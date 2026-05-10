import AppLayout from '@/components/AppLayout';
import DashboardMetrics from './components/DashboardMetrics';
import DashboardCharts from './components/DashboardCharts';
import ContainerHealth from './components/ContainerHealth';
import RecentTasksFeed from './components/RecentTasksFeed';
import QuickActions from './components/QuickActions';

export default function BotControlDashboardPage() {
  return (
    <AppLayout botOnline={true} activeTaskCount={1}>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-screen-2xl mx-auto px-6 py-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Bot Control Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                ManusBot · Bunny Magic Container · Last updated: 10:20:03
              </p>
            </div>
            <QuickActions />
          </div>

          {/* Metrics Grid */}
          <DashboardMetrics />

          {/* Charts Row */}
          <DashboardCharts />

          {/* Bottom Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2">
              <RecentTasksFeed />
            </div>
            <div>
              <ContainerHealth />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}