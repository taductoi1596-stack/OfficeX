const path = require('path');
const { LicenseService } = require(path.join(__dirname, '../packages/registry/dist/index.js'));

const adminEmail = process.env.OFFICEX_TEST_ADMIN_EMAIL;
const adminPassword = process.env.OFFICEX_TEST_ADMIN_PASSWORD;

async function testAdminApproval() {
  if (!adminEmail || !adminPassword) {
    throw new Error('Set OFFICEX_TEST_ADMIN_EMAIL and OFFICEX_TEST_ADMIN_PASSWORD to run this MongoDB integration test.');
  }

  const service = new LicenseService();
  const testEmail = `mongo-test-${Date.now()}@example.invalid`;
  const testPassword = `Temp-${Date.now()}-Pass`;
  let testUserId;

  try {
    const adminLogin = await service.login(adminEmail, adminPassword);
    if (!adminLogin.success) throw new Error(adminLogin.message);

    const registration = await service.register({
      email: testEmail,
      fullName: 'Mongo Approval Test',
      password: testPassword,
      planId: '1m',
    });
    if (!registration.success || !registration.user) throw new Error(registration.message);
    testUserId = registration.user.id;

    const pendingUser = (await service.getAllUsers()).find((user) => user.id === testUserId);
    if (!pendingUser || pendingUser.status !== 'pending') throw new Error('Registered user was not stored as pending in MongoDB.');

    const approval = await service.approveUser(testUserId, '1m');
    if (!approval.success) throw new Error(approval.message);

    await service.logout();
    const userLogin = await service.login(testEmail, testPassword);
    if (!userLogin.success) throw new Error(userLogin.message);
    const status = await service.getStatus();
    if (!status.canAccessApps) throw new Error('Approved account did not receive app access.');

    await service.logout();
    await service.login(adminEmail, adminPassword);
    const deletion = await service.deleteUser(testUserId);
    if (!deletion.success) throw new Error(deletion.message);
    testUserId = undefined;
    console.log('Mongo registration, approval, login, access, and cleanup passed.');
  } finally {
    if (testUserId) {
      await service.login(adminEmail, adminPassword);
      await service.deleteUser(testUserId);
    }
    await service.logout();
    await service.close();
  }
}

testAdminApproval().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
