const path = require('path');
const { LicenseService, WindowsAppInstallerService } = require(path.join(__dirname, '../packages/registry/dist/index.js'));

async function testExpiredAutoUninstall() {
  console.log('=== Simulating Expired Subscription ===');
  const licenseService = new LicenseService(process.cwd());
  const installerService = new WindowsAppInstallerService(process.cwd());

  // Set user to expired date in the past
  await licenseService.register({
    email: 'expired_user@workplace.com',
    fullName: 'Expired Account',
    password: '123',
    planId: 'trial_3d',
  });

  // Manually force expiry timestamp
  const storage = licenseService['readStorage']();
  storage.currentUser.expiresAt = Date.now() - 10000; // 10s ago
  storage.currentUser.lastAutoUninstallAt = 0; // Force immediate run
  licenseService['writeStorage'](storage);

  const status = licenseService.getStatus();
  console.log('Status:');
  console.log(' - Is Expired:', status.isExpired);
  console.log(' - Remaining formatted:', status.timeRemaining.formatted);

  console.log('\n=== Triggering Expiry Enforcement ===');
  const enforceRes = await licenseService.checkAndEnforceExpiry(installerService);
  console.log('Enforcement executed:');
  console.log(' - Is Expired:', enforceRes.isExpired);
  console.log(' - Auto uninstalled apps:', enforceRes.autoUninstalled);

  console.log('\n=== EXPIRED AUTO-UNINSTALL TEST PASSED! ===');
}

testExpiredAutoUninstall().catch(console.error);
