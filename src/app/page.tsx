import AppLayout from '@/components/AppLayout';
import TaskSidebar from '@/app/components/TaskSidebar';
import ChatArea from '@/app/components/ChatArea';

export default function TaskChatPage() {
  return (
    <AppLayout botOnline={true} activeTaskCount={1}>
      <div className="flex h-full overflow-hidden">
        <TaskSidebar />
        <ChatArea />
      </div>
    </AppLayout>
  );
}