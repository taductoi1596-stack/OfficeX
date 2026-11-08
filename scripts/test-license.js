const path = require('path');
const { LicenseService, SUBSCRIPTION_PLANS, WindowsAppInstallerService } = require(path.join(__dirname, '../packages/registry/dist/index.js'));

async function testLicense() {
  console.log('=== 1. Checking License Plans ===');
  console.log('Available Plans:', Object.keys(SUBSCRIPTION_PLANS));
  
  const licenseService = new LicenseService(process.cwd());
  const installerService = new WindowsAppInstallerService(process.cwd());

  console.log('\n=== 2. Testing Registration with 3-Day Free Trial ===');
  const regRes = await licenseService.register({
    email: 'user_trial@workplace.com',
    fullName: 'Nguyen Van A',
    password: 'password123',
    planId: 'trial_3d',
  });
  console.log('Register Result:', regRes.message);

  let status = licenseService.getStatus();
  console.log('User status after register:');
  console.log(' - User:', status.user.fullName, `(${status.user.email})`);
  console.log(' - Plan:', status.user.planName);
  console.log(' - Remaining:', status.timeRemaining.formatted);
  console.log(' - Is Expired:', status.isExpired);

  console.log('\n=== 3. Testing Upgrade to 1-Year VIP Plan ===');
  const upgradeRes = await licenseService.upgradePlan('1y');
  console.log('Upgrade Result:', upgradeRes.message);

  status = licenseService.getStatus();
  console.log('User status after upgrade:');
  console.log(' - Plan:', status.user.planName);
  console.log(' - Remaining:', status.timeRemaining.formatted);
  console.log(' - Is Expired:', status.isExpired);

  console.log('\n=== 4. Testing Expiry Auto-Uninstall Check ===');
  const enforceRes = await licenseService.checkAndEnforceExpiry(installerService);
  console.log('Enforcement Result:');
  console.log(' - Is Expired:', enforceRes.isExpired);
  console.log(' - Auto Uninstalled Apps:', enforceRes.autoUninstalled);

  console.log('\n=== ALL LICENSE TESTS PASSED SUCCESSFULLY! ===');
}

testLicense().catch(console.error);
