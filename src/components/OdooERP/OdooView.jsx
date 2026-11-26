import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import WorkOrderKanban from './WorkOrderKanban';
import WorkOrderModal from './WorkOrderModal';
import {
  Wrench,
  ShieldCheck,
  Search,
  SlidersHorizontal,
  Plus,
  RefreshCw,
  Layers,
  Settings,
  Bell,
  CheckCircle,
} from 'lucide-react';

export default function OdooView() {
  const {
    odooSubModule,
    setOdooSubModule,
    workOrders,
    selectedOrderId,
    setSelectedOrderId,
  } = useSimulation();

  const selectedOrder = workOrders.find((o) => o.id === selectedOrderId);

  const pendingCount = workOrders.filter((o) => o.stage === 'nueva').length;

  return (
    <div className="bg-[#F0F2F5] rounded-xl border border-slate-300 shadow-xl overflow-hidden flex flex-col h-full min-h-[620px]">
      {/* Odoo Top Purple Corporate Header */}
      <div className="bg-[#714B67] text-white px-4 py-2 flex flex-wrap items-center justify-between gap-3 shadow-md">
        {/* Brand & App Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight">odoo</span>
            <span className="text-[10px] bg-purple-900/60 px-1.5 py-0.5 rounded text-purple-200 font-mono">
              v17 Enterprise
            </span>
          </div>

          <div className="h-4 w-px bg-purple-400/40"></div>

          {/* Sub-module Selector Switcher */}
          <div className="flex items-center bg-purple-900/50 p-0.5 rounded-lg border border-purple-400/30">
            <button
              onClick={() => setOdooSubModule('mantenimiento')}
              className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                odooSubModule === 'mantenimiento'
                  ? 'bg-white text-[#714B67] font-bold shadow-xs'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              Mantenimiento (GMAO)
            </button>
            <button
              onClick={() => setOdooSubModule('calidad')}
              className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                odooSubModule === 'calidad'
                  ? 'bg-white text-[#714B67] font-bold shadow-xs'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Calidad
            </button>
          </div>
        </div>

        {/* User profile & Plant Notification */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-purple-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Planta Huancayo - L01</span>
          </div>

          {pendingCount > 0 && (
            <span className="bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 animate-pulse">
              <Bell className="w-3 h-3" />
              {pendingCount} Pendiente{pendingCount > 1 ? 's' : ''}
            </span>
          )}

          <div className="w-7 h-7 rounded-full bg-purple-800 border border-purple-400/50 flex items-center justify-center font-bold text-xs text-white">
            JG
          </div>
        </div>
      </div>

      {/* Odoo Control Panel / Breadcrumb & Search Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-slate-800 tracking-tight">
            Tablero de Órdenes de Trabajo
          </h2>
          <span className="text-xs text-slate-400">|</span>
          <span className="text-xs font-medium text-slate-500">
            {odooSubModule === 'calidad' ? 'Fallas de Calidad & Merma' : 'Mantenimiento Correctivo'}
          </span>
        </div>

        {/* Search / Filter mockup */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar solicitud o equipo..."
              readOnly
              className="bg-slate-100 border border-slate-300 rounded-md pl-8 pr-3 py-1 text-xs text-slate-700 w-52 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded border border-slate-200 text-slate-600 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium hidden sm:inline">Filtros</span>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <WorkOrderKanban onSelectOrder={(id) => setSelectedOrderId(id)} />

      {/* Detail / Edit Modal */}
      {selectedOrder && (
        <WorkOrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
}
