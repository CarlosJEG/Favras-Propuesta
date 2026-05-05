import { useState } from "react";
import { motion } from "motion/react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  FileText, TrendingUp, Clock, Download, ChevronLeft, ChevronRight,
  AlertTriangle, Camera
} from "lucide-react";

const chartData = [
  { name: "75%-85%", casos: 2 },
  { name: "85%-99%", casos: 5 },
  { name: "100%", casos: 25 },
];

const topFallidas = [
  { nombre: "Descripción del bien: Bodegas", casos: 3 },
  { nombre: "Nombre del comprador", casos: 3 },
  { nombre: "Descripción del bien: Estacionamientos", casos: 2 },
];

const revisiones = [
  { id: "416867", archivos: ["MARCELA FERNANDEZ BELTRAN-CRE.PDF"], puntaje: 100, fecha: "04-05-2026, 3:46 p. m." },
  { id: "416517", archivos: ["CRISTIAN TOLEDO HENRIQUEZ-CRE.PDF"], puntaje: 100, fecha: "04-05-2026, 3:42 p. m." },
  { id: "423648", archivos: ["ALEJANDRA SAEZ ROJAS-CRE.PDF", "ALEJANDRA SAEZ ROJAS-ESC.PDF"], puntaje: 100, fecha: "04-05-2026, 3:38 p. m." },
  { id: "424183", archivos: ["TERESA MIRANDA BLAMEY Y OTRO- CRE.PDF"], puntaje: 92.3, fecha: "04-05-2026, 3:32 p. m." },
  { id: "424183", archivos: ["FRANCISCO CATALAN CEPEDA- CRE.PDF"], puntaje: 100, fecha: "04-05-2026, 3:31 p. m." },
  { id: "424183", archivos: ["PAULA HINCAPIE AYERRE Y OTRO-CRE.PDF"], puntaje: 84.6, fecha: "04-05-2026, 3:18 p. m." },
  { id: "424183", archivos: ["NI CAPITAL SPA-CRE.PDF", "NI CAPITAL SPA-ESC.PDF"], puntaje: 100, fecha: "04-05-2026, 3:18 p. m." },
  { id: "416867", archivos: ["FABIAN GAETE CISTERNAS-ESC.PDF"], puntaje: 100, fecha: "04-05-2026, 3:15 p. m." },
  { id: "410925", archivos: ["JUAN CASTRO ALARCON-CRE.PDF", "JUAN CASTRO ALARCON-ESC.PDF"], puntaje: 100, fecha: "04-05-2026, 3:06 p. m." },
  { id: "s-644803-30", archivos: ["MARGARITA CATALAN SEPULVEDA-CRE.PDF"], puntaje: 100, fecha: "04-05-2026, 1:54 p. m." },
];

const statsCards = [
  { label: "Casos revisados", value: "32", sub: "Total", icon: FileText, color: "#007B78" },
  { label: "Porcentaje de coincidencia", value: "97%", sub: "Promedio", icon: TrendingUp, color: "#00A89E" },
  { label: "Tiempo de revisión", value: "63.94s", sub: "Promedio", icon: Clock, color: "#005C59" },
];

export function InicioPage() {
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [fromDate] = useState("mayo 4, 2026");
  const [toDate] = useState("mayo 5, 2026");

  const paginatedRevisiones = revisiones.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(revisiones.length / perPage);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gray-900 text-2xl">Panel de revisiones</h1>
          <p className="text-gray-500 text-sm mt-0.5">Resumen de actividad del sistema</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date filters */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 shadow-sm">
              <span className="text-gray-400 text-xs">📅</span>
              <span>Desde: <strong>{fromDate}</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 shadow-sm">
              <span className="text-gray-400 text-xs">📅</span>
              <span>Hasta: <strong>{toDate}</strong></span>
            </div>
          </div>
          <button className="w-9 h-9 bg-[#007B78] rounded-xl flex items-center justify-center text-white hover:bg-[#006A67] transition-colors shadow-sm">
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {statsCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-xs mb-1">{card.label}</p>
                <p className="text-3xl text-gray-900" style={{ fontWeight: 600 }}>{card.value}</p>
                <p className="text-gray-400 text-xs mt-1">{card.sub}</p>
              </div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: card.color + "18" }}
              >
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Bar chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-gray-800 text-sm mb-4">Casos por coincidencia</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 12 }}
                cursor={{ fill: "#F0F9F9" }}
              />
              <Bar dataKey="casos" radius={[6, 6, 0, 0]} maxBarSize={60}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={index === 2 ? "#007B78" : index === 1 ? "#4DB6B3" : "#A8D9D8"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top fallidas */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-gray-800 text-sm mb-4">Top 3 comparaciones fallidas</h3>
          <div className="space-y-0">
            <div className="grid grid-cols-[1fr_auto] text-xs text-gray-400 font-medium pb-2 border-b border-gray-100 mb-2">
              <span>Nombre</span>
              <span>Casos</span>
            </div>
            {topFallidas.map((item, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto] py-3 border-b border-gray-50 last:border-0">
                <span className="text-[#007B78] text-sm hover:underline cursor-pointer">{item.nombre}</span>
                <span className="text-gray-700 text-sm font-medium">{item.casos}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Estos campos requieren revisión manual frecuente</span>
          </div>
        </div>
      </div>

      {/* Recent revisions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-gray-900">Revisiones recientes</h2>
            <p className="text-gray-400 text-xs mt-0.5">Mostrando {perPage} por página</p>
          </div>
          <button className="flex items-center gap-2 bg-[#007B78] text-white px-4 py-2 rounded-xl text-sm hover:bg-[#006A67] transition-colors shadow-sm">
            <Download className="w-3.5 h-3.5" />
            Descargar
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Identificador</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Archivos</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Puntaje</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRevisiones.map((rev, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-t border-gray-50 hover:bg-[#F0F9F9] transition-colors cursor-pointer"
                >
                  <td className="px-6 py-3.5 text-sm text-gray-700 font-medium">{rev.id}</td>
                  <td className="px-6 py-3.5 text-sm text-gray-600 max-w-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-gray-700">{rev.archivos[0]}</span>
                      {rev.archivos.length > 1 && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">
                          +{rev.archivos.length - 1}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        rev.puntaje === 100
                          ? "bg-emerald-50 text-emerald-700"
                          : rev.puntaje >= 90
                          ? "bg-teal-50 text-teal-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {rev.puntaje}%
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-500">{rev.fecha}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: Math.min(totalPages, 4) }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                page === i + 1
                  ? "bg-[#007B78] text-white shadow-sm"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
