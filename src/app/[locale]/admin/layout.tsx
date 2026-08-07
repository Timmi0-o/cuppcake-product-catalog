import { AuthModal } from '@/components/modals/auth/auth-modal';
import { AdminShell } from '@/components/widgets/admin-shell/admin-shell';
import { auth } from '@/configs/auth/auth';
import type { ReactNode } from 'react';

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth();

  if (!session?.user?.id) {
    return <AuthModal forced />;
  }

  return (
    <AdminShell userEmail={session.user.email}>{children}</AdminShell>
  );
}
