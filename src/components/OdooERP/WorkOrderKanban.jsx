import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  Clock,
  Star,
  AlertCircle,
  Play,
  CheckCircle2,
  Wrench,
  ShieldCheck,
  Zap,
  Calendar,
  FileText,
} from 'lucide-react';

export default function WorkOrderKanban({ onSelectOrder }) {
  const { workOrders, startWorkOrder, odooSubModule } = useSimulation();

  // Filter orders by subModule if desired, or show all with tag
  const filteredOrders = workOrders.filter(
    (order) => !odooSubModule || order.subModule === odooSubModule
  );

  const columns = [
    {
      id: 'nueva',
      title: 'Nueva Solicitud',
      description: 'Alertas automáticas Andon sin atender',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    },
    {
      id: 'progreso',
      title: 'En Progreso',
      description: 'En intervención técnica',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      id: 'resuelto',
      title: 'Reparado / Resuelto',
      description: 'Línea rearmada y validada',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 p-3 flex-1 overflow-y-auto">
      {columns.map((col) => {
        const colOrders = filteredOrders.filter((o) => o.stage === col.id);

        return (
          <div
            key={col.id}
            className="bg-[#EBEEF2] rounded-lg border border-slate-300 flex flex-col h-full max-h-[750px] shadow-xs"
          >
            {/* Column Header */}
            <div className="p-3 border-b border-slate-300/80 flex items-center justify-between bg-white/70 rounded-t-lg">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-800 text-xs tracking-tight">
                    {col.title}
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${col.badgeClass}`}
                  >
                    {colOrders.length}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">{col.description}</p>
              </div>
            </div>

            {/* Column Cards Container */}
            <div className="p-2 space-y-2.5 overflow-y-auto flex-1">
              {colOrders.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs italic border border-dashed border-slate-300 rounded-md">
                  No hay órdenes en esta etapa
                </div>
              ) : (
                colOrders.map((order) => {
                  const isNewAndon = col.id === 'nueva' && order.source?.includes('Andon');

                  return (
                    <div
                      key={order.id}
                      onClick={() => onSelectOrder(order.id)}
                      className={`bg-white rounded-md p-3 shadow-xs border transition-all cursor-pointer hover:shadow-md relative group ${
                        isNewAndon
                          ? 'border-rose-400 ring-2 ring-rose-400/30 animate-pulse'
                          : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="font-mono text-[10px] font-bold bg-[#714B67]/10 text-[#714B67] px-1.5 py-0.5 rounded">
                          {order.id}
                        </span>

                        {isNewAndon ? (
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-rose-600 text-white animate-bounce flex items-center gap-1 shadow-xs">
                            <Zap className="w-2.5 h-2.5" /> ANDON ROJO
                          </span>
                        ) : (
                          <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {order.code || 'ALT-01'}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h5 className="font-bold text-slate-800 text-xs leading-snug mb-1 group-hover:text-[#714B67] transition-colors">
                        {order.title}
                      </h5>

                      {/* Equipment */}
                      <div className="text-[11px] font-medium text-slate-600 flex items-center gap-1 mb-2">
                        <Wrench className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{order.equipment}</span>
                      </div>

                      {/* Details & Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                        {order.downtimeFormatted && (
                          <span className="flex items-center gap-1 font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {order.downtimeFormatted}
                          </span>
                        )}

                        {order.scrapKg > 0 && (
                          <span className="bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-mono">
                            Merma: {order.scrapKg} kg
                          </span>
                        )}

                        {/* Priority Stars */}
                        <div className="ml-auto flex items-center gap-0.5 text-amber-400">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <Star className="w-3 h-3 fill-amber-400" />
                          <Star className="w-3 h-3 fill-amber-400" />
                        </div>
                      </div>

                      {/* Quick Action Button */}
                      {col.id === 'nueva' && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              startWorkOrder(order.id);
                            }}
                            className="w-full bg-[#017E84] hover:bg-[#00666b] text-white font-bold py-1 px-2 rounded text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            Atender Incidencia
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
