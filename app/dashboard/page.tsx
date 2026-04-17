import { DashboardClient } from '@/components/dashboard-client';
import { LayoutShell } from '@/components/layout-shell';
import { ProtectedRoute } from '@/components/protected-route';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <LayoutShell>
        <DashboardClient />
      </LayoutShell>
    </ProtectedRoute>
  );
}
