export default function ArticleLayout({
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
