import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { PRODUCTS, SCENARIOS, INITIAL_ORDERS, BASELINE_KPIS, ROOT_CAUSES, QUICK_ACTIONS } from '../constants/simulationData';
import { audioService } from '../services/audioService';

const SimulationContext = createContext(null);

export function SimulationProvider({ children }) {
  // Global View & Product State
  const [activeProductId, setActiveProductId] = useState('tradicional');
  const [activeView, setActiveView] = useState('dual'); // 'dual' | 'andon' | 'odoo' | 'kpis'
  const [odooSubModule, setOdooSubModule] = useState('mantenimiento'); // 'mantenimiento' | 'calidad'

  // Andon & Plant State
  const [andonState, setAndonState] = useState('VERDE'); // 'VERDE' | 'AMARILLO' | 'ROJO'
  const [currentScenario, setCurrentScenario] = useState(SCENARIOS[0]);
  const [isBeltRunning, setIsBeltRunning] = useState(true);
  const [isSoundMuted, setIsSoundMuted] = useState(false);

  // Downtime Stopwatch
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const stopwatchIntervalRef = useRef(null);

  // Transmission Bridge Event
  const [transmissionEvent, setTransmissionEvent] = useState(null);

  // Work Orders (Odoo ERP)
  const [workOrders, setWorkOrders] = useState(INITIAL_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Live Sensor Values
  const [sensorValues, setSensorValues] = useState({
    thickness: 1.81,
    colorDelta: 'Óptimo (L*=68.2)',
    ovenTemp: 208.5,
    vibrationRMS: 1.2,
  });

  const activeProduct = PRODUCTS[activeProductId === 'tradicional' ? 'TRADICIONAL' : 'PAE'];

  // Sync Audio Service mute state
  const toggleSound = () => {
    setIsSoundMuted((prev) => {
      const next = !prev;
      audioService.setMuted(next);
      return next;
    });
  };

  // Stopwatch effect for ROJO state
  useEffect(() => {
    if (andonState === 'ROJO') {
      stopwatchIntervalRef.current = setInterval(() => {
        setStopwatchSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (stopwatchIntervalRef.current) {
        clearInterval(stopwatchIntervalRef.current);
        stopwatchIntervalRef.current = null;
      }
    }
    return () => {
      if (stopwatchIntervalRef.current) clearInterval(stopwatchIntervalRef.current);
    };
  }, [andonState]);

  // Live sensor value fluctuations simulation
  useEffect(() => {
    const sensorInterval = setInterval(() => {
      setSensorValues((prev) => {
        if (andonState === 'ROJO') {
          // If stopped due to thickness fault, freeze on high value
          if (currentScenario?.defectType === 'espesor') {
            const highVal = activeProductId === 'tradicional' ? 2.18 : 2.54;
            return {
              ...prev,
              thickness: Number((highVal + (Math.random() * 0.02 - 0.01)).toFixed(2)),
              colorDelta: 'Bloqueado por Parada Relé',
              ovenTemp: 208.0,
              vibrationRMS: 0.1,
            };
          }
          if (currentScenario?.defectType === 'quemado') {
            return {
              ...prev,
              colorDelta: 'Quemado Crítico (L*=36.4)',
              ovenTemp: 236.4,
              vibrationRMS: 0.1,
            };
          }
          if (currentScenario?.defectType === 'vibracion') {
            return {
              ...prev,
              vibrationRMS: 6.8,
            };
          }
          return { ...prev, vibrationRMS: 0.0 };
        }

        if (andonState === 'AMARILLO') {
          return {
            thickness: Number((activeProduct.targetThickness + (Math.random() * 0.08 - 0.04)).toFixed(2)),
            colorDelta: 'Tostado Alto (L*=57.8 - Alerta +4°C)',
            ovenTemp: Number((218.0 + Math.random() * 2.5).toFixed(1)),
            vibrationRMS: 2.1,
          };
        }

        // VERDE (Normal)
        const baseThickness = activeProduct.targetThickness;
        const jitter = (Math.random() * 0.06 - 0.03);
        const normalThickness = Number((baseThickness + jitter).toFixed(2));
        const tempJitter = Number((208.0 + (Math.random() * 2 - 1)).toFixed(1));
        const vibJitter = Number((1.1 + (Math.random() * 0.3 - 0.15)).toFixed(2));

        return {
          thickness: normalThickness,
          colorDelta: 'Óptimo (L*=68.5, E*=1.1)',
          ovenTemp: tempJitter,
          vibrationRMS: vibJitter,
        };
      });
    }, 1500);

    return () => clearInterval(sensorInterval);
  }, [andonState, currentScenario, activeProduct, activeProductId]);

  // Trigger Scenario Handler
  const triggerScenario = (scenario) => {
    setCurrentScenario(scenario);
    setAndonState(scenario.color);

    if (scenario.color === 'ROJO') {
      setIsBeltRunning(false);
      setStopwatchSeconds(0);

      // Play industrial siren
      if (!isSoundMuted) {
        audioService.startAlarm();
      }

      // If scenario requires Odoo Trigger, generate work order automatically
      if (scenario.odooTrigger) {
        const orderIdNumber = workOrders.length + 1;
        const newOrderId = `OT-${String(orderIdNumber).padStart(3, '0')}`;
        const now = new Date();
        const timeStr = now.toLocaleTimeString('es-PE', { hour12: false });
        const dateStr = now.toISOString().split('T')[0];

        const newOrder = {
          id: newOrderId,
          code: scenario.code || 'ALT-01',
          title: scenario.shortTitle,
          equipment: scenario.equipmentName,
          equipmentId: scenario.equipmentId,
          stage: 'nueva', // Land in "Nueva Solicitud"
          priority: 3,
          type: scenario.type,
          subModule: scenario.subModule,
          source: 'Andon Automático (Señal Relé)',
          createdAt: `${dateStr} ${timeStr}`,
          startedAt: null,
          resolvedAt: null,
          downtimeMinutes: 0,
          downtimeFormatted: '0 min',
          rootCause: scenario.suggestedRootCause || 'Masa fuera de parámetro',
          actionExecuted: '',
          scrapKg: scenario.defectType === 'quemado' ? 4.5 : scenario.defectType === 'espesor' ? 2.8 : 0.5,
          operator: 'Asignación Automática Odoo',
          notes: scenario.description,
          productName: activeProduct.name,
        };

        setWorkOrders((prev) => [newOrder, ...prev]);

        // Auto-switch Odoo sub-module if needed so user sees it right away
        if (scenario.subModule) {
          setOdooSubModule(scenario.subModule);
        }

        // Trigger visual transmission banner
        setTransmissionEvent({
          id: Date.now(),
          timestamp: timeStr,
          scenarioTitle: scenario.shortTitle,
          code: scenario.code || 'ALT-01',
          orderId: newOrderId,
          equipment: scenario.equipmentName,
          message: `Señal del Relé Andon (GPIO/OPC-UA) ➔ API Odoo ERP: Orden ${newOrderId} (${scenario.code}) generada automáticamente`,
        });
      }
    } else if (scenario.color === 'AMARILLO') {
      setIsBeltRunning(true);
      audioService.stopAlarm();
      audioService.playWarningBeep();
    } else {
      // VERDE
      setIsBeltRunning(true);
      audioService.stopAlarm();
      setStopwatchSeconds(0);
      audioService.playBeep(520, 'sine', 0.15);
    }
  };

  // Start Attention on Work Order
  const startWorkOrder = (orderId) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-PE', { hour12: false });
    const dateStr = now.toISOString().split('T')[0];

    setWorkOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            stage: 'progreso',
            startedAt: `${dateStr} ${timeStr}`,
            operator: 'Ing. Supervisor / Técnico Mecatrónico',
          };
        }
        return order;
      })
    );
    audioService.playBeep(600, 'triangle', 0.12);
  };

  // Close Work Order & Rearm Andon
  const closeWorkOrder = (orderId, { rootCause, actionExecuted, scrapKg, simulatedMinutes }) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-PE', { hour12: false });
    const dateStr = now.toISOString().split('T')[0];

    // Calculate actual downtime in minutes: either from stopwatch or user simulated override
    const calculatedMinutes = simulatedMinutes !== undefined && simulatedMinutes !== null && simulatedMinutes > 0
      ? Number(simulatedMinutes)
      : Math.max(1, Math.round(stopwatchSeconds / 60));

    const downtimeFormatted = calculatedMinutes >= 60
      ? `${(calculatedMinutes / 60).toFixed(1)} h`
      : `${calculatedMinutes} min`;

    setWorkOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            stage: 'resuelto',
            resolvedAt: `${dateStr} ${timeStr}`,
            rootCause: rootCause || order.rootCause,
            actionExecuted: actionExecuted || (QUICK_ACTIONS[rootCause] || 'Mantenimiento y calibración completada.'),
            scrapKg: Number(scrapKg) || order.scrapKg || 1.2,
            downtimeMinutes: calculatedMinutes,
            downtimeFormatted: downtimeFormatted,
          };
        }
        return order;
      })
    );

    // CRITICAL: Rearm Andon!
    // Turn off siren
    audioService.stopAlarm();
    // Play success chime
    audioService.playSuccessChime();

    // Reset Andon to VERDE and resume belt
    setAndonState('VERDE');
    setIsBeltRunning(true);
    setCurrentScenario(SCENARIOS[0]);
    setStopwatchSeconds(0);

    // Close modal if open
    setSelectedOrderId(null);

    // Show brief rearm notification
    setTransmissionEvent({
      id: Date.now(),
      timestamp: timeStr,
      scenarioTitle: 'Rearme del Sistema Andon',
      code: 'RESET-OK',
      orderId: orderId,
      equipment: 'Línea de Producción Completa',
      message: `Orden ${orderId} cerrada en Odoo ERP ➔ Relé de seguridad liberado: Torre Andon a VERDE y faja reanudada.`,
    });
  };

  // Reset entire simulation
  const resetSimulation = () => {
    audioService.stopAlarm();
    setAndonState('VERDE');
    setCurrentScenario(SCENARIOS[0]);
    setIsBeltRunning(true);
    setStopwatchSeconds(0);
    setWorkOrders(INITIAL_ORDERS);
    setSelectedOrderId(null);
    setTransmissionEvent(null);
    audioService.playBeep(440, 'sine', 0.2);
  };

  // Calculate live dynamic KPIs based on resolved orders
  const dynamicKPIs = useMemo(() => {
    const resolvedOrders = workOrders.filter((o) => o.stage === 'resuelto');
    const totalDowntimeMin = resolvedOrders.reduce((acc, o) => acc + (o.downtimeMinutes || 0), 0);
    const totalScrapKg = resolvedOrders.reduce((acc, o) => acc + (o.scrapKg || 0), 0);

    // Baseline stats
    const base = BASELINE_KPIS;

    // With Andon + Odoo, MTTR drops, availability improves
    // Each resolved order shows efficient MTTR (avg of resolved orders)
    const avgMTTR = resolvedOrders.length > 0
      ? (totalDowntimeMin / (resolvedOrders.length * 60)).toFixed(1)
      : base.mttr.proposed;

    return {
      oee: base.oee,
      availability: base.availability,
      scrap: base.scrap,
      downtimePerShift: base.downtimePerShift,
      mtbf: base.mtbf,
      mttr: {
        ...base.mttr,
        current: Number(avgMTTR),
      },
      resolvedCount: resolvedOrders.length,
      totalDowntimeMin,
      totalScrapKg: totalScrapKg.toFixed(1),
    };
  }, [workOrders]);

  // Pareto data calculated dynamically from root causes of all orders
  const paretoData = useMemo(() => {
    const counts = {};
    ROOT_CAUSES.forEach((rc) => { counts[rc] = 0; });

    // Seed historical distribution for realistic industrial curve
    counts['Desgaste de rodamiento'] = 14;
    counts['Desalineación de rodillos'] = 9;
    counts['Rotura de cadena'] = 6;
    counts['Descalibración térmica del horno'] = 4;
    counts['Masa fuera de parámetro'] = 2;

    // Add in-simulation closed orders
    workOrders.forEach((order) => {
      if (order.rootCause && counts[order.rootCause] !== undefined) {
        counts[order.rootCause] += 1;
      }
    });

    const sortedCauses = Object.entries(counts)
      .map(([cause, freq]) => ({ cause, freq }))
      .sort((a, b) => b.freq - a.freq);

    const totalFreq = sortedCauses.reduce((sum, item) => sum + item.freq, 0);

    let cumulative = 0;
    return sortedCauses.map((item) => {
      cumulative += item.freq;
      const cumulativePercent = Math.round((cumulative / totalFreq) * 100);
      return {
        causa: item.cause,
        frecuencia: item.freq,
        porcentajeAcumulado: cumulativePercent,
        umbral80: 80,
      };
    });
  }, [workOrders]);

  const value = {
    activeProductId,
    setActiveProductId,
    activeProduct,
    activeView,
    setActiveView,
    odooSubModule,
    setOdooSubModule,
    andonState,
    currentScenario,
    isBeltRunning,
    isSoundMuted,
    toggleSound,
    stopwatchSeconds,
    transmissionEvent,
    setTransmissionEvent,
    workOrders,
    selectedOrderId,
    setSelectedOrderId,
    sensorValues,
    triggerScenario,
    startWorkOrder,
    closeWorkOrder,
    resetSimulation,
    dynamicKPIs,
    paretoData,
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}
