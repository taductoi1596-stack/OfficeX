import React, { useState } from 'react';
import { Settings as SettingsIcon, Palette, User, Info } from 'lucide-react';
import { cn, Button } from '@officex/ui';
import { useAuthStore, LoginForm } from '@officex/auth';

export default function App() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'account', label: 'Account', icon: User },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-card">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        <nav className="space-y-1 px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-2xl">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">General Settings</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-border bg-card">
                  <h3 className="font-medium">Language</h3>
                  <p className="text-sm text-muted-foreground mt-1">Select your preferred language for the OfficeX Suite.</p>
                  <select className="mt-4 w-full p-2 rounded-md bg-background border border-input text-sm">
                    <option>English</option>
                    <option>Vietnamese</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Appearance</h2>
              <div className="grid grid-cols-3 gap-4">
                {['Light', 'Dark', 'System'].map((theme) => (
                  <button key={theme} className="p-4 rounded-lg border border-border bg-card hover:bg-muted text-center">
                    <span className="font-medium">{theme}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Account</h2>
              {isAuthenticated && user ? (
                <div className="p-6 rounded-lg border border-border bg-card text-center">
                  <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="font-medium text-lg">{user.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-6">{user.email}</p>
                  <Button variant="outline" onClick={logout}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <LoginForm />
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">About OfficeX</h2>
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="font-bold text-xl text-primary mb-2">OfficeX Suite</h3>
                <p className="text-muted-foreground mb-4">Version 1.0.0-beta</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A modern, offline-first productivity suite designed to be the next-generation alternative to traditional office software.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
