import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Building2, Kanban, LogOut, Sun, Moon, Monitor,
  Bell, HelpCircle, ChevronDown, PanelLeftClose, PanelLeftOpen, Menu, X,
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import { signOut } from '../services/auth'
import { Logo } from './ui/Logo'
import { FeedbackButton } from './ui/FeedbackButton'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/listings',  label: 'Listings',  Icon: Building2 },
  { to: '/leads',     label: 'Pipeline',  Icon: Kanban },
]

const SIDEBAR_COLLAPSED_KEY = 'rental-crm-sidebar-collapsed'

// ── Avatar dropdown ──────────────────────────────────────────
function AvatarMenu({ user, onSignOut }) {
  const [open, setOpen] = useState(false)
  const { theme, setTheme } = useThemeStore()
  const ref = useRef(null)

  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const initials = user?.email ? user.email[0].toUpperCase() : 'U'

  const themeOptions = [
    { value: 'light',  label: 'Light',  Icon: Sun },
    { value: 'dark',   label: 'Dark',   Icon: Moon },
    { value: 'system', label: 'System', Icon: Monitor },
  ]

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full pl-1 pr-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <span className="w-8 h-8 rounded-full bg-brand-600 dark:bg-brand-500 text-white text-sm font-semibold flex items-center justify-center">
          {initials}
        </span>
        <ChevronDown size={14} className="text-slate-500 dark:text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-1rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{user?.email}</p>
          </div>

          {/* Theme selector */}
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-2 font-medium uppercase tracking-wide">Theme</p>
            <div className="flex gap-1">
              {themeOptions.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-medium transition-colors ${
                    theme === value
                      ? 'bg-brand-600 text-white dark:bg-brand-500'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Sign out */}
          <button
            onClick={() => { setOpen(false); onSignOut() }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

// ── Sidebar nav item ──────────────────────────────────────────
function NavItem({ to, label, Icon, collapsed, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        `flex items-center gap-3 py-2.5 text-sm font-medium transition-all group relative ${
          collapsed
            ? 'w-10 h-10 rounded-full justify-center mx-auto'
            : 'px-3 rounded-full mx-2'
        } ${
          isActive
            ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/40'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 hover:shadow-md hover:shadow-slate-300 dark:hover:shadow-slate-900'
        }`
      }
    >
      <Icon size={18} className="shrink-0" />
      {!collapsed && <span>{label}</span>}
      {/* Tooltip when collapsed */}
      {collapsed && (
        <span className="absolute left-full ml-2 px-2 py-1 bg-slate-800 dark:bg-slate-700 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
          {label}
        </span>
      )}
    </NavLink>
  )
}

// ── Main Layout ───────────────────────────────────────────────
export function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true'
  )
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  const toggleCollapse = () => {
    setCollapsed((v) => {
      const next = !v
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next))
      return next
    })
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const sidebarWidth = collapsed ? 'w-16' : 'w-56'

  const SidebarContent = ({ onNavClick, isCollapsed = collapsed }) => (
    <div className="flex flex-col h-full">
      {/* Nav items */}
      <nav className="flex flex-col gap-1 flex-1 py-3 pt-8 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.to}
            {...item}
            collapsed={isCollapsed}
            onClick={onNavClick}
          />
        ))}
      </nav>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* ── Desktop Sidebar ── */}
      <aside
        className={`hidden md:flex flex-col relative bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 fixed left-0 top-14 bottom-0 transition-all duration-200 z-30 ${collapsed ? 'w-16' : 'w-56'}`}
      >
        <SidebarContent />
        {/* Circle collapse button — centered on right border */}
        <button
          onClick={toggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute top-3 -right-3 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-400 dark:hover:border-brand-500 transition-colors"
        >
          {collapsed ? <PanelLeftOpen size={12} /> : <PanelLeftClose size={12} />}
        </button>
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-56 bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col">
            {/* Mobile sidebar header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Logo size={28} />
                <span className="font-bold text-brand-600 dark:text-brand-400 text-base">Rental CRM</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X size={20} />
              </button>
            </div>
            <SidebarContent onNavClick={() => setMobileOpen(false)} isCollapsed={false} />
          </aside>
        </div>
      )}

      {/* ── Top App Bar ── */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-4 z-40">
        {/* Left: Hamburger (mobile) + Logo + Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Logo size={28} />
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-brand-600 dark:text-brand-400 text-base tracking-tight">Rental CRM</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:block">For Philippine Property Agents</span>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right: Help, Notifications, Avatar */}
        <div className="flex items-center gap-1">
          <button
            title="Help"
            className="p-2 rounded-full text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            <HelpCircle size={19} />
          </button>
          <button
            title="Notifications"
            className="relative p-2 rounded-full text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            <Bell size={19} />
            {/* Notification dot */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
          </button>
          <AvatarMenu user={user} onSignOut={handleSignOut} />
        </div>
      </header>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col mt-14">
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>

      <FeedbackButton />
    </div>
  )
}

