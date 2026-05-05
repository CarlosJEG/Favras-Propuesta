import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2, ChevronDown, FileText, Upload, X, ChevronRight,
  Download, Edit3, AlertCircle, CheckCheck, Building2, Banknote,
  MapPin, Calendar, Hash, User2, ArrowLeft, Layers, Eye
} from "lucide-react";

/* ─── Data ────────────────────────────────────────────────────── */
const level1Options = [
  {
    id: "hipoteca",
    label: "Hipoteca / Prohibición",
    shortLabel: "Hipoteca/Prohibición",
    color: "#E53E3E",
    bg: "#FFF5F5",
    description: "Alzamiento de hipoteca o prohibición",
  },
  {
    id: "hipotecaParc",
    label: "Hipoteca / Prohibición Parc.",
    shortLabel: "Hip/Proh Parcial",
    color: "#3182CE",
    bg: "#EBF8FF",
    description: "Alzamiento parcial de hipoteca o prohibición",
  },
  {
    id: "prendaAcciones",
    label: "Prenda Sobre Acciones",
    shortLabel: "Prenda Acciones",
    color: "#DD6B20",
    bg: "#FFFAF0",
    description: "Alzamiento de prenda sobre acciones",
  },
  {
    id: "prendaSinDesp",
    label: "Prenda Sin Desplazamiento",
    shortLabel: "Prenda Sin Desp.",
    color: "#B7791F",
    bg: "#FFFFF0",
    description: "Alzamiento de prenda sin desplazamiento",
  },
  {
    id: "prendaBia",
    label: "Prenda Bía",
    shortLabel: "Prenda Bía",
    color: "#276749",
    bg: "#F0FFF4",
    description: "Alzamiento de prenda Bía",
  },
];

const level2Map: Record<string, string[]> = {
  hipoteca: [
    "Garantía General",
    "Específica",
    "Prohibición",
    "Hipoteca de Aguas",
    "Prohibición de Aguas",
    "Prohibición Prenda Agraria",
    "Prohibición Prend Industrial",
    "Total",
  ],
  hipotecaParc: ["Identificar los bienes a alzar"],
  prendaAcciones: ["Parcial", "Total"],
  prendaSinDesp: ["Parcial", "Total"],
  prendaBia: [],
};

const extractedFields = [
  { key: "banco_destino", label: "Banco Destino", icon: Building2, value: "Banco BICE S.A." },
  { key: "banco_emisor", label: "Banco Emisor", icon: Banknote, value: "Banco BICE S.A." },
  { key: "bien_inmobiliario", label: "Bien Inmobiliario", icon: Building2, value: "Departamento N° 502, Torre B" },
  { key: "comprador", label: "Comprador o Mutuario", icon: User2, value: "Felipe Yáñez Campillay" },
  { key: "comuna", label: "Comuna Propiedad", icon: MapPin, value: "Las Condes, Región Metropolitana" },
  { key: "direccion", label: "Dirección Propiedad", icon: MapPin, value: "Av. El Bosque Norte 0177, Of. 502" },
  { key: "fecha", label: "Fecha de Registro", icon: Calendar, value: "04 de Mayo de 2026" },
  { key: "monto", label: "Monto Carta Resguardo", icon: Banknote, value: "UF 3.250,00" },
  { key: "repertorio", label: "Número de Repertorio", icon: Hash, value: "4.821-2026" },
  { key: "vendedor", label: "Vendedor", icon: User2, value: "Inmobiliaria Torre Norte SpA" },
];

/* ─── Stepper ─────────────────────────────────────────────────── */
const STEPS = [
  { n: 1, label: "Cargar archivos", sub: "Selecciona tipo y archivos" },
  { n: 2, label: "Extracción", sub: "Procesando datos" },
  { n: 3, label: "Revisar y generar", sub: "Edita y genera documentos" },
];

function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((step, i) => {
        const done = step.n < current;
        const active = step.n === current;
        return (
          <div key={step.n} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 transition-all ${
                  done
                    ? "bg-[#007B78] text-white"
                    : active
                    ? "bg-[#007B78] text-white shadow-md ring-4 ring-[#007B78]/20"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {done ? <CheckCheck className="w-4 h-4" /> : step.n}
              </div>
              <div className="hidden sm:block">
                <p className={`text-sm font-medium ${active ? "text-[#007B78]" : done ? "text-gray-700" : "text-gray-400"}`}>
                  {step.label}
                </p>
                <p className="text-xs text-gray-400">{step.sub}</p>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-3 ${done ? "bg-[#007B78]" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────── */
export function BorradorPage() {
  const [step, setStep] = useState(1);
  const [selectedL1, setSelectedL1] = useState<string | null>(null);
  const [selectedL2, setSelectedL2] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [expandedFields, setExpandedFields] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedL1Data = level1Options.find(o => o.id === selectedL1);
  const level2Options = selectedL1 ? level2Map[selectedL1] : [];
  const isStep1Valid = selectedL1 && (level2Options.length === 0 || selectedL2) && files.length > 0;

  /* ── Handlers ── */
  const handleL1Click = (id: string) => {
    if (selectedL1 === id) return;
    setSelectedL1(id);
    setSelectedL2(null);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...dropped].slice(0, 10));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selected].slice(0, 10));
    }
  };

  const removeFile = (i: number) => {
    setFiles(prev => prev.filter((_, idx) => idx !== i));
  };

  const startExtraction = () => {
    setStep(2);
    setProcessing(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setProcessing(false);
          setStep(3);
        }, 400);
      }
      setProcessingProgress(Math.min(100, progress));
    }, 180);
  };

  const toggleField = (key: string) => {
    setExpandedFields(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  /* ─── Step 1 ──────────────────────────────────────────────── */
  const renderStep1 = () => (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Hierarchical Dropdown Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#007B78]" />
          <div>
            <h2 className="text-gray-800">Tipo de Antecedentes</h2>
            <p className="text-xs text-gray-500 mt-0.5">Selecciona el gravamen a alzar (Informe Final – GP – Comprobante Registro Civil)</p>
          </div>
        </div>

        <div className="p-6">
          {/* Level 1 */}
          <div className="mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Categoría principal</p>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5">
              {level1Options.map((opt) => {
                const isSelected = selectedL1 === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleL1Click(opt.id)}
                    className="relative flex flex-col items-start p-3.5 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md"
                    style={{
                      borderColor: isSelected ? opt.color : "#E5E7EB",
                      backgroundColor: isSelected ? opt.bg : "#FAFAFA",
                    }}
                  >
                    {isSelected && (
                      <span
                        className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: opt.color }}
                      >
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </span>
                    )}
                    <span
                      className="w-2.5 h-2.5 rounded-full mb-2 flex-shrink-0"
                      style={{ backgroundColor: opt.color }}
                    />
                    <span className="text-xs font-semibold text-gray-800 leading-snug">{opt.label}</span>
                    <span className="text-xs text-gray-400 mt-0.5 leading-tight">{opt.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Level 2 – animated */}
          <AnimatePresence>
            {selectedL1 && level2Options.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 20 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div
                  className="rounded-xl p-4 border"
                  style={{
                    backgroundColor: selectedL1Data?.bg,
                    borderColor: selectedL1Data?.color + "40",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <ChevronRight className="w-3.5 h-3.5" style={{ color: selectedL1Data?.color }} />
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: selectedL1Data?.color }}>
                      Subtipo — {selectedL1Data?.label}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {level2Options.map((opt) => {
                      const isSelected = selectedL2 === opt;
                      return (
                        <motion.button
                          key={opt}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => setSelectedL2(opt)}
                          className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border"
                          style={{
                            backgroundColor: isSelected ? selectedL1Data?.color : "white",
                            color: isSelected ? "white" : selectedL1Data?.color,
                            borderColor: isSelected ? selectedL1Data?.color : selectedL1Data?.color + "50",
                          }}
                        >
                          {opt}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
            {selectedL1 && level2Options.length === 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 20 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2 bg-[#F0F9F9] border border-[#007B78]/20 rounded-xl px-4 py-3">
                  <CheckCircle2 className="w-4 h-4 text-[#007B78]" />
                  <span className="text-sm text-[#007B78] font-medium">
                    {selectedL1Data?.label} — Acceso directo al borrador de alzamiento
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Selection summary */}
          <AnimatePresence>
            {selectedL1 && (level2Options.length === 0 || selectedL2) && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center gap-2"
              >
                <span className="text-xs text-gray-500">Tipo seleccionado:</span>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: selectedL1Data?.color }}
                >
                  {selectedL1Data?.shortLabel}
                  {selectedL2 && <> › {selectedL2}</>}
                </span>
                <span className="text-xs text-gray-400">→ Borrador de Alzamiento</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* File upload */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-[#007B78]" />
            <div>
              <h2 className="text-gray-800">GPs / Informes finales</h2>
              <p className="text-xs text-gray-500 mt-0.5">Sube hasta 10 archivos PDF, DOC o DOCX</p>
            </div>
          </div>
          {files.length > 0 && (
            <span className="text-xs font-semibold text-[#007B78] bg-[#E6F4F4] px-2 py-0.5 rounded-full">
              {files.length} archivo{files.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="p-6">
          {/* Drop zone */}
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
              dragOver
                ? "border-[#007B78] bg-[#F0F9F9]"
                : "border-gray-200 hover:border-[#007B78]/50 hover:bg-[#FAFEFE]"
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${dragOver ? "bg-[#007B78]" : "bg-gray-100"}`}>
              <FileText className={`w-5 h-5 ${dragOver ? "text-white" : "text-gray-400"}`} />
            </div>
            <p className="text-sm text-gray-600 text-center">
              Arrastra archivos PDF, DOC o DOCX aquí o{" "}
              <span className="text-[#007B78] font-medium">haz clic para seleccionar</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">Máximo 10 archivos</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleFileInput}
          />

          {/* File list */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 space-y-2"
              >
                {files.map((file, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5 group"
                  >
                    <FileText className="w-4 h-4 text-[#007B78] flex-shrink-0" />
                    <span className="text-sm text-gray-700 flex-1 truncate">{file.name}</span>
                    <span className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                    <button
                      onClick={() => removeFile(i)}
                      className="w-5 h-5 rounded-full bg-gray-200 hover:bg-red-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="w-3 h-3 text-gray-500 hover:text-red-500" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between">
        {!isStep1Valid && (
          <div className="flex items-center gap-1.5 text-sm text-gray-400">
            <AlertCircle className="w-4 h-4" />
            <span>
              {!selectedL1
                ? "Selecciona un tipo de antecedente"
                : level2Options.length > 0 && !selectedL2
                ? "Selecciona un subtipo"
                : "Agrega al menos un archivo"}
            </span>
          </div>
        )}
        <div className="ml-auto">
          <button
            disabled={!isStep1Valid}
            onClick={startExtraction}
            className="flex items-center gap-2 bg-[#007B78] hover:bg-[#006A67] disabled:bg-gray-200 disabled:text-gray-400 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm"
          >
            <FileText className="w-4 h-4" />
            Iniciar Extracción
          </button>
        </div>
      </div>
    </motion.div>
  );

  /* ─── Step 2 ──────────────────────────────────────────────── */
  const renderStep2 = () => (
    <motion.div
      key="step2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <div className="text-center max-w-sm">
        {/* Spinner */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-t-[#007B78] border-r-transparent border-b-transparent border-l-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-[#007B78]">{Math.round(processingProgress)}%</span>
          </div>
        </div>

        <h2 className="text-gray-800 text-lg mb-2">Extrayendo datos...</h2>
        <p className="text-gray-500 text-sm mb-6">
          Analizando {files.length} archivo{files.length !== 1 ? "s" : ""} con el modelo de IA
        </p>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-[#007B78] rounded-full"
            style={{ width: `${processingProgress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>

        {/* Steps indicator */}
        <div className="mt-6 space-y-2 text-left">
          {[
            { label: "Leyendo archivos", done: processingProgress > 20 },
            { label: "Extrayendo campos", done: processingProgress > 50 },
            { label: "Validando datos", done: processingProgress > 75 },
            { label: "Generando borrador", done: processingProgress >= 100 },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${item.done ? "bg-[#007B78]" : "bg-gray-200"}`}>
                {item.done && <CheckCheck className="w-2.5 h-2.5 text-white" />}
              </div>
              <span className={`text-sm transition-colors ${item.done ? "text-gray-700" : "text-gray-400"}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  /* ─── Step 3 ──────────────────────────────────────────────── */
  const renderStep3 = () => {
    const mockFiles = files.length > 0
      ? files.map(f => f.name)
      : ["FELIPE YANEZ CAMPILLAY-CRE.pdf", "FELIPE YANEZ CAMPILLAY-ESC.pdf", "FELIPE YANEZ CAMPILLAY.pdf"];

    return (
      <motion.div
        key="step3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        {/* Alert banner */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">
            Los campos marcados con icono de alerta no contienen datos o están vacíos.
          </p>
        </div>

        {/* Split panel layout */}
        <div className="flex gap-4 items-start">

          {/* LEFT PANEL — 35% — Análisis de Documento */}
          <div className="w-[35%] flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-20">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-gray-900">Análisis de Documento</h2>
                <p className="text-xs text-gray-500 mt-0.5">Datos extraídos automáticamente</p>
              </div>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                style={{ backgroundColor: selectedL1Data?.color ?? "#007B78" }}
              >
                {selectedL1Data?.shortLabel ?? "Alzamiento Total"}
                {selectedL2 ? ` · ${selectedL2}` : ""}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 p-4 border-b border-gray-100">
              {[
                { label: "Campos", value: "10/10", color: "#007B78" },
                { label: "Coincidencia", value: "100%", color: "#007B78" },
                { label: "Tiempo", value: "2.3s", color: "#007B78" },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#F0F9F9] rounded-xl p-2.5 text-center">
                  <p className="text-sm font-bold" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* File tabs */}
            <div className="px-4 pt-3 pb-0 flex gap-1.5 flex-wrap border-b border-gray-100">
              {mockFiles.map((f, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-t-lg text-xs font-medium border-b-2 transition-colors ${
                    activeTab === i
                      ? "border-[#007B78] text-[#007B78] bg-[#F0F9F9]"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <CheckCircle2 className={`w-3 h-3 ${activeTab === i ? "text-[#007B78]" : "text-emerald-500"}`} />
                  <span className="truncate max-w-[100px]">{f.split("-").pop()?.replace(".pdf", "").replace(".PDF", "") ?? f}</span>
                </button>
              ))}
            </div>

            {/* Extracted fields accordion */}
            <div className="divide-y divide-gray-50 max-h-[420px] overflow-y-auto">
              {extractedFields.map((field) => {
                const expanded = expandedFields.includes(field.key);
                return (
                  <div key={field.key}>
                    <button
                      onClick={() => toggleField(field.key)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="flex-1 text-sm text-gray-700 text-left">{field.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
                      />
                    </button>
                    <AnimatePresence>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-3 pl-11">
                            <p className="text-sm text-[#007B78] font-medium bg-[#F0F9F9] px-3 py-1.5 rounded-lg">
                              {field.value}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT PANEL — 65% — Vista Previa */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#007B78]" />
                <div>
                  <h2 className="text-gray-900">Vista Previa del Documento</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Pre-borrador generado automáticamente</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  <Edit3 className="w-3.5 h-3.5" />
                  Editar
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#007B78] text-white text-sm hover:bg-[#006A67] transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  Descargar
                </button>
              </div>
            </div>

            {/* Document preview */}
            <div className="p-6 bg-gray-50 min-h-[600px]">
              <div className="max-w-2xl mx-auto">
                {/* Paper */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  {/* Document header */}
                  <div className="bg-[#007B78] px-8 py-5 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="absolute text-white text-6xl font-bold rotate-[-30deg]"
                          style={{ top: `${i * 40 - 20}px`, left: `${(i % 3) * 120 - 20}px`, opacity: 0.3 }}>
                          BORRADOR
                        </div>
                      ))}
                    </div>
                    <div className="relative z-10">
                      <p className="text-white/70 text-xs uppercase tracking-widest mb-1">Favras · Sistema de Análisis Legal</p>
                      <h3 className="text-white text-lg font-semibold">BORRADOR DE ALZAMIENTO</h3>
                      <p className="text-white/80 text-sm mt-0.5">
                        {selectedL1Data?.label ?? "Alzamiento Total"}
                        {selectedL2 ? ` — ${selectedL2}` : ""}
                      </p>
                    </div>
                    <div className="absolute top-3 right-4 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-white/80 text-xs font-mono">
                      PRE-BORRADOR
                    </div>
                  </div>

                  {/* Document body */}
                  <div className="px-8 py-6 space-y-5 text-sm">
                    {/* Date */}
                    <div className="text-right text-gray-500 text-xs">
                      Santiago, {new Date().toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })}
                    </div>

                    {/* Intro */}
                    <p className="text-gray-700 leading-relaxed">
                      En la ciudad de Santiago, a{" "}
                      <span className="font-semibold text-gray-900">04 de Mayo de 2026</span>, comparecen:
                    </p>

                    {/* Parties */}
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-lg p-4 border-l-3" style={{ borderLeftColor: "#007B78", borderLeftWidth: 3 }}>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Mutuario / Deudor</p>
                        <p className="text-gray-800 font-medium">Felipe Yáñez Campillay</p>
                        <p className="text-gray-500 text-xs mt-0.5">R.U.T: 15.234.567-8</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 border-l-3" style={{ borderLeftColor: "#3182CE", borderLeftWidth: 3 }}>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Banco Acreedor</p>
                        <p className="text-gray-800 font-medium">Banco BICE S.A.</p>
                        <p className="text-gray-500 text-xs mt-0.5">R.U.T: 96.506.610-K</p>
                      </div>
                    </div>

                    {/* Legal text */}
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Antecedentes del Gravamen</p>
                      <p className="text-gray-700 leading-relaxed text-sm">
                        Por medio del presente instrumento, <span className="font-medium">Banco BICE S.A.</span> declara alzar y dejar sin efecto la{" "}
                        <span className="font-medium">{selectedL1Data?.label ?? "hipoteca y prohibición"}</span>
                        {selectedL2 ? ` (${selectedL2})` : ""} constituida sobre el inmueble ubicado en:
                      </p>
                    </div>

                    {/* Property */}
                    <div className="border border-[#007B78]/20 rounded-xl p-4 bg-[#F7FDFC]">
                      <p className="text-xs font-semibold text-[#007B78] uppercase tracking-wider mb-3">Bien Inmueble</p>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Dirección", value: "Av. El Bosque Norte 0177, Of. 502" },
                          { label: "Comuna", value: "Las Condes, R.M." },
                          { label: "Nº Repertorio", value: "4.821-2026" },
                          { label: "Monto", value: "UF 3.250,00" },
                        ].map((item) => (
                          <div key={item.label}>
                            <p className="text-xs text-gray-400">{item.label}</p>
                            <p className="text-sm font-medium text-gray-800">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Legal boilerplate */}
                    <p className="text-gray-600 text-xs leading-relaxed">
                      La presente escritura tiene por objeto dejar constancia del alzamiento del gravamen antes mencionado, en conformidad con lo dispuesto en los artículos 2407 y siguientes del Código Civil y demás normas aplicables. Se deja constancia que la obligación caucionada se encuentra íntegramente satisfecha...
                    </p>

                    {/* Signature area */}
                    <div className="border-t border-gray-100 pt-5 mt-6 grid grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="h-10 border-b border-dashed border-gray-300 mb-2" />
                        <p className="text-xs text-gray-500">Firma Banco BICE S.A.</p>
                        <p className="text-xs text-gray-400">Representante Legal</p>
                      </div>
                      <div className="text-center">
                        <div className="h-10 border-b border-dashed border-gray-300 mb-2" />
                        <p className="text-xs text-gray-500">Firma Notario Público</p>
                        <p className="text-xs text-gray-400">Fecha y Sello</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="bg-gray-50 px-8 py-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400">Generado por Favras · {new Date().toLocaleDateString("es-CL")}</span>
                    <span className="text-xs font-mono bg-amber-100 text-amber-700 px-2 py-0.5 rounded">BORRADOR — NO VÁLIDO</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 pb-4">
          <button
            onClick={() => { setStep(1); setSelectedL1(null); setSelectedL2(null); setFiles([]); setProcessingProgress(0); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Nuevo caso (cargar nuevos archivos)
          </button>
          <button className="flex items-center gap-2 bg-[#007B78] hover:bg-[#006A67] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm">
            <Download className="w-4 h-4" />
            Generar Documento
          </button>
        </div>
      </motion.div>
    );
  };

  /* ─── Render ──────────────────────────────────────────────── */
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-gray-900 text-2xl">Borradores de Alzamientos</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Genera borradores de alzamiento a partir de documentos legales
        </p>
      </div>

      <Stepper current={step} />

      <AnimatePresence mode="wait">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </AnimatePresence>
    </div>
  );
}
