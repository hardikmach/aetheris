import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PillButton } from '../components/ui/PillButton';
import { GlassCard } from '../components/ui/GlassCard';
import { 
  Zap, 
  Shield, 
  ChevronRight, 
  Mail, 
  Key, 
  Eye, 
  EyeOff, 
  Lock, 
  RefreshCw, 
  ShieldCheck, 
  Check, 
  AlertCircle, 
  Fingerprint, 
  Smartphone,
  CheckCircle
} from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  // Authentication states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Verification & MFA flow states
  const [loadingStep, setLoadingStep] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showMfa, setShowMfa] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [expectedOtp, setExpectedOtp] = useState('');
  const [otpTimeLeft, setOtpTimeLeft] = useState(30);
  const [mfaError, setMfaError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Google SSO Sim states
  const [showGoogleSso, setShowGoogleSso] = useState(false);
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState<string | null>(null);

  // Generate unique OTP code for Aetheris Armor MFA
  const generateNewOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setExpectedOtp(code);
    setOtpTimeLeft(30);
    setMfaError(null);
  };

  // Timer loop for OTP rotation
  useEffect(() => {
    if (!showMfa || loginSuccess) return;
    
    if (otpTimeLeft <= 0) {
      generateNewOtp();
      return;
    }

    const timer = setTimeout(() => {
      setOtpTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [otpTimeLeft, showMfa, loginSuccess]);

  // Password strength logic
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-white/10', width: 'w-0' };
    let score = 1;
    if (pass.length >= 8) score++;
    if (/[0-9]/.test(pass) && /[a-zA-Z]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    
    if (score === 1) return { score, label: 'WEAK', color: 'bg-red-500/80', width: 'w-1/3' };
    if (score === 2) return { score, label: 'FAIR', color: 'bg-amber-500/80', width: 'w-2/3' };
    if (score === 3) return { score, label: 'SECURE', color: 'bg-blue-500/80', width: 'w-3/4' };
    return { score, label: 'HIGH SECURITY', color: 'bg-emerald-500/80', width: 'w-full' };
  };

  const strength = getPasswordStrength(password);

  // Form validator before advancing to handshake
  const handleValidateForm = () => {
    setAuthError(null);
    
    if (!email) {
      setAuthError('Email address is required for identity validation.');
      return;
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setAuthError('Please enter a valid institution-aligned email address.');
      return;
    }

    if (!password) {
      setAuthError('Security passcode must be supplied.');
      return;
    }

    if (password.length < 6) {
      setAuthError('Authorized passcodes are minimum 6 alphanumeric characters.');
      return;
    }

    // Passwords passed - initiate multi-step secure check
    startSecurityHandshake();
  };

  const startSecurityHandshake = () => {
    setIsVerifying(true);
    setLoadingStep(0);

    // Multi-step animated security audit check
    const interval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev >= 3) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVerifying(false);
            generateNewOtp();
            setShowMfa(true);
          }, 600);
          return prev;
        }
        return prev + 1;
      });
    }, 900);
  };

  const handleMfaSubmit = () => {
    setMfaError(null);

    if (mfaCode === expectedOtp || mfaCode === '123456') { // Master dev override
      setLoginSuccess(true);
      setTimeout(() => {
        onLogin();
      }, 1200);
    } else {
      setMfaError('Handshake token invalid or expired. Check security generator.');
    }
  };

  // Google SSO Simulator trigger
  const handleGoogleSsoInit = () => {
    setShowGoogleSso(true);
  };

  const handleSelectGoogleAccount = (emailChoice: string) => {
    setEmail(emailChoice);
    setPassword('OAuth2-Provider-AetherisPass!');
    setShowGoogleSso(false);
    
    setIsVerifying(true);
    setLoadingStep(0);
    
    const interval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev >= 3) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVerifying(false);
            generateNewOtp();
            setShowMfa(true);
          }, 600);
          return prev;
        }
        return prev + 1;
      });
    }, 850);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.05)_0%,transparent_70%)] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <GlassCard className="p-10 border-white/10 overflow-hidden relative" variant="dark">
          
          <AnimatePresence mode="wait">
            
            {/* Standard Credentials Page */}
            {!isVerifying && !showMfa && !loginSuccess && !showGoogleSso && (
              <motion.div
                key="credentials"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="flex flex-col items-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,0,0,0.3)]">
                    <Zap className="w-10 h-10 text-white fill-white" />
                  </div>
                  <h1 className="text-3xl font-display font-bold tracking-tighter mb-2">ACCESS RENTENER</h1>
                  <p className="text-on-surface/40 text-sm font-medium text-center">
                    Institutional access to high-fidelity retail intelligence.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Google Authenticator Action */}
                  <PillButton 
                    variant="secondary" 
                    className="w-full flex items-center justify-center gap-3 py-4 cursor-pointer"
                    onClick={handleGoogleSsoInit}
                  >
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                    Sign in with Google Account
                  </PillButton>

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/5"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                      <span className="bg-[#0a0a0a] px-4 text-on-surface/20">or enterprise SSO credentials</span>
                    </div>
                  </div>

                  {/* Errors Block */}
                  {authError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-primary/10 border border-primary/20 text-xs text-primary rounded-xl flex items-start gap-2 font-medium"
                    >
                      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{authError}</span>
                    </motion.div>
                  )}

                  <div className="space-y-4 font-sans">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface/40 pl-4 font-mono">Work Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/30" />
                        <input 
                          type="email" 
                          placeholder="name@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center px-4">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface/40 font-mono">Passcode</label>
                        {password && (
                          <span className={`${strength.color.replace('/80', '')} text-[9px] font-mono px-1.5 py-0.5 rounded text-white font-bold`}>
                            {strength.label}
                          </span>
                        )}
                      </div>
                      
                      <div className="relative">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/30" />
                        <input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-12 text-sm focus:outline-none focus:border-primary/50 transition-colors font-mono tracking-wider"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface/30 hover:text-on-surface/60 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Cool Strength Bar Overlay */}
                      {password && (
                        <div className="h-1 w-[calc(100%-32px)] mx-auto bg-white/5 rounded-full mt-1.5 overflow-hidden">
                          <div className={`h-full ${strength.color} ${strength.width} transition-all duration-350`} />
                        </div>
                      )}
                    </div>
                    
                    <PillButton variant="primary" className="w-full py-4 group cursor-pointer" onClick={handleValidateForm}>
                      ESTABLISH HANDSHAKE <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </PillButton>

                    {/* Admin Autocomplete & Bypass Node for Testing */}
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-2 text-[11px] font-sans mt-2">
                      <div className="flex items-center justify-between text-[10px] text-on-surface/40 uppercase font-mono tracking-wider font-bold">
                        <span>Admin Testing Node</span>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-emerald-500/80 font-mono text-[9px] uppercase">Bypass Active</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4 py-1">
                        <div className="text-[10px] font-mono text-on-surface/50 leading-relaxed">
                          Email: <span className="text-on-surface/90 font-bold">admin@rentener.com</span><br/>
                          Pass: <span className="text-on-surface/90 font-semibold font-mono">admin123</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEmail('admin@rentener.com');
                            setPassword('admin123');
                            setAuthError(null);
                          }}
                          className="px-3 py-1.5 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-xl text-primary font-mono font-bold text-[9px] cursor-pointer transition-all uppercase"
                        >
                          Quick Fill
                        </button>
                      </div>
                      <div className="border-t border-white/5 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEmail('admin@rentener.com');
                            setPassword('admin123');
                            setLoginSuccess(true);
                            setTimeout(() => {
                              onLogin();
                            }, 1000);
                          }}
                          className="w-full py-2 bg-on-surface/5 hover:bg-white/10 border border-white/5 rounded-xl text-on-surface/70 hover:text-on-surface font-mono font-bold text-[9px] cursor-pointer transition-all uppercase flex items-center justify-center gap-1.5"
                        >
                          <Shield className="w-3 h-3 text-primary" /> Direct Admin Auth Bypass
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

            {/* Google Identity Selector Simul */}
            {showGoogleSso && (
              <motion.div
                key="google-sso"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex flex-col items-center">
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-10 h-10 mb-4" />
                  <h3 className="text-xl font-display font-bold">Sign in with Google</h3>
                  <p className="text-xs text-on-surface/40 mt-1 font-sans">Choose an account to proceed securely</p>
                </div>

                <div className="space-y-2 pt-4">
                  {[
                    { name: 'Dr. Hardik Tyagi', email: 'hardiktyagi777@gmail.com', desc: 'Rentener Labs Org Owner' },
                    { name: 'Agent Admin', email: 'admin@rentener.com', desc: 'Secure Sandbox Master' }
                  ].map((acc) => (
                    <button
                      key={acc.email}
                      onClick={() => handleSelectGoogleAccount(acc.email)}
                      className="w-full text-left p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/20 hover:bg-white/[0.08] transition-all cursor-pointer group flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{acc.name}</p>
                        <p className="text-xs text-on-surface/40 font-mono mt-0.5">{acc.email}</p>
                        <p className="text-[9px] text-on-surface/20 uppercase font-bold tracking-wide mt-1">{acc.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-on-surface/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>

                <PillButton 
                  variant="outline" 
                  className="w-full justify-center py-3.5 text-xs text-on-surface/60 hover:text-on-surface font-mono"
                  onClick={() => setShowGoogleSso(false)}
                >
                  CANCEL
                </PillButton>
              </motion.div>
            )}

            {/* Simulated Handshake Security Audit Check */}
            {isVerifying && (
              <motion.div
                key="verifying"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex flex-col items-center justify-center py-8 space-y-6"
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border border-primary/20 flex items-center justify-center relative">
                    <RefreshCw className="w-10 h-10 text-primary animate-spin" strokeWidth={1.5} />
                    <div className="absolute inset-0 border-t border-r border-primary rounded-full animate-[spin_1s_linear_infinite]" />
                  </div>
                  <ShieldCheck className="w-6 h-6 text-primary absolute -bottom-1 -right-1 bg-[#0a0a0a] rounded-full p-0.5" />
                </div>

                <div className="text-center space-y-2 w-full max-w-xs font-mono">
                  <h3 className="text-sm font-bold tracking-wider uppercase text-primary">AETHERIS AUDITING CHANNEL</h3>
                  
                  <div className="space-y-1.5 p-3.5 rounded-lg bg-black/40 border border-white/5 text-[9px] text-left text-on-surface/50">
                    <p className={`flex items-center gap-2 ${loadingStep >= 0 ? 'text-primary' : ''}`}>
                      {loadingStep >= 1 ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />}
                      <span>TLS HANDSHAKE STAGE (X-SECURE)</span>
                    </p>
                    <p className={`flex items-center gap-2 ${loadingStep >= 1 ? 'text-primary' : ''}`}>
                      {loadingStep >= 2 ? <Check className="w-3 h-3 text-emerald-400" /> : loadingStep === 1 ? <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" /> : null}
                      <span className={loadingStep < 1 ? 'opacity-30' : ''}>RESOLVING CREDENTIAL ENVELOPE</span>
                    </p>
                    <p className={`flex items-center gap-2 ${loadingStep >= 2 ? 'text-primary' : ''}`}>
                      {loadingStep >= 3 ? <Check className="w-3 h-3 text-emerald-400" /> : loadingStep === 2 ? <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" /> : null}
                      <span className={loadingStep < 2 ? 'opacity-30' : ''}>AETHERIS ARMOR SIGNATURE VERIFICATION</span>
                    </p>
                    <p className={`flex items-center gap-2 ${loadingStep >= 3 ? 'text-primary' : ''}`}>
                      {loadingStep >= 4 ? <Check className="w-3 h-3 text-emerald-400" /> : loadingStep === 3 ? <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" /> : null}
                      <span className={loadingStep < 3 ? 'opacity-30' : ''}>ISSUING TEMPORARY MFA TICKET</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* MFA Security Key Page */}
            {showMfa && !loginSuccess && (
              <motion.div
                key="mfa"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <Fingerprint className="w-7 h-7 text-primary animate-pulse" />
                  </div>
                  <h3 className="text-xl font-display font-semibold tracking-tight">MFA Verification</h3>
                  <p className="text-xs text-on-surface/40 text-center mt-2 max-w-xs font-sans">
                    Aetheris Armor requires security pass validation to unlock your active logistics console.
                  </p>
                </div>

                {/* Simulated Aetheris Armor Generator Card */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-primary/20 text-primary text-[8px] font-mono px-2 py-0.5 rounded-bl-xl font-bold uppercase tracking-wider">
                    ARMOR SECURITY TOKEN
                  </div>
                  
                  <p className="text-[9px] font-mono uppercase text-on-surface/40 font-bold tracking-widest">Dynamic Verification Key</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-mono tracking-[0.25em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-white font-semibold">
                      {expectedOtp}
                    </span>
                    
                    <div className="flex items-center gap-2 text-xs font-mono">
                      {/* Rotating ring timer indicator */}
                      <div className="relative w-5 h-5 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
                          <circle cx="10" cy="10" r="8" fill="none" stroke="#ff0000" strokeWidth="1.5" 
                            strokeDasharray={50}
                            strokeDashoffset={50 - (50 * otpTimeLeft) / 30}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute text-[8px] font-bold text-on-surface mt-0.5">{otpTimeLeft}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-[8px] font-mono text-on-surface/30 uppercase pt-2 border-t border-white/5">
                    <span>Aetheris Sec ID: RE-F58</span>
                    <button 
                      onClick={generateNewOtp} 
                      className="text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-2.5 h-2.5" /> Force Rotate Key
                    </button>
                  </div>
                </div>

                {/* Input block */}
                <div className="space-y-4">
                  {mfaError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-primary/10 border border-primary/20 text-[11px] text-justify text-primary rounded-xl flex items-start gap-2"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{mfaError}</span>
                    </motion.div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface/40 pl-4 font-mono">Enter 6-Digit Verification Key</label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/30" />
                      <input 
                        type="text" 
                        placeholder="••••••"
                        maxLength={6}
                        value={mfaCode}
                        onChange={(e) => {
                          const sanitized = e.target.value.replace(/[^0-9]/g, '');
                          setMfaCode(sanitized);
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-6 text-base tracking-[0.4em] font-mono focus:outline-none focus:border-primary/50 transition-colors text-center"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <PillButton 
                      variant="outline" 
                      className="flex-1 py-4 justify-center text-xs font-mono cursor-pointer"
                      onClick={() => {
                        setShowMfa(false);
                        setMfaCode('');
                      }}
                    >
                      BACK
                    </PillButton>
                    <PillButton 
                      variant="primary" 
                      className="flex-2 py-4 justify-center text-xs font-mono cursor-pointer font-bold shadow-[0_0_15px_rgba(255,0,0,0.25)]" 
                      disabled={mfaCode.length < 6}
                      onClick={handleMfaSubmit}
                    >
                      VALIDATE KEY
                    </PillButton>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Authentication Complete Success Screen */}
            {loginSuccess && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-10 space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <CheckCircle className="w-12 h-12 text-emerald-400" />
                  </motion.div>
                  <div className="absolute inset-x-0 -bottom-2 flex justify-center">
                    <span className="text-[8px] font-mono bg-emerald-500 text-black px-2 py-0.5 rounded-full font-bold uppercase">
                      SECURED
                    </span>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <h3 className="text-xl font-display font-bold">ACCESS AUTHORIZED</h3>
                  <p className="text-xs text-on-surface/40 max-w-xs font-mono">
                    Token ID: auth_tok_rentener_{Math.random().toString(36).substr(2, 9)}
                  </p>
                  <p className="text-xs text-emerald-400/80 font-medium">
                    Initializing Rentener Analytics Console...
                  </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Secure Credit Watermark Section */}
          <div className="mt-8 flex items-center justify-center gap-2 text-[9px] uppercase tracking-widest font-bold text-on-surface/15 pt-4 border-t border-white/5 font-mono">
            <Shield className="w-3 h-3 text-primary" />
            SECURED BY AETHERIS ARMOR SHUTTLE v4.2
          </div>
        </GlassCard>

        {/* Request access subtext footer info link */}
        {!isVerifying && !loginSuccess && (
          <p className="text-center mt-6 text-xs text-on-surface/30">
            Forgot authorization passcode? <span className="text-primary hover:underline cursor-pointer font-bold">Reset Sec-Key</span>
          </p>
        )}
      </motion.div>
    </div>
  );
};

