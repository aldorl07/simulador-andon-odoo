import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Layers,
  Factory,
  BarChart3,
  SlidersHorizontal,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Wheat,
  Cookie,
} from 'lucide-react';
import { PRODUCTS } from '../constants/simulationData';

export default function Header() {
  const {
    activeProductId,
    setActiveProductId,
    activeView,
    setActiveView,
    isSoundMuted,
    toggleSound,
    resetSimulation,
    andonState,
  } = useSimulation();

  return (
    <header className="bg-slate-900 border-b border-slate-700/80 text-white shadow-xl sticky top-0 z-50">
      {/* Top Banner */}
      <div className="max-w-[1920px] mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        {/* Left: Branding & Plant Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black shadow-inner">
            <Cookie className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base md:text-lg tracking-tight text-slate-100 flex items-center gap-2">
                Fábrica de Galletas María E.I.R.L.
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-amber-500/30 font-medium">
                  Huancayo, Perú
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>Simulador Andon 4.0 + Odoo ERP (Mantenimiento y Calidad)</span>
              <span className="inline-block w-1 h-1 rounded-full bg-slate-500"></span>
              <span className="text-slate-400 font-mono">Línea Continua L-01</span>
            </p>
          </div>
        </div>

        {/* Center: Active Product Selector */}
        <div className="flex items-center bg-slate-950/80 p-1.5 rounded-xl border border-slate-700/70 shadow-inner gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider pl-2 flex items-center gap-1">
            <Wheat className="w-3.5 h-3.5 text-amber-500" /> Producto:
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setActiveProductId('tradicional')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                activeProductId === 'tradicional'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
              title="Espesor objetivo: 1.8 mm ± 0.2 mm | Límite crítico: > 2.0 mm"
            >
              <span className="w-2 h-2 rounded-full bg-amber-200"></span>
              María Tradicional
              <span className="text-[10px] opacity-80 font-mono bg-black/20 px-1 rounded">1.8 mm</span>
            </button>
            <button
              onClick={() => setActiveProductId('pae')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                activeProductId === 'pae'
                  ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-600/20'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
              title="Espesor objetivo: 2.2 mm ± 0.2 mm | Límite crítico: > 2.4 mm"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Integral PAE
              <span className="text-[10px] opacity-80 font-mono bg-black/20 px-1 rounded">2.2 mm</span>
            </button>
          </div>
        </div>

        {/* Right: Sound Control, Reset & Status Badge */}
        <div className="flex items-center gap-2.5">
          {/* Status Pill */}
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border shadow-sm ${
              andonState === 'ROJO'
                ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                : andonState === 'AMARILLO'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
            }`}
          >
            {andonState === 'ROJO' && <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-bounce" />}
            {andonState === 'AMARILLO' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
            {andonState === 'VERDE' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            Andon: {andonState}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
              isSoundMuted
                ? 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                : andonState === 'ROJO'
                ? 'bg-rose-600 border-rose-400 text-white animate-bounce shadow-lg shadow-rose-600/30'
                : 'bg-slate-800 border-slate-600 text-amber-400 hover:bg-slate-700'
            }`}
            title={isSoundMuted ? 'Activar sirena de alarma' : 'Silenciar alarma'}
          >
            {isSoundMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">Sirena OFF</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Sirena ON</span>
              </>
            )}
          </button>

          {/* Reset Simulation */}
          <button
            onClick={resetSimulation}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 hover:text-white flex items-center gap-1.5 transition-all"
            title="Reiniciar todos los estados a verde y restablecer órdenes"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>
        </div>
      </div>

      {/* Navigation View Tabs */}
      <div className="max-w-[1920px] mx-auto px-4 py-1.5 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          <button
            onClick={() => setActiveView('dual')}
            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
              activeView === 'dual'
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Vista Dual (Recomendada para exposición)
          </button>

          <button
            onClick={() => setActiveView('andon')}
            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
              activeView === 'andon'
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            Solo Planta (Andon)
          </button>

          <button
            onClick={() => setActiveView('odoo')}
            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
              activeView === 'odoo'
                ? 'bg-[#714B67] text-white font-bold shadow-md shadow-[#714B67]/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Solo Odoo ERP
          </button>

          <button
            onClick={() => setActiveView('kpis')}
            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
              activeView === 'kpis'
                ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Dashboard KPIs
          </button>
        </div>

        {/* Current Active Specs Callout */}
        <div className="hidden lg:flex items-center gap-3 text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            Espesor Objetivo: <b className="text-slate-200">{PRODUCTS[activeProductId === 'tradicional' ? 'TRADICIONAL' : 'PAE'].targetThickness} mm</b>
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            Límite Crítico: <b className="text-rose-300">&gt; {PRODUCTS[activeProductId === 'tradicional' ? 'TRADICIONAL' : 'PAE'].criticalLimit} mm</b>
          </span>
        </div>
      </div>
    </header>
  );
}
