import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Radio, AlertOctagon, AlertTriangle, CheckCircle, Volume2, Eye } from 'lucide-react';

export default function AndonTower() {
  const { andonState, isSoundMuted, currentScenario, sensorValues, activeProduct } = useSimulation();

  const isRed = andonState === 'ROJO';
  const isYellow = andonState === 'AMARILLO';
  const isGreen = andonState === 'VERDE';

  return (
    <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Tower Visual Representation */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center">
          {/* Stack light cap */}
          <div className="w-14 h-3 bg-slate-700 rounded-t-md border-t border-slate-500 shadow-sm"></div>

          {/* RED LIGHT */}
          <div
            className={`w-14 h-12 border-x-2 border-b-2 border-slate-800 transition-all duration-300 relative flex items-center justify-center overflow-hidden ${
              isRed
                ? 'bg-rose-600 animate-pulse-glow-red shadow-lg shadow-rose-600/80'
                : 'bg-rose-950/60 opacity-40'
            }`}
          >
            {/* Fresnel lens horizontal ridges */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
            {isRed && (
              <span className="relative z-10 text-[10px] font-black text-white tracking-widest uppercase">
                FALLA
              </span>
            )}
          </div>

          {/* AMBER LIGHT */}
          <div
            className={`w-14 h-12 border-x-2 border-b-2 border-slate-800 transition-all duration-300 relative flex items-center justify-center overflow-hidden ${
              isYellow
                ? 'bg-amber-500 animate-pulse-glow-amber shadow-lg shadow-amber-500/80'
                : 'bg-amber-950/60 opacity-40'
            }`}
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
            {isYellow && (
              <span className="relative z-10 text-[10px] font-black text-slate-950 tracking-widest uppercase">
                ALERTA
              </span>
            )}
          </div>

          {/* GREEN LIGHT */}
          <div
            className={`w-14 h-12 border-x-2 border-b-2 border-slate-800 transition-all duration-300 relative flex items-center justify-center overflow-hidden ${
              isGreen
                ? 'bg-emerald-500 animate-pulse-glow-green shadow-lg shadow-emerald-500/80'
                : 'bg-emerald-950/60 opacity-40'
            }`}
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
            {isGreen && (
              <span className="relative z-10 text-[10px] font-black text-white tracking-widest uppercase">
                NORMAL
              </span>
            )}
          </div>

          {/* Tower metal pole & heavy base */}
          <div className="w-4 h-10 bg-gradient-to-r from-slate-600 via-slate-400 to-slate-700 shadow-md"></div>
          <div className="w-20 h-3 bg-slate-800 rounded-b-md border-b-2 border-slate-950 shadow-lg"></div>
        </div>

        {/* Tower Info & Diagnosis */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Torre Semafórica Andon:</span>
            <span
              className={`text-sm font-black px-2.5 py-0.5 rounded tracking-wide ${
                isRed
                  ? 'bg-rose-500 text-white animate-pulse'
                  : isYellow
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-emerald-500 text-white'
              }`}
            >
              {andonState}
            </span>
            {isRed && !isSoundMuted && (
              <span className="flex items-center gap-1 text-xs text-rose-400 font-mono font-bold animate-bounce">
                <Volume2 className="w-3.5 h-3.5" /> Sirena Activa
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300 font-medium">
            {currentScenario.shortTitle} — {currentScenario.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 pt-1">
            <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              Estación afectada: <strong className="text-slate-200">{currentScenario.equipmentName}</strong>
            </span>
            {currentScenario.code && (
              <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-mono text-amber-300">
                Código Alerta: <strong>{currentScenario.code}</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Optical Sensor Status Gauges */}
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-6">
        {/* Sensor Óptico de Espesor */}
        <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 min-w-[190px]">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-cyan-400" /> Sensor Espesor (LAM-01)
            </span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                sensorValues.thickness > activeProduct.criticalLimit
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}
            >
              {sensorValues.thickness > activeProduct.criticalLimit ? 'FUERA LÍMITE' : 'EN TOLERANCIA'}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black font-mono text-cyan-300">
              {sensorValues.thickness.toFixed(2)} mm
            </span>
            <span className="text-[10px] text-slate-400">
              Obj: {activeProduct.targetThickness} ± {activeProduct.tolerance} mm
            </span>
          </div>
          {/* Progress gauge bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden relative">
            <div
              className={`h-full transition-all duration-300 ${
                sensorValues.thickness > activeProduct.criticalLimit ? 'bg-rose-500' : 'bg-cyan-400'
              }`}
              style={{
                width: `${Math.min(100, (sensorValues.thickness / (activeProduct.criticalLimit * 1.25)) * 100)}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Sensor Óptico de Color / Temp */}
        <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 min-w-[190px]">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-amber-400" /> Sensor Color (HOR-01)
            </span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                isRed && currentScenario.defectType === 'quemado'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : isYellow
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}
            >
              {isRed && currentScenario.defectType === 'quemado' ? 'QUEMADO' : isYellow ? 'ALERTA' : 'ÓPTIMO'}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black font-mono text-amber-300">
              {sensorValues.ovenTemp.toFixed(1)} °C
            </span>
            <span className="text-[10px] text-slate-400">
              {sensorValues.colorDelta}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                sensorValues.ovenTemp > 225 ? 'bg-rose-500' : sensorValues.ovenTemp > 215 ? 'bg-amber-500' : 'bg-emerald-400'
              }`}
              style={{
                width: `${Math.min(100, ((sensorValues.ovenTemp - 180) / (250 - 180)) * 100)}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
