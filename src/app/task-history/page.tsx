import AppLayout from '@/components/AppLayout';
import TaskHistoryTable from './components/TaskHistoryTable';

export default function TaskHistoryPage() {
  return (
    <AppLayout botOnline={true} activeTaskCount={1}>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-screen-2xl mx-auto px-6 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Task History</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Complete record of all 247 tasks executed by ManusBot
            </p>
          </div>
          <TaskHistoryTable />
        </div>
      </div>
    </AppLayout>
  );
}