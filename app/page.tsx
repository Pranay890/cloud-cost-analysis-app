import { DashboardClient } from '@/components/dashboard-client';
import { LayoutShell } from '@/components/layout-shell';

export default function HomePage() {
  return (
    <LayoutShell>
      <DashboardClient />
    </LayoutShell>
  );
}
