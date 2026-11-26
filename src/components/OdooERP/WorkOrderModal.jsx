import React, { useState, useEffect } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { ROOT_CAUSES, QUICK_ACTIONS } from '../../constants/simulationData';
import {
  X,
  CheckCircle,
  Clock,
  Play,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Wrench,
  Scale,
  FileText,
  Star,
  User,
  Building,
  Tag,
} from 'lucide-react';

export default function WorkOrderModal({ order, onClose }) {
  const { startWorkOrder, closeWorkOrder, andonState, stopwatchSeconds } = useSimulation();

  // Local form state
  const [rootCause, setRootCause] = useState(order.rootCause || ROOT_CAUSES[0]);
  const [actionExecuted, setActionExecuted] = useState(
    order.actionExecuted || QUICK_ACTIONS[order.rootCause || ROOT_CAUSES[0]] || ''
  );
  const [scrapKg, setScrapKg] = useState(order.scrapKg || 1.2);
  const [simulatedMinutes, setSimulatedMinutes] = useState(
    order.downtimeMinutes > 0 ? order.downtimeMinutes : Math.max(1, Math.round(stopwatchSeconds / 60))
  );

  // Update suggested action when root cause changes
  const handleRootCauseChange = (e) => {
    const newCause = e.target.value;
    setRootCause(newCause);
    if (!actionExecuted || actionExecuted === QUICK_ACTIONS[rootCause]) {
      setActionExecuted(QUICK_ACTIONS[newCause] || '');
    }
  };

  // Quick autofill button handler
  const handleAutofillSuggestion = () => {
    if (QUICK_ACTIONS[rootCause]) {
      setActionExecuted(QUICK_ACTIONS[rootCause]);
    }
  };

  const handleStartAttention = () => {
    startWorkOrder(order.id);
  };

  const handleCloseAndRearm = (e) => {
    e.preventDefault();
    closeWorkOrder(order.id, {
      rootCause,
      actionExecuted,
      scrapKg,
      simulatedMinutes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-3xl overflow-hidden flex flex-col text-slate-800 text-xs">
        {/* Odoo Form Header & Status Pipeline Bar */}
        <div className="bg-[#714B67] text-white px-4 py-2.5 flex items-center justify-between border-b border-[#5a3a52]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-wide">Odoo 17.0</span>
            <span className="opacity-60">/</span>
            <span className="font-medium text-xs text-purple-200">
              {order.subModule === 'calidad' ? 'Control de Calidad' : 'Mantenimiento (GMAO)'}
            </span>
            <span className="opacity-60">/</span>
            <span className="font-mono bg-purple-900/60 px-1.5 py-0.5 rounded text-[11px] font-bold">
              {order.id}
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-purple-200 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Odoo Breadcrumb & Action Control Bar */}
        <div className="bg-slate-100 px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            {order.stage === 'nueva' && (
              <button
                type="button"
                onClick={handleStartAttention}
                className="bg-[#017E84] hover:bg-[#00666b] text-white font-bold px-3 py-1.5 rounded text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Iniciar Atención (Pasar a En Progreso)
              </button>
            )}

            {order.stage === 'progreso' && (
              <button
                type="button"
                onClick={handleCloseAndRearm}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                Cerrar OT y Rearmar Andon
              </button>
            )}

            {order.stage === 'resuelto' && (
              <span className="px-3 py-1 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Incidencia Reparada y Validada
              </span>
            )}
          </div>

          {/* Odoo Stage Pipeline Indicator */}
          <div className="flex items-center rounded overflow-hidden border border-slate-300 bg-white shadow-xs">
            <span
              className={`px-3 py-1 font-semibold text-[11px] transition-colors ${
                order.stage === 'nueva'
                  ? 'bg-[#714B67] text-white font-bold'
                  : 'text-slate-500 bg-slate-50'
              }`}
            >
              1. Nueva Solicitud
            </span>
            <div className="w-2 h-4 border-r border-slate-300 transform skew-x-[-20deg]"></div>
            <span
              className={`px-3 py-1 font-semibold text-[11px] transition-colors ${
                order.stage === 'progreso'
                  ? 'bg-[#017E84] text-white font-bold'
                  : 'text-slate-500 bg-slate-50'
              }`}
            >
              2. En Progreso
            </span>
            <div className="w-2 h-4 border-r border-slate-300 transform skew-x-[-20deg]"></div>
            <span
              className={`px-3 py-1 font-semibold text-[11px] transition-colors ${
                order.stage === 'resuelto'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-500 bg-slate-50'
              }`}
            >
              3. Reparado / Resuelto
            </span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-4">
          {/* Order Title and Badge */}
          <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                  {order.code || 'ALT-01'}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold border border-rose-200">
                  ORIGEN: {order.source}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {order.title}
              </h2>
            </div>

            {/* Priority 3 Stars */}
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded border border-amber-200 text-amber-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-bold text-amber-700 ml-1">Alta Prioridad</span>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field: Equipo / Estación */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Equipo / Estación Industrial
              </label>
              <input
                type="text"
                readOnly
                value={order.equipment}
                className="w-full bg-slate-100 border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-800 cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-500 italic">Autocompletado desde señal Andon</span>
            </div>

            {/* Field: Tipo de Incidencia */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Tipo de Incidencia
              </label>
              <input
                type="text"
                readOnly
                value={order.type}
                className="w-full bg-slate-100 border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-800 cursor-not-allowed"
              />
            </div>

            {/* Field: Tiempo de Parada */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Tiempo de Parada Registrado (Minutos)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  step="1"
                  disabled={order.stage === 'resuelto'}
                  value={simulatedMinutes}
                  onChange={(e) => setSimulatedMinutes(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono font-bold text-slate-800 focus:outline-none focus:border-[#017E84]"
                />
                <span className="text-slate-500 font-mono text-xs font-bold whitespace-nowrap">min</span>
              </div>
              <span className="text-[10px] text-slate-500">
                Capturado en vivo: {Math.round(stopwatchSeconds / 60)} min (editable para simular impacto en KPIs)
              </span>
            </div>

            {/* Field: Merma / Scrap Asociado */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Merma Asociada / Masa Fuera de Rango (kg)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  disabled={order.stage === 'resuelto'}
                  value={scrapKg}
                  onChange={(e) => setScrapKg(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono font-bold text-slate-800 focus:outline-none focus:border-[#017E84]"
                />
                <span className="text-slate-500 font-mono text-xs font-bold whitespace-nowrap">kg</span>
              </div>
              <span className="text-[10px] text-slate-500">
                Lote de descarte retenido antes de empaque
              </span>
            </div>

            {/* Field: Causa Raíz (Mandatory Dropdown) */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Causa Raíz Diagnosticada <span className="text-rose-500">*</span>
              </label>
              <select
                value={rootCause}
                disabled={order.stage === 'resuelto'}
                onChange={handleRootCauseChange}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-800 bg-white focus:outline-none focus:border-[#017E84]"
              >
                {ROOT_CAUSES.map((cause) => (
                  <option key={cause} value={cause}>
                    {cause}
                  </option>
                ))}
              </select>
            </div>

            {/* Field: Acción Correctiva Ejecutada */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Acción Correctiva Ejecutada <span className="text-rose-500">*</span>
                </label>
                {order.stage !== 'resuelto' && (
                  <button
                    type="button"
                    onClick={handleAutofillSuggestion}
                    className="text-[11px] text-[#017E84] hover:text-[#00666b] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    Autocompletar sugerencia técnica
                  </button>
                )}
              </div>
              <textarea
                rows={2}
                disabled={order.stage === 'resuelto'}
                value={actionExecuted}
                onChange={(e) => setActionExecuted(e.target.value)}
                placeholder="Escribe la intervención técnica realizada..."
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-[#017E84]"
              ></textarea>
            </div>
          </div>

          {/* Operational Log Details */}
          <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1 text-[11px] text-slate-600 font-mono">
            <div className="flex justify-between">
              <span>Registrado: <strong>{order.createdAt}</strong></span>
              <span>Técnico Responsable: <strong>{order.operator}</strong></span>
            </div>
            {order.startedAt && (
              <div className="text-[#017E84]">
                Inicio de atención: <strong>{order.startedAt}</strong>
              </div>
            )}
            {order.resolvedAt && (
              <div className="text-emerald-700">
                Cierre y rearmado de línea: <strong>{order.resolvedAt}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-200 font-medium transition-colors cursor-pointer"
          >
            Cerrar Ventana
          </button>

          {order.stage !== 'resuelto' ? (
            <button
              type="button"
              onClick={handleCloseAndRearm}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              Cerrar OT y Rearmar Andon
            </button>
          ) : (
            <span className="text-emerald-700 font-bold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              OT Cerrada en Odoo
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
