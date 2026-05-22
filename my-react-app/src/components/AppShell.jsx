import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

const navItems = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/products', icon: 'inventory_2', label: 'Inventory' },
  { to: '/dashboard', icon: 'monitoring', label: 'Analytics' },
  { to: '/dashboard', icon: 'psychology', label: 'AI Insights' },
  { to: '/products/new', icon: 'add_box', label: 'New Product' },
];

function Icon({ children, className = '' }) {
  return <span className={`material-symbols-outlined ${className}`}>{children}</span>;
}

export default function AppShell({ children, title = 'Dashboard Overview', subtitle = "Welcome back. Here's what's happening today." }) {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  function onLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd]">
      <aside className="fixed left-0 top-0 z-50 hidden h-full w-[280px] flex-col border-r border-[#4a4455]/20 bg-[#171f33]/88 p-4 shadow-sm backdrop-blur-xl md:flex">
        <Link to="/dashboard" className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#7c3aed] to-[#4cd7f6]">
            <Icon className="text-white [font-variation-settings:'FILL'_1]">bolt</Icon>
          </div>
          <div>
            <h1 className="text-2xl font-bold leading-tight text-[#d2bbff]">SmartStore AI</h1>
            <p className="font-mono text-xs uppercase tracking-wider text-[#ccc3d8]">Enterprise Admin</p>
          </div>
        </Link>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={`${item.to}-${item.label}`}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                  isActive
                    ? 'border-r-2 border-[#d2bbff] bg-[#7c3aed]/20 text-[#d2bbff]'
                    : 'text-[#ccc3d8] hover:bg-[#2d3449]/45 hover:text-[#dae2fd]'
                }`
              }
            >
              <Icon>{item.icon}</Icon>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-4 border-t border-[#4a4455]/20 pt-4">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d2bbff] to-[#4cd7f6] px-4 py-3 font-bold text-[#25005a] shadow-lg shadow-[#7c3aed]/20">
            <Icon className="[font-variation-settings:'FILL'_1]">rocket_launch</Icon>
            Upgrade to Pro
          </button>
          <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-[#ffb4ab] transition-opacity hover:opacity-80">
            <Icon>logout</Icon>
            Logout
          </button>
        </div>
      </aside>

      <header className="fixed right-0 top-0 z-40 flex h-16 w-full items-center justify-between border-b border-[#4a4455]/20 bg-[#0b1326]/70 px-4 backdrop-blur-md md:w-[calc(100%-280px)] md:px-6">
        <div className="relative max-w-xl flex-1">
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#958da1]">search</Icon>
          <input
            className="w-full rounded-full border-0 bg-[#222a3d] py-2 pl-10 pr-4 text-sm text-[#dae2fd] outline-none transition focus:ring-2 focus:ring-[#d2bbff]/45"
            placeholder="Search orders, products, or AI insights..."
          />
        </div>
        <div className="ml-4 flex items-center gap-2 sm:gap-4">
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#ccc3d8] transition hover:bg-[#2d3449]/50 hover:text-[#dae2fd]" aria-label="Notifications">
            <Icon>notifications</Icon>
          </button>
          <button className="hidden h-10 w-10 items-center justify-center rounded-full text-[#d2bbff] transition hover:bg-[#2d3449]/50 sm:flex" aria-label="AI assistant">
            <Icon className="[font-variation-settings:'FILL'_1]">colors_spark</Icon>
          </button>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-[#dae2fd]">{user?.name || 'Admin User'}</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#4cd7f6]">Admin</p>
          </div>
        </div>
      </header>

      <main className="min-h-screen pb-24 pt-24 md:ml-[280px] md:pb-10">
        <div className="mx-auto max-w-[1440px] space-y-8 px-4 md:px-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-semibold tracking-normal text-[#dae2fd]">{title}</h2>
              <p className="mt-1 text-[#ccc3d8]">{subtitle}</p>
            </div>
          </div>
          {children}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around bg-[#171f33]/90 px-4 backdrop-blur-xl md:hidden">
        {navItems.slice(0, 4).map((item) => (
          <NavLink key={`mobile-${item.label}`} to={item.to}>
            {({ isActive }) => (
              <span className={`flex flex-col items-center gap-1 text-[10px] ${isActive ? 'text-[#d2bbff]' : 'text-[#ccc3d8]'}`}>
                <Icon className={isActive ? "[font-variation-settings:'FILL'_1]" : ''}>{item.icon}</Icon>
                {item.label.split(' ')[0]}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
