import { LayoutGrid, Shield, Zap, User, LogOut, Menu } from 'lucide-react';
import { PillButton } from './ui/PillButton';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onLogout?: () => void;
}

export const Navbar = ({ onNavigate, currentPage, onLogout }: NavbarProps) => {
  const navItems = [
    { id: 'landing', label: 'Protocol', icon: Zap },
    { id: 'dashboard', label: 'Intelligence', icon: LayoutGrid },
    { id: 'assets', label: 'Logistics', icon: Shield },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass pill px-6 py-3 pointer-events-auto">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(255,0,0,0.5)]">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-display font-bold text-lg tracking-tighter">RENTENER</span>
        </div>

        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <PillButton
              key={item.id}
              variant={currentPage === item.id ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onNavigate(item.id)}
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
            </PillButton>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {onLogout ? (
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 pill bg-white/5 flex items-center justify-center border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <User className="w-5 h-5 text-on-surface/60" />
              </div>
              <PillButton variant="outline" size="sm" onClick={onLogout} className="group">
                <LogOut className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
                Exit
              </PillButton>
            </div>
          ) : (
            <PillButton variant="primary" size="sm" onClick={() => onNavigate('login')}>
              Launch Hub
            </PillButton>
          )}
          <div className="md:hidden">
            <Menu className="w-6 h-6 cursor-pointer" />
          </div>
        </div>
      </div>
    </nav>
  );
};
