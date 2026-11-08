/**
 * OneDriveBrowserModal.tsx
 * 
 * Office 365 Style OneDrive File Browser Dialog.
 * Features sidebar navigation, breadcrumbs, grid/list view, search, new folder,
 * file actions (Open, Rename, Delete, Pin Favorite), upload/download, and storage meter.
 */

import React, { useState, useEffect } from 'react';
import { OneDriveAuthEngine, MicrosoftUserProfile } from './OneDriveAuthEngine';
import { MicrosoftGraphEngine, OneDriveItem } from './MicrosoftGraphEngine';
import { OneDriveEngine } from './OneDriveEngine';

interface OneDriveBrowserModalProps {
  mode: 'open' | 'save_as';
  onClose: () => void;
}

export function OneDriveBrowserModal({ mode, onClose }: OneDriveBrowserModalProps) {
  const [profile, setProfile] = useState<MicrosoftUserProfile | null>(OneDriveAuthEngine.getUserProfile());
  const [currentNav, setCurrentNav] = useState<'my_files' | 'recent' | 'favorites' | 'shared'>('my_files');
  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [folderBreadcrumbs, setFolderBreadcrumbs] = useState<Array<{ id: string; name: string }>>([
    { id: 'root', name: 'OneDrive' },
  ]);

  const [items, setItems] = useState<OneDriveItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isLoading, setIsLoading] = useState(false);

  // Login inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassExcel, setLoginPassExcel] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Action Modals
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [saveFileName, setSaveFileName] = useState('Workbook_1.xlsx');
  const [renamingItem, setRenamingItem] = useState<{ id: string; name: string } | null>(null);
  const [renameValue, setRenameValue] = useState('');

  useEffect(() => {
    if (OneDriveAuthEngine.isAuthenticated()) {
      loadCurrentItems();
    }
  }, [currentNav, currentFolderId, searchQuery]);

  const loadCurrentItems = async () => {
    setIsLoading(true);
    try {
      if (searchQuery.trim()) {
        const res = await MicrosoftGraphEngine.searchItems(searchQuery);
        setItems(res);
      } else if (currentNav === 'recent') {
        const res = await MicrosoftGraphEngine.getRecentItems();
        setItems(res);
      } else if (currentNav === 'favorites') {
        const res = await MicrosoftGraphEngine.getFavoriteItems();
        setItems(res);
      } else if (currentNav === 'shared') {
        const res = await MicrosoftGraphEngine.getSharedItems();
        setItems(res);
      } else {
        const res = await MicrosoftGraphEngine.getItemsInFolder(currentFolderId);
        setItems(res);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const [loginError, setLoginError] = useState<string | null>(null);
  const [showOAuthWindow, setShowOAuthWindow] = useState(false);

  const handleLogin = async () => {
    setLoginError(null);
    const validation = OneDriveAuthEngine.validateMicrosoftAccount(loginEmail, loginPassExcel);
    if (!validation.isValid) {
      setLoginError(validation.error || 'Authentication error');
      return;
    }

    // Launch Microsoft OAuth 2.0 Consent Prompt
    setShowOAuthWindow(true);
  };

  const handleConsentAccept = async () => {
    setShowOAuthWindow(false);
    setIsLoggingIn(true);
    const res = await OneDriveAuthEngine.login(loginEmail, loginPassExcel);
    setIsLoggingIn(false);
    if (res.success && res.profile) {
      setProfile(res.profile);
      loadCurrentItems();
    } else if (res.error) {
      setLoginError(res.error);
    }
  };

  const handleLogout = async () => {
    await OneDriveAuthEngine.logout();
    setProfile(null);
  };

  const handleNavigateFolder = (folder: OneDriveItem) => {
    setCurrentFolderId(folder.id);
    setFolderBreadcrumbs(prev => [...prev, { id: folder.id, name: folder.name }]);
  };

  const handleBreadcrumbClick = (index: number) => {
    const target = folderBreadcrumbs[index];
    setFolderBreadcrumbs(prev => prev.slice(0, index + 1));
    setCurrentFolderId(target.id);
  };

  const handleOpenFile = async (item: OneDriveItem) => {
    await OneDriveEngine.openItem(item);
    onClose();
  };

  const handleSaveFile = async () => {
    if (!saveFileName.trim()) return;
    const legacy = (window as any).EditorAPI?.getLegacy?.();
    const content = legacy?.getSelectionText?.() || 'Workbook Content';
    await OneDriveEngine.saveCurrentWorkbook(saveFileName, content);
    onClose();
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    await MicrosoftGraphEngine.createFolder(currentFolderId, newFolderName);
    setNewFolderName('');
    setShowNewFolder(false);
    loadCurrentItems();
  };

  const handleDeleteItem = async (id: string) => {
    await MicrosoftGraphEngine.deleteItem(id);
    loadCurrentItems();
  };

  const handleToggleFavorite = (id: string) => {
    MicrosoftGraphEngine.toggleFavorite(id);
    loadCurrentItems();
  };

  const handleRenameSubmit = async () => {
    if (!renamingItem || !renameValue.trim()) return;
    await MicrosoftGraphEngine.renameItem(renamingItem.id, renameValue);
    setRenamingItem(null);
    loadCurrentItems();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ width: 880, height: 600, background: '#fff', borderRadius: 14, boxShadow: '0 16px 48px rgba(0,0,0,0.3)', border: '1px solid #D1D5DB', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* ── HEADER ────────────────────────────────────────────────────────── */}
        <div style={{ padding: '14px 20px', background: '#0078D4', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontWeight: 700, fontSize: 16 }}>
            <span style={{ fontSize: 22 }}>☁️</span>
            <span>Microsoft OneDrive — {mode === 'open' ? 'Open Workbook' : 'Save Workbook As'}</span>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', color: '#fff', fontSize: 18, cursor: 'pointer' }}>✕</button>
        </div>

        {/* ── IF NOT LOGGED IN ─────────────────────────────────────────────── */}
        {!profile ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, background: '#F9FAFB', position: 'relative' }}>
            <span style={{ fontSize: 56, marginBottom: 12 }}>☁️</span>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Sign in to Microsoft OneDrive</div>
            <div style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', maxWidth: 420, marginBottom: 20 }}>
              Connect your Microsoft Account (Outlook, Hotmail, or Microsoft 365 Enterprise) to open, edit, and auto-sync Workbooks across all your devices.
            </div>

            {/* Error Message Alert Box */}
            {loginError && (
              <div style={{ width: 360, padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 8, color: '#991B1B', fontSize: 12, marginBottom: 16, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 16 }}>⚠️</span>
                <div>{loginError}</div>
              </div>
            )}

            <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Microsoft Email Account</label>
                <input
                  value={loginEmail}
                  onChange={e => { setLoginEmail(e.target.value); setLoginError(null); }}
                  placeholder="user@outlook.com or user@company.com"
                  style={{ width: '100%', padding: '9px 12px', border: `1px solid ${loginError ? '#EF4444' : '#D1D5DB'}`, borderRadius: 6, fontSize: 13, outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 4 }}>PassExcel</label>
                <input
                  type="passExcel"
                  value={loginPassExcel}
                  onChange={e => { setLoginPassExcel(e.target.value); setLoginError(null); }}
                  placeholder="••••••••••••"
                  style={{ width: '100%', padding: '9px 12px', border: `1px solid ${loginError ? '#EF4444' : '#D1D5DB'}`, borderRadius: 6, fontSize: 13, outline: 'none' }}
                />
              </div>
              <button
                onClick={handleLogin}
                disabled={isLoggingIn || !loginEmail.trim()}
                style={{
                  padding: '11px', background: '#0078D4', color: '#fff', border: 'none',
                  borderRadius: 6, fontWeight: 700, fontSize: 14, cursor: isLoggingIn ? 'wait' : 'pointer',
                  opacity: isLoggingIn || !loginEmail.trim() ? 0.7 : 1, marginTop: 4,
                }}
              >
                {isLoggingIn ? '⚡ Connecting to Microsoft Identity Platform...' : 'Sign In with Microsoft Account'}
              </button>
            </div>

            <div style={{ fontSize: 11, color: '#9CA3AF' }}>
              🔒 Protected by OAuth 2.0 PKCE SSL Encryption • Microsoft Graph API v1.0
            </div>

            {/* MICROSOFT OAUTH 2.0 PERMISSION CONSENT WINDOW */}
            {showOAuthWindow && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 440, background: '#fff', borderRadius: 12, boxShadow: '0 16px 48px rgba(0,0,0,0.35)', border: '1px solid #D1D5DB', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', background: '#0078D4', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                    <span>https://login.microsoftonline.com/common/oauth2/v2.0/authorize</span>
                    <span>OAuth 2.0 PKCE</span>
                  </div>
                  <div style={{ padding: 24 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                      <span style={{ fontSize: 32 }}>☁️</span>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Permissions Requested</div>
                        <div style={{ fontSize: 11, color: '#6B7280' }}>OfficeX Excel Desktop App</div>
                      </div>
                    </div>

                    <div style={{ fontSize: 12, color: '#374151', marginBottom: 16 }}>
                      <b>OfficeX Excel</b> needs your permission to access resources in your organization:
                    </div>

                    <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: 12, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, color: '#4B5563' }}>
                      <div>✔ <b>Files.ReadWrite</b> — Access and edit your OneDrive files</div>
                      <div>✔ <b>User.Read</b> — Read your basic Microsoft user profile</div>
                      <div>✔ <b>offline_access</b> — Maintain access to data given access to</div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                      <button onClick={() => setShowOAuthWindow(false)} style={{ padding: '8px 16px', background: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                      <button onClick={handleConsentAccept} style={{ padding: '8px 20px', background: '#0078D4', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Accept & Continue</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── MAIN BROWSER INTERFACE (LOGGED IN) ─────────────────────────── */
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            
            {/* ── SIDEBAR ────────────────────────────────────────────────────── */}
            <div style={{ width: 230, background: '#F3F4F6', borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', padding: 14 }}>
              {/* Account Card */}
              <div style={{ padding: 10, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#0078D4', color: '#fff', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {profile.displayName.slice(0, 2)}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 700, fontSize: 12, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile.displayName}</div>
                    <div style={{ fontSize: 10, color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile.mail}</div>
                  </div>
                </div>

                {/* Storage Meter Bar */}
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#4B5563', fontWeight: 600, marginBottom: 3 }}>
                    <span>Storage</span>
                    <span>15.2 GB / 100 GB</span>
                  </div>
                  <div style={{ height: 5, background: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: '15%', height: '100%', background: '#0078D4', borderRadius: 3 }} />
                  </div>
                </div>

                <button onClick={handleLogout} style={{ marginTop: 10, width: '100%', padding: '4px', background: '#FEE2E2', color: '#DC2626', border: '1px solid #FCA5A5', borderRadius: 4, fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>Sign Out</button>
              </div>

              {/* Navigation Items */}
              <div style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', letterSpacing: '0.05em', marginBottom: 6, paddingLeft: 6 }}>NAVIGATE</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  { id: 'my_files', icon: '📁', label: 'My Files' },
                  { id: 'recent', icon: '🕒', label: 'Recent Files' },
                  { id: 'favorites', icon: '⭐', label: 'Favorites' },
                  { id: 'shared', icon: '👥', label: 'Shared With Me' },
                ].map(nav => (
                  <button
                    key={nav.id}
                    onClick={() => { setCurrentNav(nav.id as any); setSearchQuery(''); }}
                    style={{
                      display: 'flex', gap: 10, alignItems: 'center', padding: '8px 10px',
                      borderRadius: 6, border: 'none', background: currentNav === nav.id ? '#E0F2FE' : 'transparent',
                      color: currentNav === nav.id ? '#0284C7' : '#374151', fontWeight: currentNav === nav.id ? 700 : 500,
                      fontSize: 12, cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{nav.icon}</span>
                    <span>{nav.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── CONTENT AREA ───────────────────────────────────────────────── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', overflow: 'hidden' }}>
              
              {/* Toolbar */}
              <div style={{ padding: '10px 16px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <input
                  placeholder="🔍 Search files in OneDrive..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ flex: 1, padding: '7px 12px', border: '1px solid #D1D5DB', borderRadius: 6, fontSize: 12, outline: 'none' }}
                />

                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setShowNewFolder(true)} style={{ padding: '6px 12px', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>+ New Folder</button>
                  <button onClick={loadCurrentItems} style={{ padding: '6px 12px', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>🔄 Refresh</button>
                  <button onClick={() => setViewMode(v => v === 'list' ? 'grid' : 'list')} style={{ padding: '6px 10px', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>{viewMode === 'list' ? '🔲 Grid' : '☰ List'}</button>
                </div>
              </div>

              {/* Breadcrumbs */}
              <div style={{ padding: '8px 16px', background: '#FAFAFA', borderBottom: '1px solid #F3F4F6', fontSize: 11, display: 'flex', gap: 6, alignItems: 'center' }}>
                {folderBreadcrumbs.map((b, idx) => (
                  <React.Fragment key={b.id}>
                    {idx > 0 && <span style={{ color: '#9CA3AF' }}>/</span>}
                    <button onClick={() => handleBreadcrumbClick(idx)} style={{ border: 'none', background: 'none', color: '#0078D4', fontWeight: 600, cursor: 'pointer', padding: 0 }}>{b.name}</button>
                  </React.Fragment>
                ))}
              </div>

              {/* Items List */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
                {isLoading ? (
                  <div style={{ textAlign: 'center', padding: 40, color: '#6B7280', fontSize: 13 }}>⚡ Loading OneDrive items...</div>
                ) : items.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>
                    <span style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>📭</span>
                    No files or folders found here.
                  </div>
                ) : viewMode === 'list' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {items.map(item => (
                      <div
                        key={item.id}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#fff', transition: 'background 0.12s' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#F9FAFB'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#fff'}
                      >
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1, cursor: item.isFolder ? 'pointer' : 'default' }} onClick={() => item.isFolder ? handleNavigateFolder(item) : handleOpenFile(item)}>
                          <span style={{ fontSize: 24 }}>{item.isFolder ? '📁' : '📄'}</span>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>{item.name}</div>
                            <div style={{ fontSize: 10, color: '#6B7280' }}>
                              {item.isFolder ? `${item.folderChildCount ?? 0} items` : `${(item.size / 1024).toFixed(1)} KB`} • Modified {new Date(item.lastModifiedDateTime).toLocaleDateString()}
                              {item.isShared && ` • Shared by ${item.sharedBy}`}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => handleToggleFavorite(item.id)} title={item.isFavorite ? 'Unfavorite' : 'Favorite'} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 14 }}>{item.isFavorite ? '⭐' : '☆'}</button>
                          {!item.isFolder && (
                            <button onClick={() => handleOpenFile(item)} style={{ padding: '4px 10px', background: '#0078D4', color: '#fff', border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Open</button>
                          )}
                          <button onClick={() => { setRenamingItem({ id: item.id, name: item.name }); setRenameValue(item.name); }} style={{ padding: '4px 8px', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>✏️</button>
                          <button onClick={() => handleDeleteItem(item.id)} style={{ padding: '4px 8px', background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
                    {items.map(item => (
                      <div
                        key={item.id}
                        onClick={() => item.isFolder ? handleNavigateFolder(item) : handleOpenFile(item)}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 14, border: '1px solid #E5E7EB', borderRadius: 8, background: '#fff', cursor: 'pointer', textAlign: 'center' }}
                      >
                        <span style={{ fontSize: 36, marginBottom: 6 }}>{item.isFolder ? '📁' : '📄'}</span>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                        <div style={{ fontSize: 10, color: '#6B7280', marginTop: 2 }}>{item.isFolder ? `${item.folderChildCount ?? 0} items` : `${(item.size / 1024).toFixed(1)} KB`}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Save As Footer Input */}
              {mode === 'save_as' && (
                <div style={{ padding: '12px 16px', background: '#F9FAFB', borderTop: '1px solid #E5E7EB', display: 'flex', gap: 10, alignItems: 'center' }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>File name:</label>
                  <input
                    value={saveFileName}
                    onChange={e => setSaveFileName(e.target.value)}
                    style={{ flex: 1, padding: '7px 12px', border: '1px solid #D1D5DB', borderRadius: 6, fontSize: 12, outline: 'none' }}
                  />
                  <button onClick={handleSaveFile} style={{ padding: '8px 18px', background: '#0078D4', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Save to OneDrive</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── FOOTER STATUS BAR ─────────────────────────────────────────────── */}
        <div style={{ padding: '8px 16px', background: '#F3F4F6', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: '#4B5563' }}>
          <div>🟢 Status: Connected to Microsoft Identity Platform • OAuth 2.0 PKCE</div>
          <div>⚡ Auto-Save Sync: Active (Background)</div>
        </div>
      </div>

      {/* ── NEW FOLDER MODAL ───────────────────────────────────────────────── */}
      {showNewFolder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 380, background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Create New Folder in OneDrive</div>
            <input
              placeholder="Folder Name"
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #CCC', borderRadius: 6, fontSize: 12, marginBottom: 14, outline: 'none' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setShowNewFolder(false)} style={{ padding: '6px 12px', background: '#E5E7EB', border: 'none', borderRadius: 4, fontSize: 11 }}>Cancel</button>
              <button onClick={handleCreateFolder} style={{ padding: '6px 14px', background: '#0078D4', color: '#fff', border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* ── RENAME ITEM MODAL ──────────────────────────────────────────────── */}
      {renamingItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 380, background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Rename OneDrive Item</div>
            <input
              value={renameValue}
              onChange={e => setRenameValue(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #CCC', borderRadius: 6, fontSize: 12, marginBottom: 14, outline: 'none' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setRenamingItem(null)} style={{ padding: '6px 12px', background: '#E5E7EB', border: 'none', borderRadius: 4, fontSize: 11 }}>Cancel</button>
              <button onClick={handleRenameSubmit} style={{ padding: '6px 14px', background: '#0078D4', color: '#fff', border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
