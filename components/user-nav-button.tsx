'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { UserProfileModal } from '@/components/user-profile-modal';

export function UserNavButton() {
  const { user } = useAuth();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  if (user) {
    return (
      <>
        <button
          onClick={() => setIsUserModalOpen(true)}
          className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm transition hover:bg-primary/20"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs font-semibold">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-foreground">{user?.name}</span>
        </button>
        <UserProfileModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <Link href="/login" className="text-sm text-muted transition hover:text-foreground">
        Login
      </Link>
      <Link
        href="/signup"
        className="inline-flex items-center justify-center rounded-full bg-border px-5 py-2 text-sm font-medium text-foreground transition hover:bg-card"
      >
        Sign Up
      </Link>
    </>
  );
}
