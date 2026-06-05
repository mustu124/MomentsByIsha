export function AdminCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-md border border-ink/10 bg-white p-6 shadow-sm lg:p-7 ${className}`}>{children}</section>;
}
