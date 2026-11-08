import React, { useState, useEffect } from 'react';

export interface FolderOption {
  id: string;
  icon: string;
  label: string;
  desc: string;
  path: string;
}

export const PRESET_FOLDERS: FolderOption[] = [
  { id: 'desktop', icon: '🖥️', label: 'Desktop', desc: 'Màn hình chính', path: 'C:\\Users\\taduc\\Desktop' },
  { id: 'documents', icon: '📄', label: 'Documents', desc: 'Thư mục Tài liệu', path: 'C:\\Users\\taduc\\Documents' },
  { id: 'downloads', icon: '📥', label: 'Downloads', desc: 'Thư mục Tải về', path: 'C:\\Users\\taduc\\Downloads' },
  { id: 'officex', icon: '💼', label: 'OfficeX Docs', desc: 'Thư mục tài liệu OfficeX', path: 'C:\\Users\\taduc\\Documents\\OfficeX' },
];

interface FolderSaveDialogProps {
  isOpen: boolean;
  title?: string;
  subtitle?: string;
  initialFileName?: string;
  initialFolder?: string;
  onSave: (fullPath: string, fileName: string) => void;
  onDismiss: () => void;
  onCancel?: () => void;
}

export const FolderSaveDialog: React.FC<FolderSaveDialogProps> = ({
  isOpen,
  title = 'Chọn Thư Mục Lưu Tài Liệu',
  subtitle = 'Tài liệu chưa được đặt tên hoặc chọn vị trí lưu. Hãy chọn thư mục lưu trữ:',
  initialFileName = 'Document 1.docx',
  initialFolder = 'C:\\Users\\taduc\\Desktop',
  onSave,
  onDismiss,
  onCancel,
}) => {
  const [selectedFolder, setSelectedFolder] = useState<string>(initialFolder);
  const [fileName, setFileName] = useState<string>(initialFileName);
  const [isCustomFolder, setIsCustomFolder] = useState(false);
  const [customPath, setCustomPath] = useState('D:\\OfficeX_Docs');

  useEffect(() => {
    if (isOpen) {
      setFileName(initialFileName || 'Document 1.docx');
      if (initialFolder) {
        setSelectedFolder(initialFolder);
      }
    }
  }, [isOpen, initialFileName, initialFolder]);

  if (!isOpen) return null;

  const currentFolder = isCustomFolder ? (customPath.trim() || 'C:\\Users\\taduc\\Desktop') : selectedFolder;
  const cleanName = fileName.trim() || 'Document 1';
  const finalFileName = cleanName.includes('.') ? cleanName : `${cleanName}.docx`;
  const fullPath = `${currentFolder.replace(/[\\/]+$/, '')}\\${finalFileName}`;

  const handleConfirm = () => {
    onSave(fullPath, finalFileName);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 12,
          width: 540,
          maxWidth: '92vw',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.28)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #d1d5db',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #2b579a 0%, #1f4277 100%)',
            color: '#fff',
            padding: '18px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 26 }}>📁</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: -0.2 }}>{title}</div>
              <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>{subtitle}</div>
            </div>
          </div>
          <button
            onClick={onDismiss}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: 18,
              cursor: 'pointer',
              opacity: 0.8,
              padding: 4,
              lineHeight: 1,
            }}
            title="Đóng"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* File Name Input */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              📝 Tên tài liệu:
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #2b579a', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConfirm();
                }}
                autoFocus
                placeholder="Ví dụ: Báo cáo công việc..."
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  border: 'none',
                  outline: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#111827',
                }}
              />
              <span style={{ padding: '0 12px', background: '#f3f4f6', color: '#6b7280', fontSize: 13, fontWeight: 600, borderLeft: '1px solid #e5e7eb', height: '100%', display: 'flex', alignItems: 'center' }}>
                .docx
              </span>
            </div>
          </div>

          {/* Folder Choices */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              📂 Chọn thư mục lưu:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {PRESET_FOLDERS.map((f) => {
                const isSelected = !isCustomFolder && selectedFolder === f.path;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setIsCustomFolder(false);
                      setSelectedFolder(f.path);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: isSelected ? '2px solid #2b579a' : '1px solid #e5e7eb',
                      background: isSelected ? '#eff6ff' : '#fafafa',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{f.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: isSelected ? 700 : 600, color: isSelected ? '#1e40af' : '#1f2937' }}>
                        {f.label}
                      </div>
                      <div style={{ fontSize: 11, color: '#6b7280', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {f.desc}
                      </div>
                    </div>
                    {isSelected && (
                      <span style={{ color: '#2b579a', fontSize: 14, fontWeight: 'bold' }}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Folder Option */}
            <div style={{ marginTop: 10 }}>
              <button
                type="button"
                onClick={() => setIsCustomFolder(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: isCustomFolder ? '2px solid #2b579a' : '1px dashed #cbd5e1',
                  background: isCustomFolder ? '#eff6ff' : '#f8fafc',
                  width: '100%',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: 13,
                  fontWeight: 500,
                  color: isCustomFolder ? '#1e40af' : '#475569',
                }}
              >
                <span>📁</span>
                <span>Thư mục khác / Nhập đường dẫn tùy chỉnh...</span>
              </button>

              {isCustomFolder && (
                <div style={{ marginTop: 8 }}>
                  <input
                    type="text"
                    value={customPath}
                    onChange={(e) => setCustomPath(e.target.value)}
                    placeholder="Ví dụ: D:\VanBan\DuAn2026"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1.5px solid #2b579a',
                      fontSize: 13,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Full Path Preview */}
          <div
            style={{
              padding: '10px 14px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              fontSize: 12,
              color: '#334155',
            }}
          >
            <div style={{ fontWeight: 600, color: '#64748b', marginBottom: 2 }}>📍 Đường dẫn lưu đầy đủ:</div>
            <div style={{ fontFamily: 'Consolas, monospace', wordBreak: 'break-all', color: '#0f172a', fontWeight: 600 }}>
              {fullPath}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '14px 24px',
            background: '#f9fafb',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <button
            type="button"
            onClick={onDismiss}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: '1px solid #d1d5db',
              background: '#ffffff',
              color: '#4b5563',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Soạn thảo trước (Lưu sau)
          </button>

          <div style={{ display: 'flex', gap: 10 }}>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                style={{
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: '1px solid #d1d5db',
                  background: '#ffffff',
                  color: '#4b5563',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Hủy
              </button>
            )}
            <button
              type="button"
              onClick={handleConfirm}
              style={{
                padding: '8px 22px',
                borderRadius: 6,
                border: 'none',
                background: '#2b579a',
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 2px 6px rgba(43, 87, 154, 0.35)',
              }}
            >
              <span>💾</span>
              <span>Lưu vào thư mục này</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
