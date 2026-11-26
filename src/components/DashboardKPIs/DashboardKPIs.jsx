import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  Clock,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  PieChart as PieIcon,
  Activity,
  Layers,
  Award,
} from 'lucide-react';
import { BASELINE_KPIS } from '../../constants/simulationData';

export default function DashboardKPIs() {
  const { dynamicKPIs, paretoData, workOrders } = useSimulation();

  const resolvedOrders = workOrders.filter((o) => o.stage === 'resuelto');

  // Comparative data for Bar Chart
  const comparativeData = [
    {
      kpi: 'OEE (%)',
      Antes: 62.4,
      Propuesta: 73.9,
      Meta: 67.6,
    },
    {
      kpi: 'Disponibilidad (%)',
      Antes: 81.2,
      Propuesta: 89.6,
      Meta: 85.0,
    },
    {
      kpi: 'Merma Horneada (%)',
      Antes: 6.0,
      Propuesta: 4.12,
      Meta: 3.0,
    },
    {
      kpi: 'Paradas (min/turno)',
      Antes: 45.0,
      Propuesta: 31.1,
      Meta: 35.0,
    },
    {
      kpi: 'MTTR (horas)',
      Antes: 8.5,
      Propuesta: 5.8,
      Meta: 6.5,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Dashboard Top Header */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Módulo 3: Panel de KPIs de Mantenimiento & Calidad
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-mono font-medium">
                Actualización en Vivo
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Evaluación comparativa del impacto operacional (Diagnóstico Inicial vs. Integración Andon + Odoo ERP)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
            <span className="text-slate-400">Órdenes Resueltas:</span>{' '}
            <strong className="text-emerald-400 font-mono text-sm">{resolvedOrders.length}</strong>
          </div>
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
            <span className="text-slate-400">Merma Acumulada:</span>{' '}
            <strong className="text-amber-400 font-mono text-sm">{dynamicKPIs.totalScrapKg} kg</strong>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: OEE */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-lg relative overflow-hidden">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            OEE Global
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {BASELINE_KPIS.oee.proposed}%
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+11.5% vs Inicial</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-800/80 flex justify-between">
            <span>Antes: 62.4%</span>
            <span className="text-cyan-400 font-bold">Meta: 67.6%</span>
          </div>
        </div>

        {/* Card 2: Disponibilidad */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-lg relative overflow-hidden">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Disponibilidad
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {BASELINE_KPIS.availability.proposed}%
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+8.4% vs Inicial</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-800/80 flex justify-between">
            <span>Antes: 81.2%</span>
            <span className="text-cyan-400 font-bold">Meta: 85.0%</span>
          </div>
        </div>

        {/* Card 3: Merma Final */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-lg relative overflow-hidden">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Merma Horneada
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-cyan-400 font-mono">
              {BASELINE_KPIS.scrap.proposed}%
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-cyan-400 font-semibold mt-1">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>-1.88% de merma</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-800/80 flex justify-between">
            <span>Antes: 6.0%</span>
            <span className="text-cyan-400 font-bold">Meta: 3.0%</span>
          </div>
        </div>

        {/* Card 4: Paradas Atascos/Roturas */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-lg relative overflow-hidden">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Paradas por Turno
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amber-400 font-mono">
              {BASELINE_KPIS.downtimePerShift.proposed}
            </span>
            <span className="text-xs text-slate-400">min</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-1">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>-13.9 min/turno</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-800/80 flex justify-between">
            <span>Antes: 45 min</span>
            <span className="text-cyan-400 font-bold">Meta: 35 min</span>
          </div>
        </div>

        {/* Card 5: MTBF */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-lg relative overflow-hidden">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            MTBF (Entre Fallas)
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-purple-400 font-mono">
              {BASELINE_KPIS.mtbf.proposed}
            </span>
            <span className="text-xs text-slate-400">h</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-purple-400 font-semibold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+128 h confiabilidad</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-800/80 flex justify-between">
            <span>Antes: 160 h</span>
            <span className="text-cyan-400 font-bold">Meta: 240 h</span>
          </div>
        </div>

        {/* Card 6: MTTR */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-lg relative overflow-hidden">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            MTTR (Reparación)
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-rose-400 font-mono">
              {dynamicKPIs.mttr.current || BASELINE_KPIS.mttr.proposed}
            </span>
            <span className="text-xs text-slate-400">h</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-1">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>-2.7 h por orden</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-800/80 flex justify-between">
            <span>Antes: 8.5 h</span>
            <span className="text-cyan-400 font-bold">Meta: 6.5 h</span>
          </div>
        </div>
      </div>

      {/* Charts Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Comparative Before vs After Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                Comparativo de Métricas Operacionales
              </h3>
              <p className="text-[11px] text-slate-400">
                Línea Base Inicial vs. Propuesta con Andon + Odoo ERP
              </p>
            </div>
            <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
              Meta OEE: 67.6%
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparativeData} margin={{ top: 20, right: 20, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis
                  dataKey="kpi"
                  stroke="#94a3b8"
                  fontSize={10}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#f8fafc',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Antes" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Diagnóstico Inicial" />
                <Bar dataKey="Propuesta" fill="#10b981" radius={[4, 4, 0, 0]} name="Con Andon + Odoo" />
                <Bar dataKey="Meta" fill="#0284c7" radius={[4, 4, 0, 0]} name="Meta Académica" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Dynamic Pareto Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                Diagrama de Pareto Dinámico de Causas Raíz
              </h3>
              <p className="text-[11px] text-slate-400">
                Frecuencia de fallas y curva acumulada 80-20 (Principio de Pareto)
              </p>
            </div>
            <span className="text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded">
              Regla 80 / 20
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={paretoData} margin={{ top: 20, right: 20, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis
                  dataKey="causa"
                  stroke="#94a3b8"
                  fontSize={9}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={10} label={{ value: 'Frecuencia', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#94a3b8' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={10} domain={[0, 100]} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#f8fafc',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <ReferenceLine yAxisId="right" y={80} stroke="#ef4444" strokeDasharray="3 3" label={{ value: '80% Crítico', position: 'insideTopRight', fill: '#ef4444', fontSize: 10 }} />
                <Bar yAxisId="left" dataKey="frecuencia" fill="#6366f1" radius={[4, 4, 0, 0]} name="Ocurrencias" />
                <Line yAxisId="right" type="monotone" dataKey="porcentajeAcumulado" stroke="#f59e0b" strokeWidth={2.5} name="% Acumulado" dot={{ fill: '#f59e0b', r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Engineering Technical Explanation Callout for Academic Defense */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl text-xs space-y-2">
        <h4 className="font-bold text-slate-200 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          Fundamento Ingenieril de la Integración Andon ➔ Odoo ERP (Fábrica de Galletas María E.I.R.L.)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-300">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="font-bold text-cyan-400 block mb-1">1. Reducción Drástica del MTTR</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              La conexión directa del relé Andon con el módulo de Mantenimiento de Odoo elimina los tiempos muertos de reporte verbal (de <strong>8.5 h a 5.8 h</strong>), disparando la notificación instantánea al técnico especializado.
            </p>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="font-bold text-emerald-400 block mb-1">2. Control y Mitigación de Merma</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              La detención automática de faja ante descalibraciones de espesor (&gt;2.0 mm / &gt;2.4 mm) y tostado evita que la masa defectuosa ingrese al empaque, reduciendo la merma del <strong>6.0% al 4.12%</strong>.
            </p>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="font-bold text-purple-400 block mb-1">3. Trazabilidad y Análisis Pareto</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              La captura obligatoria de causa raíz en el cierre de la orden alimenta automáticamente la matriz de fallas, demostrando que el desgaste de rodamientos y desalineación de rodillos concentran el <strong>80%</strong> de las pérdidas de disponibilidad.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
