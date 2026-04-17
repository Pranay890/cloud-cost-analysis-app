'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogOut, User, Mail, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.push('/');
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">Account</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* User Info Section */}
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                <span className="text-lg font-semibold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted font-medium">Account holder</p>
                <p className="text-lg font-bold text-foreground">{user.name}</p>
              </div>
            </div>
          </div>

          {/* Email Section */}
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-muted font-semibold">Email</p>
                <p className="mt-1 text-sm text-foreground break-all">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-muted font-semibold mb-3">Status</p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success" />
              <p className="text-sm text-foreground font-medium">Active</p>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full mt-6 bg-error/10 border border-error/30 text-error hover:bg-error/20 disabled:opacity-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isLoggingOut ? 'Signing out...' : 'Sign out'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
