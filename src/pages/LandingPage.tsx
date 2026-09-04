import { useState } from 'react';
import { motion } from 'motion/react';
import { PillButton } from '../components/ui/PillButton';
import { GlassCard } from '../components/ui/GlassCard';
import { 
  ArrowUpRight, 
  ChevronRight, 
  Package, 
  BarChart3, 
  Search, 
  Database, 
  Zap, 
  Activity,
  UserPlus
} from 'lucide-react';

interface LandingPageProps {
  onLaunch?: () => void;
  isLoggedIn?: boolean;
  onNavigate?: (page: string) => void;
}

const PRODUCT_DESCRIPTIONS: Record<string, { desc: string; detail: string }> = {
  '01 RETAIL HUB': {
    desc: 'Empowering sustainable Logistics. Recover up to 80% more revenue.',
    detail: 'An integrated workspace simplifying supply chain billing and compliance tracking across distribution networks.'
  },
  '02 DOCUMENT X-RAY': {
    desc: 'Decompile, parse, and evaluate complex fine documents automatically.',
    detail: 'Harness state-of-the-art document modeling to deconstruct PDF invoices, trade pacts, and penalty listings.'
  },
  '03 LOGISTICS INTELLIGENCE': {
    desc: 'Interactive real-time cargo trackers with automated OTIF waivers.',
    detail: 'Monitor live shipments across terminal grids, inspect ambient cargo health sensors, and resolve disputes on-the-fly.'
  },
  '04 ACTIONABLE INSIGHTS': {
    desc: 'Prevent costly invoice leakages and on-time penalty risks instantly.',
    detail: 'Predictive analytics algorithms identify anomalies and late delivery dangers to protect margins.'
  },
  '05 DASHBOARDS': {
    desc: 'Ecosystem statistics with detailed high-precision metrics and curves.',
    detail: 'Analyze comprehensive wallet logs, active carrier performance deviation bars, and custody balances.'
  }
};

export const LandingPage = ({ onLaunch, isLoggedIn, onNavigate }: LandingPageProps) => {
  const [activeProduct, setActiveProduct] = useState('01 RETAIL HUB');

  const handleProductClick = (label: string) => {
    setActiveProduct(label);
    if (isLoggedIn && onNavigate) {
      if (label === '03 LOGISTICS INTELLIGENCE') {
        onNavigate('assets');
      } else {
        onNavigate('dashboard');
      }
    }
  };

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto space-y-6">
      {/* Top Section */}
      <div className="grid grid-cols-12 gap-6">
        {/* Product Card */}
        <GlassCard className="col-span-12 md:col-span-8 p-8 flex flex-col justify-between" variant="dark">
          <div>
            <div className="flex justify-between items-start mb-12">
              <h2 className="text-4xl font-display font-bold">PRODUCT</h2>
              <span className="text-[10px] tracking-widest text-on-surface/30 font-mono">RENTENER.COM</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                '01 RETAIL HUB',
                '02 DOCUMENT X-RAY',
                '03 LOGISTICS INTELLIGENCE',
                '04 ACTIONABLE INSIGHTS',
                '05 DASHBOARDS'
              ].map((label) => {
                const isActive = activeProduct === label;
                return (
                  <button 
                    key={label}
                    onClick={() => handleProductClick(label)}
                    className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all duration-300 cursor-pointer ${
                      isActive 
                      ? 'bg-primary text-white shadow-[0_0_15px_rgba(255,0,0,0.4)]' 
                      : 'bg-white/5 text-on-surface/40 hover:bg-white/10'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-4 text-on-surface/60 text-sm">
              <Activity className="w-4 h-4 text-primary animate-pulse" />
              <p className="font-semibold text-on-surface">{PRODUCT_DESCRIPTIONS[activeProduct].desc}</p>
            </div>
            <p className="text-xs text-on-surface/40 leading-relaxed font-sans pl-8">
              {PRODUCT_DESCRIPTIONS[activeProduct].detail}
            </p>
          </div>
        </GlassCard>

        {/* Counter Card */}
        <GlassCard className="col-span-12 md:col-span-4 p-8 flex flex-col items-center justify-center relative overflow-hidden" variant="dark">
          <div className="absolute top-4 left-6 text-[10px] text-white/20 tracking-tighter uppercase">Empowering Sustainable</div>
          <div className="text-8xl font-display font-bold flex items-start">
            320<span className="text-4xl text-primary mt-4">+</span>
          </div>
          <div className="mt-4 px-3 py-1 rounded-full bg-primary text-[10px] font-bold">2026</div>
          <div className="absolute bottom-6 right-6 flex -space-x-3">
             {[1,2,3].map(i => (
               <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-zinc-800 overflow-hidden">
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="user" />
               </div>
             ))}
             <div className="w-8 h-8 rounded-full border-2 border-background bg-zinc-900 flex items-center justify-center text-[8px] font-bold text-primary">18K+</div>
          </div>
        </GlassCard>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-12 gap-6">
        {/* Info Card */}
        <GlassCard className="col-span-12 md:col-span-7 p-8 relative overflow-hidden h-[400px]" variant="dark">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50" />
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary fill-primary" />
              <span className="font-display font-bold text-lg">Rentener</span>
            </div>
            
            <h1 className="text-6xl font-display font-bold leading-none max-w-md">
              ALL YOUR RETAIL PARTNER DATA <br />
              <span className="text-primary">IN ONE PLACE</span>
            </h1>
            
            <div className="flex justify-between items-center text-[10px] tracking-widest text-on-surface/40 font-mono">
              <span>RENTENER.COM</span>
              <span>@CHARGEBACK</span>
            </div>
          </div>
        </GlassCard>

        {/* Stat Card */}
        <GlassCard className="col-span-12 md:col-span-5 bg-primary p-8 flex flex-col justify-between border-transparent group cursor-pointer" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex justify-between items-start" onClick={onLaunch}>
            <span className="px-3 py-1 rounded-full bg-black text-[10px] font-bold">WON</span>
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </div>
          
          <div onClick={onLaunch}>
            <h2 className="text-7xl font-display font-bold tracking-tighter">$83,235</h2>
            <div className="flex items-center gap-2 mt-4 text-[10px] font-bold border-t border-white/20 pt-4 cursor-pointer hover:gap-3 transition-all" onClick={onLaunch}>
              LEARN HOW IT WORKS <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-12 gap-6">
        {/* Steps Card */}
        <GlassCard className="col-span-12 md:col-span-4 p-8 bg-gradient-to-br from-[#400000] to-black" variant="dark">
           <div className="mb-12">
             <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
             </div>
             <h2 className="text-4xl font-display font-bold leading-[0.9] mb-4">HOW RETAIL PATH WORKS IN 3 STEPS</h2>
           </div>
           <div className="space-y-4">
             {['01 CONNECT', '02 ANALYZE', '03 RECOVER'].map((step, i) => (
               <div key={step} className="flex items-center gap-4">
                 <span className="text-[10px] font-mono text-primary font-bold">{step}</span>
                 <div className="h-px flex-1 bg-white/10" />
                 {i === 2 && <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_red]" />}
               </div>
             ))}
           </div>
        </GlassCard>

        {/* Logo Card */}
        <GlassCard className="col-span-12 md:col-span-4 p-8 flex items-center justify-center bg-black" variant="dark">
          <div className="relative">
            <div className="absolute inset-0 blur-[40px] bg-primary/40 rounded-full" />
            <div className="relative w-32 h-32 flex items-center justify-center border-2 border-primary rounded-2xl">
               <Zap className="w-20 h-20 text-primary shadow-[0_0_20px_red]" fill="currentColor" />
            </div>
          </div>
        </GlassCard>

        {/* Typography Card */}
        <GlassCard className="col-span-12 md:col-span-4 p-8" variant="dark">
           <div className="space-y-4">
             <div className="text-sm font-bold text-on-surface/40 border-b border-white/10 pb-2">HELVETICA NOW DISPLAY</div>
             <div className="text-6xl font-display font-bold">Aa Bb</div>
             <div className="text-5xl font-display font-bold text-primary">1234</div>
             <div className="pt-8 text-right">
                <p className="text-[8px] uppercase tracking-widest text-on-surface/20 mb-1">Smart Consumption</p>
                <p className="text-sm font-medium leading-tight">Optimize energy use with real-time data.</p>
             </div>
           </div>
        </GlassCard>
      </div>

      {/* CTA Section */}
      <section className="text-center py-20 border-t border-white/10 mt-12 bg-gradient-to-b from-transparent to-primary/5 rounded-3xl">
        <h2 className="text-5xl md:text-7xl font-display font-bold mb-8">READY TO RECOVER?</h2>
        <div className="flex justify-center gap-4">
           <PillButton size="lg" variant="primary" onClick={onLaunch}>GET STARTED</PillButton>
           <PillButton size="lg" variant="outline" onClick={onLaunch}>REQUEST DEMO</PillButton>
        </div>
      </section>
    </div>
  );
};
