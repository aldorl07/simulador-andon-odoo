import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { SCENARIOS } from '../../constants/simulationData';
import { PlayCircle, AlertCircle, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export default function ScenariosPanel() {
  const { currentScenario, triggerScenario } = useSimulation();

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-4 shadow-xl">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            Panel de Control de Escenarios (Disparadores en Vivo)
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
          Uso durante la defensa académica
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {SCENARIOS.map((sc) => {
          const isActive = currentScenario?.id === sc.id;
          const isRed = sc.color === 'ROJO';
          const isYellow = sc.color === 'AMARILLO';
          const isGreen = sc.color === 'VERDE';

          let borderClass = 'border-slate-800 hover:border-slate-600 bg-slate-950/70 text-slate-300';
          if (isActive) {
            if (isRed) borderClass = 'border-rose-500 bg-rose-950/70 text-white ring-2 ring-rose-500/50 shadow-lg shadow-rose-950/50';
            else if (isYellow) borderClass = 'border-amber-500 bg-amber-950/60 text-white ring-2 ring-amber-500/50';
            else borderClass = 'border-emerald-500 bg-emerald-950/60 text-white ring-2 ring-emerald-500/50';
          }

          return (
            <button
              key={sc.id}
              onClick={() => triggerScenario(sc)}
              className={`p-3 rounded-lg border text-left transition-all relative flex flex-col justify-between group cursor-pointer ${borderClass}`}
            >
              {/* Top row with status badge */}
              <div className="flex items-center justify-between gap-1.5 mb-1.5">
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    isRed
                      ? 'bg-rose-600 text-white'
                      : isYellow
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {isRed && <AlertCircle className="w-3 h-3" />}
                  {isYellow && <AlertTriangle className="w-3 h-3" />}
                  {isGreen && <ShieldCheck className="w-3 h-3" />}
                  {sc.color}
                </span>

                {sc.code && (
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800">
                    {sc.code}
                  </span>
                )}
              </div>

              {/* Title & description */}
              <div className="text-xs font-bold leading-snug mb-1 group-hover:text-white">
                {sc.buttonLabel}
              </div>

              <div className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                {sc.description}
              </div>

              {/* Bottom active indicator */}
              {isActive && (
                <div className="mt-2 text-[9px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                  Escenario Activo en Planta
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
