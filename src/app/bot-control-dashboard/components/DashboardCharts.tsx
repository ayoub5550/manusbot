'use client';

import dynamic from 'next/dynamic';

const TaskVolumeChart = dynamic(() => import('./TaskVolumeChart'), { ssr: false });
const ApiUsageChart = dynamic(() => import('./ApiUsageChart'), { ssr: false });

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
      <div className="xl:col-span-3">
        <TaskVolumeChart />
      </div>
      <div className="xl:col-span-2">
        <ApiUsageChart />
      </div>
    </div>
  );
}