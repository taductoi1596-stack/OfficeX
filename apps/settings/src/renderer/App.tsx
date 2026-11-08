import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { 
  Settings as SettingsIcon, Palette, User, Info, Sun, Moon, Monitor, 
  Bell, Shield, Cpu, Check, ChevronRight, LogIn, LogOut, Mail, Lock, 
  UserPlus, KeyRound, AlertCircle, RefreshCw, Sparkles, UserCheck 
} from 'lucide-react';

// ─── Translations ─────────────────────────────────────────────────────────────
type Lang = 'en' | 'vi' | 'zh' | 'ja' | 'ko' | 'fr' | 'de' | 'es';

const TRANSLATIONS: Record<Lang, Record<string, string>> = {
  en: {
    settings: 'Settings', general: 'General', appearance: 'Appearance',
    account: 'Account', notifications: 'Notifications', privacy: 'Privacy',
    about: 'About', save: 'Save Changes', saved: 'Saved!',
    language: 'Language', language_desc: 'Select your preferred language.',
    autoSave: 'Auto Save', autoSave_desc: 'Automatically save documents.',
    autoSave_interval: 'Auto Save Interval', autoSave_interval_desc: 'How often to auto-save.',
    spellCheck: 'Spell Check', spellCheck_desc: 'Highlight spelling errors.',
    diagnostic: 'Diagnostic Tools', diagnostic_desc: 'Diagnostic utilities for platform integration testing.',
    simulate_crash: 'Simulate Crash', test_notif: 'Test Notification',
    test_dialog: 'Test Dialog', test_clipboard: 'Test Clipboard',
    theme: 'Theme', light: 'Light', dark: 'Dark', system: 'System',
    accent: 'Accent Color', compact: 'Compact Mode', compact_desc: 'Reduce spacing.',
    animations: 'Animations', animations_desc: 'Enable smooth transitions.',
    font_size: 'Font Size', small: 'Small (13px)', medium: 'Medium (15px)', large: 'Large (17px)',
    sign_in: 'Sign in to OfficeX', sign_in_desc: 'Sync your settings across devices.',
    sign_up: 'Create OfficeX Account', sign_up_desc: 'Join OfficeX to store and sync your documents.',
    email: 'Email address', password: 'Password', confirm_password: 'Confirm Password',
    full_name: 'Full Name', login: 'Sign In', register: 'Sign Up', logout: 'Sign Out',
    no_account: "Don't have an account? Sign Up", have_account: 'Already have an account? Sign In',
    forgot_password: 'Forgot password?', reset_password: 'Reset Password',
    back_to_login: 'Back to Sign In',
    edit_profile: 'Edit Profile', notif_updates: 'App Updates', notif_updates_desc: 'New version available.',
    notif_reminders: 'Reminders', notif_reminders_desc: 'Auto-save and recovery.',
    notif_sound: 'Sound Effects', notif_sound_desc: 'Play sound on notifications.',
    notif_desktop: 'Desktop Notifications', notif_desktop_desc: 'Show native OS notifications.',
    analytics: 'Usage Analytics', analytics_desc: 'Share anonymous data.',
    crash_reports: 'Crash Reports', crash_reports_desc: 'Send crash reports.',
    data_mgmt: 'Data Management', clear_data: 'Clear Local Data', export_data: 'Export My Data',
    about_title: 'About OfficeX', about_desc: 'A modern, offline-first productivity suite.',
    software_updates: 'Software Updates', check_updates: 'Check for Updates',
    checking: 'Checking...', up_to_date: '✓ You are on the latest version (1.0.0)',
    minutes: 'minutes', copied: '✓ Copied to clipboard!',
    min: 'minute', error_fields: 'Please fill in all required fields.',
    error_password_match: 'Passwords do not match.',
    error_user_exists: 'An account with this email already exists.',
    error_invalid_login: 'Invalid email or password.',
    success_registered: 'Account created successfully! Logging you in...',
    version: 'Version 1.0.0 • Build 2026.08.16',
  },
  vi: {
    settings: 'Cài đặt', general: 'Tổng quát', appearance: 'Giao diện',
    account: 'Tài khoản', notifications: 'Thông báo', privacy: 'Bảo mật',
    about: 'Giới thiệu', save: 'Lưu thay đổi', saved: 'Đã lưu!',
    language: 'Ngôn ngữ', language_desc: 'Chọn ngôn ngữ ưa thích của bạn.',
    autoSave: 'Tự động lưu', autoSave_desc: 'Tự động lưu tài liệu định kỳ.',
    autoSave_interval: 'Khoảng thời gian lưu', autoSave_interval_desc: 'Bao lâu tự động lưu một lần.',
    spellCheck: 'Kiểm tra chính tả', spellCheck_desc: 'Đánh dấu lỗi chính tả khi gõ.',
    diagnostic: 'Công cụ chẩn đoán', diagnostic_desc: 'Tiện ích kiểm tra tích hợp nền tảng.',
    simulate_crash: 'Giả lập sự cố', test_notif: 'Thử thông báo',
    test_dialog: 'Thử hộp thoại', test_clipboard: 'Thử clipboard',
    theme: 'Chủ đề', light: 'Sáng', dark: 'Tối', system: 'Hệ thống',
    accent: 'Màu nhấn', compact: 'Chế độ gọn', compact_desc: 'Giảm khoảng cách bố cục.',
    animations: 'Hiệu ứng', animations_desc: 'Bật chuyển động mượt mà.',
    font_size: 'Cỡ chữ', small: 'Nhỏ (13px)', medium: 'Vừa (15px)', large: 'Lớn (17px)',
    sign_in: 'Đăng nhập OfficeX', sign_in_desc: 'Đồng bộ cài đặt trên nhiều thiết bị.',
    sign_up: 'Đăng ký tài khoản OfficeX', sign_up_desc: 'Tạo tài khoản mới để lưu và đồng bộ tài liệu.',
    email: 'Địa chỉ email', password: 'Mật khẩu', confirm_password: 'Xác nhận mật khẩu',
    full_name: 'Họ và tên', login: 'Đăng nhập', register: 'Đăng ký ngay', logout: 'Đăng xuất',
    no_account: 'Chưa có tài khoản? Đăng ký ngay', have_account: 'Đã có tài khoản? Đăng nhập',
    forgot_password: 'Quên mật khẩu?', reset_password: 'Đặt lại mật khẩu',
    back_to_login: 'Quay lại Đăng nhập',
    edit_profile: 'Sửa hồ sơ', notif_updates: 'Cập nhật ứng dụng', notif_updates_desc: 'Phiên bản mới có sẵn.',
    notif_reminders: 'Nhắc nhở', notif_reminders_desc: 'Lưu tự động và phục hồi.',
    notif_sound: 'Âm thanh', notif_sound_desc: 'Phát âm khi có thông báo.',
    notif_desktop: 'Thông báo hệ thống', notif_desktop_desc: 'Hiển thị thông báo từ HĐH.',
    analytics: 'Phân tích sử dụng', analytics_desc: 'Chia sẻ dữ liệu ẩn danh.',
    crash_reports: 'Báo cáo sự cố', crash_reports_desc: 'Gửi báo cáo lỗi tự động.',
    data_mgmt: 'Quản lý dữ liệu', clear_data: 'Xóa dữ liệu cục bộ', export_data: 'Xuất dữ liệu',
    about_title: 'Giới thiệu OfficeX', about_desc: 'Bộ phần mềm năng suất hiện đại, hoạt động offline.',
    software_updates: 'Cập nhật phần mềm', check_updates: 'Kiểm tra cập nhật',
    checking: 'Đang kiểm tra...', up_to_date: '✓ Bạn đang dùng phiên bản mới nhất (1.0.0)',
    minutes: 'phút', copied: '✓ Đã sao chép vào clipboard!',
    min: 'phút', error_fields: 'Vui lòng nhập đầy đủ các trường thông tin.',
    error_password_match: 'Mật khẩu xác nhận không khớp!',
    error_user_exists: 'Email này đã được đăng ký tài khoản!',
    error_invalid_login: 'Email hoặc mật khẩu không chính xác!',
    success_registered: 'Tạo tài khoản thành công! Đang tự động đăng nhập...',
    version: 'Phiên bản 1.0.0 • Build 2026.08.16',
  },
  zh: {
    settings: '设置', general: '常规', appearance: '外观',
    account: '账户', notifications: '通知', privacy: '隐私',
    about: '关于', save: '保存更改', saved: '已保存!',
    language: '语言', language_desc: '选择您偏好的界面语言。',
    autoSave: '自动保存', autoSave_desc: '自动定期保存文档。',
    autoSave_interval: '自动保存间隔', autoSave_interval_desc: '自动保存频率。',
    spellCheck: '拼写检查', spellCheck_desc: '输入时标记拼写错误。',
    diagnostic: '诊断工具', diagnostic_desc: '平台集成测试实用程序。',
    simulate_crash: '模拟崩溃', test_notif: '测试通知',
    test_dialog: '测试对话框', test_clipboard: '测试剪贴板',
    theme: '主题', light: '浅色', dark: '深色', system: '跟随系统',
    accent: '强调色', compact: '紧凑模式', compact_desc: '减少布局间距。',
    animations: '动画效果', animations_desc: '启用流畅过渡动画。',
    font_size: '字体大小', small: '小 (13px)', medium: '中 (15px)', large: '大 (17px)',
    sign_in: '登录 OfficeX', sign_in_desc: '跨设备同步您的设置。',
    sign_up: '创建 OfficeX 账户', sign_up_desc: '注册以保存和同步文档。',
    email: '电子邮件', password: '密码', confirm_password: '确认密码',
    full_name: '姓名', login: '登录', register: '注册', logout: '退出',
    no_account: '还没有账户？立即注册', have_account: '已有账户？登录',
    forgot_password: '忘记密码？', reset_password: '重置密码',
    back_to_login: '返回登录',
    edit_profile: '编辑资料', notif_updates: '应用更新', notif_updates_desc: '有新版本时通知。',
    notif_reminders: '提醒', notif_reminders_desc: '自动保存和恢复提醒。',
    notif_sound: '声音效果', notif_sound_desc: '通知时播放声音。',
    notif_desktop: '桌面通知', notif_desktop_desc: '显示系统通知。',
    analytics: '使用分析', analytics_desc: '共享匿名使用数据。',
    crash_reports: '崩溃报告', crash_reports_desc: '自动发送崩溃报告。',
    data_mgmt: '数据管理', clear_data: '清除本地数据', export_data: '导出数据',
    about_title: '关于 OfficeX', about_desc: '现代离线优先生产力套件。',
    software_updates: '软件更新', check_updates: '检查更新',
    checking: '检查中...', up_to_date: '✓ 您正在使用最新版本 (1.0.0)',
    minutes: '分钟', copied: '✓ 已复制到剪贴板!',
    min: '分钟', error_fields: '请填写所有必填字段。',
    error_password_match: '两次输入的密码不一致！',
    error_user_exists: '该邮箱已被注册！',
    error_invalid_login: '邮箱或密码错误！',
    success_registered: '注册成功！正在为您自动登录...',
    version: '版本 1.0.0 • 构建 2026.08.16',
  },
  ja: {
    settings: '設定', general: '一般', appearance: '外観',
    account: 'アカウント', notifications: '通知', privacy: 'プライバシー',
    about: '情報', save: '変更を保存', saved: '保存済み!',
    language: '言語', language_desc: '使用する言語を選択してください。',
    autoSave: '自動保存', autoSave_desc: '定期的に自動保存。',
    autoSave_interval: '自動保存間隔', autoSave_interval_desc: '保存頻度。',
    spellCheck: 'スペルチェック', spellCheck_desc: '入力中にエラーを強調表示。',
    diagnostic: '診断ツール', diagnostic_desc: 'プラットフォーム統合テスト。',
    simulate_crash: 'クラッシュシミュレート', test_notif: '通知テスト',
    test_dialog: 'ダイアログテスト', test_clipboard: 'クリップボードテスト',
    theme: 'テーマ', light: 'ライト', dark: 'ダーク', system: 'システム',
    accent: 'アクセントカラー', compact: 'コンパクトモード', compact_desc: 'レイアウトを縮小。',
    animations: 'アニメーション', animations_desc: 'スムーズな遷移を有効化。',
    font_size: 'フォントサイズ', small: '小 (13px)', medium: '中 (15px)', large: '大 (17px)',
    sign_in: 'OfficeX にサインイン', sign_in_desc: '設定をデバイス間で同期。',
    sign_up: 'OfficeX アカウント作成', sign_up_desc: 'ドキュメントを同期するための新規登録。',
    email: 'メールアドレス', password: 'パスワード', confirm_password: 'パスワード確認',
    full_name: '氏名', login: 'サインイン', register: '新規登録', logout: 'サインアウト',
    no_account: 'アカウントをお持ちでないですか？新規登録', have_account: 'アカウントをお持ちですか？サインイン',
    forgot_password: 'パスワードをお忘れですか？', reset_password: 'パスワード再設定',
    back_to_login: 'サインインに戻る',
    edit_profile: 'プロフィール編集', notif_updates: 'アプリ更新', notif_updates_desc: '新バージョンが利用可能。',
    notif_reminders: 'リマインダー', notif_reminders_desc: '自動保存と復元。',
    notif_sound: '効果音', notif_sound_desc: '通知時に音を鳴らす。',
    notif_desktop: 'デスクトップ通知', notif_desktop_desc: 'OSの通知を表示。',
    analytics: '使用状況分析', analytics_desc: '匿名データを共有。',
    crash_reports: 'クラッシュレポート', crash_reports_desc: '自動的に送信。',
    data_mgmt: 'データ管理', clear_data: 'ローカルデータを削除', export_data: 'データをエクスポート',
    about_title: 'OfficeX について', about_desc: 'モダンなオフラインファーストの生産性スイート。',
    software_updates: 'ソフトウェア更新', check_updates: '更新を確認',
    checking: '確認中...', up_to_date: '✓ 最新バージョンです (1.0.0)',
    minutes: '分', copied: '✓ クリップボードにコピーしました!',
    min: '分', error_fields: 'すべての項目を入力してください。',
    error_password_match: 'パスワードが一致しません！',
    error_user_exists: 'このメールアドレスは既に登録されています！',
    error_invalid_login: 'メールアドレスまたはパスワードが正しくありません！',
    success_registered: 'アカウントが作成されました！ログイン中...',
    version: 'バージョン 1.0.0 • ビルド 2026.08.16',
  },
  ko: {
    settings: '설정', general: '일반', appearance: '모양',
    account: '계정', notifications: '알림', privacy: '개인정보',
    about: '정보', save: '변경사항 저장', saved: '저장됨!',
    language: '언어', language_desc: '선호 언어를 선택하세요.',
    autoSave: '자동 저장', autoSave_desc: '문서를 자동으로 저장합니다.',
    autoSave_interval: '자동 저장 간격', autoSave_interval_desc: '저장 빈도.',
    spellCheck: '맞춤법 검사', spellCheck_desc: '입력 중 오류 강조.',
    diagnostic: '진단 도구', diagnostic_desc: '플랫폼 통합 테스트 유틸리티.',
    simulate_crash: '충돌 시뮬레이션', test_notif: '알림 테스트',
    test_dialog: '대화상자 테스트', test_clipboard: '클립보드 테스트',
    theme: '테마', light: '밝음', dark: '어두움', system: '시스템',
    accent: '강조색', compact: '컴팩트 모드', compact_desc: '레이아웃 간격 줄이기.',
    animations: '애니메이션', animations_desc: '부드러운 전환 활성화.',
    font_size: '글꼴 크기', small: '작음 (13px)', medium: '보통 (15px)', large: '큼 (17px)',
    sign_in: 'OfficeX 로그인', sign_in_desc: '기기 간 설정을 동기화합니다.',
    sign_up: 'OfficeX 계정 생성', sign_up_desc: '문서를 동기화하기 위한 새 계정 등록.',
    email: '이메일 주소', password: '비밀번호', confirm_password: '비밀번호 확인',
    full_name: '이름', login: '로그인', register: '회원가입', logout: '로그아웃',
    no_account: '계정이 없으신가요? 회원가입', have_account: '이미 계정이 있으신가요? 로그인',
    forgot_password: '비밀번호를 잊으셨나요?', reset_password: '비밀번호 재설정',
    back_to_login: '로그인으로 돌아가기',
    edit_profile: '프로필 편집', notif_updates: '앱 업데이트', notif_updates_desc: '새 버전 알림.',
    notif_reminders: '알림', notif_reminders_desc: '자동 저장 및 복구.',
    notif_sound: '효과음', notif_sound_desc: '알림 소리 재생.',
    notif_desktop: '데스크톱 알림', notif_desktop_desc: 'OS 알림 표시.',
    analytics: '사용 분석', analytics_desc: '익명 데이터 공유.',
    crash_reports: '충돌 보고서', crash_reports_desc: '자동으로 전송.',
    data_mgmt: '데이터 관리', clear_data: '로컬 데이터 삭제', export_data: '데이터 내보내기',
    about_title: 'OfficeX 정보', about_desc: '현대적인 오프라인 우선 생산성 제품군.',
    software_updates: '소프트웨어 업데이트', check_updates: '업데이트 확인',
    checking: '확인 중...', up_to_date: '✓ 최신 버전입니다 (1.0.0)',
    minutes: '분', copied: '✓ 클립보드에 복사됨!',
    min: '분', error_fields: '모든 항목을 입력해 주세요.',
    error_password_match: '비밀번호가 일치하지 않습니다!',
    error_user_exists: '이미 등록된 이메일입니다!',
    error_invalid_login: '이메일 또는 비밀번호가 올바르지 않습니다!',
    success_registered: '계정이 생성되었습니다! 자동 로그인 중...',
    version: '버전 1.0.0 • 빌드 2026.08.16',
  },
  fr: {
    settings: 'Paramètres', general: 'Général', appearance: 'Apparence',
    account: 'Compte', notifications: 'Notifications', privacy: 'Confidentialité',
    about: 'À propos', save: 'Enregistrer', saved: 'Enregistré!',
    language: 'Langue', language_desc: 'Sélectionnez votre langue préférée.',
    autoSave: 'Enregistrement auto', autoSave_desc: 'Sauvegarde automatique des documents.',
    autoSave_interval: 'Intervalle de sauvegarde', autoSave_interval_desc: 'Fréquence de sauvegarde.',
    spellCheck: 'Vérification orthographique', spellCheck_desc: 'Marquer les fautes.',
    diagnostic: 'Outils de diagnostic', diagnostic_desc: 'Test d\'intégration de la plateforme.',
    simulate_crash: 'Simuler un crash', test_notif: 'Tester la notification',
    test_dialog: 'Tester la boîte de dialogue', test_clipboard: 'Tester le presse-papier',
    theme: 'Thème', light: 'Clair', dark: 'Sombre', system: 'Système',
    accent: 'Couleur d\'accent', compact: 'Mode compact', compact_desc: 'Réduire l\'espacement.',
    animations: 'Animations', animations_desc: 'Activer les transitions.',
    font_size: 'Taille de police', small: 'Petit (13px)', medium: 'Moyen (15px)', large: 'Grand (17px)',
    sign_in: 'Se connecter à OfficeX', sign_in_desc: 'Synchroniser les paramètres.',
    sign_up: 'Créer un compte OfficeX', sign_up_desc: 'Inscrivez-vous pour synchroniser vos documents.',
    email: 'Adresse e-mail', password: 'Mot de passe', confirm_password: 'Confirmer le mot de passe',
    full_name: 'Nom complet', login: 'Se connecter', register: 'S\'inscrire', logout: 'Se déconnecter',
    no_account: 'Pas de compte ? S\'inscrire', have_account: 'Déjà un compte ? Se connecter',
    forgot_password: 'Mot de passe oublié ?', reset_password: 'Réinitialiser',
    back_to_login: 'Retour à la connexion',
    edit_profile: 'Modifier le profil', notif_updates: 'Mises à jour', notif_updates_desc: 'Nouvelle version disponible.',
    notif_reminders: 'Rappels', notif_reminders_desc: 'Sauvegarde et récupération.',
    notif_sound: 'Sons', notif_sound_desc: 'Jouer un son.',
    notif_desktop: 'Notifications bureau', notif_desktop_desc: 'Afficher les notifications OS.',
    analytics: 'Analytiques', analytics_desc: 'Partager des données anonymes.',
    crash_reports: 'Rapports de crash', crash_reports_desc: 'Envoyer automatiquement.',
    data_mgmt: 'Gestion des données', clear_data: 'Effacer les données', export_data: 'Exporter',
    about_title: 'À propos d\'OfficeX', about_desc: 'Suite de productivité moderne hors ligne.',
    software_updates: 'Mises à jour', check_updates: 'Vérifier les mises à jour',
    checking: 'Vérification...', up_to_date: '✓ Vous utilisez la dernière version (1.0.0)',
    minutes: 'minutes', copied: '✓ Copié dans le presse-papier!',
    min: 'minute', error_fields: 'Veuillez remplir tous les champs.',
    error_password_match: 'Les mots de passe ne correspondent pas !',
    error_user_exists: 'Cet e-mail est déjà enregistré !',
    error_invalid_login: 'E-mail ou mot de passe incorrect !',
    success_registered: 'Compte créé avec succès ! Connexion en cours...',
    version: 'Version 1.0.0 • Build 2026.08.16',
  },
  de: {
    settings: 'Einstellungen', general: 'Allgemein', appearance: 'Darstellung',
    account: 'Konto', notifications: 'Benachrichtigungen', privacy: 'Datenschutz',
    about: 'Über', save: 'Änderungen speichern', saved: 'Gespeichert!',
    language: 'Sprache', language_desc: 'Wählen Sie Ihre bevorzugte Sprache.',
    autoSave: 'Automatisch speichern', autoSave_desc: 'Dokumente automatisch speichern.',
    autoSave_interval: 'Speicherintervall', autoSave_interval_desc: 'Wie oft automatisch speichern.',
    spellCheck: 'Rechtschreibprüfung', spellCheck_desc: 'Rechtschreibfehler hervorheben.',
    diagnostic: 'Diagnosewerkzeuge', diagnostic_desc: 'Tests für die Plattformintegration.',
    simulate_crash: 'Absturz simulieren', test_notif: 'Benachrichtigung testen',
    test_dialog: 'Dialog testen', test_clipboard: 'Zwischenablage testen',
    theme: 'Thema', light: 'Hell', dark: 'Dunkel', system: 'System',
    accent: 'Akzentfarbe', compact: 'Kompaktmodus', compact_desc: 'Abstände reduzieren.',
    animations: 'Animationen', animations_desc: 'Übergänge aktivieren.',
    font_size: 'Schriftgröße', small: 'Klein (13px)', medium: 'Mittel (15px)', large: 'Groß (17px)',
    sign_in: 'Bei OfficeX anmelden', sign_in_desc: 'Einstellungen synchronisieren.',
    sign_up: 'OfficeX-Konto erstellen', sign_up_desc: 'Registrieren, um Dokumente zu synchronisieren.',
    email: 'E-Mail-Adresse', password: 'Passwort', confirm_password: 'Passwort bestätigen',
    full_name: 'Vollständiger Name', login: 'Anmelden', register: 'Registrieren', logout: 'Abmelden',
    no_account: 'Noch kein Konto? Registrieren', have_account: 'Bereits ein Konto? Anmelden',
    forgot_password: 'Passwort vergessen?', reset_password: 'Passwort zurücksetzen',
    back_to_login: 'Zurück zur Anmeldung',
    edit_profile: 'Profil bearbeiten', notif_updates: 'App-Updates', notif_updates_desc: 'Neue Version verfügbar.',
    notif_reminders: 'Erinnerungen', notif_reminders_desc: 'Automatisches Speichern.',
    notif_sound: 'Töne', notif_sound_desc: 'Benachrichtigungston.',
    notif_desktop: 'Desktop-Benachrichtigungen', notif_desktop_desc: 'OS-Benachrichtigungen anzeigen.',
    analytics: 'Nutzungsanalyse', analytics_desc: 'Anonyme Daten teilen.',
    crash_reports: 'Absturzberichte', crash_reports_desc: 'Automatisch senden.',
    data_mgmt: 'Datenverwaltung', clear_data: 'Lokale Daten löschen', export_data: 'Daten exportieren',
    about_title: 'Über OfficeX', about_desc: 'Modernes offline-first Produktivitätspaket.',
    software_updates: 'Software-Updates', check_updates: 'Updates prüfen',
    checking: 'Prüfe...', up_to_date: '✓ Sie verwenden die neueste Version (1.0.0)',
    minutes: 'Minuten', copied: '✓ In Zwischenablage kopiert!',
    min: 'Minute', error_fields: 'Bitte alle Felder ausfüllen.',
    error_password_match: 'Passwörter stimmen nicht überein!',
    error_user_exists: 'Diese E-Mail ist bereits registriert!',
    error_invalid_login: 'Ungültige E-Mail oder falsches Passwort!',
    success_registered: 'Konto erfolgreich erstellt! Sie werden angemeldet...',
    version: 'Version 1.0.0 • Build 2026.08.16',
  },
  es: {
    settings: 'Configuración', general: 'General', appearance: 'Apariencia',
    account: 'Cuenta', notifications: 'Notificaciones', privacy: 'Privacidad',
    about: 'Acerca de', save: 'Guardar cambios', saved: '¡Guardado!',
    language: 'Idioma', language_desc: 'Selecciona tu idioma preferido.',
    autoSave: 'Guardar automáticamente', autoSave_desc: 'Guardar documentos automáticamente.',
    autoSave_interval: 'Intervalo de guardado', autoSave_interval_desc: 'Frecuencia de guardado.',
    spellCheck: 'Corrector ortográfico', spellCheck_desc: 'Resaltar errores.',
    diagnostic: 'Herramientas de diagnóstico', diagnostic_desc: 'Pruebas de integración.',
    simulate_crash: 'Simular fallo', test_notif: 'Probar notificación',
    test_dialog: 'Probar diálogo', test_clipboard: 'Probar portapapeles',
    theme: 'Tema', light: 'Claro', dark: 'Oscuro', system: 'Sistema',
    accent: 'Color de acento', compact: 'Modo compacto', compact_desc: 'Reducir espaciado.',
    animations: 'Animaciones', animations_desc: 'Transiciones suaves.',
    font_size: 'Tamaño de fuente', small: 'Pequeño (13px)', medium: 'Mediano (15px)', large: 'Grande (17px)',
    sign_in: 'Iniciar sesión en OfficeX', sign_in_desc: 'Sincroniza tu configuración.',
    sign_up: 'Crear cuenta de OfficeX', sign_up_desc: 'Regístrate para sincronizar tus documentos.',
    email: 'Correo electrónico', password: 'Contraseña', confirm_password: 'Confirmar contraseña',
    full_name: 'Nombre completo', login: 'Iniciar sesión', register: 'Registrarse', logout: 'Cerrar sesión',
    no_account: '¿No tienes cuenta? Regístrate', have_account: '¿Ya tienes cuenta? Iniciar sesión',
    forgot_password: '¿Olvidaste tu contraseña?', reset_password: 'Restablecer contraseña',
    back_to_login: 'Volver a iniciar sesión',
    edit_profile: 'Editar perfil', notif_updates: 'Actualizaciones', notif_updates_desc: 'Nueva versión disponible.',
    notif_reminders: 'Recordatorios', notif_reminders_desc: 'Guardado automático.',
    notif_sound: 'Sonidos', notif_sound_desc: 'Reproducir sonido.',
    notif_desktop: 'Notificaciones de escritorio', notif_desktop_desc: 'Mostrar notificaciones del SO.',
    analytics: 'Análisis de uso', analytics_desc: 'Compartir datos anónimos.',
    crash_reports: 'Informes de fallos', crash_reports_desc: 'Enviar automáticamente.',
    data_mgmt: 'Gestión de datos', clear_data: 'Borrar datos locales', export_data: 'Exportar datos',
    about_title: 'Acerca de OfficeX', about_desc: 'Suite de productividad moderna sin conexión.',
    software_updates: 'Actualizaciones', check_updates: 'Buscar actualizaciones',
    checking: 'Comprobando...', up_to_date: '✓ Tienes la última versión (1.0.0)',
    minutes: 'minutos', copied: '✓ ¡Copiado al portapapeles!',
    min: 'minuto', error_fields: 'Por favor completa todos los campos.',
    error_password_match: '¡Las contraseñas no coinciden!',
    error_user_exists: '¡Este correo electrónico ya está registrado!',
    error_invalid_login: '¡Correo o contraseña incorrectos!',
    success_registered: '¡Cuenta creada con éxito! Iniciando sesión...',
    version: 'Versión 1.0.0 • Build 2026.08.16',
  },
};

const LANG_LABELS: Record<Lang, string> = {
  en: '🇬🇧 English', vi: '🇻🇳 Tiếng Việt', zh: '🇨🇳 中文',
  ja: '🇯🇵 日本語', ko: '🇰🇷 한국어', fr: '🇫🇷 Français',
  de: '🇩🇪 Deutsch', es: '🇪🇸 Español',
};

// ─── i18n Context ─────────────────────────────────────────────────────────────
type I18nCtx = { lang: Lang; t: (k: string) => string; setLang: (l: Lang) => void };
const I18nContext = createContext<I18nCtx>({ lang: 'en', t: k => k, setLang: () => {} });
const useI18n = () => useContext(I18nContext);

const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem('officex.language');
    return (stored as Lang) || 'vi';
  });

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem('officex.language', l);
    document.documentElement.lang = l;
  }, []);

  const t = useCallback((k: string) => {
    return TRANSLATIONS[lang]?.[k] || TRANSLATIONS['en']?.[k] || k;
  }, [lang]);

  return <I18nContext.Provider value={{ lang, t, setLang }}>{children}</I18nContext.Provider>;
};

// ─── Hooks ───────────────────────────────────────────────────────────────────
const useSetting = <T,>(key: string, def: T) => {
  const stored = localStorage.getItem(`officex.${key}`);
  const [val, setVal] = useState<T>(() => stored !== null ? JSON.parse(stored) : def);
  const save = (v: T) => { setVal(v); localStorage.setItem(`officex.${key}`, JSON.stringify(v)); };
  return [val, save] as const;
};

// ─── IPC ────────────────────────────────────────────────────────────────────
const getAPI = () => (window as any).electronAPI || (window as any).ipc || null;
const invoke = (channel: string, ...args: any[]) => {
  const api = getAPI();
  if (!api) return Promise.resolve(null);
  if (typeof api.invoke === 'function') return api.invoke(channel, ...args);
  return Promise.resolve(null);
};

// ─── UI Components ────────────────────────────────────────────────────────────
const Row = ({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
    <div className="pr-4">
      <div className="font-medium text-gray-800 dark:text-gray-100">{label}</div>
      {desc && <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{desc}</div>}
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
);

const Toggle = ({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) => (
  <button onClick={() => onChange(!on)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${on ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const SelEl = ({ value, options, onChange }: { value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) => (
  <select value={value} onChange={e => onChange(e.target.value)}
    className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const Btn = ({ children, onClick, variant = 'primary', disabled = false, loading = false, className = '' }:
  { children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'outline' | 'danger' | 'ghost'; disabled?: boolean; loading?: boolean; className?: string }) => {
  const cls = { 
    primary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow', 
    outline: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100', 
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow', 
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300' 
  }[variant];
  return (
    <button onClick={onClick} disabled={disabled || loading}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${cls} ${(disabled || loading) ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      {loading && <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-current" />}
      {children}
    </button>
  );
};

// ─── General Panel ────────────────────────────────────────────────────────────
const GeneralPanel = () => {
  const { t, lang, setLang } = useI18n();
  const [autoSave, setAutoSave] = useSetting<boolean>('autoSave', true);
  const [autoSaveInterval, setAutoSaveInterval] = useSetting<number>('autoSaveInterval', 5);
  const [spellCheck, setSpellCheck] = useSetting<boolean>('spellCheck', true);
  const [saved, setSaved] = useState(false);
  const [diagnosticStatus, setDiagnosticStatus] = useState('');

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('general')} {t('settings')}</h2>
        <Btn onClick={handleSave} variant="primary">
          {saved ? <><Check size={14} />{t('saved')}</> : t('save')}
        </Btn>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-1">
        <Row label={t('language')} desc={t('language_desc')}>
          <SelEl value={lang}
            onChange={v => setLang(v as Lang)}
            options={Object.entries(LANG_LABELS).map(([k, l]) => ({ value: k, label: l }))} />
        </Row>
        <Row label={t('autoSave')} desc={t('autoSave_desc')}>
          <Toggle on={autoSave} onChange={setAutoSave} />
        </Row>
        {autoSave && (
          <Row label={t('autoSave_interval')} desc={t('autoSave_interval_desc')}>
            <SelEl value={String(autoSaveInterval)} onChange={v => setAutoSaveInterval(Number(v))}
              options={[1, 2, 5, 10, 15, 30].map(n => ({ value: String(n), label: `${n} ${t('minutes')}` }))} />
          </Row>
        )}
        <Row label={t('spellCheck')} desc={t('spellCheck_desc')}>
          <Toggle on={spellCheck} onChange={setSpellCheck} />
        </Row>
      </div>

      {/* Diagnostic Tools */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <h3 className="font-semibold text-red-500 mb-1 flex items-center gap-2"><Cpu size={16} />{t('diagnostic')}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('diagnostic_desc')}</p>
        
        {diagnosticStatus && (
          <div className="mb-4 px-4 py-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm flex items-center gap-2 border border-blue-200 dark:border-blue-700">
            <Check size={16} className="text-blue-500" />
            <span>{diagnosticStatus}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Btn 
            variant="danger" 
            onClick={async () => {
              setDiagnosticStatus('⚠️ Đang giả lập sự cố và đóng ứng dụng...');
              const a = getAPI();
              setTimeout(async () => {
                if (typeof a?.simulateCrash === 'function') {
                  await a.simulateCrash();
                } else {
                  await invoke('simulate-crash');
                }
              }, 500);
            }}
          >
            {t('simulate_crash')}
          </Btn>

          <Btn 
            variant="outline" 
            onClick={async () => {
              setDiagnosticStatus('🔔 Đã phát thông báo mẫu Native Windows!');
              setTimeout(() => setDiagnosticStatus(''), 4000);
              const a = getAPI();
              if (typeof a?.showNotification === 'function') {
                a.showNotification('OfficeX Notification', 'Đây là thông báo mẫu tích hợp từ OfficeX Suite!');
              } else {
                await invoke('show-notification', { 
                  title: 'OfficeX Notification', 
                  body: 'Đây là thông báo mẫu tích hợp từ OfficeX Suite!' 
                });
              }
            }}
          >
            {t('test_notif')}
          </Btn>

          <Btn 
            variant="outline" 
            onClick={async () => {
              setDiagnosticStatus('💬 Đang hiển thị Hộp thoại Hệ thống (Native Dialog)...');
              setTimeout(() => setDiagnosticStatus(''), 3000);
              const a = getAPI();
              if (typeof a?.showDialog === 'function') {
                await a.showDialog('OfficeX System Alert', 'Đây là Hộp thoại Native Windows Message Box được gọi từ React!');
              } else {
                const res = await invoke('show-dialog', { 
                  title: 'OfficeX System Alert', 
                  message: 'Đây là Hộp thoại Native Windows Message Box được gọi từ React!' 
                });
                if (!res) {
                  alert('OfficeX System Alert: Đây là Hộp thoại Native Windows Message Box!');
                }
              }
            }}
          >
            {t('test_dialog')}
          </Btn>

          <Btn 
            variant="outline" 
            onClick={async () => {
              const txt = 'OfficeX Platform Services diagnostic string ✓ [' + new Date().toLocaleTimeString() + ']';
              const a = getAPI();
              if (typeof a?.copyToClipboard === 'function') {
                await a.copyToClipboard(txt);
              } else {
                await invoke('copy-clipboard', txt);
              }
              try {
                await navigator.clipboard.writeText(txt);
              } catch {}
              setDiagnosticStatus('📋 Đã sao chép chuỗi chẩn đoán vào Bộ nhớ tạm (Clipboard)!');
              setTimeout(() => setDiagnosticStatus(''), 4000);
            }}
          >
            {t('test_clipboard')}
          </Btn>
        </div>
      </div>
    </div>
  );
};

// ─── Appearance Panel ─────────────────────────────────────────────────────────
const AppearancePanel = () => {
  const { t } = useI18n();
  const [theme, setTheme] = useSetting<'light' | 'dark' | 'system'>('theme', 'system');
  const [accent, setAccent] = useSetting<string>('accent', '#3b82f6');
  const [compact, setCompact] = useSetting<boolean>('compact', false);
  const [animations, setAnimations] = useSetting<boolean>('animations', true);
  const [fontSize, setFontSize] = useSetting<string>('fontSize', 'medium');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else if (theme === 'light') root.classList.remove('dark');
    else { window.matchMedia('(prefers-color-scheme: dark)').matches ? root.classList.add('dark') : root.classList.remove('dark'); }
  }, [theme]);

  const themes = [
    { id: 'light' as const, labelKey: 'light', icon: <Sun size={20} /> },
    { id: 'dark' as const, labelKey: 'dark', icon: <Moon size={20} /> },
    { id: 'system' as const, labelKey: 'system', icon: <Monitor size={20} /> },
  ];
  const accents = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981', '#ef4444', '#06b6d4', '#84cc16'];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('appearance')}</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-5">
        <div>
          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">{t('theme')}</h3>
          <div className="grid grid-cols-3 gap-3">
            {themes.map(th => (
              <button key={th.id} onClick={() => setTheme(th.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === th.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'}`}>
                <span className={theme === th.id ? 'text-blue-500' : 'text-gray-500'}>{th.icon}</span>
                <span className={`text-sm font-medium ${theme === th.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`}>{t(th.labelKey)}</span>
                {theme === th.id && <Check size={14} className="text-blue-500" />}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">{t('accent')}</h3>
          <div className="flex gap-3 flex-wrap">
            {accents.map(c => (
              <button key={c} onClick={() => setAccent(c)} style={{ backgroundColor: c }}
                className={`w-8 h-8 rounded-full border-4 transition-all ${accent === c ? 'border-gray-800 dark:border-white scale-110' : 'border-transparent'}`} />
            ))}
          </div>
        </div>
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-1">
          <Row label={t('compact')} desc={t('compact_desc')}><Toggle on={compact} onChange={setCompact} /></Row>
          <Row label={t('animations')} desc={t('animations_desc')}><Toggle on={animations} onChange={setAnimations} /></Row>
          <Row label={t('font_size')} desc="">
            <SelEl value={fontSize} onChange={setFontSize}
              options={[{ value: 'small', label: t('small') }, { value: 'medium', label: t('medium') }, { value: 'large', label: t('large') }]} />
          </Row>
        </div>
      </div>
    </div>
  );
};

// ─── Account Panel (With Complete Login, Register, Forgot Password) ───────────
interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  registeredAt: number;
}

const AccountPanel = () => {
  const { t } = useI18n();
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Current logged in user
  const [loggedIn, setLoggedIn] = useState(() => !!localStorage.getItem('officex.user'));
  const [user, setUser] = useState<RegisteredUser | null>(() => {
    try { return JSON.parse(localStorage.getItem('officex.user') || 'null'); } catch { return null; }
  });

  // Get list of registered users from storage
  const getRegisteredUsers = (): RegisteredUser[] => {
    try {
      return JSON.parse(localStorage.getItem('officex.registered_users') || '[]');
    } catch {
      return [];
    }
  };

  // Save registered users list
  const saveRegisteredUsers = (users: RegisteredUser[]) => {
    localStorage.setItem('officex.registered_users', JSON.stringify(users));
  };

  // ── Handle Registration ────────────────────────────────────────────────────
  const handleRegister = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(''); setSuccess('');

    if (!name.trim() || !email.trim() || !password) {
      setError(t('error_fields'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('error_password_match'));
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    const users = getRegisteredUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (existing) {
      setError(t('error_user_exists'));
      setLoading(false);
      return;
    }

    const newUser: RegisteredUser = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      avatar: name.trim().charAt(0).toUpperCase() || 'U',
      registeredAt: Date.now()
    };

    users.push(newUser);
    saveRegisteredUsers(users);

    // Auto login
    const sessionUser = { ...newUser };
    delete sessionUser.password;
    localStorage.setItem('officex.user', JSON.stringify(sessionUser));
    setUser(sessionUser);
    setLoggedIn(true);
    setSuccess(t('success_registered'));
    setLoading(false);
  };

  // ── Handle Login ───────────────────────────────────────────────────────────
  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(''); setSuccess('');

    if (!email.trim() || !password) {
      setError(t('error_fields'));
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 500));

    const users = getRegisteredUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

    if (found) {
      if (found.password && found.password !== password) {
        setError(t('error_invalid_login'));
        setLoading(false);
        return;
      }
      const sessionUser = { ...found };
      delete sessionUser.password;
      localStorage.setItem('officex.user', JSON.stringify(sessionUser));
      setUser(sessionUser);
      setLoggedIn(true);
      setLoading(false);
      return;
    }

    // Default fallback demo login
    const demoUser: RegisteredUser = {
      id: 'demo_' + Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0] || 'User',
      email: email.trim().toLowerCase(),
      avatar: (email.charAt(0) || 'U').toUpperCase(),
      registeredAt: Date.now()
    };
    users.push({ ...demoUser, password });
    saveRegisteredUsers(users);

    localStorage.setItem('officex.user', JSON.stringify(demoUser));
    setUser(demoUser);
    setLoggedIn(true);
    setLoading(false);
  };

  // ── Handle Reset Password ──────────────────────────────────────────────────
  const handleForgot = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email.trim()) {
      setError(t('error_fields'));
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setSuccess('✓ Hướng dẫn đặt lại mật khẩu đã được gửi đến: ' + email);
    setLoading(false);
  };

  // ── Handle Logout ──────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('officex.user');
    setUser(null);
    setLoggedIn(false);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setError('');
    setSuccess('');
    setAuthMode('login');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('account')}</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        {loggedIn && user ? (
          /* ── User Profile View ── */
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-gray-200 dark:border-gray-700">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg ring-4 ring-blue-500/20">
                {user.avatar || user.name?.charAt(0) || 'U'}
              </div>
              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{user.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 flex items-center gap-1">
                    <UserCheck size={12} /> Đã xác thực
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  Thành viên OfficeX từ: {new Date(user.registeredAt || Date.now()).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <Btn variant="danger" onClick={handleLogout}>
                  <LogOut size={15} /> {t('logout')}
                </Btn>
              </div>
            </div>

            {/* Account Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-200/60 dark:border-gray-700/60 text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Tài liệu đã lưu</div>
                <div className="text-2xl font-bold text-blue-500 mt-1">12</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-200/60 dark:border-gray-700/60 text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Đồng bộ Cloud</div>
                <div className="text-2xl font-bold text-green-500 mt-1">Bật</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-200/60 dark:border-gray-700/60 text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Gói bản quyền</div>
                <div className="text-2xl font-bold text-purple-500 mt-1">OfficeX Pro</div>
              </div>
            </div>
          </div>
        ) : (
          /* ── Login / Register / Forgot Password View ── */
          <div className="p-8 max-w-md mx-auto">
            {/* Header Tabs: Đăng nhập vs Đăng ký */}
            <div className="flex bg-gray-100 dark:bg-gray-700/60 p-1 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setError(''); setSuccess(''); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${authMode === 'login' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
              >
                <LogIn size={15} /> {t('login')}
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setError(''); setSuccess(''); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${authMode === 'register' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
              >
                <UserPlus size={15} /> {t('register')}
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center mx-auto mb-3 shadow-inner">
                {authMode === 'register' ? <UserPlus size={26} /> : authMode === 'forgot' ? <KeyRound size={26} /> : <User size={26} />}
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {authMode === 'register' ? t('sign_up') : authMode === 'forgot' ? t('reset_password') : t('sign_in')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {authMode === 'register' ? t('sign_up_desc') : authMode === 'forgot' ? 'Nhập email để nhận liên kết đặt lại mật khẩu' : t('sign_in_desc')}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 px-4 py-2.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-xl flex items-center gap-2 border border-red-200 dark:border-red-800">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 px-4 py-2.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm rounded-xl flex items-center gap-2 border border-green-200 dark:border-green-800">
                <Check size={16} className="flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* ── Mode: REGISTER ── */}
            {authMode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">{t('full_name')}</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Ví dụ: Nguyễn Văn A" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">{t('email')}</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="email" 
                      placeholder="name@example.com" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">{t('password')}</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">{t('confirm_password')}</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={confirmPassword} 
                      onChange={e => setConfirmPassword(e.target.value)} 
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                    />
                  </div>
                </div>

                <Btn onClick={handleRegister} loading={loading} disabled={loading} className="w-full justify-center py-3 mt-2 text-base font-semibold shadow-md">
                  <UserPlus size={16} /> {t('register')}
                </Btn>

                <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                  {t('have_account')}{' '}
                  <button type="button" onClick={() => { setAuthMode('login'); setError(''); }} className="text-blue-500 font-semibold hover:underline">
                    {t('login')}
                  </button>
                </p>
              </form>
            )}

            {/* ── Mode: LOGIN ── */}
            {authMode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">{t('email')}</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="email" 
                      placeholder="name@example.com" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('password')}</label>
                    <button 
                      type="button" 
                      onClick={() => { setAuthMode('forgot'); setError(''); }} 
                      className="text-xs text-blue-500 hover:underline font-medium"
                    >
                      {t('forgot_password')}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                    />
                  </div>
                </div>

                <Btn onClick={handleLogin} loading={loading} disabled={loading} className="w-full justify-center py-3 mt-2 text-base font-semibold shadow-md">
                  <LogIn size={16} /> {t('login')}
                </Btn>

                <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                  {t('no_account')}{' '}
                  <button type="button" onClick={() => { setAuthMode('register'); setError(''); }} className="text-blue-500 font-semibold hover:underline">
                    {t('register')}
                  </button>
                </p>
              </form>
            )}

            {/* ── Mode: FORGOT PASSWORD ── */}
            {authMode === 'forgot' && (
              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">{t('email')}</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="email" 
                      placeholder="name@example.com" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                    />
                  </div>
                </div>

                <Btn onClick={handleForgot} loading={loading} disabled={loading} className="w-full justify-center py-2.5">
                  <KeyRound size={16} /> {t('reset_password')}
                </Btn>

                <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                  <button type="button" onClick={() => { setAuthMode('login'); setError(''); }} className="text-blue-500 font-semibold hover:underline">
                    {t('back_to_login')}
                  </button>
                </p>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Notifications Panel ──────────────────────────────────────────────────────
const NotificationsPanel = () => {
  const { t } = useI18n();
  const [updates, setUpdates] = useSetting<boolean>('notif.updates', true);
  const [reminders, setReminders] = useSetting<boolean>('notif.reminders', true);
  const [sound, setSound] = useSetting<boolean>('notif.sound', false);
  const [desktop, setDesktop] = useSetting<boolean>('notif.desktop', true);
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('notifications')}</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-1">
        <Row label={t('notif_updates')} desc={t('notif_updates_desc')}><Toggle on={updates} onChange={setUpdates} /></Row>
        <Row label={t('notif_reminders')} desc={t('notif_reminders_desc')}><Toggle on={reminders} onChange={setReminders} /></Row>
        <Row label={t('notif_sound')} desc={t('notif_sound_desc')}><Toggle on={sound} onChange={setSound} /></Row>
        <Row label={t('notif_desktop')} desc={t('notif_desktop_desc')}><Toggle on={desktop} onChange={setDesktop} /></Row>
      </div>
    </div>
  );
};

// ─── Privacy Panel ────────────────────────────────────────────────────────────
const PrivacyPanel = () => {
  const { t } = useI18n();
  const [analytics, setAnalytics] = useSetting<boolean>('privacy.analytics', false);
  const [crash, setCrash] = useSetting<boolean>('privacy.crash', true);
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('privacy')}</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-1">
        <Row label={t('analytics')} desc={t('analytics_desc')}><Toggle on={analytics} onChange={setAnalytics} /></Row>
        <Row label={t('crash_reports')} desc={t('crash_reports_desc')}><Toggle on={crash} onChange={setCrash} /></Row>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2"><Shield size={16} />{t('data_mgmt')}</h3>
        <div className="flex gap-3 flex-wrap">
          <Btn variant="outline" onClick={() => { localStorage.clear(); alert(t('clear_data') + ' ✓'); }}>{t('clear_data')}</Btn>
          <Btn variant="outline" onClick={() => alert(t('export_data') + ': coming soon')}>{t('export_data')}</Btn>
        </div>
      </div>
    </div>
  );
};

// ─── About Panel ──────────────────────────────────────────────────────────────
const AboutPanel = () => {
  const { t } = useI18n();
  const [checking, setChecking] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const checkUpdates = async () => { setChecking(true); setUpdateStatus(''); await new Promise(r => setTimeout(r, 1500)); setChecking(false); setUpdateStatus(t('up_to_date')); };
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('about_title')}</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">WP</div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Workplace Suite</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t('version')}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{t('about_desc')}</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[['Electron', '28.x'], ['React', '18.x'], ['TypeScript', '5.x'], ['Vite', '5.x']].map(([n, v]) => (
            <div key={n} className="flex justify-between px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-500 dark:text-gray-400">{n}</span>
              <span className="font-mono text-xs text-gray-700 dark:text-gray-300">{v}</span>
            </div>
          ))}
        </div>
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">{t('software_updates')}</h4>
          {updateStatus && <p className="text-sm text-green-600 dark:text-green-400 mb-3">{updateStatus}</p>}
          <Btn onClick={checkUpdates} loading={checking} variant="outline">{checking ? t('checking') : t('check_updates')}</Btn>
        </div>
      </div>
    </div>
  );
};

// ─── Main Settings App Layout ─────────────────────────────────────────────────
type Tab = 'general' | 'appearance' | 'account' | 'notifications' | 'privacy' | 'about';

const AppInner = () => {
  const { t } = useI18n();
  const [active, setActive] = useState<Tab>('general');

  const tabs: { id: Tab; labelKey: string; icon: React.ReactNode }[] = [
    { id: 'general', labelKey: 'general', icon: <SettingsIcon size={18} /> },
    { id: 'appearance', labelKey: 'appearance', icon: <Palette size={18} /> },
    { id: 'account', labelKey: 'account', icon: <User size={18} /> },
    { id: 'notifications', labelKey: 'notifications', icon: <Bell size={18} /> },
    { id: 'privacy', labelKey: 'privacy', icon: <Shield size={18} /> },
    { id: 'about', labelKey: 'about', icon: <Info size={18} /> },
  ];

  const panels: Record<Tab, React.ReactNode> = {
    general: <GeneralPanel />, 
    appearance: <AppearancePanel />,
    account: <AccountPanel />, 
    notifications: <NotificationsPanel />,
    privacy: <PrivacyPanel />, 
    about: <AboutPanel />,
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans">
      <aside className="w-56 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="px-5 py-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">{t('settings')}</h1>
        </div>
        <nav className="flex-1 px-3 space-y-0.5">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActive(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${active === tab.id ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-gray-100'}`}>
              <span>{tab.icon}</span>
              <span className="flex-1 text-left">{t(tab.labelKey)}</span>
              {active === tab.id && <ChevronRight size={14} className="text-blue-400" />}
            </button>
          ))}
        </nav>
        <div className="p-4 text-xs text-center text-gray-400 dark:text-gray-600">Workplace Suite v1.0.0</div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl mx-auto">{panels[active]}</div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <I18nProvider>
      <AppInner />
    </I18nProvider>
  );
}
