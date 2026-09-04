import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/ui/GlassCard';
import { PillButton } from '../components/ui/PillButton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle,
  Truck,
  Database,
  Search,
  Zap,
  Filter,
  X,
  Compass,
  Thermometer,
  ShieldAlert,
  Calendar,
  CloudLightning,
  Coins,
  Loader2,
  SlidersHorizontal,
  DollarSign,
  RotateCcw
} from 'lucide-react';

interface Shipment {
  id: string;
  partner: string;
  partnerLogo: string;
  origin: string;
  destination: string;
  carrier: string;
  status: 'In Transit' | 'Delayed' | 'Delivered' | 'Action Required';
  eta: string;
  dateStr: string;
  confidence: number;
  value: string;
  valueNumeric: number;
  carbonKg: number;
  temperature: number;
  chargebackRisk: 'None' | 'Low' | 'Medium' | 'High';
  routeEfficiency: number;
}

const initialShipments: Shipment[] = [
  {
    id: 'SH-4821-TG',
    partner: 'Target Corp',
    partnerLogo: 'TG',
    origin: 'Los Angeles Port',
    destination: 'Dallas Inland Hub',
    carrier: 'Union Pacific Rail',
    status: 'Action Required',
    eta: 'May 28, 09:15',
    dateStr: '2026-05-28',
    confidence: 64,
    value: '$285,000',
    valueNumeric: 285000,
    carbonKg: 1840,
    temperature: 21.2,
    chargebackRisk: 'High',
    routeEfficiency: 72
  },
  {
    id: 'SH-9840-WM',
    partner: 'Walmart Inc',
    partnerLogo: 'WM',
    origin: 'Memphis Region Center',
    destination: 'Atlanta Fulfillment',
    carrier: 'FedEx Freight Ground',
    status: 'In Transit',
    eta: 'May 26, 14:30',
    dateStr: '2026-05-26',
    confidence: 97,
    value: '$124,500',
    valueNumeric: 124500,
    carbonKg: 420,
    temperature: 18.5,
    chargebackRisk: 'Low',
    routeEfficiency: 94
  },
  {
    id: 'SH-7123-AZ',
    partner: 'Amazon Web Retail',
    partnerLogo: 'AZ',
    origin: 'Seattle SODO Terminal',
    destination: 'Chicago O\'Hare Hub',
    carrier: 'Prime Air Cargo',
    status: 'Delayed',
    eta: 'May 25, 22:45',
    dateStr: '2026-05-25',
    confidence: 81,
    value: '$98,000',
    valueNumeric: 98000,
    carbonKg: 1210,
    temperature: 4.2,
    chargebackRisk: 'Medium',
    routeEfficiency: 82
  },
  {
    id: 'SH-2291-HD',
    partner: 'Home Depot Logistics',
    partnerLogo: 'HD',
    origin: 'Atlanta Rail Yard',
    destination: 'Houston Distribution',
    carrier: 'CSX Rail Link',
    status: 'In Transit',
    eta: 'May 27, 11:00',
    dateStr: '2026-05-27',
    confidence: 91,
    value: '$165,000',
    valueNumeric: 165000,
    carbonKg: 680,
    temperature: 24.0,
    chargebackRisk: 'None',
    routeEfficiency: 88
  },
  {
    id: 'SH-3101-WF',
    partner: 'Whole Foods Inc',
    partnerLogo: 'WF',
    origin: 'Napa Cold Logistics',
    destination: 'Seattle Prime Hub',
    carrier: 'Lineage Cold Chain',
    status: 'Delivered',
    eta: 'May 24, 08:00',
    dateStr: '2026-05-24',
    confidence: 100,
    value: '$72,000',
    valueNumeric: 72000,
    carbonKg: 310,
    temperature: 3.4,
    chargebackRisk: 'None',
    routeEfficiency: 98
  }
];

const deviationChartData = [
  { name: 'Union Pacific', 'Actual Days': 4.2, 'Optimized Days': 3.1, 'Savings ($)': 1420 },
  { name: 'FedEx Freight', 'Actual Days': 1.8, 'Optimized Days': 1.5, 'Savings ($)': 580 },
  { name: 'Prime Air', 'Actual Days': 0.9, 'Optimized Days': 0.8, 'Savings ($)': 920 },
  { name: 'CSX Rail', 'Actual Days': 3.5, 'Optimized Days': 2.9, 'Savings ($)': 1100 },
  { name: 'Lineage Cold', 'Actual Days': 2.1, 'Optimized Days': 2.0, 'Savings ($)': 210 }
];

export const LogisticsPage = () => {
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [search, setSearch] = useState('');
  const [partnerFilter, setPartnerFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Advanced filters state
  const [minValFilter, setMinValFilter] = useState<number>(0);
  const [maxValFilter, setMaxValFilter] = useState<number>(300000);
  const [startDateFilter, setStartDateFilter] = useState<string>('');
  const [endDateFilter, setEndDateFilter] = useState<string>('');
  const [selectedCarriers, setSelectedCarriers] = useState<string[]>([]);

  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [disputeTriggered, setDisputeTriggered] = useState<Record<string, 'idle' | 'submitting' | 'success'>>({});

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await fetch('/api/shipments');
        if (response.ok) {
          const data = await response.json();
          setShipments(data);
        }
      } catch (err) {
        console.error('Error fetching shipments:', err);
      }
    };
    fetchShipments();
  }, []);

  const handleTriggerDispute = (shipmentId: string) => {
    setDisputeTriggered(prev => ({ ...prev, [shipmentId]: 'submitting' }));
    
    setTimeout(async () => {
      try {
        const response = await fetch(`/api/shipments/${shipmentId}/dispute`, {
          method: 'POST'
        });
        if (!response.ok) throw new Error('Dispute failed server validation');
        const resData = await response.json();
        
        setDisputeTriggered(prev => ({ ...prev, [shipmentId]: 'success' }));
        setShipments(resData.shipments);
        
        setSelectedShipment(prev => {
          if (prev && prev.id === shipmentId) {
            return { ...prev, chargebackRisk: 'None', status: 'In Transit', confidence: 92 };
          }
          return prev;
        });
      } catch (err) {
        console.error(err);
        setDisputeTriggered(prev => ({ ...prev, [shipmentId]: 'idle' }));
        alert('Internal server authentication error executing cargo dispute.');
      }
    }, 1200);
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = 
      shipment.id.toLowerCase().includes(search.toLowerCase()) ||
      shipment.partner.toLowerCase().includes(search.toLowerCase()) ||
      shipment.carrier.toLowerCase().includes(search.toLowerCase());

    const matchesPartner = partnerFilter === 'All' || shipment.partner.includes(partnerFilter);
    const matchesStatus = statusFilter === 'All' || shipment.status === statusFilter;

    // Advanced Filters matching
    const matchesValue = shipment.valueNumeric >= minValFilter && shipment.valueNumeric <= maxValFilter;
    
    let matchesDate = true;
    if (startDateFilter) {
      matchesDate = matchesDate && (shipment.dateStr >= startDateFilter);
    }
    if (endDateFilter) {
      matchesDate = matchesDate && (shipment.dateStr <= endDateFilter);
    }

    const matchesCarrier = selectedCarriers.length === 0 || selectedCarriers.includes(shipment.carrier);

    return matchesSearch && matchesPartner && matchesStatus && matchesValue && matchesDate && matchesCarrier;
  });

  const getStatusStyle = (status: Shipment['status']) => {
    switch (status) {
      case 'In Transit':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Delayed':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Action Required':
        return 'bg-primary/10 text-primary border-primary/20 animate-pulse';
      case 'Delivered':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  const getRiskStyle = (risk: Shipment['chargebackRisk']) => {
    switch (risk) {
      case 'None':
        return 'text-emerald-400';
      case 'Low':
        return 'text-blue-400';
      case 'Medium':
        return 'text-amber-400';
      case 'High':
        return 'text-primary uppercase font-bold text-glow';
    }
  };

  const totalRevenue = shipments.reduce((sum, s) => sum + s.valueNumeric, 0);
  const avgEfficiencyVal = shipments.length > 0
    ? (shipments.reduce((sum, s) => sum + s.routeEfficiency, 0) / shipments.length).toFixed(1)
    : '0';
  const disputeSavingsSum = shipments.reduce((sum, s) => {
    if (s.id === 'SH-4821-TG' && s.chargebackRisk === 'None') {
      return sum + 18400; // Target saved leakage
    }
    return sum;
  }, 0);
  const totalCarbon = shipments.reduce((sum, s) => sum + s.carbonKg, 0);

  const statistics = {
    totalRevenueTracked: `$${totalRevenue.toLocaleString()}`,
    avgEfficiency: `${avgEfficiencyVal}%`,
    disputedSavings: `$${disputeSavingsSum.toLocaleString()}`,
    avoidedCarbon: `${totalCarbon.toLocaleString()} kg`
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto grid grid-cols-12 gap-6">
      {/* KPI Controls Header Block - Visualized in Bento Architecture */}
      <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
        <GlassCard className="p-5 flex flex-col justify-between" variant="dark">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-on-surface/40 font-bold font-mono">Managed Freight Value</p>
            <p className="text-3xl font-display font-bold mt-2">{statistics.totalRevenueTracked}</p>
          </div>
          <p className="text-[10px] text-emerald-400 font-mono mt-3 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +14.8% Active Capacity
          </p>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col justify-between" variant="dark">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-on-surface/40 font-bold font-mono">Route Efficiency AI</p>
            <p className="text-3xl font-display font-bold mt-2">{statistics.avgEfficiency}</p>
          </div>
          <p className="text-[10px] text-primary font-mono mt-3 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" /> Optimized by Rentener V2
          </p>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col justify-between border-primary/20" variant="dark">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-primary font-bold font-mono">chargeback leakage saved</p>
            <p className="text-3xl font-display font-medium text-primary text-glow mt-2">{statistics.disputedSavings}</p>
          </div>
          <p className="text-[10px] text-white/50 font-mono mt-3 flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-primary" /> Auto-dispute engine live
          </p>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col justify-between" variant="dark">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-on-surface/40 font-bold font-mono">Avoided CO₂ Equivalent</p>
            <p className="text-3xl font-display font-bold mt-2">{statistics.avoidedCarbon}</p>
          </div>
          <p className="text-[10px] text-emerald-400 font-mono mt-3 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> High Eco-Performance
          </p>
        </GlassCard>
      </div>

      {/* Control Tower Side Bar: Predict Alerts & disputes */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <GlassCard className="p-6 border-primary/20 relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent">
          <div className="absolute top-0 right-0 p-3 text-[9px] font-mono uppercase bg-primary text-white rounded-bl-xl font-bold">
            CRITICAL INSIGHT
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-display font-bold tracking-tight">PREDICTIVE ACTION CENTRE</h3>
          </div>

          <p className="text-xs text-on-surface/70 leading-relaxed mb-6">
            Rentener Logistics Telemetry has flagged a high probability late-arrival fine for cargo with Target Corp. Action is required to avoid penalty charges.
          </p>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-3 mb-6 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-on-surface/40">Shipment ID:</span>
              <span className="font-bold text-on-surface">SH-4821-TG</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface/40">Expected Fine:</span>
              <span className="font-bold text-primary">$8,450.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface/40">Rule Violated:</span>
              <span className="text-right text-on-surface/80">OTIF (On-Time In-Full) 3hr delay</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-white/5">
              <span className="text-on-surface/40">AI Resolution:</span>
              <span className="text-emerald-400 font-bold">Force Majeure Waiver Ready</span>
            </div>
          </div>

          {disputeTriggered['SH-4821-TG'] === 'success' ? (
            <div className="w-full py-3.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <CheckCircle className="w-4 h-4" /> DISPUTE PROTOCOL ENGAGED
            </div>
          ) : (
            <PillButton 
              variant="primary" 
              className="w-full py-3.5 justify-center font-bold relative overflow-hidden group shadow-[0_0_25px_rgba(255,0,0,0.3)]"
              disabled={disputeTriggered['SH-4821-TG'] === 'submitting'}
              onClick={() => handleTriggerDispute('SH-4821-TG')}
            >
              {disputeTriggered['SH-4821-TG'] === 'submitting' ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-white" /> SUBMITTING WAIVER REPORT...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-white fill-white animate-pulse" /> AUTOMATE DISPUTE WAIVER
                </span>
              )}
            </PillButton>
          )}
        </GlassCard>

        {/* Advanced Filters Card */}
        <GlassCard className="p-6 border-white/10 relative overflow-hidden bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-display font-bold uppercase tracking-wider">Advanced Audit Controls</h3>
            </div>
            {/* Quick reset button */}
            {(minValFilter > 0 || maxValFilter < 300000 || startDateFilter || endDateFilter || selectedCarriers.length > 0) && (
              <button
                onClick={() => {
                  setMinValFilter(0);
                  setMaxValFilter(300000);
                  setStartDateFilter('');
                  setEndDateFilter('');
                  setSelectedCarriers([]);
                }}
                className="flex items-center gap-1 text-[9px] uppercase font-mono font-bold text-primary hover:text-primary/80 transition-colors bg-primary/10 border border-primary/20 rounded-full px-2.5 py-0.5 cursor-pointer"
                title="Reset Advanced Filters"
              >
                <RotateCcw className="w-2.5 h-2.5 animate-spin-slow" /> Reset
              </button>
            )}
          </div>

          <div className="space-y-5">
            {/* 1. Value Threshold filters */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface/40 font-mono">Freight Value Range</span>
                <span className="text-[10px] font-mono text-primary font-bold">
                  ${(minValFilter / 1000).toFixed(0)}k - ${(maxValFilter / 1000).toFixed(0)}k
                </span>
              </div>
              <div className="space-y-2.5">
                <div className="relative">
                  <label htmlFor="min-val-slider" className="sr-only">Minimum freight value filter</label>
                  <input
                    id="min-val-slider"
                    type="range"
                    min="0"
                    max="300000"
                    step="5000"
                    value={minValFilter}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= maxValFilter) setMinValFilter(val);
                    }}
                    className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
                  />
                  <div className="flex justify-between text-[8px] font-mono text-on-surface/30 mt-0.5">
                    <span>Min Threshold: ${minValFilter.toLocaleString()}</span>
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="max-val-slider" className="sr-only">Maximum freight value filter</label>
                  <input
                    id="max-val-slider"
                    type="range"
                    min="0"
                    max="300000"
                    step="5000"
                    value={maxValFilter}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= minValFilter) setMaxValFilter(val);
                    }}
                    className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
                  />
                  <div className="flex justify-between text-[8px] font-mono text-on-surface/30 mt-0.5">
                    <span>Max Threshold: ${maxValFilter.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Specific Carrier filters */}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface/40 font-mono block mb-2.5">
                Carrier Distribution
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Union Pacific Rail', short: 'Union Pacific' },
                  { label: 'FedEx Freight Ground', short: 'FedEx Freight' },
                  { label: 'Prime Air Cargo', short: 'Prime Air' },
                  { label: 'CSX Rail Link', short: 'CSX Rail' },
                  { label: 'Lineage Cold Chain', short: 'Lineage Cold' }
                ].map((carrier) => {
                  const isSelected = selectedCarriers.includes(carrier.label);
                  return (
                    <button
                      key={carrier.label}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedCarriers(selectedCarriers.filter(c => c !== carrier.label));
                        } else {
                          setSelectedCarriers([...selectedCarriers, carrier.label]);
                        }
                      }}
                      className={`text-[9px] font-mono font-bold uppercase py-1.5 px-3 rounded-xl border transition-all duration-300 flex items-center gap-1 cursor-pointer ${
                        isSelected 
                          ? 'bg-primary/10 border-primary text-primary shadow-[0_0_10px_rgba(255,0,0,0.15)]' 
                          : 'bg-white/[0.02] border-white/5 text-on-surface/50 hover:bg-white/[0.04] hover:text-on-surface'
                      }`}
                    >
                      <Truck className={`w-2.5 h-2.5 ${isSelected ? 'text-primary' : 'text-on-surface/30'}`} />
                      {carrier.short}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Date Range (ETA) interval */}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface/40 font-mono block mb-2">
                ETA Interval (May 2026)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="start-date-input" className="text-[8px] font-mono uppercase text-on-surface/30 block mb-1">Start Date</label>
                  <div className="relative">
                    <input
                      id="start-date-input"
                      type="date"
                      min="2026-05-01"
                      max="2026-05-31"
                      value={startDateFilter}
                      onChange={(e) => setStartDateFilter(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/5 hover:border-white/10 rounded-xl py-2 px-3 text-[10px] text-on-surface focus:outline-none focus:border-primary/50 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="end-date-input" className="text-[8px] font-mono uppercase text-on-surface/30 block mb-1">End Date</label>
                  <div className="relative">
                    <input
                      id="end-date-input"
                      type="date"
                      min="2026-05-01"
                      max="2026-05-31"
                      value={endDateFilter}
                      onChange={(e) => setEndDateFilter(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/5 hover:border-white/10 rounded-xl py-2 px-3 text-[10px] text-on-surface focus:outline-none focus:border-primary/50 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Active filters count / stats feedback */}
            <div className="pt-3.5 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-on-surface/40 uppercase">
              <span>Matching Shipments:</span>
              <span className="font-bold text-on-surface">
                {filteredShipments.length} / {shipments.length} LOADS
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Carrier Performance Deviances Chart */}
        <GlassCard className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-display font-medium uppercase tracking-wider">Transit Time Loss vs. AI Path</h3>
            <Database className="w-4 h-4 text-on-surface/30" />
          </div>

          <div className="h-[210px] w-full font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deviationChartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0a0a0a', 
                    borderRadius: '12px', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }} 
                  itemStyle={{ color: '#ff0000' }}
                />
                <Bar dataKey="Actual Days" fill="rgba(255,255,255,0.15)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Optimized Days" fill="#ff0000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <p className="text-[10px] text-on-surface/40 mt-3 font-mono leading-tight uppercase text-center">
            Red represents Rentener recommended multimodal adjustments
          </p>
        </GlassCard>
      </div>

      {/* Main Intelligent Shipment Ledger */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
        <GlassCard className="p-8">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
            <div>
              <h3 className="text-xl font-display font-semibold">Active Supply Chain Ledger</h3>
              <p className="text-xs text-on-surface/40 font-mono mt-1 uppercase">Predictive tracking, delay avoidance, and invoice validation</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] uppercase font-bold text-on-surface/60 font-mono">5 ACTIVE LOADS</span>
            </div>
          </div>

          {/* Search and Filters grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6">
            <div className="relative md:col-span-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/40" />
              <input
                type="text"
                placeholder="Search by Shipment ID, partner, carrier..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-3.5 pl-12 pr-6 text-xs focus:outline-none focus:border-primary/50 transition-all font-sans placeholder:text-on-surface/30 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="relative md:col-span-3">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface/40" />
              <select
                value={partnerFilter}
                onChange={(e) => setPartnerFilter(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-full py-3 pl-10 pr-6 text-xs text-on-surface/70 focus:outline-none focus:border-primary/50 appearance-none font-sans"
              >
                <option value="All">All Partners</option>
                <option value="Target">Target Corp</option>
                <option value="Walmart">Walmart Inc</option>
                <option value="Amazon">Amazon Web</option>
                <option value="Home Depot">Home Depot</option>
                <option value="Whole Foods">Whole Foods</option>
              </select>
            </div>

            <div className="relative md:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-full py-3 pl-6 pr-6 text-xs text-on-surface/70 focus:outline-none focus:border-primary/50 appearance-none font-sans"
              >
                <option value="All">All Statuses</option>
                <option value="In Transit">In Transit</option>
                <option value="Delayed">Delayed</option>
                <option value="Action Required">Action Required</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans">
              <thead>
                <tr className="border-b border-white/10 text-[9px] uppercase tracking-wider text-on-surface/40 font-bold font-mono">
                  <th className="pb-4">Cargo / ID</th>
                  <th className="pb-4">Origin / Destination</th>
                  <th className="pb-4">Confidence Alert</th>
                  <th className="pb-4 text-center">Audit Risk</th>
                  <th className="pb-4 text-right">Freight Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredShipments.length > 0 ? (
                  filteredShipments.map((shipment) => (
                    <tr 
                      key={shipment.id}
                      onClick={() => setSelectedShipment(shipment)}
                      className="group hover:bg-white/[0.02] cursor-pointer transition-colors"
                    >
                      <td className="py-5 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold tracking-tight text-glow text-[11px] group-hover:border-primary/30 transition-colors">
                            {shipment.partnerLogo}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                                {shipment.id}
                              </span>
                              <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full border ${getStatusStyle(shipment.status)}`}>
                                {shipment.status}
                              </span>
                            </div>
                            <p className="text-xs text-on-surface/40 mt-1">{shipment.partner}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-5 max-w-[180px] truncate">
                        <p className="font-medium text-xs text-on-surface/80">{shipment.destination}</p>
                        <p className="text-[10px] text-on-surface/40 mt-1 flex items-center gap-1">
                          <Truck className="w-3 h-3 text-on-surface/30" /> {shipment.carrier}
                        </p>
                      </td>

                      <td className="py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-white/5 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${shipment.confidence > 90 ? 'bg-emerald-500' : shipment.confidence > 80 ? 'bg-amber-500' : 'bg-primary'}`}
                              style={{ width: `${shipment.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono font-bold">{shipment.confidence}%</span>
                        </div>
                        <p className="text-[9px] text-on-surface/30 font-mono uppercase mt-1">ETA: {shipment.eta}</p>
                      </td>

                      <td className="py-5 text-center font-mono">
                        <span className={`text-xs ${getRiskStyle(shipment.chargebackRisk)}`}>
                          {shipment.chargebackRisk}
                        </span>
                        <p className="text-[9px] text-on-surface/30 uppercase mt-1">Rentener AI Score</p>
                      </td>

                      <td className="py-5 text-right font-mono">
                        <p className="font-bold text-on-surface">{shipment.value}</p>
                        <p className="text-[9px] text-emerald-400 font-bold mt-1 flex items-center justify-end gap-0.5">
                          {shipment.routeEfficiency}% Optimal
                        </p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-sm text-on-surface/30">
                      No logistics shipments found matching search conditions.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      {/* Shipment Modal Detail View */}
      <AnimatePresence>
        {selectedShipment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedShipment(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
              className="relative w-full max-w-2xl glass-dark rounded-[1.5rem] border border-white/10 p-8 overflow-hidden bg-zinc-950/95 shadow-[0_0_50px_rgba(255,0,0,0.15)] z-10"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent" />

              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center font-bold text-lg ring-1 ring-white/10">
                    {selectedShipment.partnerLogo}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-display font-medium leading-none">{selectedShipment.id}</h2>
                      <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border ${getStatusStyle(selectedShipment.status)}`}>
                        {selectedShipment.status}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface/40 mt-1 uppercase tracking-wider font-mono">{selectedShipment.partner}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedShipment(null)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-on-surface/60 hover:text-on-surface transition-colors cursor-pointer border border-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Dynamic Map Router Tracker Visual */}
              <div className="mb-6">
                <p className="text-[10px] uppercase font-mono tracking-widest text-on-surface/40 font-bold mb-3">
                  Autonomous Transit Route Track & Telemetry Vector Map
                </p>
                
                {/* Visual Map Component */}
                <div className="bg-zinc-950 border border-white/10 rounded-2xl p-4 overflow-hidden relative shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                  {/* Grid overlay for radar effect */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
                  
                  {/* Top Bar with real-time tracking telemetry metrics */}
                  <div className="relative z-10 flex justify-between items-center text-[9px] font-mono text-on-surface/50 border-b border-white/5 pb-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                      <span className="font-bold tracking-wider uppercase text-primary">GPS FEED ACTIVE</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>LOCK: SATELLITE R-309</span>
                      <span>LAT: {((selectedShipment.temperature * 1.83 + 30)).toFixed(4)}° N</span>
                      <span>LONG: {-((selectedShipment.confidence * 0.75 + 75)).toFixed(4)}° W</span>
                    </div>
                  </div>

                  {/* SVG Map Canvas */}
                  <div className="w-full h-[180px] relative">
                    <svg viewBox="0 0 500 220" className="w-full h-full select-none">
                      {/* Background Faint US Topography & Major Supply Hub Connections */}
                      <g className="opacity-15">
                        {/* Major grid references / terminal lines */}
                        <line x1="50" y1="0" x2="50" y2="220" stroke="rgba(255,255,255,0.2)" strokeDasharray="2 4" />
                        <line x1="150" y1="0" x2="150" y2="220" stroke="rgba(255,255,255,0.2)" strokeDasharray="2 4" />
                        <line x1="250" y1="0" x2="250" y2="220" stroke="rgba(255,255,255,0.2)" strokeDasharray="2 4" />
                        <line x1="350" y1="0" x2="350" y2="220" stroke="rgba(255,255,255,0.2)" strokeDasharray="2 4" />
                        <line x1="450" y1="0" x2="450" y2="220" stroke="rgba(255,255,255,0.2)" strokeDasharray="2 4" />
                        
                        <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(255,255,255,0.2)" strokeDasharray="2 4" />
                        <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.2)" strokeDasharray="2 4" />
                        <line x1="0" y1="180" x2="500" y2="180" stroke="rgba(255,255,255,0.2)" strokeDasharray="2 4" />

                        {/* Stylized background outline nodes */}
                        <circle cx="60" cy="40" r="2" fill="white" />
                        <circle cx="50" cy="100" r="2" fill="white" />
                        <circle cx="70" cy="155" r="2" fill="white" />
                        <circle cx="235" cy="165" r="2" fill="white" />
                        <circle cx="290" cy="135" r="2" fill="white" />
                        <circle cx="320" cy="90" r="2" fill="white" />
                        <circle cx="360" cy="145" r="2" fill="white" />
                        <circle cx="240" cy="195" r="2" fill="white" />

                        {/* Abstract faint flow lines */}
                        <path d="M 60,40 Q 150,55 320,90" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />
                        <path d="M 70,155 Q 160,160 235,165" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />
                        <path d="M 235,165 Q 290,150 360,145" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />
                      </g>

                      {/* Precise Active Route Logic */}
                      {(() => {
                        const getCoords = (name: string) => {
                          const norm = name.toLowerCase();
                          if (norm.includes('los angeles')) return { x: 70, y: 155, label: 'LAX' };
                          if (norm.includes('dallas')) return { x: 235, y: 165, label: 'DFW' };
                          if (norm.includes('memphis')) return { x: 290, y: 135, label: 'MEM' };
                          if (norm.includes('atlanta')) return { x: 360, y: 145, label: 'ATL' };
                          if (norm.includes('seattle')) return { x: 60, y: 40, label: 'SEA' };
                          if (norm.includes('chicago')) return { x: 320, y: 90, label: 'ORD' };
                          if (norm.includes('houston')) return { x: 240, y: 195, label: 'IAH' };
                          if (norm.includes('napa')) return { x: 50, y: 100, label: 'APC' };
                          return { x: 250, y: 110, label: 'HUB' };
                        };

                        const start = getCoords(selectedShipment.origin);
                        const end = getCoords(selectedShipment.destination);

                        // Calculate curved midpoint control coordinates for organic arc paths
                        const midX = (start.x + end.x) / 2;
                        const midY = (start.y + end.y) / 2 - Math.abs(start.x - end.x) * 0.15;
                        const pathD = `M ${start.x},${start.y} Q ${midX},${midY} ${end.x},${end.y}`;

                        // Determine the current interpolation factor based on confidence (simulates progress)
                        const ratio = selectedShipment.confidence / 100;
                        const currentX = start.x + (end.x - start.x) * ratio;
                        const currentY = start.y + (end.y - start.y) * ratio - Math.sin(Math.PI * ratio) * (Math.abs(start.x - end.x) * 0.15);

                        return (
                          <>
                            {/* Inactive general radar sweep overlay effect */}
                            <circle cx="250" cy="110" r="140" fill="none" stroke="rgba(255, 0, 0, 0.02)" strokeWidth="1" />
                            <circle cx="250" cy="110" r="80" fill="none" stroke="rgba(255, 0, 0, 0.02)" strokeWidth="1" />
                            
                            {/* Main Active Route Line (Glowing red path) */}
                            <path 
                              d={pathD} 
                              fill="none" 
                              stroke="rgba(255,0,0,0.15)" 
                              strokeWidth="3.5" 
                              strokeLinecap="round" 
                            />
                            <motion.path 
                              d={pathD} 
                              fill="none" 
                              stroke="#ff0000" 
                              strokeWidth="1.5" 
                              strokeLinecap="round" 
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                            
                            {/* Flow indicator animated dots */}
                            <motion.path
                              d={pathD}
                              fill="none"
                              stroke="rgba(255, 255, 255, 0.6)"
                              strokeWidth="2"
                              strokeDasharray="4 20"
                              strokeLinecap="round"
                              animate={{ strokeDashoffset: -40 }}
                              transition={{ repeat: Infinity, ease: "linear", duration: 2.2 }}
                            />

                            {/* Origin Node Icon and Label */}
                            <g transform={`translate(${start.x}, ${start.y})`}>
                              {/* Pulse wave behind node */}
                              <circle cx="0" cy="0" r="8" fill="rgba(255, 255, 255, 0.15)" className="animate-ping" style={{ animationDuration: '3s' }} />
                              <circle cx="0" cy="0" r="4.5" fill="#1e1b4b" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
                              <circle cx="0" cy="0" r="2" fill="white" />
                              <text 
                                x="8" 
                                y="3" 
                                fill="rgba(255,255,255,0.8)" 
                                fontSize="7" 
                                fontFamily="monospace" 
                                fontWeight="bold"
                                className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                              >
                                {start.label}
                              </text>
                            </g>

                            {/* Destination Node Icon and Label */}
                            <g transform={`translate(${end.x}, ${end.y})`}>
                              <circle cx="0" cy="0" r="8" fill="rgba(255, 0, 0, 0.15)" className="animate-ping" style={{ animationDuration: '2.5s' }} />
                              <circle cx="0" cy="0" r="4.5" fill="#1e1b4b" stroke="#ff0000" strokeWidth="1.5" />
                              <circle cx="0" cy="0" r="2" fill="#ff0000" />
                              <text 
                                x="8" 
                                y="3" 
                                fill="#ff0000" 
                                fontSize="7" 
                                fontFamily="monospace" 
                                fontWeight="bold"
                                className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                              >
                                {end.label}
                              </text>
                            </g>

                            {/* Live Moving Carrier Coordinates Marker (Vehicle indicator) */}
                            <motion.g 
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5 }}
                              transform={`translate(${currentX}, ${currentY})`}
                            >
                              {/* Glowing signal ripple */}
                              <circle cx="0" cy="0" r="14" fill="none" stroke="#ff0000" strokeWidth="0.75" className="animate-ping animate-duration-1000" style={{ animationDuration: '1.5s' }} />
                              
                              {/* Active container vehicle locator */}
                              <rect x="-5" y="-5" width="10" height="10" rx="2.5" fill="#ff0000" className="shadow-[0_0_10px_#ff0000]" />
                              
                              <Truck className="w-2.5 h-2.5 text-white absolute -translate-x-1.25 -translate-y-1.25" style={{ transform: 'translate(-5px, -5px)', width: '10px', height: '10px' }} />
                              
                              {/* Label hover for asset tracking indicator */}
                              <g transform="translate(0, -12)">
                                <rect x="-24" y="-7" width="48" height="11" rx="2" fill="rgba(10,10,10,0.95)" stroke="rgba(255,0,0,0.3)" strokeWidth="0.5" />
                                <text x="0" y="1" textAnchor="middle" fill="#ff0000" fontSize="6" fontFamily="monospace" fontWeight="bold">
                                  {selectedShipment.id.split('-')[1]} • ON-WAY
                                </text>
                              </g>
                            </motion.g>
                          </>
                        );
                      })()}
                    </svg>
                  </div>

                  {/* Bottom legend with progress information */}
                  <div className="mt-3 flex flex-wrap justify-between items-center text-[10px] font-mono border-t border-white/5 pt-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white border border-black" />
                        <span className="text-on-surface/40">ORIGIN:</span>
                        <span className="text-on-surface/80 truncate max-w-[110px]">{selectedShipment.origin}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-on-surface/40">DEST:</span>
                        <span className="text-on-surface/80 truncate max-w-[110px]">{selectedShipment.destination}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1 sm:mt-0">
                      <span className="text-on-surface/40">EST. DISTANCE REACHED:</span>
                      <span className="text-primary font-bold">{selectedShipment.confidence}% CARGO METRIC LOCK</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Cargo Health Stats (IoT Environment logs) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="text-[9px] uppercase tracking-widest text-on-surface/40 font-bold font-mono">Cargo Temp Sensor</p>
                  <p className="text-base font-mono font-bold mt-1 flex items-center gap-1">
                    <Thermometer className="w-4 h-4 text-primary" /> {selectedShipment.temperature}°C
                  </p>
                  <p className="text-[9px] text-emerald-400 mt-1 uppercase font-mono">optimal zone</p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="text-[9px] uppercase tracking-widest text-on-surface/40 font-bold font-mono">Carbon CO₂ Load</p>
                  <p className="text-base font-mono font-bold mt-1 text-on-surface">
                    {selectedShipment.carbonKg} kg
                  </p>
                  <p className="text-[9px] text-primary mt-1 uppercase font-mono">offsets pending</p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="text-[9px] uppercase tracking-widest text-on-surface/40 font-bold font-mono">Chargeback Risk</p>
                  <p className={`text-base font-mono font-bold mt-1 ${getRiskStyle(selectedShipment.chargebackRisk)}`}>
                    {selectedShipment.chargebackRisk}
                  </p>
                  <p className="text-[9px] text-on-surface/30 mt-1 uppercase font-mono">rule audit status</p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="text-[9px] uppercase tracking-widest text-on-surface/40 font-bold font-mono">Fulfillment Index</p>
                  <p className="text-base font-mono font-bold mt-1 text-emerald-400">
                    {selectedShipment.routeEfficiency}%
                  </p>
                  <p className="text-[9px] text-emerald-400 mt-1 uppercase font-mono">Optimal Route</p>
                </div>
              </div>

              {/* Dispute Control / Multimodal Dispatch Actions */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                {selectedShipment.chargebackRisk === 'High' || selectedShipment.chargebackRisk === 'Medium' ? (
                  disputeTriggered[selectedShipment.id] === 'success' ? (
                    <div className="flex-1 py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider font-mono">
                      <CheckCircle className="w-4 h-4" /> AUTONOMOUS DISPUTE PROTOCOL ACQUIRED
                    </div>
                  ) : (
                    <PillButton
                      variant="primary"
                      className="flex-1 justify-center py-3 text-xs font-bold"
                      disabled={disputeTriggered[selectedShipment.id] === 'submitting'}
                      onClick={() => handleTriggerDispute(selectedShipment.id)}
                    >
                      {disputeTriggered[selectedShipment.id] === 'submitting' ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" /> ENGAGING INTEL PROTOCOLS...
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <ShieldAlert className="w-4 h-4" /> SOLVE POTENTIAL DISPUTE WAIVER
                        </span>
                      )}
                    </PillButton>
                  )
                ) : (
                  <div className="flex-1 py-3 bg-white/5 text-on-surface/40 border border-white/5 rounded-full flex items-center justify-center text-xs font-bold uppercase tracking-wider font-mono">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mr-2" /> AUDIT COMPLIANCE STANDARDS VERIFIED
                  </div>
                )}

                <PillButton 
                  variant="outline" 
                  className="sm:px-8 py-3 text-xs font-bold"
                  onClick={() => setSelectedShipment(null)}
                >
                  DISMISS VIEW
                </PillButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
