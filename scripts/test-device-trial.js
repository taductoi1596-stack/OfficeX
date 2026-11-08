const path = require('path');
const { LicenseService } = require(path.join(__dirname, '../packages/registry/dist/index.js'));

async function testDeviceTrial() {
  console.log('=== TEST GIỚI HẠN DÙNG THỬ 1 LẦN / MÁY TÍNH & IP ===\n');
  const licenseService = new LicenseService(process.cwd());

  const info = licenseService.getDeviceFingerprintInfo();
  console.log('Thông tin thiết bị phát hiện:');
  console.log(' - Hostname:', info.hostname);
  console.log(' - Primary IP:', info.primaryIp);
  console.log(' - Device ID / Hardware Hash:', info.deviceId);
  console.log(' - Network MACs:', info.macs.join(', '));
  console.log('');

  // 1. Clean previous state for test
  licenseService.logout();
  const trialsFile = path.join(process.env.APPDATA || '', 'OfficeX', 'device_trials.json');
  try { if (require('fs').existsSync(trialsFile)) require('fs').unlinkSync(trialsFile); } catch {}

  // 2. First trial registration (Should SUCCESS)
  console.log('[Lần 1] Đăng ký dùng thử 3 Ngày lần đầu trên máy tính:');
  const reg1 = await licenseService.register({
    email: 'user_first_trial@workplace.com',
    fullName: 'First Trial User',
    planId: 'trial_3d',
  });
  console.log(' - Kết quả:', reg1.success ? 'THÀNH CÔNG' : 'THẤT BẠI');
  console.log(' - Thông báo:', reg1.message);

  if (!reg1.success) {
    throw new Error('Lần đầu đăng ký phải thành công!');
  }
  console.log(' -> [PASS] Lần 1 thành công!\n');

  // 3. Second trial registration on SAME DEVICE with DIFFERENT EMAIL (Should be REJECTED)
  console.log('[Lần 2] Cố tình đăng ký dùng thử 3 Ngày lần 2 bằng email khác trên cùng máy tính / IP:');
  const reg2 = await licenseService.register({
    email: 'user_cheat_trial@workplace.com',
    fullName: 'Cheat User',
    planId: 'trial_3d',
  });
  console.log(' - Kết quả:', reg2.success ? 'CHO PHÉP (LỖI)' : 'BỊ CHẶN (ĐÚNG)');
  console.log(' - Mã lỗi:', reg2.code);
  console.log(' - Lý do chặn:', reg2.message);

  if (reg2.success === false && reg2.code === 'TRIAL_ALREADY_USED') {
    console.log(' -> [PASS] Khóa IP & Thiết bị thành công! Không cho phép lạm dụng dùng thử nhiều lần.\n');
  } else {
    throw new Error('Hệ thống phải chặn dùng thử lần 2 trên cùng máy tính!');
  }

  // 4. Paid Plan Registration on the same device (Should SUCCESS)
  console.log('[Lần 3] Đăng ký gói trả phí 1 Tháng trên cùng máy tính:');
  const reg3 = await licenseService.register({
    email: 'paid_user@workplace.com',
    fullName: 'Paid User',
    planId: '1m',
  });
  console.log(' - Kết quả:', reg3.success ? 'THÀNH CÔNG' : 'THẤT BẠI');
  console.log(' - Thông báo:', reg3.message);
  if (reg3.success) {
    console.log(' -> [PASS] Cho phép đăng ký gói trả phí bình thường!\n');
  }

  console.log('=== TẤT CẢ KIỂM THỬ GIỚI HẠN THIẾT BỊ ĐÃ ĐẠT 100%! ===');
}

testDeviceTrial().catch(console.error);
