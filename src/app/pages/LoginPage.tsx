import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, ArrowRight, Brain } from "lucide-react";
import { motion } from "motion/react";

export function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("BICE");
  const [password, setPassword] = useState("••••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      navigate("/");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F7FAFA] flex flex-col">
      {/* Top bar */}
      <header className="bg-[#007B78] h-14 flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold tracking-widest text-sm">FAVRAS</span>
          </div>
          <nav className="flex items-center gap-4">
            {["Inicio", "Historial", "Revisar", "Borrador"].map((item) => (
              <span key={item} className="text-white/60 text-sm cursor-default">{item}</span>
            ))}
          </nav>
          <div className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center">
            <span className="text-white/70 text-xs">👤</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header accent */}
            <div className="h-1.5 bg-gradient-to-r from-[#007B78] to-[#00A89E]" />

            <div className="p-8">
              {/* Logo */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-[#007B78] flex items-center justify-center mb-3 shadow-md">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-gray-900 text-xl">Iniciar sesión</h1>
                <p className="text-gray-500 text-sm mt-1">Accede a tu cuenta de Favras</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                {/* Username */}
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-700">Nombre de usuario</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm outline-none focus:border-[#007B78] focus:ring-2 focus:ring-[#007B78]/15 transition-all"
                    placeholder="Usuario"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-700">Contraseña</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm outline-none focus:border-[#007B78] focus:ring-2 focus:ring-[#007B78]/15 transition-all pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-[#007B78] hover:bg-[#006A67] text-white py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-70 shadow-sm mt-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Iniciar sesión
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            © 2026 Favras · Herramienta de Análisis Legal
          </p>
        </motion.div>
      </div>
    </div>
  );
}
