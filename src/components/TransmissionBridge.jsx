import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Radio, ArrowRight, Server, Cpu, CheckCircle2, X } from 'lucide-react';

export default function TransmissionBridge() {
  const { transmissionEvent, setTransmissionEvent } = useSimulation();

  if (!transmissionEvent) return null;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-y border-indigo-500/40 px-4 py-2 text-white shadow-xl relative overflow-hidden transition-all duration-300">
      {/* Light pulse glow line */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent pointer-events-none animate-signal-pulse"></div>

      <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 overflow-x-auto">
          {/* Hardware Source */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono font-semibold shrink-0">
            <Cpu className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Relé Andon / PLC (GPIO)</span>
          </div>

          <div className="flex items-center gap-1 text-cyan-400 shrink-0 font-mono">
            <Radio className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
            <span className="hidden sm:inline text-[10px] uppercase tracking-wider text-slate-400">Protocolo OPC-UA / REST</span>
            <ArrowRight className="w-4 h-4 text-cyan-300 animate-pulse" />
          </div>

          {/* Odoo Target */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#714B67]/40 border border-[#714B67] text-purple-200 font-mono font-semibold shrink-0">
            <Server className="w-3.5 h-3.5 text-purple-300" />
            <span>API Odoo ERP (XML-RPC)</span>
          </div>

          {/* Message content */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-700 text-slate-200">
            <span className="font-semibold text-amber-300">{transmissionEvent.code}:</span>
            <span className="text-slate-200">{transmissionEvent.message}</span>
            <span className="text-[10px] text-slate-400 font-mono bg-black/40 px-1.5 py-0.5 rounded">
              {transmissionEvent.timestamp}
            </span>
          </div>
        </div>

        <button
          onClick={() => setTransmissionEvent(null)}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors shrink-0"
          title="Cerrar notificación"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
