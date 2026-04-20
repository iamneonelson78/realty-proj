import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { signOut } from '../services/auth'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/listings', label: 'Listings', icon: '🏢' },
  { to: '/leads', label: 'Pipeline', icon: '📋' },
]

function NavItem({ to, label, icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-emerald-50 text-emerald-700'
            : 'text-slate-600 hover:bg-slate-100'
        }`
      }
    >
      <span>{icon}</span>
      {label}
    </NavLink>
  )
}

export function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const Sidebar = ({ onNavClick }) => (
    <div className="flex flex-col h-full p-4 gap-2">
      <div className="px-3 py-4 mb-2 border-b border-slate-200">
        <h1 className="font-bold text-emerald-700 text-lg">Rental CRM</h1>
        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} onClick={onNavClick} />
        ))}
      </nav>
      <button
        onClick={handleSignOut}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <span>🚪</span> Sign out
      </button>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-slate-200 fixed inset-y-0 left-0">
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-56 bg-white h-full shadow-xl">
            <Sidebar onNavClick={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col md:ml-56">
        {/* Mobile topbar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200">
          <button onClick={() => setMobileOpen(true)} className="text-slate-600 text-xl">☰</button>
          <span className="font-bold text-emerald-700">Rental CRM</span>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
