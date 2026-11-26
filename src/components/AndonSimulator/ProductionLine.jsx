import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  RotateCw,
  Sliders,
  Flame,
  Package,
  Layers,
  AlertOctagon,
  Timer,
  PauseCircle,
  ZapOff,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { STATIONS } from '../../constants/simulationData';

export default function ProductionLine() {
  const {
    andonState,
    isBeltRunning,
    stopwatchSeconds,
    currentScenario,
    activeProduct,
    sensorValues,
  } = useSimulation();

  // Format stopwatch seconds as HH:MM:SS
  const formatTime = (totalSec) => {
    const hrs = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSec % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const isRed = andonState === 'ROJO';
  const isYellow = andonState === 'AMARILLO';

  // Array of biscuits positioned across conveyor positions
  const biscuits = [
    { id: 1, posPercent: 8, label: 'Masa cruda' },
    { id: 2, posPercent: 25, label: 'Laminada' },
    { id: 3, posPercent: 44, label: 'Estampada' },
    { id: 4, posPercent: 64, label: 'Horneándose' },
    { id: 5, posPercent: 82, label: 'Enfriamiento' },
    { id: 6, posPercent: 95, label: 'Empaque' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-4 shadow-2xl relative overflow-hidden">
      {/* Station Headers Bar */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
          <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
            Línea de Producción Automatizada
            <span className="text-xs font-mono text-slate-400 font-normal">
              (5 Estaciones Industriales)
            </span>
          </h3>
        </div>

        {/* Relay Stop Status / Stopwatch */}
        {isRed ? (
          <div className="flex items-center gap-3 bg-rose-950/80 border border-rose-500 px-3 py-1.5 rounded-lg animate-relay-blink shadow-lg shadow-rose-900/40">
            <div className="flex items-center gap-1.5 text-rose-300 font-black text-xs uppercase tracking-wider">
              <ZapOff className="w-4 h-4 text-rose-400" />
              <span>FAJA DETENIDA POR RELÉ</span>
            </div>
            <div className="h-4 w-px bg-rose-700"></div>
            <div className="flex items-center gap-1.5 text-white font-mono font-bold text-sm">
              <Timer className="w-4 h-4 text-rose-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span>{formatTime(stopwatchSeconds)}</span>
            </div>
          </div>
        ) : isYellow ? (
          <div className="flex items-center gap-2 bg-amber-950/60 border border-amber-500/60 px-3 py-1 rounded-lg text-xs font-semibold text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>Alerta preventiva: Faja en operación controlada</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/60 px-3 py-1 rounded-lg text-xs font-semibold text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Faja en marcha continua (Velocidad: 4.8 m/min)</span>
          </div>
        )}
      </div>

      {/* 5 Physical Stations Visual Layout */}
      <div className="grid grid-cols-5 gap-2 pt-2 pb-4">
        {/* Estación 1: Sobadora EQ-01 */}
        <div
          className={`p-2.5 rounded-lg border text-center transition-all ${
            isRed && currentScenario.equipmentId === 'EQ-01'
              ? 'bg-rose-950/60 border-rose-500 shadow-md shadow-rose-500/30'
              : 'bg-slate-950/70 border-slate-800'
          }`}
        >
          <div className="flex justify-center mb-1.5">
            <div
              className={`w-9 h-9 rounded-md flex items-center justify-center ${
                isRed && currentScenario.equipmentId === 'EQ-01'
                  ? 'bg-rose-600 text-white animate-bounce'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              <RotateCw className={`w-5 h-5 ${isBeltRunning ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            </div>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">EQ-01</div>
          <div className="text-xs font-bold text-white truncate" title="Sobadora Industrial">
            Sobadora Industrial
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Vibración: <span className="font-mono text-cyan-300">{sensorValues.vibrationRMS} mm/s</span>
          </div>
        </div>

        {/* Estación 2: Laminadora LAM-01 */}
        <div
          className={`p-2.5 rounded-lg border text-center transition-all relative ${
            isRed && currentScenario.equipmentId === 'LAM-01'
              ? 'bg-rose-950/60 border-rose-500 shadow-md shadow-rose-500/30'
              : 'bg-slate-950/70 border-slate-800'
          }`}
        >
          {/* Optical sensor flag */}
          <div className="absolute -top-2 right-1 text-[9px] bg-cyan-900 border border-cyan-500 text-cyan-200 px-1 rounded font-mono">
            Sensor Espesor
          </div>
          <div className="flex justify-center mb-1.5">
            <div
              className={`w-9 h-9 rounded-md flex items-center justify-center ${
                isRed && currentScenario.equipmentId === 'LAM-01'
                  ? 'bg-rose-600 text-white animate-bounce'
                  : 'bg-slate-800 text-cyan-400'
              }`}
            >
              <Sliders className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">LAM-01</div>
          <div className="text-xs font-bold text-white truncate" title="Máquina Laminadora">
            Laminadora
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            <span className={sensorValues.thickness > activeProduct.criticalLimit ? 'text-rose-400 font-bold' : 'text-cyan-300'}>
              {sensorValues.thickness} mm
            </span>
          </div>
        </div>

        {/* Estación 3: Estampadora */}
        <div className="p-2.5 rounded-lg border bg-slate-950/70 border-slate-800 text-center">
          <div className="flex justify-center mb-1.5">
            <div className="w-9 h-9 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">EST-01</div>
          <div className="text-xs font-bold text-white truncate" title="Máquina Estampadora">
            Estampadora
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            Troquelado María
          </div>
        </div>

        {/* Estación 4: Horno HOR-01 */}
        <div
          className={`p-2.5 rounded-lg border text-center transition-all relative ${
            (isRed && currentScenario.equipmentId === 'HOR-01') || isYellow
              ? isRed
                ? 'bg-rose-950/60 border-rose-500 shadow-md shadow-rose-500/30'
                : 'bg-amber-950/50 border-amber-500'
              : 'bg-slate-950/70 border-slate-800'
          }`}
        >
          <div className="absolute -top-2 right-1 text-[9px] bg-amber-900 border border-amber-500 text-amber-200 px-1 rounded font-mono">
            Sensor Color
          </div>
          <div className="flex justify-center mb-1.5">
            <div
              className={`w-9 h-9 rounded-md flex items-center justify-center ${
                isRed && currentScenario.equipmentId === 'HOR-01'
                  ? 'bg-rose-600 text-white animate-bounce'
                  : isYellow
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800 text-amber-400'
              }`}
            >
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">HOR-01</div>
          <div className="text-xs font-bold text-white truncate" title="Horno Continuo">
            Horno Continuo
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            <span className={sensorValues.ovenTemp > 225 ? 'text-rose-400 font-bold' : isYellow ? 'text-amber-300 font-bold' : 'text-slate-300'}>
              {sensorValues.ovenTemp} °C
            </span>
          </div>
        </div>

        {/* Estación 5: Faja de Enfriamiento y Empaque */}
        <div className="p-2.5 rounded-lg border bg-slate-950/70 border-slate-800 text-center">
          <div className="flex justify-center mb-1.5">
            <div className="w-9 h-9 rounded-md bg-slate-800 text-emerald-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ENF-01</div>
          <div className="text-xs font-bold text-white truncate" title="Faja de Enfriamiento y Empaquetado">
            Enfriamiento/Empaque
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            Lote: <span className="text-emerald-300">L-2026-N</span>
          </div>
        </div>
      </div>

      {/* ANIMATED CONVEYOR BELT CONTAINER */}
      <div className="mt-2 relative">
        {/* Conveyor Bed Structure */}
        <div className="bg-slate-950 border-y-4 border-slate-700 h-28 rounded-md relative overflow-hidden flex items-center shadow-inner">
          {/* Animated belt stripes */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, #475569 0, #475569 10px, transparent 10px, transparent 20px)',
              backgroundSize: '28px 28px',
              animation: isBeltRunning ? 'conveyor-move 1.2s linear infinite' : 'none',
            }}
          ></div>

          {/* Guide rails */}
          <div className="absolute top-1 left-0 right-0 h-1 bg-gradient-to-r from-slate-600 via-slate-400 to-slate-600 opacity-60"></div>
          <div className="absolute bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-slate-600 via-slate-400 to-slate-600 opacity-60"></div>

          {/* Biscuits on the conveyor */}
          {biscuits.map((biscuit, index) => {
            // Determine biscuit appearance according to stage and alert state
            let biscuitBg = activeProduct.colorHex;
            let biscuitBorder = '#b45309';
            let isDefective = false;
            let defectText = '';

            // Check if this biscuit corresponds to defective station
            if (isRed) {
              if (currentScenario.defectType === 'espesor' && (index === 1 || index === 2)) {
                isDefective = true;
                defectText = 'Lámina Descalibrada (>2.0mm)';
                biscuitBg = '#ef4444';
                biscuitBorder = '#b91c1c';
              } else if (currentScenario.defectType === 'quemado' && (index === 3 || index === 4)) {
                isDefective = true;
                defectText = 'Galleta Quemada';
                biscuitBg = '#1c1917'; // very dark burnt
                biscuitBorder = '#dc2626';
              } else if (currentScenario.defectType === 'atasco' && index === 1) {
                isDefective = true;
                defectText = 'Atasco Cadena';
                biscuitBg = '#b91c1c';
                biscuitBorder = '#7f1d1d';
              } else if (currentScenario.defectType === 'vibracion' && index === 0) {
                isDefective = true;
                defectText = 'Falla Sobadora';
                biscuitBg = '#b91c1c';
                biscuitBorder = '#7f1d1d';
              }
            } else if (isYellow && index >= 3) {
              // Darker golden biscuit for preventive warning
              biscuitBg = '#78350f';
            }

            return (
              <div
                key={biscuit.id}
                className="absolute flex flex-col items-center transition-all duration-500"
                style={{
                  left: `${biscuit.posPercent}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                {/* Defect Alert Badge over biscuit if defective */}
                {isDefective && (
                  <div className="mb-1 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-600 text-white animate-bounce whitespace-nowrap shadow-md shadow-rose-900">
                    {defectText}
                  </div>
                )}

                {/* Industrial Biscuit Graphic */}
                <div
                  className={`w-14 h-14 rounded-full border-2 relative flex items-center justify-center transition-all ${
                    isDefective
                      ? 'border-rose-500 shadow-lg shadow-rose-600/80 scale-110'
                      : 'shadow-md hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: biscuitBg,
                    borderColor: isDefective ? '#ef4444' : biscuitBorder,
                  }}
                >
                  {/* Biscuit decorative dots/holes (typical Maria biscuit) */}
                  <div className="absolute inset-1.5 rounded-full border border-dashed border-black/20 flex items-center justify-center pointer-events-none">
                    <div className="grid grid-cols-3 gap-1 opacity-40">
                      <div className="w-1 h-1 rounded-full bg-black"></div>
                      <div className="w-1 h-1 rounded-full bg-black"></div>
                      <div className="w-1 h-1 rounded-full bg-black"></div>
                      <div className="w-1 h-1 rounded-full bg-black"></div>
                      <div className="w-1 h-1 rounded-full bg-black"></div>
                      <div className="w-1 h-1 rounded-full bg-black"></div>
                    </div>
                  </div>

                  {/* Biscuit Text Center */}
                  <span
                    className={`text-[8px] font-black tracking-tighter uppercase select-none ${
                      isDefective ? 'text-white' : 'text-amber-950/70'
                    }`}
                  >
                    {isDefective ? 'RECHAZO' : 'MARÍA'}
                  </span>
                </div>

                {/* Biscuit Station Subtext */}
                <span className="text-[9px] text-slate-400 mt-1 font-mono">
                  {biscuit.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Industrial rollers animation underneath */}
        <div className="flex justify-between px-6 pt-1">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full border border-slate-600 bg-slate-800 ${
                isBeltRunning ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '0.8s' }}
            >
              <div className="w-1 h-full bg-slate-500 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
