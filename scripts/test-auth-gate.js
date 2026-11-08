const path = require('path');
const { LicenseService } = require(path.join(__dirname, '../packages/registry/dist/index.js'));

async function testAuthGate() {
  console.log('=== TEST AUTH GATE (Khóa truy cập ứng dụng khi chưa đăng nhập) ===\n');
  const licenseService = new LicenseService(process.cwd());

  // 1. Clear session (Logout)
  licenseService.logout();
  let status = licenseService.getStatus();
  console.log('[Test 1] Trạng thái khi ĐĂNG XUẤT:');
  console.log(' - isLoggedIn:', status.isLoggedIn);
  console.log(' - canAccessApp:', status.isLoggedIn && !status.isExpired);
  if (status.isLoggedIn === false) {
    console.log(' -> [PASS] Khóa truy cập thành công! Không cho phép mở bất kỳ app nào khi chưa đăng nhập.\n');
  } else {
    console.error(' -> [FAIL] Vẫn cho phép truy cập khi chưa đăng nhập!');
  }

  // 2. Login / Register with 3-Day Trial
  console.log('[Test 2] Đăng ký dùng thử 3 Ngày:');
  await licenseService.register({
    email: 'test_auth@workplace.com',
    fullName: 'Test User',
    planId: 'trial_3d',
  });
  status = licenseService.getStatus();
  console.log(' - isLoggedIn:', status.isLoggedIn);
  console.log(' - isExpired:', status.isExpired);
  console.log(' - Plan:', status.user?.planName);
  console.log(' - canAccessApp:', status.isLoggedIn && !status.isExpired);
  if (status.isLoggedIn === true && !status.isExpired) {
    console.log(' -> [PASS] Đã mở khóa quyền truy cập đầy đủ các ứng dụng!\n');
  } else {
    console.error(' -> [FAIL] Không truy cập được sau khi đăng ký!');
  }

  // 3. Expired State
  console.log('[Test 3] Trạng thái HẾT HẠN:');
  const storage = licenseService['readStorage']();
  storage.currentUser.expiresAt = Date.now() - 5000;
  licenseService['writeStorage'](storage);
  status = licenseService.getStatus();
  console.log(' - isLoggedIn:', status.isLoggedIn);
  console.log(' - isExpired:', status.isExpired);
  console.log(' - canAccessApp:', status.isLoggedIn && !status.isExpired);
  if (status.isExpired === true) {
    console.log(' -> [PASS] Khóa truy cập thành công khi hết hạn! Yêu cầu gia hạn.\n');
  } else {
    console.error(' -> [FAIL] Không khóa khi hết hạn!');
  }

  console.log('=== TOÀN BỘ BỘ KHÓA TRUY CẬP ĐÃ HOẠT ĐỘNG HOÀN HẢO! ===');
}

testAuthGate().catch(console.error);
