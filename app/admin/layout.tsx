export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ width: '100%' }}>
      {children}
    </div>
  );
}
