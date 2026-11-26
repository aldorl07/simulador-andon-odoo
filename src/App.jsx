import React from 'react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import Header from './components/Header';
import TransmissionBridge from './components/TransmissionBridge';
import AndonSimulator from './components/AndonSimulator/AndonSimulator';
import OdooView from './components/OdooERP/OdooView';
import DashboardKPIs from './components/DashboardKPIs/DashboardKPIs';

function MainContent() {
  const { activeView } = useSimulation();

  return (
    <main className="max-w-[1920px] mx-auto p-3 sm:p-4 md:p-5 flex-1 w-full">
      {/* VISTA DUAL (Recomendada para exposición): 50% Andon / 50% Odoo */}
      {activeView === 'dual' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
          <div className="w-full">
            <AndonSimulator />
          </div>
          <div className="w-full">
            <OdooView />
          </div>
        </div>
      )}

      {/* SOLO PLANTA (ANDON) */}
      {activeView === 'andon' && (
        <div className="max-w-6xl mx-auto">
          <AndonSimulator />
        </div>
      )}

      {/* SOLO ODOO ERP */}
      {activeView === 'odoo' && (
        <div className="max-w-7xl mx-auto">
          <OdooView />
        </div>
      )}

      {/* DASHBOARD KPIS */}
      {activeView === 'kpis' && (
        <div className="max-w-7xl mx-auto">
          <DashboardKPIs />
        </div>
      )}
    </main>
  );
}

export default function App() {
  return (
    <SimulationProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
        <Header />
        <TransmissionBridge />
        <MainContent />
      </div>
    </SimulationProvider>
  );
}
