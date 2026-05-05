import { Outlet, NavLink, useNavigate } from "react-router";
import { User, Brain, LogOut } from "lucide-react";
import { useState } from "react";

export function Layout() {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { to: "/", label: "Inicio", end: true },
    { to: "/historial", label: "Historial" },
    { to: "/revisar", label: "Revisar" },
    { to: "/borrador", label: "Borrador" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAFA]">
      {/* Navbar */}
      <header className="bg-[#007B78] shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold tracking-widest text-sm">FAVRAS</span>
          </NavLink>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-white/75 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center text-white hover:border-white/60 hover:bg-white/10 transition-all duration-200"
            >
              <User className="w-4 h-4" />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-10 w-44 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-800">BICE</p>
                  <p className="text-xs text-gray-500">usuario@bice.cl</p>
                </div>
                <button
                  onClick={() => { setShowUserMenu(false); navigate("/login"); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
