import { AdminSideNav } from '@/components/layout/AdminSideNav';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSideNav />
      <div className="flex-1 ml-64">
        {children}
      </div>
    </div>
  );
}
