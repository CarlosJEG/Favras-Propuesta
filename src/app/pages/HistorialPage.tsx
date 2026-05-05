import { useState } from "react";
import { motion } from "motion/react";
import { Download, ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";

const allRevisiones = [
  { id: "416867", archivos: ["MARCELA FERNANDEZ BELTRAN-CRE.PDF"], puntaje: "-", fecha: "04-05-2026, 3:46 p. m.", tipo: "Revisión" },
  { id: "416517", archivos: ["CRISTIAN TOLEDO HENRIQUEZ-CRE.PDF"], puntaje: "-", fecha: "04-05-2026, 3:42 p. m.", tipo: "Revisión" },
  { id: "423648", archivos: ["ALEJANDRA SAEZ ROJAS-CRE.PDF", "ALEJANDRA SAEZ ROJAS-ESC.PDF"], puntaje: "-", fecha: "04-05-2026, 3:38 p. m.", tipo: "Revisión" },
  { id: "424183", archivos: ["TERESA MIRANDA BLAMEY Y OTRO- CRE.PDF"], puntaje: "-", fecha: "04-05-2026, 3:32 p. m.", tipo: "Revisión" },
  { id: "424183", archivos: ["FRANCISCO CATALAN CEPEDA- CRE.PDF"], puntaje: "-", fecha: "04-05-2026, 3:31 p. m.", tipo: "Revisión" },
  { id: "424183", archivos: ["PAULA HINCAPIE AYERRE Y OTRO-CRE.PDF"], puntaje: "-", fecha: "04-05-2026, 3:18 p. m.", tipo: "Revisión" },
  { id: "424183", archivos: ["NI CAPITAL SPA-CRE.PDF", "NI CAPITAL SPA-ESC.PDF"], puntaje: "-", fecha: "04-05-2026, 3:18 p. m.", tipo: "Borrador" },
  { id: "416867", archivos: ["FABIAN GAETE CISTERNAS-ESC.PDF"], puntaje: "-", fecha: "04-05-2026, 3:15 p. m.", tipo: "Revisión" },
  { id: "410925", archivos: ["JUAN CASTRO ALARCON-CRE.PDF", "JUAN CASTRO ALARCON-ESC.PDF"], puntaje: "-", fecha: "04-05-2026, 3:06 p. m.", tipo: "Revisión" },
  { id: "s-644803-30", archivos: ["MARGARITA CATALAN SEPULVEDA-CRE.PDF"], puntaje: "-", fecha: "04-05-2026, 1:54 p. m.", tipo: "Borrador" },
  { id: "415524", archivos: ["FELIPE YANEZ CAMPILLAY-CRE.PDF", "FELIPE YANEZ CAMPILLAY-ESC.PDF"], puntaje: "-", fecha: "04-05-2026, 1:51 p. m.", tipo: "Revisión" },
  { id: "414917", archivos: ["HECTOR CASTILLO GONZALEZ-CRE.PDF"], puntaje: "-", fecha: "04-05-2026, 1:40 p. m.", tipo: "Revisión" },
  { id: "422469", archivos: ["ADEEL INTERNATIONAL IMPORT EXPORT LTDA-CRE.PDF"], puntaje: "-", fecha: "04-05-2026, 1:33 p. m.", tipo: "Borrador" },
  { id: "415092", archivos: ["FREDERIC HERNANDEZ BARRIGA Y OTRO -CRE.PDF"], puntaje: "-", fecha: "04-05-2026, 1:23 p. m.", tipo: "Revisión" },
  { id: "423124", archivos: ["HERNAN GUTIERREZ AGUILERA-CRE.PDF"], puntaje: "-", fecha: "04-05-2026, 1:12 p. m.", tipo: "Revisión" },
];

const TABS = ["Todas", "Revisiones", "Generador de Documentos"];

export function HistorialPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [perPage, setPerPage] = useState(15);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const filtered = allRevisiones.filter((r) => {
    if (activeTab === 1 && r.tipo !== "Revisión") return false;
    if (activeTab === 2 && r.tipo !== "Borrador") return false;
    if (search) {
      const q = search.toLowerCase();
      return r.id.toLowerCase().includes(q) || r.archivos.some(a => a.toLowerCase().includes(q));
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gray-900 text-2xl">Historial de revisiones</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {filtered.length} registros en total
          </p>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center gap-1 px-5 pt-4 border-b border-gray-100">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(i); setPage(1); }}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium border-b-2 transition-all -mb-px ${
                activeTab === i
                  ? "border-[#007B78] text-[#007B78]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por ID o archivo..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-[#007B78] focus:ring-2 focus:ring-[#007B78]/10 transition-all w-64"
              />
            </div>

            {/* Per page */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="text-xs"># Revisiones por página</span>
              <select
                value={perPage}
                onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#007B78] bg-white"
              >
                {[10, 15, 25, 50].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <Filter className="w-3.5 h-3.5" />
              Filtrar
            </button>
            <button className="flex items-center gap-2 bg-[#007B78] text-white px-4 py-1.5 rounded-lg text-sm hover:bg-[#006A67] transition-colors shadow-sm">
              <Download className="w-3.5 h-3.5" />
              Descargar
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Identificador</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Archivos</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tipo</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Puntaje</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((rev, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-t border-gray-50 hover:bg-[#F0F9F9] transition-colors cursor-pointer group"
                >
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-700">{rev.id}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600 max-w-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#007B78] group-hover:underline truncate max-w-[280px]">
                        {rev.archivos[0]}
                      </span>
                      {rev.archivos.length > 1 && (
                        <span className="text-xs bg-[#E6F4F4] text-[#007B78] px-1.5 py-0.5 rounded-md flex-shrink-0">
                          +{rev.archivos.length - 1}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      rev.tipo === "Borrador"
                        ? "bg-purple-50 text-purple-700"
                        : "bg-blue-50 text-blue-700"
                    }`}>
                      {rev.tipo}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{rev.puntaje}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{rev.fecha}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {paginated.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No se encontraron resultados para "{search}"</p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/30">
          <p className="text-xs text-gray-500">
            Mostrando {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} de {filtered.length} registros
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={i}
                  onClick={() => setPage(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                    page === pageNum
                      ? "bg-[#007B78] text-white shadow-sm"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            {totalPages > 5 && (
              <>
                <span className="text-gray-400 text-xs">···</span>
                <button
                  onClick={() => setPage(totalPages)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors`}
                >
                  {totalPages}
                </button>
              </>
            )}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
