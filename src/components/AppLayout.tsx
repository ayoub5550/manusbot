import Sidebar from '@/components/Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  botOnline?: boolean;
  activeTaskCount?: number;
}

export default function AppLayout({ children, botOnline = true, activeTaskCount = 0 }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar botOnline={botOnline} activeTaskCount={activeTaskCount} />
      <main className="flex-1 overflow-hidden flex flex-col min-w-0">
        {children}
      </main>
    </div>
  );
}