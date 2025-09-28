import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Bot, GitBranch, Settings, Atom } from 'lucide-react';
import { cn } from '@/lib/utils';
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Agents', href: '/agents', icon: Bot },
  { name: 'Pipeline', href: '/pipeline', icon: GitBranch },
  { name: 'Settings', href: '/settings', icon: Settings },
];
export function Sidebar() {
  const location = useLocation();
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50 bg-gray-50 border-r border-gray-200">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center gap-x-3">
          <div className="bg-gray-900 p-2 rounded-lg">
            <Atom className="h-6 w-6 text-white" />
          </div>
          <h1 className="font-display text-xl font-bold text-gray-900">Aether GTM</h1>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors duration-150',
                          isActive
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon
                            className={cn(
                              'h-6 w-6 shrink-0 transition-colors duration-150',
                              isActive
                                ? 'text-white'
                                : 'text-gray-400 group-hover:text-gray-900'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
            <li className="mt-auto">
              <div className="text-center text-xs text-gray-400">
                <p>Built with ❤️ at Cloudflare</p>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}