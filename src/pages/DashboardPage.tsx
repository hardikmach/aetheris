import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/ui/GlassCard';
import { PillButton } from '../components/ui/PillButton';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  ArrowRightLeft,
  Settings as SettingsIcon,
  ChevronRight,
  Loader2,
  Globe,
  BarChart3,
  Search,
  X,
  Building,
  CreditCard,
  Copy,
  Check,
  Wallet,
  AlertCircle,
  Lock,
  Sparkles
} from 'lucide-react';

interface MarketCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
}

const portfolioData = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 5000 },
  { name: 'Thu', value: 4500 },
  { name: 'Fri', value: 6000 },
  { name: 'Sat', value: 5500 },
  { name: 'Sun', value: 7000 },
];

const assets = [
  { name: 'Ethereum', symbol: 'ETH', balance: '12.45', value: '$28,450.00', change: '+2.4%', up: true },
  { name: 'Bitcoin', symbol: 'BTC', balance: '0.84', value: '$45,200.12', change: '-1.2%', up: false },
  { name: 'Aetheris', symbol: 'AETH', balance: '4,500.00', value: '$9,000.00', change: '+12.5%', up: true },
  { name: 'Solana', symbol: 'SOL', balance: '120.00', value: '$12,400.00', change: '+5.7%', up: true },
];

export const DashboardPage = () => {
  const [marketData, setMarketData] = useState<MarketCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assetSearchQuery, setAssetSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<typeof assets[0] | null>(null);

  // Expanded high-fidelity ledger states & transfer logic
  const [totalBalance, setTotalBalance] = useState(95050.12);
  const [monthlyGrowth, setMonthlyGrowth] = useState(12450.00);
  
  // Modal state
  const [activeModal, setActiveModal] = useState<'deposit' | 'withdraw' | null>(null);
  
  // Transfer flow states
  const [depositAmount, setDepositAmount] = useState('2500');
  const [withdrawAmount, setWithdrawAmount] = useState('1000');
  const [depositType, setDepositType] = useState<'bank' | 'card' | 'crypto'>('bank');
  const [withdrawType, setWithdrawType] = useState<'bank' | 'crypto'>('bank');
  
  // Specific inputs
  const [selectedBank, setSelectedBank] = useState('Chase Commercial Prime');
  const [routingNumber, setRoutingNumber] = useState('021000021');
  const [accountNumber, setAccountNumber] = useState('9876543210');
  
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('DR. HARDIK TYAGI');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  const [cryptoAsset, setCryptoAsset] = useState('ETH');
  const [isCopied, setIsCopied] = useState(false);
  
  // Execution states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [txId, setTxId] = useState('');

  const [transactionHistory, setTransactionHistory] = useState<Array<{
    id: string;
    type: 'Deposit' | 'Withdraw';
    method: string;
    amount: number;
    status: 'Pending' | 'Completed' | 'Failed';
    timestamp: string;
  }>>([
    { id: 'TX-8921-A', type: 'Deposit', method: 'Sovereign Bank Wire', amount: 5000, status: 'Completed', timestamp: 'May 24, 09:30' },
    { id: 'TX-7234-W', type: 'Withdraw', method: 'Secured ACH Transfer', amount: 1200, status: 'Completed', timestamp: 'May 22, 14:15' },
  ]);

  const getCryptoAddress = (symbol: string) => {
    switch (symbol) {
      case 'BTC': return 'bc1q9dgqy6f9m5yv42ascr3k7lpxv7y06kwhqlnunv';
      case 'ETH': return '0x7a29ee6285a855faf2b6fc6ab929bb08492fe103';
      case 'SOL': return '8vS6r9SAsvYxMvWk4XW8yLqH8uD1Qn6uH9qD3wD5aD9g';
      case 'AETH': return '0xA839aE93e9A9bEfDcdE932a939E8cAD88f8Dfe72';
      default: return '0x0000000000000000000000000000000000000000';
    }
  };

  const depositSteps = [
    'Initializing Sovereign Gateway Auditing Protocol...',
    'Assessing clearing reserves and validating signatures...',
    'Performing real-time escrow settlement ledger handshake...',
    'Finalizing institutional custody deposition allocation...'
  ];

  const withdrawSteps = [
    'Initializing secure withdraw handshake protocols...',
    'Validating account collateral and anti-fraud thresholds...',
    'Routing settlement dispatch requests to Tier-1 correspondent banks...',
    'Reconciling secure institutional balance sheets...'
  ];

  const handleExecuteDeposit = () => {
    const amountNum = parseFloat(depositAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;
    
    setIsProcessing(true);
    setProcessingStep(0);
    setTransferSuccess(false);

    const sampleTxId = `TX-${Math.floor(1000 + Math.random() * 9000)}-D`;
    setTxId(sampleTxId);

    const stepInterval = setInterval(() => {
      setProcessingStep(prev => {
        if (prev >= 3) {
          clearInterval(stepInterval);
          
          // Fire persistent backend call once client checks animate
          const method = depositType === 'bank' ? `${selectedBank} (ACH)` : depositType === 'card' ? 'Secure Slate Card' : `Crypto (${cryptoAsset})`;
          fetch('/api/user-data/deposit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: amountNum, method })
          })
            .then(res => {
              if (!res.ok) throw new Error('Failed to deposit');
              return res.json();
            })
            .then(resData => {
              setIsProcessing(false);
              setTransferSuccess(true);
              setTotalBalance(resData.user.totalBalance);
              setMonthlyGrowth(resData.user.monthlyGrowth);
              setTransactionHistory(resData.user.transactionHistory);
              setTxId(resData.tx.id);
            })
            .catch(err => {
              console.error(err);
              setIsProcessing(false);
              alert('Deposition protocol failed clearance.');
            });
          return prev;
        }
        return prev + 1;
      });
    }, 700);
  };

  const handleExecuteWithdraw = () => {
    const amountNum = parseFloat(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;
    if (amountNum > totalBalance) {
      alert("Insufficient account collateral to execute dispatch.");
      return;
    }

    setIsProcessing(true);
    setProcessingStep(0);
    setTransferSuccess(false);

    const sampleTxId = `TX-${Math.floor(1000 + Math.random() * 9000)}-W`;
    setTxId(sampleTxId);

    const stepInterval = setInterval(() => {
      setProcessingStep(prev => {
        if (prev >= 3) {
          clearInterval(stepInterval);
          
          // Fire persistent backend call once checks animate
          const method = withdrawType === 'bank' ? 'Commercial Bank ACH' : `Crypto (${cryptoAsset})`;
          fetch('/api/user-data/withdraw', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: amountNum, method })
          })
            .then(res => {
              if (!res.ok) throw new Error('Withdraw failed');
              return res.json();
            })
            .then(resData => {
              setIsProcessing(false);
              setTransferSuccess(true);
              setTotalBalance(resData.user.totalBalance);
              setTransactionHistory(resData.user.transactionHistory);
              setTxId(resData.tx.id);
            })
            .catch(err => {
              console.error(err);
              setIsProcessing(false);
              alert('Withdrawal protocol failed clearance.');
            });
          return prev;
        }
        return prev + 1;
      });
    }, 700);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const getAssetHistory = (symbol: string) => {
    const basePrices: Record<string, number> = {
      ETH: 2285,
      BTC: 53800,
      AETH: 2.00,
      SOL: 103.3
    };
    const base = basePrices[symbol] || 100;
    const changePercent = symbol === 'BTC' ? -0.012 : symbol === 'ETH' ? 0.024 : symbol === 'AETH' ? 0.125 : 0.057;
    
    const history = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (let i = 0; i < 7; i++) {
      const factor = 1 + (Math.sin(i * 1.5) * 0.035) + (i - 6) * (changePercent / 6);
      const price = base * factor;
      history.push({
        day: days[i],
        price: Number(price.toFixed(symbol === 'AETH' ? 4 : 2)),
        volume: Number((base * factor * 1234).toFixed(0))
      });
    }
    return history;
  };

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/market-data');
        if (!response.ok) throw new Error('Failed to fetch market data');
        const data = await response.json();
        setMarketData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user-data');
        if (response.ok) {
          const data = await response.json();
          setTotalBalance(data.totalBalance);
          setMonthlyGrowth(data.monthlyGrowth);
          setTransactionHistory(data.transactionHistory);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchMarketData();
    fetchUserData();
    const interval = setInterval(fetchMarketData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatCompactNumber = (number: number) => {
    return Intl.NumberFormat('en-US', {
      notation: "compact",
      maximumFractionDigits: 1
    }).format(number);
  };
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto grid grid-cols-12 gap-6">
      {/* Sidebar Overview */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <GlassCard className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-on-surface/50 text-sm font-medium mb-1">Total Balance</p>
              <h2 className="text-4xl font-display font-bold">
                ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
            </div>
            <div className="p-2 rounded-full bg-primary/10 border border-primary/20 text-primary">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 mb-8">
            <span className="text-primary flex items-center font-bold">
              <Plus className="w-4 h-4 mr-1" /> ${monthlyGrowth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
            </span>
            <span className="text-on-surface/40 text-sm">since last month</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <PillButton variant="primary" className="w-full cursor-pointer" onClick={() => { setActiveModal('deposit'); setTransferSuccess(false); setIsProcessing(false); setDepositAmount('2500'); }}>Deposit</PillButton>
            <PillButton variant="outline" className="w-full cursor-pointer" onClick={() => { setActiveModal('withdraw'); setTransferSuccess(false); setIsProcessing(false); setWithdrawAmount('1000'); }}>Withdraw</PillButton>
          </div>
        </GlassCard>

        <div className="space-y-4">
          <h3 className="text-xl font-display font-semibold px-2">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <GlassCard className="p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/10 transition-colors" variant="dark">
              <ArrowRightLeft className="w-6 h-6 text-on-surface/60" />
              <span className="text-sm font-medium">Swap</span>
            </GlassCard>
            <GlassCard className="p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/10 transition-colors" variant="dark">
              <Plus className="w-6 h-6 text-on-surface/60" />
              <span className="text-sm font-medium">Stake</span>
            </GlassCard>
          </div>
        </div>

        {/* Settlement Ledger Logs */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl font-display font-semibold">Reserve Ledger</h3>
            <span className="text-[9px] font-mono bg-white/5 border border-white/10 text-on-surface/40 px-2 py-0.5 rounded">AUTO-AUDITED</span>
          </div>
          <GlassCard className="p-6 space-y-4" variant="dark">
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {transactionHistory.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg ${log.type === 'Deposit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-primary/10 text-primary'}`}>
                      {log.type === 'Deposit' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate text-on-surface">{log.method}</p>
                      <p className="text-[9px] font-mono text-on-surface/40 mt-0.5">{log.timestamp} • {log.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-mono font-bold ${log.type === 'Deposit' ? 'text-emerald-400' : 'text-primary'}`}>
                      {log.type === 'Deposit' ? '+' : '-'}${log.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <span className="text-[8px] font-mono text-emerald-500/80 uppercase font-semibold">Cleared</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Main Content */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
        {/* Chart Card */}
        <GlassCard className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-display font-semibold">Portfolio Growth</h3>
            <div className="flex gap-2">
              {['1D', '1W', '1M', '1Y'].map((t) => (
                <button key={t} className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${t === '1W' ? 'bg-primary text-white' : 'hover:bg-white/10 text-on-surface/40'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff0000" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ff0000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1c1b1b', 
                    borderRadius: '12px', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                  }} 
                  itemStyle={{ color: '#ff0000' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#ff0000" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Assets Card */}
        <GlassCard className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-display font-semibold">My Assets</h3>
            <PillButton variant="ghost" size="sm" className="text-xs">
              View All <ChevronRight className="w-3 h-3 ml-1" />
            </PillButton>
          </div>

          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/40" />
            <input
              type="text"
              placeholder="Filter assets by name or symbol..."
              value={assetSearchQuery}
              onChange={(e) => setAssetSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-3.5 pl-12 pr-6 text-sm focus:outline-none focus:border-primary/50 transition-all font-sans placeholder:text-on-surface/30 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-4">
            {assets.filter(
              (asset) =>
                asset.name.toLowerCase().includes(assetSearchQuery.toLowerCase()) ||
                asset.symbol.toLowerCase().includes(assetSearchQuery.toLowerCase())
            ).length > 0 ? (
              assets
                .filter(
                  (asset) =>
                    asset.name.toLowerCase().includes(assetSearchQuery.toLowerCase()) ||
                    asset.symbol.toLowerCase().includes(assetSearchQuery.toLowerCase())
                )
                .map((asset, i) => (
                  <div key={i} onClick={() => setSelectedAsset(asset)} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all group cursor-pointer border border-transparent hover:border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs ring-1 ring-white/10">
                        {asset.symbol}
                      </div>
                      <div>
                        <h4 className="font-bold">{asset.name}</h4>
                        <p className="text-xs text-on-surface/40 uppercase tracking-wider">{asset.balance} {asset.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{asset.value}</p>
                      <p className={`text-xs flex items-center justify-end font-semibold ${asset.up ? 'text-primary' : 'text-red-400'}`}>
                        {asset.up ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                        {asset.change}
                      </p>
                    </div>
                  </div>
                ))
            ) : (
              <div className="py-8 text-center text-sm text-on-surface/40 font-medium">
                No assets found matching "{assetSearchQuery}"
              </div>
            )}
          </div>
        </GlassCard>

        {/* Real-time Market Data Section */}
        <GlassCard className="p-8 pb-4 overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold text-glow">Global Market Trends</h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-on-surface/40">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              LIVE DATA
            </div>
          </div>

          <div className="overflow-x-auto -mx-8 px-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-4 text-[10px] uppercase tracking-widest text-on-surface/40 font-bold">#</th>
                  <th className="pb-4 text-[10px] uppercase tracking-widest text-on-surface/40 font-bold">Asset</th>
                  <th className="pb-4 text-[10px] uppercase tracking-widest text-on-surface/40 font-bold text-right">Price</th>
                  <th className="pb-4 text-[10px] uppercase tracking-widest text-on-surface/40 font-bold text-right">24h</th>
                  <th className="pb-4 text-[10px] uppercase tracking-widest text-on-surface/40 font-bold text-right hidden md:table-cell">Market Cap</th>
                  <th className="pb-4 text-[10px] uppercase tracking-widest text-on-surface/40 font-bold text-right hidden lg:table-cell">Volume</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <p className="text-sm text-on-surface/40 font-medium">Fetching global capital flows...</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  marketData.map((coin) => (
                    <tr key={coin.id} className="group border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 text-xs font-mono text-on-surface/40">{coin.market_cap_rank}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full group-hover:scale-110 transition-transform" />
                          <div>
                            <p className="text-sm font-bold leading-none mb-1">{coin.name}</p>
                            <p className="text-[10px] font-mono text-on-surface/40 uppercase leading-none">{coin.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-sm font-bold text-right">
                        ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className={`py-4 text-xs font-bold text-right ${(coin.price_change_percentage_24h ?? 0) >= 0 ? 'text-primary' : 'text-red-400'}`}>
                        {coin.price_change_percentage_24h != null 
                          ? `${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%`
                          : '0.00%'}
                      </td>
                      <td className="py-4 text-xs font-mono text-on-surface/60 text-right hidden md:table-cell">
                        {formatCurrency(coin.market_cap)}
                      </td>
                      <td className="py-4 text-xs font-mono text-on-surface/60 text-right hidden lg:table-cell">
                        {formatCompactNumber(coin.total_volume)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {!loading && (
            <div className="py-4 flex justify-center border-t border-white/5 mt-4">
              <PillButton variant="ghost" size="sm" className="text-xs group">
                Deep Dive Analytics <ArrowRightLeft className="w-3 h-3 ml-2 group-hover:rotate-180 transition-transform duration-500" />
              </PillButton>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Modal Dialog for Asset Detail */}
      <AnimatePresence>
        {selectedAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAsset(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            
            {/* Modal Glass Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
              className="relative w-full max-w-2xl glass-dark rounded-[1.5rem] border border-white/10 p-8 overflow-hidden bg-zinc-950/95 shadow-[0_0_50px_rgba(255,0,0,0.15)] z-10"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
              
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-lg ring-1 ring-white/10">
                    {selectedAsset.symbol}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-display font-medium leading-none">{selectedAsset.name}</h2>
                      <span className="text-[10px] font-mono bg-white/10 text-on-surface/60 px-2 py-0.5 rounded-full uppercase font-bold">
                        {selectedAsset.symbol}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface/40 mt-1 uppercase tracking-wider font-mono">Enterprise Asset Custody Profile</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-on-surface/60 hover:text-on-surface transition-colors cursor-pointer border border-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Info Dashboard Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <p className="text-[9px] uppercase tracking-widest text-on-surface/40 font-bold mb-1 font-mono">Portfolio Position</p>
                  <p className="text-base font-mono font-bold">{selectedAsset.balance} {selectedAsset.symbol}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <p className="text-[9px] uppercase tracking-widest text-on-surface/40 font-bold mb-1 font-mono">Current Value</p>
                  <p className="text-base font-mono font-bold text-primary">{selectedAsset.value}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <p className="text-[9px] uppercase tracking-widest text-on-surface/40 font-bold mb-1 font-mono">24H Velocity</p>
                  <div className={`text-base font-mono font-bold flex items-center gap-1 ${selectedAsset.up ? 'text-primary' : 'text-red-400'}`}>
                    {selectedAsset.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {selectedAsset.change}
                  </div>
                </div>
              </div>

              {/* Detailed Chart Block */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-display font-bold uppercase tracking-wider text-on-surface/60">
                    7-Day Price History Log
                  </h4>
                  <p className="text-[9px] font-mono text-on-surface/30 uppercase">
                    aligned with analytics feed
                  </p>
                </div>
                
                <div className="h-[200px] w-full bg-black/30 rounded-2xl p-4 border border-white/5">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getAssetHistory(selectedAsset.symbol)}>
                      <defs>
                        <linearGradient id="modalColorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff0000" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#ff0000" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} 
                      />
                      <YAxis 
                        domain={['auto', 'auto']}
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0a0a0a', 
                          borderRadius: '12px', 
                          border: '1px solid rgba(255,255,255,0.1)',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                          fontSize: '11px'
                        }} 
                        itemStyle={{ color: '#ff0000' }}
                        labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        name="Price ($)"
                        stroke="#ff0000" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#modalColorValue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Secondary Details Meta Log */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono mb-2 pt-4 border-t border-white/5">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-on-surface/30 font-bold mb-1">Asset Status</p>
                  <p className="text-on-surface/70">COLD STORAGE</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-on-surface/30 font-bold mb-1">Risk Rating</p>
                  <p className="text-primary font-bold">SECURE (AAA)</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-on-surface/30 font-bold mb-1">Allocation</p>
                  <p className="text-on-surface/70">
                    {(parseFloat(selectedAsset.value.replace(/[^0-9.]/g, '')) / 95050.12 * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-on-surface/30 font-bold mb-1">X-RAY ID</p>
                  <p className="text-on-surface/50 truncate">RE-{(selectedAsset.symbol).slice(0,3)}-8291</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Custody Transfer Portal (Deposit & Withdraw) */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (!isProcessing) setActiveModal(null); }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            {/* Modal Glass Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
              className="relative w-full max-w-xl glass-dark rounded-[1.5rem] border border-white/10 p-8 overflow-hidden bg-zinc-950/95 shadow-[0_0_50px_rgba(255,0,0,0.2)] z-10"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-emerald-500" />

              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`p-1.5 rounded-lg text-xs font-mono font-bold ${activeModal === 'deposit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-primary/10 text-primary'}`}>
                      {activeModal.toUpperCase()} PROTOCOL
                    </span>
                    <span className="text-[9px] font-mono text-on-surface/30">v4.8 ACTIVE</span>
                  </div>
                  <h2 className="text-2xl font-display font-medium text-on-surface mt-2">
                    {activeModal === 'deposit' ? 'Aetheris Sovereign Escrow Deposit' : 'Collateral Asset Dispatch Console'}
                  </h2>
                  <p className="text-xs text-on-surface/40 mt-1 font-sans">
                    Secure institutional capital clearing provided by Aetheris Armor.
                  </p>
                </div>

                <button
                  onClick={() => { if (!isProcessing) setActiveModal(null); }}
                  disabled={isProcessing}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-on-surface/60 hover:text-on-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer border border-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {/* 1. Transaction Executing HANDSHAKE Step */}
                {isProcessing && (
                  <motion.div
                    key="step-processing"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="flex flex-col items-center justify-center py-10 space-y-6"
                  >
                    <div className="relative">
                      <div className={`w-20 h-20 rounded-full border flex items-center justify-center relative ${activeModal === 'deposit' ? 'border-emerald-500/20' : 'border-primary/20'}`}>
                        <Loader2 className={`w-10 h-10 animate-spin ${activeModal === 'deposit' ? 'text-emerald-400' : 'text-primary'}`} strokeWidth={1.5} />
                        <div className={`absolute inset-0 border-t border-r rounded-full animate-[spin_1s_linear_infinite] ${activeModal === 'deposit' ? 'border-emerald-500' : 'border-primary'}`} />
                      </div>
                      <Lock className="w-6 h-6 text-on-surface absolute -bottom-1 -right-1 bg-zinc-950 rounded-full p-0.5 border border-white/10" />
                    </div>

                    <div className="text-center space-y-2 w-full max-w-xs font-mono">
                      <h3 className={`text-xs font-bold tracking-wider uppercase ${activeModal === 'deposit' ? 'text-emerald-400' : 'text-primary'}`}>
                        AUDITING TELEMETRY CHANNELS
                      </h3>
                      
                      <div className="space-y-1.5 p-4 rounded-xl bg-black/40 border border-white/5 text-[10px] text-left text-on-surface/50">
                        {(activeModal === 'deposit' ? depositSteps : withdrawSteps).map((stepMsg, stepIdx) => (
                          <p key={stepIdx} className={`flex items-center gap-2 ${processingStep >= stepIdx ? 'text-on-surface' : 'opacity-25'}`}>
                            {processingStep > stepIdx ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : processingStep === stepIdx ? (
                              <span className={`w-1.5 h-1.5 rounded-full animate-ping shrink-0 ${activeModal === 'deposit' ? 'bg-emerald-500' : 'bg-primary'}`} />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
                            )}
                            <span className="truncate">{stepMsg}</span>
                          </p>
                        ))}
                      </div>

                      {/* Smooth progress bar */}
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-3">
                        <div 
                          className={`h-full transition-all duration-300 ${activeModal === 'deposit' ? 'bg-emerald-500' : 'bg-primary'}`}
                          style={{ width: `${(processingStep + 1) * 25}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 2. Success Ticket Output */}
                {!isProcessing && transferSuccess && (
                  <motion.div
                    key="step-success"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-8 space-y-6 font-mono text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      >
                        <Check className="w-12 h-12 text-emerald-400" />
                      </motion.div>
                      <div className="absolute inset-x-0 -bottom-2 flex justify-center">
                        <span className="text-[8px] font-mono bg-emerald-500 text-black px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          SUCCESSFUL
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4 max-w-sm">
                      <div>
                        <h3 className="text-xl font-display font-semibold text-on-surface">TRANSFER CONFIRMED</h3>
                        <p className="text-[10px] text-on-surface/40 mt-1 uppercase font-bold">Ref ID: {txId}</p>
                      </div>

                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-left text-on-surface/60 space-y-2">
                        <div className="flex justify-between">
                          <span>Security Action:</span>
                          <span className="text-on-surface font-semibold uppercase">{activeModal === 'deposit' ? 'Direct Allocation' : 'Escrow Dispatch'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cleared Amount:</span>
                          <span className="text-emerald-400 font-bold">${parseFloat(activeModal === 'deposit' ? depositAmount : withdrawAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sovereign Clearing Fee:</span>
                          <span className="text-on-surface/40">$0.00 (Tier-1 Partner)</span>
                        </div>
                        <div className="flex justify-between border-t border-white/5 pt-2 mt-2">
                          <span>Updated Account Balance:</span>
                          <span className="text-on-surface font-bold">${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>

                      <PillButton 
                        variant="primary" 
                        className="w-full justify-center py-3.5 text-xs font-mono font-bold cursor-pointer bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        onClick={() => setActiveModal(null)}
                      >
                        RETURN TO ACCOUNT CONTROL
                      </PillButton>
                    </div>
                  </motion.div>
                )}

                {/* 3. Primary Fields Form Selection */}
                {!isProcessing && !transferSuccess && (
                  <motion.div
                    key="step-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {/* Mode-specific tabs */}
                    {activeModal === 'deposit' && (
                      <div className="flex border-b border-white/5 pb-1 gap-2">
                        {[
                          { id: 'bank', name: 'Commercial ACH', icon: Building },
                          { id: 'card', name: 'Secure Slate Card', icon: CreditCard },
                          { id: 'crypto', name: 'Cryptographic Ledger', icon: Wallet }
                        ].map((tab) => {
                          const IconComp = tab.icon;
                          const isSel = depositType === tab.id;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setDepositType(tab.id as any)}
                              className={`flex-1 flex items-center justify-center gap-2 py-3 border-b-2 font-mono text-[10px] font-bold tracking-wider uppercase transition-colors cursor-pointer ${isSel ? 'border-emerald-500 text-emerald-400 bg-emerald-500/[0.02]' : 'border-transparent text-on-surface/40 hover:text-on-surface/70 hover:bg-white/[0.01]'}`}
                            >
                              <IconComp className="w-3.5 h-3.5" />
                              <span>{tab.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {activeModal === 'withdraw' && (
                      <div className="flex border-b border-white/5 pb-1 gap-2">
                        {[
                          { id: 'bank', name: 'Sovereign Bank Routing', icon: Building },
                          { id: 'crypto', name: 'External Crypto Wallet', icon: Wallet }
                        ].map((tab) => {
                          const IconComp = tab.icon;
                          const isSel = withdrawType === tab.id;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setWithdrawType(tab.id as any)}
                              className={`flex-1 flex items-center justify-center gap-2 py-2.5 border-b-2 font-mono text-[10px] font-bold tracking-wider uppercase transition-colors cursor-pointer ${isSel ? 'border-primary text-primary bg-primary/[0.02]' : 'border-transparent text-on-surface/40 hover:text-on-surface/70 hover:bg-white/[0.01]'}`}
                            >
                              <IconComp className="w-3.5 h-3.5" />
                              <span>{tab.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Inputs */}
                    <div className="space-y-4 font-sans text-xs">
                      {/* Amount Field */}
                      <div className="space-y-1.5 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="flex justify-between items-center text-[10px] uppercase font-mono font-bold tracking-wider text-on-surface/40">
                          <span>Amount ({activeModal === 'deposit' ? 'USD Deposit' : 'USD Dispatch'})</span>
                          {activeModal === 'withdraw' && (
                            <span>Account Collateral: ${totalBalance.toLocaleString()}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-2 pr-2">
                          <span className="text-3xl font-mono font-bold text-on-surface/40">$</span>
                          <input 
                            type="number" 
                            value={activeModal === 'deposit' ? depositAmount : withdrawAmount}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (activeModal === 'deposit') setDepositAmount(val);
                               else setWithdrawAmount(val);
                            }}
                            className="bg-transparent border-none text-3xl font-mono font-semibold text-on-surface focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="0.00"
                          />
                          <div className="flex gap-1.5 shrink-0">
                            {[1000, 5000, 10000].map((quickPreset) => (
                              <button
                                key={quickPreset}
                                type="button"
                                onClick={() => {
                                  if (activeModal === 'deposit') setDepositAmount(quickPreset.toString());
                                  else {
                                    const constrained = Math.min(quickPreset, totalBalance);
                                    setWithdrawAmount(constrained.toFixed(0));
                                  }
                                }}
                                className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/5 rounded-lg text-[9px] font-mono text-on-surface/70 cursor-pointer transition-all"
                              >
                                +{quickPreset / 1000}k
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* --- METHOD SPECIFIC FIELDS --- */}
                      
                      {/* 1. BANK SELECTION TAB */}
                      {((activeModal === 'deposit' && depositType === 'bank') || (activeModal === 'withdraw' && withdrawType === 'bank')) && (
                        <div className="space-y-4 animate-in fade-in duration-350">
                          {/* Partners Grid */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-mono font-bold tracking-widest text-on-surface/40 pl-4">Sovereign Correspondent Partner Bank</label>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                              {[
                                { name: 'Chase Commercial', icon: '🏦' },
                                { name: 'Citibank Sovereign', icon: '🏛️' },
                                { name: 'Wells Fargo Enterprise', icon: '💎' },
                                { name: 'Bank of America Tier1', icon: '📈' }
                              ].map((bank) => {
                                const isSelBank = selectedBank === bank.name;
                                return (
                                  <button
                                    key={bank.name}
                                    type="button"
                                    onClick={() => setSelectedBank(bank.name)}
                                    className={`p-3.5 rounded-xl border text-left flex items-center gap-2.5 cursor-pointer transition-colors ${isSelBank ? 'bg-white/10 border-white/20 text-on-surface' : 'bg-white/[0.01] border-white/5 text-on-surface/40 hover:bg-white/5 hover:border-white/10'}`}
                                  >
                                    <span className="text-base">{bank.icon}</span>
                                    <span className="font-semibold text-[10px] uppercase font-mono tracking-wider truncate">{bank.name.split(' ')[0]} Business</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3.5">
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-mono font-bold tracking-widest text-on-surface/40 pl-4">Routing Transit Number</label>
                              <input 
                                type="text" 
                                value={routingNumber}
                                maxLength={9}
                                onChange={(e) => setRoutingNumber(e.target.value.replace(/[^0-9]/g, ''))}
                                className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-5 text-xs text-on-surface font-mono placeholder:text-on-surface/20 focus:outline-none focus:border-white/30"
                                placeholder="021000021"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-mono font-bold tracking-widest text-on-surface/40 pl-4">Commercial Account Number</label>
                              <input 
                                type="text" 
                                value={accountNumber}
                                maxLength={12}
                                onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                                className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-5 text-xs text-on-surface font-mono placeholder:text-on-surface/20 focus:outline-none focus:border-white/30"
                                placeholder="9876543210"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 2. SECURE CARD TAB (ONLY ON DEPOSIT) */}
                      {activeModal === 'deposit' && depositType === 'card' && (
                        <div className="space-y-4 animate-in fade-in duration-350">
                          
                          {/* Visual Slate Card Simulator Representation */}
                          <div className="relative h-[155px] w-full rounded-2xl p-6 bg-gradient-to-br from-zinc-900 via-[#161516] to-[#0d0c0d] border border-white/10 overflow-hidden shadow-2xl">
                            {/* Card grid overlay texture */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
                            
                            <div className="absolute top-0 right-0 bg-primary/20 text-primary text-[8px] font-mono px-3 py-1 rounded-bl-xl font-bold uppercase tracking-widest">
                              AETHERIS SOVEREIGN PLATINUM
                            </div>

                            <div className="h-full flex flex-col justify-between relative z-10 font-mono">
                              <div className="flex justify-between items-start">
                                <div className="p-1 px-2.5 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-500 font-bold">
                                  CORE CHIP SECURE
                                </div>
                                <span className="text-sm font-semibold tracking-widest text-white/40">VIP PRIVATE</span>
                              </div>

                              <div className="py-2">
                                <p className="text-base tracking-[0.2em] font-bold text-on-surface min-h-[24px]">
                                  {cardNumber || '••••  ••••  ••••  ••••'}
                                </p>
                              </div>

                              <div className="flex justify-between items-end text-[9px] uppercase tracking-wider text-on-surface/50">
                                <div>
                                  <p className="text-[7px] text-on-surface/30">HOLDER REPRESENTATIVE</p>
                                  <p className="font-bold text-on-surface/90 mt-0.5">{cardHolder.slice(0, 18) || 'REPRESENTATIVE NAME'}</p>
                                </div>
                                <div className="flex gap-4">
                                  <div>
                                    <p className="text-[7px] text-on-surface/30">EXPIRY</p>
                                    <p className="font-bold text-on-surface/90 mt-0.5">{cardExpiry || '12/29'}</p>
                                  </div>
                                  <div>
                                    <p className="text-[7px] text-on-surface/30">CVV</p>
                                    <p className="font-bold text-on-surface/90 mt-0.5">{cardCvv || '•••'}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Inputs */}
                          <div className="space-y-3.5">
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-mono font-bold tracking-widest text-on-surface/40 pl-4">Secure Corporate Card Number</label>
                              <input 
                                type="text" 
                                placeholder="4000 1234 5678 9010"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                maxLength={19}
                                className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-5 text-xs text-on-surface font-mono focus:outline-none focus:border-white/30"
                              />
                            </div>
                            
                            <div className="grid grid-cols-12 gap-3">
                              <div className="col-span-6 space-y-1">
                                <label className="text-[10px] uppercase font-mono font-bold tracking-widest text-on-surface/40 pl-4">Beneficiary Holder Name</label>
                                <input 
                                  type="text" 
                                  placeholder="DR. HARDIK TYAGI"
                                  value={cardHolder}
                                  onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                                  className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-5 text-xs text-on-surface font-mono focus:outline-none focus:border-white/30"
                                />
                              </div>
                              <div className="col-span-3 space-y-1">
                                <label className="text-[10px] uppercase font-mono font-bold tracking-widest text-on-surface/40 pl-4">Exp Date</label>
                                <input 
                                  type="text" 
                                  placeholder="MM/YY"
                                  value={cardExpiry}
                                  maxLength={5}
                                  onChange={(e) => {
                                    let v = e.target.value.replace(/[^0-9]/g, '');
                                    if (v.length > 2) v = v.substr(0,2) + '/' + v.substr(2,2);
                                    setCardExpiry(v);
                                  }}
                                  className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-5 text-xs text-on-surface font-mono focus:outline-none focus:border-white/30 text-center"
                                />
                              </div>
                              <div className="col-span-3 space-y-1">
                                <label className="text-[10px] uppercase font-mono font-bold tracking-widest text-on-surface/40 pl-4">CVV Pass</label>
                                <input 
                                  type="password" 
                                  placeholder="•••"
                                  value={cardCvv}
                                  maxLength={3}
                                  onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ''))}
                                  className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-5 text-xs text-on-surface font-mono focus:outline-none focus:border-white/30 text-center"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 3. CRYPTOGRAPHIC VAULT LEDGER TAB */}
                      {((activeModal === 'deposit' && depositType === 'crypto') || (activeModal === 'withdraw' && withdrawType === 'crypto')) && (
                        <div className="space-y-4 animate-in fade-in duration-350">
                          
                          {/* Asset Picker Line */}
                          <div className="space-y-1.5 font-mono text-[10px] font-bold text-on-surface/40">
                            <label className="pl-4 uppercase tracking-wider">SECURE DIGITAL LEDGER COLLATERAL</label>
                            <div className="flex gap-2 mt-1">
                              {['ETH', 'BTC', 'SOL', 'AETH'].map((tokenSymbol) => {
                                const isSelToken = cryptoAsset === tokenSymbol;
                                return (
                                  <button
                                    key={tokenSymbol}
                                    type="button"
                                    onClick={() => { setCryptoAsset(tokenSymbol); setIsCopied(false); }}
                                    className={`flex-1 py-3 px-1 rounded-xl border text-center cursor-pointer transition-colors ${isSelToken ? 'bg-white/10 border-white/20 text-on-surface font-bold' : 'bg-white/[0.01] border-white/5 text-on-surface/40 hover:bg-white/5 hover:border-white/10'}`}
                                  >
                                    {tokenSymbol}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* For DEPOSIT show deposit address and QR representation */}
                          {activeModal === 'deposit' ? (
                            <div className="p-4.5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-center gap-5 justify-between">
                              <div className="space-y-2.5 flex-1 w-full text-center md:text-left">
                                <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/10">ESCROW DEPOSIT COLD COINCIDENCE ADDRESS</span>
                                <p className="text-[10.5px] font-mono text-on-surface break-all tracking-wider leading-relaxed bg-black/40 p-3.5 rounded-xl border border-white/5 select-all">
                                  {getCryptoAddress(cryptoAsset)}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(getCryptoAddress(cryptoAsset));
                                    setIsCopied(true);
                                    setTimeout(() => setIsCopied(false), 2000);
                                  }}
                                  className="w-full md:w-auto px-4.5 py-2.5 bg-white/5 hover:bg-white/10 active:scale-95 text-[10px] font-mono font-bold uppercase border border-white/10 hover:border-white/20 rounded-lg text-on-surface tracking-wider cursor-pointer transition-all flex items-center justify-center gap-1.5"
                                >
                                  {isCopied ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-400" /> ADDRESS COPIED TO CLIPBOARD
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" /> COPY SECURE ADDRESS TICKET
                                    </>
                                  )}
                                </button>
                              </div>

                              {/* Canvas-styled decorative vector QR representation */}
                              <div className="w-[105px] h-[105px] bg-white rounded-xl p-2.5 flex items-center justify-center shrink-0 border-2 border-white/20 shadow-xl relative group">
                                <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                                  <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                                  <rect x="5" y="5" width="20" height="20" fill="white" />
                                  <rect x="10" y="10" width="10" height="10" fill="currentColor" />
                                  
                                  <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                                  <rect x="75" y="5" width="20" height="20" fill="white" />
                                  <rect x="80" y="10" width="10" height="10" fill="currentColor" />

                                  <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                                  <rect x="5" y="75" width="20" height="20" fill="white" />
                                  <rect x="10" y="80" width="10" height="10" fill="currentColor" />

                                  {/* Center and auxiliary blocks */}
                                  <rect x="40" y="40" width="20" height="20" fill="currentColor" />
                                  <rect x="45" y="15" width="10" height="15" fill="currentColor" />
                                  <rect x="15" y="45" width="15" height="10" fill="currentColor" />
                                  <rect x="75" y="40" width="15" height="15" fill="currentColor" />
                                  <rect x="40" y="75" width="15" height="15" fill="currentColor" />
                                  <rect x="65" y="65" width="25" height="25" fill="currentColor" />
                                  <rect x="72" y="72" width="11" height="11" fill="white" />
                                </svg>
                                <span className="absolute inset-0 bg-black/85 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl text-[8px] font-mono font-bold text-center text-on-surface p-1">
                                  SCAN IN WALLET APP
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-mono font-bold tracking-widest text-on-surface/40 pl-4">External Destination Wallet Address</label>
                              <input 
                                type="text" 
                                placeholder="0x7a29ee6285a855faf2... or SOL equivalent"
                                className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-5 text-xs text-on-surface font-mono placeholder:text-on-surface/20 focus:outline-none focus:border-white/30"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Info alert segment */}
                      <div className="p-3.5 bg-white/[0.01] border border-white/5 rounded-xl flex items-start gap-2.5 text-[10px] leading-relaxed text-on-surface/40 font-mono text-justify">
                        <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-on-surface/70 uppercase">Federal Clearing Guarantee</p>
                          <p>All transacted funds are insured and verified by multi-signature secure hardware keys. Settlement time averages less than 2.1 seconds.</p>
                        </div>
                      </div>

                      {/* Action trigger button */}
                      <div className="pt-2">
                        {activeModal === 'deposit' ? (
                          <PillButton 
                            variant="primary" 
                            className="w-full justify-center py-4 text-xs font-mono font-bold cursor-pointer bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-1.5"
                            disabled={!depositAmount || parseFloat(depositAmount) <= 0}
                            onClick={handleExecuteDeposit}
                          >
                            <Lock className="w-4 h-4" /> AUTHORIZE SOVEREIGN DEPOSIT OF ${parseFloat(depositAmount || '0').toLocaleString()} USD
                          </PillButton>
                        ) : (
                          <PillButton 
                            variant="primary" 
                            className="w-full justify-center py-4 text-xs font-mono font-bold cursor-pointer bg-primary hover:bg-primary/95 shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all flex items-center gap-1.5"
                            disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > totalBalance}
                            onClick={handleExecuteWithdraw}
                          >
                            <Lock className="w-4 h-4" /> DISPATCH ${parseFloat(withdrawAmount || '0').toLocaleString()} USD COLLATERAL OUTFLOW
                          </PillButton>
                        )}
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
