import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  ListChecks,
  CheckSquare,
  BookOpen,
  MessageCircle,
  User,
  LogOut,
  Bell,
  HelpCircle,
} from 'lucide-react'

function Layout({ children, user, onLogout }) {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Onboarding Steps', path: '/tasks', icon: ListChecks },
    { name: 'Resources', path: '/resources', icon: BookOpen },
    { name: 'Helper', path: '/chat', icon: MessageCircle },
  ]

  const utilityNavigation = [
    { name: 'Help', path: '/chat', icon: HelpCircle },
    { name: 'Profile', path: '/profile', icon: User },
  ]

  const currentPage = navigation.find((item) => location.pathname === item.path)
    || utilityNavigation.find((item) => location.pathname === item.path)

  return (
    <div className="min-h-screen bg-[#f4f4f4] p-3 md:p-4">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1600px] gap-3 md:gap-4">
        <aside className="hidden w-[248px] shrink-0 rounded-[24px] bg-[#161616] px-4 py-5 text-white shadow-[0_24px_60px_rgba(0,0,0,0.18)] lg:flex lg:flex-col">
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0f62fe] text-sm font-bold tracking-[0.24em] text-white">
              IBM
            </div>
            <div>
              <p className="text-sm font-semibold text-white">IBM Onboarding</p>
              <p className="text-xs text-white/55">Workspace</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <Link
                  key={`${item.name}-${item.path}`}
                  to={item.path}
                  className={`group flex items-center gap-3 rounded-2xl px-3 py-3 transition-all duration-200 ${
                    isActive
                      ? 'bg-white/8 text-white'
                      : 'text-white/62 hover:bg-white/6 hover:text-white'
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                      isActive
                        ? 'bg-white text-[#161616]'
                        : 'bg-white/5 text-white/72 group-hover:bg-white/10 group-hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                  </span>
                  <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/45">Current hire</p>
              <p className="mt-2 text-sm font-semibold text-white">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="mt-1 text-xs text-white/55">{user?.role || 'New team member'}</p>
            </div>

            <div className="space-y-1.5">
              {utilityNavigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition-all ${
                      isActive
                        ? 'bg-white/8 text-white'
                        : 'text-white/62 hover:bg-white/6 hover:text-white'
                    }`}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                      <Icon size={18} />
                    </span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}

              <button
                onClick={onLogout}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm text-white/62 transition-all hover:bg-white/6 hover:text-white"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                  <LogOut size={18} />
                </span>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col rounded-[24px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
          <header className="border-b border-[#e0e0e0] px-5 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#6f6f6f]">
                  IBM Onboarding / {currentPage?.name || 'Workspace'}
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#161616]">
                  {currentPage?.name || 'IBM Onboarding Workspace'}
                </h1>
              </div>

              <div className="flex items-center justify-between gap-3 lg:justify-end">
                <div className="flex items-center gap-2">
                  <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#e0e0e0] bg-[#f4f4f4] text-[#393939] transition hover:border-[#c6c6c6] hover:bg-[#ebebeb]">
                    <Bell size={18} />
                  </button>
                  <Link
                    to="/profile"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0f62fe] text-sm font-semibold text-white transition hover:bg-[#0043ce]"
                  >
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </Link>
                </div>

                <div className="hidden rounded-2xl bg-[#f4f4f4] px-4 py-2.5 text-right sm:block">
                  <p className="text-sm font-semibold text-[#161616]">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-[#6f6f6f]">{user?.department || 'Onboarding cohort'}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {navigation.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={`mobile-${item.name}-${item.path}`}
                    to={item.path}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? 'bg-[#0f62fe] text-white'
                        : 'bg-[#f4f4f4] text-[#525252] hover:bg-[#e0e0e0]'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </header>

          <main className="flex-1 px-5 py-5 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Layout

// Made with Bob
