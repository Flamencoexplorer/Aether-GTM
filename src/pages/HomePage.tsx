import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
export function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="lg:pl-64">
        <div className="mx-auto max-w-screen-2xl p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}