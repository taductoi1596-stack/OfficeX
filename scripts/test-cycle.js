const path = require('path');
const { WindowsAppInstallerService, WORKPLACE_APPS } = require(path.join(__dirname, '../packages/registry/dist/index.js'));
const fs = require('fs');

async function testFullInstallUninstallCycle() {
  console.log('====================================================');
  console.log('   KIỂM TRA CHU KỲ CÀI ĐẶT & GỠ CÀI ĐẶT TOÀN DIỆN   ');
  console.log('====================================================\n');

  const installer = new WindowsAppInstallerService(process.cwd());
  const appIds = ['word', 'excel', 'powerpoint', 'ai'];

  for (const appId of appIds) {
    const appDef = WORKPLACE_APPS[appId];
    console.log(`\n>>> [1] ĐANG GỠ CÀI ĐẶT: ${appDef.displayName} (${appId}) <<<`);
    const uninstRes = await installer.uninstallApp(appId);
    console.log(' - Kết quả gỡ:', uninstRes.success ? 'THÀNH CÔNG' : 'THẤT BẠI', uninstRes.message);

    let statusAfterUninst = (await installer.getAllAppsStatus())[appId];
    console.log(` - Trạng thái sau khi gỡ: isInstalled=${statusAfterUninst.isInstalled}, desktop=${statusAfterUninst.desktopShortcutExists}, inControlPanel=${statusAfterUninst.inControlPanel}`);
    if (statusAfterUninst.isInstalled) {
      throw new Error(`Gỡ cài đặt ${appId} thất bại: isInstalled vẫn là true!`);
    }

    console.log(`\n>>> [2] ĐANG CÀI ĐẶT LẠI: ${appDef.displayName} (${appId}) <<<`);
    const instRes = await installer.installApp(appId);
    console.log(' - Kết quả cài đặt:', instRes.success ? 'THÀNH CÔNG' : 'THẤT BẠI', instRes.message);

    let statusAfterInst = (await installer.getAllAppsStatus())[appId];
    console.log(` - Trạng thái sau khi cài lại: isInstalled=${statusAfterInst.isInstalled}, desktop=${statusAfterInst.desktopShortcutExists}, inControlPanel=${statusAfterInst.inControlPanel}`);
    if (!statusAfterInst.isInstalled || !statusAfterInst.desktopShortcutExists) {
      throw new Error(`Cài lại ${appId} thất bại: isInstalled hoặc shortcut không tồn tại!`);
    }

    console.log(` -> [PASS] ${appDef.displayName}: Gỡ và Cài đặt lại hoàn hảo!`);
  }

  console.log('\n====================================================');
  console.log(' TẤT CẢ 4 ỨNG DỤNG ĐỀU CÀI ĐẶT & GỠ CÀI ĐẶT 100% HOÀN HẢO!');
  console.log('====================================================');
}

testFullInstallUninstallCycle().catch(console.error);
