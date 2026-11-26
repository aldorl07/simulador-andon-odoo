import React from 'react';
import AndonTower from './AndonTower';
import ProductionLine from './ProductionLine';
import ScenariosPanel from './ScenariosPanel';
import { Factory, ShieldAlert, Cpu } from 'lucide-react';

export default function AndonSimulator() {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Module Title Header */}
      <div className="flex items-center justify-between bg-slate-900/90 px-4 py-2.5 rounded-xl border border-slate-800 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Factory className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold tracking-tight text-white uppercase flex items-center gap-2">
              Módulo 1: Planta Industrial & Sistema Andon
            </h2>
            <span className="text-[10px] text-slate-400">
              Monitoreo en Tiempo Real y Control de Paradas Automatizadas
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> PLC Activo
          </span>
          <span>|</span>
          <span className="text-slate-300">Huancayo, Perú</span>
        </div>
      </div>

      {/* Andon Stack Tower */}
      <AndonTower />

      {/* Production Line & Animated Conveyor */}
      <ProductionLine />

      {/* Scenarios Trigger Panel */}
      <ScenariosPanel />
    </div>
  );
}
