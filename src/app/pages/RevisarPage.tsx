import { useState, useRef } from "react";
import { motion } from "motion/react";
import { FileText, Upload, CheckCircle2, Info, X, AlertCircle } from "lucide-react";

interface FileSlot {
  id: string;
  label: string;
  required: boolean;
  file?: File;
}

export function RevisarPage() {
  const [slots, setSlots] = useState<FileSlot[]>([
    { id: "instructivo", label: "Instructivo de alzamiento SalesForce", required: true },
    { id: "escritura", label: "Escritura de compraventa", required: true },
    { id: "carta", label: "Carta de resguardo", required: true },
    { id: "gravamenes", label: "Gravámenes y prohibiciones", required: false },
  ]);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleFile = (slotId: string, file: File) => {
    setSlots(prev =>
      prev.map(s => s.id === slotId ? { ...s, file } : s)
    );
  };

  const handleDrop = (slotId: string, e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(slotId, file);
  };

  const removeFile = (slotId: string) => {
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, file: undefined } : s));
  };

  const canRevisar = slots.filter(s => s.required).every(s => s.file);

  const allowedFormats = ["PDF", "JPG", "JPEG", "PNG", "TXT", "DOC", "DOCX"];

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 text-2xl">Sube tus documentos</h1>
          <p className="text-gray-500 text-sm mt-1">Agrega archivos para corregir con Favras</p>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 bg-[#F0F9F9] border border-[#007B78]/20 rounded-xl px-4 py-3 mb-6">
          <Info className="w-4 h-4 text-[#007B78] flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-600">
            <p>Formatos permitidos: <span className="font-medium text-gray-800">{allowedFormats.join(", ")}</span></p>
            <p>Tamaño máximo: <span className="font-medium text-gray-800">20 MB por documento</span></p>
          </div>
        </div>

        {/* File upload slots */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <Upload className="w-4 h-4 text-[#007B78]" />
            <h2 className="text-gray-800">Documentos requeridos</h2>
          </div>

          <div className="divide-y divide-gray-50">
            {slots.map((slot, i) => (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="px-6 py-5"
              >
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-sm font-medium text-gray-800">{slot.label}</span>
                  {slot.required ? (
                    <span className="text-red-500 text-xs">*</span>
                  ) : (
                    <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md">Opcional</span>
                  )}
                </div>

                {slot.file ? (
                  // File uploaded state
                  <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-emerald-800 truncate">{slot.file.name}</p>
                      <p className="text-xs text-emerald-600">{(slot.file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      onClick={() => removeFile(slot.id)}
                      className="w-6 h-6 rounded-full bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center transition-colors flex-shrink-0"
                    >
                      <X className="w-3 h-3 text-emerald-700" />
                    </button>
                  </div>
                ) : (
                  // Drop zone
                  <div
                    onClick={() => inputRefs.current[slot.id]?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(slot.id); }}
                    onDragLeave={() => setDragOver(null)}
                    onDrop={(e) => handleDrop(slot.id, e)}
                    className={`flex items-center gap-3 border-2 border-dashed rounded-xl px-4 py-3.5 cursor-pointer transition-all duration-200 ${
                      dragOver === slot.id
                        ? "border-[#007B78] bg-[#F0F9F9]"
                        : "border-gray-200 hover:border-[#007B78]/50 hover:bg-[#F7FAFA]"
                    }`}
                  >
                    <FileText className={`w-4 h-4 flex-shrink-0 transition-colors ${dragOver === slot.id ? "text-[#007B78]" : "text-gray-400"}`} />
                    <span className="text-sm text-gray-500">
                      Arrastra un documento o{" "}
                      <span className="text-[#007B78] font-medium">haz clic para seleccionar</span>
                    </span>
                  </div>
                )}

                <input
                  ref={(el) => { inputRefs.current[slot.id] = el; }}
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.txt,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(slot.id, file);
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Missing required notice */}
        {!canRevisar && (
          <div className="flex items-center gap-2 mt-4 text-sm text-amber-600">
            <AlertCircle className="w-4 h-4" />
            <span>Completa los campos requeridos (*) para continuar</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end mt-6">
          <button
            disabled={!canRevisar}
            className="flex items-center gap-2 bg-[#007B78] hover:bg-[#006A67] disabled:bg-gray-200 disabled:text-gray-400 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            Revisar documentos
          </button>
        </div>
      </motion.div>
    </div>
  );
}
