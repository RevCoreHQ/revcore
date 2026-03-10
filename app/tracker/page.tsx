'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { supabase, hasSupabase } from '@/lib/supabase';
import SpaceBackground from '@/components/SpaceBackground';

const PASS  = 'revcore2024';
const STORE = 'rcTrackerV1';

type Tab       = 'overview' | 'clients' | 'services' | 'analytics' | 'team' | 'calendar' | 'payments' | 'settings' | 'my-dashboard' | 'my-clients' | 'my-ledger' | 'goals' | 'goals-mgmt';
type UserRole  = 'super_admin' | 'admin' | 'sales_manager' | 'finance' | 'setter' | 'closer';
type Stage     = 'onboarding' | 'balance-pending' | 'active' | 'at-risk' | 'paused' | 'churned';
type PlanT     = 'recurring' | 'one-time';
type InitCommT = 'pct' | 'fixed' | 'none';
type OngoingT  = 'pct-renewal' | 'rev-share' | 'none';
type CommFor   = 'closer' | 'setter' | 'both' | 'none';
type CommStat  = 'pending' | 'paid';
type PayStat   = 'current' | 'overdue' | 'failed';

interface Partner { id: string; name: string; role: 'setter' | 'closer' | 'both'; active?: boolean; }
interface Client {
  id: string; name: string; company: string; pkg: string;
  planT: PlanT; start: string; renewal: string; amount: number; nextDue: string;
  setterId: string; closerId: string;
  setterInitT: InitCommT; setterInitV: number;
  closerInitT: InitCommT; closerInitV: number;
  ongoingT: OngoingT; ongoingFor: CommFor; ongoingV: number;
  isSplit: boolean; deposit: number; bal: number; balNote: string;
  depPaid: boolean; balPaid: boolean;
  stage: Stage; payStat: PayStat; ghlId: string; notes: string; at: string;
  isUpsold?: boolean; origPkg?: string; origAmount?: number; upsoldAt?: string;
  apptTotal?: number; apptDelivered?: number;
}
interface Commission {
  id: string; clientId: string; partnerId: string; role: 'setter' | 'closer';
  commT: 'initial' | 'renewal'; amount: number;
  due: string; paid: string; stat: CommStat; notes: string;
}
interface ServicePkg { id: string; name: string; price: number; planT: PlanT; description: string; }
interface Activity { id: string; clientId: string; type: 'call' | 'email' | 'note' | 'payment' | 'issue'; note: string; at: string; }
interface MonthlyGoal { month: string; revenueTarget: number; newClientsTarget: number; }
interface TeamGoal { id: string; partnerId: string; dialsPerDay: number; bookedPerWeek: number; attendedPerWeek: number; setBy: string; updatedAt: string; }
interface DailyLog { id: string; partnerId: string; date: string; dials: number; bookedAppts: number; attendedAppts: number; notes: string; submittedAt: string; }
interface Task { id: string; assignedToPartnerId: string; assignedByUserId: string; title: string; description: string; dueDate: string; isCompleted: boolean; completedAt: string; createdAt: string; }
interface PaymentRecord { id: string; clientId: string; month: string; dueDate: string; amount: number; paid: boolean; paidAt: string; }
interface AppData { partners: Partner[]; clients: Client[]; comms: Commission[]; packages: ServicePkg[]; activities: Activity[]; goals: MonthlyGoal[]; teamGoals: TeamGoal[]; dailyLogs: DailyLog[]; tasks: Task[]; paymentRecords: PaymentRecord[]; }
interface RcUser { id: string; username: string; email: string; name: string; role: UserRole; partner_id: string; password_hash: string; is_active: boolean; created_at: string; }
interface Session { userId: string; username: string; name: string; role: UserRole; partnerId: string; }

const PPA_MONTHLY = 2000; // estimated monthly revenue per PPA client
const monthlyVal = (c: Client) => c.pkg.toLowerCase().includes('ppa') ? PPA_MONTHLY : c.amount;

const uid   = () => Math.random().toString(36).slice(2, 10);
const fmtD  = (d: string) => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const fmtM  = (n: number) => '$' + (n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const today = () => new Date().toISOString().slice(0, 10);
// Returns Monday of the week containing d (or today)
const getMonday = (d: Date = new Date()): string => { const dt = new Date(d); dt.setDate(dt.getDate() - ((dt.getDay() + 6) % 7)); return dt.toISOString().slice(0, 10); };
const normalizeData = (raw: Partial<AppData>): AppData => ({
  partners:  raw.partners  ?? [],
  clients:   raw.clients   ?? [],
  comms:     raw.comms     ?? [],
  packages:  raw.packages  ?? [],
  activities: raw.activities ?? [],
  goals:     raw.goals     ?? [],
  teamGoals: raw.teamGoals ?? [],
  dailyLogs: raw.dailyLogs ?? [],
  tasks:     raw.tasks     ?? [],
  paymentRecords: raw.paymentRecords ?? [],
});

function calcInit(c: Client, role: 'setter' | 'closer'): number {
  const t = role === 'setter' ? c.setterInitT : c.closerInitT;
  const v = role === 'setter' ? c.setterInitV : c.closerInitV;
  if (t === 'none' || !v) return 0;
  return t === 'fixed' ? v : (c.amount * v) / 100;
}
function calcOngoing(c: Client): number {
  if (c.ongoingT === 'none' || !c.ongoingV) return 0;
  return (c.amount * c.ongoingV) / 100;
}
function getWeekStart(offset = 0): Date {
  const d = new Date(); d.setDate(d.getDate() - d.getDay() + offset * 7); d.setHours(0,0,0,0); return d;
}
function getBiweekly(start: string, wStart: Date, wEnd: Date): Date[] {
  if (!start) return [];
  const res: Date[] = [];
  const s = new Date(start + 'T00:00:00');
  let d = new Date(s); d.setDate(d.getDate() + 14);
  while (d <= wEnd) { if (d >= wStart) res.push(new Date(d)); d.setDate(d.getDate() + 14); }
  return res;
}
function genInitComms(c: Client): Commission[] {
  const out: Commission[] = [];
  if (c.setterInitT !== 'none' && c.setterId) {
    const amt = calcInit(c, 'setter');
    if (amt > 0) out.push({ id: uid(), clientId: c.id, partnerId: c.setterId, role: 'setter', commT: 'initial', amount: amt, due: c.start || today(), paid: '', stat: 'pending', notes: '' });
  }
  if (c.closerInitT !== 'none' && c.closerId) {
    const amt = calcInit(c, 'closer');
    if (amt > 0) out.push({ id: uid(), clientId: c.id, partnerId: c.closerId, role: 'closer', commT: 'initial', amount: amt, due: c.start || today(), paid: '', stat: 'pending', notes: '' });
  }
  return out;
}

const STAGES: Record<Stage, { label: string; color: string }> = {
  onboarding:        { label: 'Onboarding',     color: '#6B8EFE' },
  'balance-pending': { label: 'Balance Pending', color: '#26D9B0' },
  active:            { label: 'Active',          color: '#94D96B' },
  'at-risk':  { label: 'At Risk',    color: '#F59E0B' },
  paused:     { label: 'Paused',     color: 'rgba(255,255,255,0.35)' },
  churned:    { label: 'Churned',    color: '#FE6462' },
};
const PAY_STAT: Record<PayStat, { label: string; color: string }> = {
  current: { label: 'Current', color: '#94D96B' },
  overdue: { label: 'Overdue', color: '#F59E0B' },
  failed:  { label: 'Failed',  color: '#FE6462' },
};

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin', admin: 'Admin', sales_manager: 'Sales Manager',
  finance: 'Finance', setter: 'Setter', closer: 'Closer',
};
const ROLE_COLORS: Record<UserRole, string> = {
  super_admin: '#FE6462', admin: '#FEB64A', sales_manager: '#6B8EFE',
  finance: '#94D96B', setter: '#26D9B0', closer: '#a78bfa',
};
const ROLE_TABS: Record<UserRole, { id: Tab; label: string }[]> = {
  super_admin: [
    { id: 'overview', label: 'Overview' }, { id: 'payments', label: 'Payments' },
    { id: 'clients', label: 'Clients' }, { id: 'services', label: 'Services' },
    { id: 'analytics', label: 'Analytics' }, { id: 'team', label: 'Team & Payouts' },
    { id: 'goals-mgmt', label: 'Goals & Tasks' }, { id: 'calendar', label: 'Calendar' },
    { id: 'settings', label: 'Settings' },
  ],
  admin: [
    { id: 'overview', label: 'Overview' }, { id: 'payments', label: 'Payments' },
    { id: 'clients', label: 'Clients' }, { id: 'services', label: 'Services' },
    { id: 'analytics', label: 'Analytics' }, { id: 'team', label: 'Team & Payouts' },
    { id: 'goals-mgmt', label: 'Goals & Tasks' }, { id: 'calendar', label: 'Calendar' },
    { id: 'settings', label: 'Settings' },
  ],
  sales_manager: [
    { id: 'overview', label: 'Overview' }, { id: 'clients', label: 'Clients' },
    { id: 'analytics', label: 'Analytics' }, { id: 'team', label: 'Team' },
    { id: 'goals-mgmt', label: 'Goals & Tasks' },
    { id: 'calendar', label: 'Calendar' }, { id: 'settings', label: 'Settings' },
  ],
  finance: [
    { id: 'overview', label: 'Overview' }, { id: 'payments', label: 'Payments' },
    { id: 'clients', label: 'Clients' }, { id: 'services', label: 'Services' },
    { id: 'analytics', label: 'Analytics' }, { id: 'team', label: 'Team & Payouts' },
    { id: 'settings', label: 'Settings' },
  ],
  setter: [
    { id: 'my-dashboard', label: 'My Dashboard' }, { id: 'my-clients', label: 'My Clients' },
    { id: 'my-ledger', label: 'My Ledger' }, { id: 'goals', label: 'Goals & Tasks' },
  ],
  closer: [
    { id: 'my-dashboard', label: 'My Dashboard' }, { id: 'my-clients', label: 'My Clients' },
    { id: 'my-ledger', label: 'My Ledger' }, { id: 'goals', label: 'Goals & Tasks' },
  ],
};

async function hashPassword(pw: string): Promise<string> {
  const data = new TextEncoder().encode(pw + 'rc_v1_salt');
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}
function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
  return Array.from(crypto.getRandomValues(new Uint8Array(14))).map(b => chars[b % chars.length]).join('');
}
function generateUsername(name: string): string {
  const parts = name.trim().toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
  const base = parts.length >= 2 ? `${parts[0]}.${parts[parts.length - 1]}` : parts[0] || 'user';
  return base + String(Math.floor(Math.random() * 90) + 10);
}

// Defaults: setter 10%, closer 25%
const blankC = (): Omit<Client, 'id' | 'at'> => ({
  name: '', company: '', pkg: '', planT: 'recurring', start: '', renewal: '', amount: 0, nextDue: '',
  setterId: '', closerId: '',
  setterInitT: 'pct', setterInitV: 10,
  closerInitT: 'pct', closerInitV: 25,
  ongoingT: 'none', ongoingFor: 'none', ongoingV: 0,
  isSplit: false, deposit: 0, bal: 0, balNote: '', depPaid: false, balPaid: false,
  stage: 'onboarding', payStat: 'current', ghlId: '', notes: '',
  isUpsold: false, origPkg: '', origAmount: 0, upsoldAt: '',
});

// ─── Styles ───────────────────────────────────────────────────────────────────
const card: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.25rem 1.5rem', backdropFilter: 'blur(8px)' };
const glassCard: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.5rem', backdropFilter: 'blur(12px)' };
const inp: React.CSSProperties  = { width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '0.65rem 0.85rem', color: '#fff', fontSize: '0.88rem', fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' };
const lbl: React.CSSProperties  = { display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.35rem' };
const badge = (color: string): React.CSSProperties => ({ display: 'inline-block', padding: '2px 10px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 700, background: color + '22', color, border: `1px solid ${color}44` });
const btn = (variant: 'primary' | 'ghost' | 'danger' | 'success' = 'primary'): React.CSSProperties => ({
  border: 'none', borderRadius: '10px', padding: '0.55rem 1.1rem', fontSize: '0.83rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s',
  ...(variant === 'primary' ? { background: 'linear-gradient(135deg,#FE6462,#e84f4d)', color: '#fff', boxShadow: '0 4px 15px rgba(254,100,98,0.3)' } :
      variant === 'success' ? { background: 'linear-gradient(135deg,#94D96B,#7bc455)', color: '#fff', boxShadow: '0 4px 12px rgba(148,217,107,0.25)' } :
      variant === 'danger'  ? { background: 'rgba(254,100,98,0.12)', color: '#FE6462', border: '1px solid rgba(254,100,98,0.3)' } :
                              { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }),
});

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '0.65rem 0.85rem', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap', borderBottom: '1px solid rgba(255,255,255,0.07)' };
const tdStyle: React.CSSProperties = { padding: '0.75rem 0.85rem', fontSize: '0.84rem', color: 'rgba(255,255,255,0.8)', borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' };

// ─── Login ────────────────────────────────────────────────────────────────────
function Login({ onLogin }: { onLogin: (s: Session) => void }) {
  const [mode, setMode] = useState<'loading' | 'setup' | 'login'>('loading');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  // Setup-mode fields
  const [setupKey, setSetupKey] = useState('');
  const [setupName, setSetupName] = useState('');
  const [setupUser, setSetupUser] = useState('');
  const [setupPass, setSetupPass] = useState('');
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    if (!hasSupabase || !supabase) { setMode('login'); return; }
    supabase.from('rc_users').select('*', { count: 'exact', head: true })
      .then(({ count }) => setMode((count ?? 0) === 0 ? 'setup' : 'login'));
  }, []);

  const EyeBtn = ({ vis, toggle }: { vis: boolean; toggle: () => void }) => (
    <button type="button" onClick={toggle} style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 0 }}>
      {vis
        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
    </button>
  );

  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setLoading(true);
    try {
      if (!supabase) throw new Error('No database connection.');
      const { data: rows } = await supabase.from('rc_users').select('*').eq('username', username.toLowerCase().trim()).eq('is_active', true);
      if (!rows?.length) { setErr('Invalid username or password.'); return; }
      const user = rows[0] as RcUser;
      const hash = await hashPassword(password);
      if (hash !== user.password_hash) { setErr('Invalid username or password.'); return; }
      const session: Session = { userId: user.id, username: user.username, name: user.name, role: user.role, partnerId: user.partner_id || '' };
      sessionStorage.setItem('rcTrackerSession', JSON.stringify(session));
      onLogin(session);
    } catch (ex: unknown) { setErr(ex instanceof Error ? ex.message : 'Login failed.'); }
    finally { setLoading(false); }
  };

  const doSetup = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setLoading(true);
    try {
      if (setupKey !== PASS) { setErr('Incorrect setup key.'); return; }
      if (!setupName.trim() || !setupUser.trim()) { setErr('Name and username are required.'); return; }
      if (setupPass.length < 8) { setErr('Password must be at least 8 characters.'); return; }
      const hash = await hashPassword(setupPass);
      const user: RcUser = { id: uid(), username: setupUser.toLowerCase().trim(), email: '', name: setupName.trim(), role: 'super_admin', partner_id: '', password_hash: hash, is_active: true, created_at: new Date().toISOString() };
      const { error } = await supabase!.from('rc_users').insert(user);
      if (error) { setErr(error.message); return; }
      const session: Session = { userId: user.id, username: user.username, name: user.name, role: 'super_admin', partnerId: '' };
      sessionStorage.setItem('rcTrackerSession', JSON.stringify(session));
      onLogin(session);
    } catch (ex: unknown) { setErr(ex instanceof Error ? ex.message : 'Setup failed.'); }
    finally { setLoading(false); }
  };

  const iconBox = (
    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '72px', height: '72px', background: 'linear-gradient(135deg,rgba(254,100,98,0.15),rgba(254,100,98,0.05))', border: '1px solid rgba(254,100,98,0.3)', borderRadius: '20px', marginBottom: '1.25rem', boxShadow: '0 0 40px rgba(254,100,98,0.15)' }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FE6462" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
    </div>
  );

  if (mode === 'loading') return (
    <div style={{ minHeight: '100vh', background: '#070b0f', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <SpaceBackground fixed />
      <div style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans, sans-serif', position: 'relative', zIndex: 1 }}>Loading…</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#070b0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'DM Sans, sans-serif', paddingTop: 'calc(80px + 2rem)', position: 'relative', overflow: 'hidden' }}>
      <SpaceBackground fixed />
      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1, animation: 'trackerFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          {iconBox}
          <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.04em', margin: '0 0 0.4rem', lineHeight: 1.1 }}>RevCore<br />{mode === 'setup' ? 'First Time Setup' : 'Tracker'}</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', margin: 0 }}>{mode === 'setup' ? 'Create your super admin account to get started' : 'Internal use only · Authorized access required'}</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '2rem', backdropFilter: 'blur(20px)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
          {mode === 'setup' ? (
            <form onSubmit={doSetup}>
              <label style={lbl}>Setup Key</label>
              <div style={{ marginBottom: '1rem' }}>
                <input type="password" value={setupKey} onChange={e => setSetupKey(e.target.value)} placeholder="Enter setup key" required style={inp} onFocus={e => e.target.style.borderColor='rgba(254,100,98,0.6)'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.12)'} />
              </div>
              <label style={lbl}>Your Full Name</label>
              <div style={{ marginBottom: '1rem' }}>
                <input type="text" value={setupName} onChange={e => { setSetupName(e.target.value); if (!setupUser) setSetupUser(generateUsername(e.target.value)); }} placeholder="Hayden Mitchell" required style={inp} onFocus={e => e.target.style.borderColor='rgba(254,100,98,0.6)'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.12)'} />
              </div>
              <label style={lbl}>Username</label>
              <div style={{ marginBottom: '1rem' }}>
                <input type="text" value={setupUser} onChange={e => setSetupUser(e.target.value)} placeholder="hayden.m" required style={inp} onFocus={e => e.target.style.borderColor='rgba(254,100,98,0.6)'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.12)'} />
              </div>
              <label style={lbl}>Password</label>
              <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                <input type={showSetup ? 'text' : 'password'} value={setupPass} onChange={e => setSetupPass(e.target.value)} placeholder="Min 8 characters" required style={{ ...inp, paddingRight: '7rem' }} onFocus={e => e.target.style.borderColor='rgba(254,100,98,0.6)'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.12)'} />
                <div style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <button type="button" onClick={() => setSetupPass(generatePassword())} style={{ background: 'rgba(254,100,98,0.15)', border: '1px solid rgba(254,100,98,0.3)', borderRadius: '6px', color: '#FE6462', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer', padding: '3px 7px', fontFamily: 'DM Sans' }}>Gen</button>
                  <EyeBtn vis={showSetup} toggle={() => setShowSetup(v => !v)} />
                </div>
              </div>
              {err && <div style={{ background: 'rgba(254,100,98,0.1)', border: '1px solid rgba(254,100,98,0.3)', borderRadius: '10px', padding: '0.65rem 1rem', color: '#FE6462', fontSize: '0.83rem', marginBottom: '1rem' }}>{err}</div>}
              <button type="submit" disabled={loading} style={{ ...btn('primary'), width: '100%', padding: '0.85rem', fontSize: '0.92rem' }}>{loading ? 'Creating account…' : 'Create Super Admin'}</button>
            </form>
          ) : (
            <form onSubmit={doLogin}>
              <label style={lbl}>Username</label>
              <div style={{ marginBottom: '1rem' }}>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="your.username" required style={inp} onFocus={e => e.target.style.borderColor='rgba(254,100,98,0.6)'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.12)'} />
              </div>
              <label style={lbl}>Password</label>
              <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required style={{ ...inp, paddingRight: '3rem' }} onFocus={e => e.target.style.borderColor='rgba(254,100,98,0.6)'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.12)'} />
                <EyeBtn vis={show} toggle={() => setShow(v => !v)} />
              </div>
              {err && <div style={{ background: 'rgba(254,100,98,0.1)', border: '1px solid rgba(254,100,98,0.3)', borderRadius: '10px', padding: '0.65rem 1rem', color: '#FE6462', fontSize: '0.83rem', marginBottom: '1rem' }}>{err}</div>}
              <button type="submit" disabled={loading} style={{ ...btn('primary'), width: '100%', padding: '0.85rem', fontSize: '0.92rem' }}>{loading ? 'Signing in…' : 'Sign In'}</button>
            </form>
          )}
        </div>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.18)', fontSize: '0.73rem', marginTop: '1.25rem' }}>RevCore Internal Tools · Confidential</p>
      </div>
    </div>
  );
}

// ─── Client Modal ─────────────────────────────────────────────────────────────
function ClientModal({ client, partners, packages, onSave, onClose }: { client?: Client; partners: Partner[]; packages: ServicePkg[]; onSave: (c: Omit<Client, 'id' | 'at'>, isNew: boolean) => void; onClose: () => void }) {
  const [f, setF] = useState<Omit<Client, 'id' | 'at'>>(client ? { ...client } : blankC());
  const set = (k: keyof typeof f, v: unknown) => setF(p => {
    const next = { ...p, [k]: v };
    // Auto-set nextDue to 1 month after start for recurring plans (new clients only)
    if (!client && (k === 'start' || k === 'planT')) {
      const start = k === 'start' ? v as string : p.start;
      const planT = k === 'planT' ? v as string : p.planT;
      if (start && planT === 'recurring') {
        const d = new Date(start + 'T00:00:00');
        d.setMonth(d.getMonth() + 1);
        next.nextDue = d.toISOString().slice(0, 10);
      }
    }
    // When enabling upsell, snapshot current pkg/amount as the originals
    if (k === 'isUpsold' && v === true && !p.origPkg) {
      next.origPkg = p.pkg;
      next.origAmount = p.amount;
    }
    return next;
  });
  const gr: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' };
  const section = (title: string) => <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '1.25rem', marginBottom: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>{title}</div>;
  const field = (label: string, node: React.ReactNode) => <div><label style={lbl}>{label}</label>{node}</div>;
  const sel = (val: string, onChange: (v: string) => void, options: [string, string][]) => (
    <select value={val} onChange={e => onChange(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
  const numInp = (val: number, onChange: (n: number) => void) => (
    <input type="number" value={val || ''} onChange={e => onChange(parseFloat(e.target.value) || 0)} style={inp}
      onFocus={e => e.target.style.borderColor = 'rgba(254,100,98,0.6)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
  );
  const txtInp = (val: string, onChange: (s: string) => void, placeholder = '') => (
    <input type="text" value={val} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inp}
      onFocus={e => e.target.style.borderColor = 'rgba(254,100,98,0.6)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
  );
  const dateInp = (val: string, onChange: (s: string) => void) => (
    <input type="date" value={val} onChange={e => onChange(e.target.value)} style={inp}
      onFocus={e => e.target.style.borderColor = 'rgba(254,100,98,0.6)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem', overflowY: 'auto', backdropFilter: 'blur(6px)' }}>
      <div style={{ width: '100%', maxWidth: '680px', background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '2rem', marginTop: '80px', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>{client ? 'Edit Client' : 'Add New Client'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.4rem', lineHeight: 1, padding: 0 }}>×</button>
        </div>

        {section('Client Info')}
        <div style={gr}>
          {field('Client Name *', txtInp(f.name, v => set('name', v), 'John Smith'))}
          {field('Company', txtInp(f.company, v => set('company', v), 'Acme Inc.'))}
          {field('Package', txtInp(f.pkg, v => set('pkg', v), 'Growth Package'))}
          {field('GHL Contact ID', txtInp(f.ghlId, v => set('ghlId', v), 'GHL-XXXXXXXXX'))}
        </div>

        {section('Payment Details')}
        {packages.length > 0 && (
          <div style={{ marginBottom: '0.85rem' }}>
            <label style={lbl}>Quick Fill from Standard Package</label>
            <select defaultValue="" onChange={e => {
              const pkg = packages.find(p => p.id === e.target.value);
              if (!pkg) return;
              setF(p => ({ ...p, pkg: pkg.name, amount: pkg.price, planT: pkg.planT }));
              e.target.value = '';
            }} style={{ ...inp, cursor: 'pointer' }}>
              <option value="">— Select a package to fill —</option>
              {packages.map(p => <option key={p.id} value={p.id}>{p.name} · {fmtM(p.price)}{p.planT === 'recurring' ? '/mo' : ''}</option>)}
            </select>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.3rem' }}>Fills package name, amount, and plan type. You can override any field after.</div>
          </div>
        )}
        <div style={gr}>
          {field('Plan Type', sel(f.planT, v => set('planT', v as PlanT), [['recurring', 'Recurring'], ['one-time', 'One-Time']]))}
          {field('Payment Amount ($)', numInp(f.amount, v => set('amount', v)))}
          {field('Start Date *', dateInp(f.start, v => set('start', v)))}
          {f.planT === 'recurring' ? field('Renewal Date', dateInp(f.renewal, v => set('renewal', v))) : <div />}
          {field('Next Due Date', dateInp(f.nextDue, v => set('nextDue', v)))}
          {field('Payment Status', sel(f.payStat, v => set('payStat', v as PayStat), [['current', 'Current'], ['overdue', 'Overdue'], ['failed', 'Failed']]))}
        </div>

        {section('Split / Staged Payment')}
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', marginBottom: '0.75rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', fontWeight: 600 }}>
          <input type="checkbox" checked={f.isSplit} onChange={e => set('isSplit', e.target.checked)} style={{ accentColor: '#FE6462', width: '15px', height: '15px' }} />
          This deal has a split/staged payment
        </label>
        {f.isSplit && (
          <div style={gr}>
            {field('Deposit Amount ($)', numInp(f.deposit, v => set('deposit', v)))}
            {field('Balance Amount ($)', numInp(f.bal, v => set('bal', v)))}
            {field('Deposit Status', sel(f.depPaid ? 'paid' : 'pending', v => set('depPaid', v === 'paid'), [['pending', 'Pending'], ['paid', 'Paid']]))}
            {field('Balance Status', sel(f.balPaid ? 'paid' : 'pending', v => set('balPaid', v === 'paid'), [['pending', 'Pending'], ['paid', 'Paid']]))}
            <div style={{ gridColumn: '1/-1' }}>{field('When is balance due?', txtInp(f.balNote, v => set('balNote', v), 'e.g. After first 3 appointments'))}</div>
          </div>
        )}

        {section('Sales Team')}
        <div style={gr}>
          {field('Setter', sel(f.setterId, v => set('setterId', v), [['', '— None —'], ...partners.filter(p => p.active !== false).map(p => [p.id, p.name] as [string, string])]))}
          {field('Closer', sel(f.closerId, v => set('closerId', v), [['', '— None —'], ...partners.filter(p => p.active !== false).map(p => [p.id, p.name] as [string, string])]))}
        </div>

        {section('Initial Commission (Deal Close)')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.85rem', marginBottom: '0.75rem' }}>
          <div><label style={lbl}>Setter — Type</label>{sel(f.setterInitT, v => set('setterInitT', v as InitCommT), [['none', 'None'], ['pct', 'Percentage (%)'], ['fixed', 'Fixed ($)']])}</div>
          <div><label style={lbl}>Setter — Value</label>{numInp(f.setterInitV, v => set('setterInitV', v))}</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.1rem' }}>
            <div style={{ ...card, padding: '0.5rem 0.75rem', background: 'rgba(254,100,98,0.07)', width: '100%' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Setter earns</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FE6462' }}>{fmtM(calcInit({ ...f, id: '', at: '' }, 'setter'))}</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.85rem' }}>
          <div><label style={lbl}>Closer — Type</label>{sel(f.closerInitT, v => set('closerInitT', v as InitCommT), [['none', 'None'], ['pct', 'Percentage (%)'], ['fixed', 'Fixed ($)']])}</div>
          <div><label style={lbl}>Closer — Value</label>{numInp(f.closerInitV, v => set('closerInitV', v))}</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.1rem' }}>
            <div style={{ ...card, padding: '0.5rem 0.75rem', background: 'rgba(107,142,254,0.07)', width: '100%' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Closer earns</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#6B8EFE' }}>{fmtM(calcInit({ ...f, id: '', at: '' }, 'closer'))}</div>
            </div>
          </div>
        </div>

        {section('Ongoing Commission (Renewals)')}
        <div style={gr}>
          {field('Commission Type', sel(f.ongoingT, v => set('ongoingT', v as OngoingT), [['none', 'None'], ['pct-renewal', '% of Renewal Payment'], ['rev-share', '% Revenue Share']]))}
          {field('Applies To', sel(f.ongoingFor, v => set('ongoingFor', v as CommFor), [['none', '— None —'], ['closer', 'Closer Only'], ['setter', 'Setter Only'], ['both', 'Both (split evenly']]))}
          {f.ongoingT !== 'none' && field('Percentage (%)', numInp(f.ongoingV, v => set('ongoingV', v)))}
          {f.ongoingT !== 'none' && (
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <div style={{ ...card, padding: '0.5rem 0.75rem', background: 'rgba(148,217,107,0.07)', width: '100%' }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Per cycle</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#94D96B' }}>{fmtM(calcOngoing({ ...f, id: '', at: '' }))}</div>
              </div>
            </div>
          )}
        </div>

        {section('Upsell Tracking')}
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', marginBottom: '0.75rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', fontWeight: 600 }}>
          <input type="checkbox" checked={f.isUpsold || false} onChange={e => set('isUpsold', e.target.checked)} style={{ accentColor: '#B47AFF', width: '15px', height: '15px' }} />
          This client was upsold to a new package
        </label>
        {f.isUpsold && (
          <>
            <div style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>
              The <strong style={{ color: 'rgba(255,255,255,0.5)' }}>new package</strong> fields update the client&apos;s active package used in all revenue calculations.
            </div>
            <div style={{ ...gr, marginBottom: '0.75rem', padding: '0.85rem', background: 'rgba(180,122,255,0.06)', border: '1px solid rgba(180,122,255,0.15)', borderRadius: '12px' }}>
              <div style={{ gridColumn: '1/-1', fontSize: '0.68rem', fontWeight: 700, color: '#B47AFF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Original (what they started on)</div>
              {field('Original Package', txtInp(f.origPkg || '', v => set('origPkg', v), 'e.g. 15 Appointments'))}
              {field('Original Amount ($)', numInp(f.origAmount || 0, v => set('origAmount', v)))}
            </div>
            <div style={{ ...gr, padding: '0.85rem', background: 'rgba(148,217,107,0.06)', border: '1px solid rgba(148,217,107,0.15)', borderRadius: '12px' }}>
              <div style={{ gridColumn: '1/-1', fontSize: '0.68rem', fontWeight: 700, color: '#94D96B', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>New Package (drives MRR & revenue)</div>
              {field('New Package', txtInp(f.pkg, v => set('pkg', v), 'e.g. Retainer'))}
              {field('New Amount ($)', numInp(f.amount, v => set('amount', v)))}
              {field('New Plan Type', sel(f.planT, v => set('planT', v as PlanT), [['recurring', 'Recurring'], ['one-time', 'One-Time']]))}
              {field('Upsell Date', dateInp(f.upsoldAt || '', v => set('upsoldAt', v)))}
            </div>
          </>
        )}

        {section('Appointment Tracking')}
        <div style={{ marginBottom: '0.5rem', fontSize: '0.73rem', color: 'rgba(255,255,255,0.3)' }}>For appointment-based packages — track delivery progress.</div>
        <div style={gr}>
          {field('Appointments Contracted', numInp(f.apptTotal || 0, v => set('apptTotal', v)))}
          {field('Appointments Delivered', numInp(f.apptDelivered || 0, v => set('apptDelivered', v)))}
        </div>
        {(f.apptTotal || 0) > 0 && (
          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>Progress</span>
              <span style={{ fontSize: '0.72rem', color: '#fff', fontWeight: 700 }}>{f.apptDelivered || 0} / {f.apptTotal}</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '6px', height: '6px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, ((f.apptDelivered || 0) / (f.apptTotal || 1)) * 100)}%`, background: '#26D9B0', borderRadius: '6px' }} />
            </div>
          </div>
        )}

        {section('Status & Notes')}
        <div style={gr}>
          {field('Pipeline Stage', sel(f.stage, v => set('stage', v as Stage), [['onboarding','Onboarding'],['balance-pending','Balance Pending'],['active','Active'],['at-risk','At Risk'],['paused','Paused'],['churned','Churned']]))}
          <div />
        </div>
        <div style={{ marginTop: '0.75rem' }}>{field('Notes', <textarea value={f.notes} onChange={e => set('notes', e.target.value)} rows={3} placeholder="Any relevant notes…" style={{ ...inp, resize: 'vertical', lineHeight: 1.5 }} />)}</div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={onClose} style={btn('ghost')}>Cancel</button>
          <button onClick={() => { if (!f.name.trim() || !f.start) return; onSave(f, !client); }} disabled={!f.name.trim() || !f.start} style={{ ...btn('primary'), opacity: (!f.name.trim() || !f.start) ? 0.4 : 1, cursor: (!f.name.trim() || !f.start) ? 'not-allowed' : 'pointer' }}>{client ? 'Save Changes' : 'Add Client'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
/* ─── Drill Panel ─────────────────────────────────────────────────────────── */
function DrillPanel({ title, subtitle, onClose, children }: { title: string; subtitle: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: '#070b0f', zIndex: 900, animation: 'drillFadeIn 0.2s ease both' }} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(580px,100vw)', background: '#0b0f16', borderLeft: '1px solid rgba(255,255,255,0.08)', zIndex: 901, display: 'flex', flexDirection: 'column', animation: 'drillSlideIn 0.38s cubic-bezier(0.16,1,0.3,1) both', boxShadow: '-24px 0 80px rgba(0,0,0,0.6)' }}>
        <div style={{ padding: '1.5rem 1.75rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <h3 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>{title}</h3>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', margin: 0 }}>{subtitle}</p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '34px', height: '34px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.9rem', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.75rem' }}>{children}</div>
      </div>
    </>
  );
}

/* ─── Client drill card ───────────────────────────────────────────────────── */
function ClientDrillCard({ client, partners, comms }: { client: Client; partners: Partner[]; comms: Commission[] }) {
  const [hov, setHov] = useState(false);
  const setter = partners.find(p => p.id === client.setterId);
  const closer = partners.find(p => p.id === client.closerId);
  const pendingComm = comms.filter(c => c.clientId === client.id && c.stat === 'pending').reduce((s, c) => s + c.amount, 0);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: hov ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${hov ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '14px', padding: '1rem 1.1rem', marginBottom: '0.7rem', transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)', transform: hov ? 'translateY(-2px)' : 'none', boxShadow: hov ? '0 8px 24px rgba(0,0,0,0.3)' : 'none' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.55rem' }}>
        <div>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem', letterSpacing: '-0.01em' }}>{client.company || client.name}</div>
          {client.company && <div style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.38)', marginTop: '1px' }}>{client.name}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span style={badge(STAGES[client.stage].color)}>{STAGES[client.stage].label}</span>
          <span style={{ color: '#94D96B', fontWeight: 800, fontSize: '0.92rem' }}>{fmtM(client.amount)}{client.planT === 'recurring' && <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>/mo</span>}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem 1.25rem', fontSize: '0.74rem', color: 'rgba(255,255,255,0.38)' }}>
        {client.pkg && <span>{client.pkg}</span>}
        {setter && <span>Setter: <b style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{setter.name}</b></span>}
        {closer && <span>Closer: <b style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{closer.name}</b></span>}
        {client.start && <span>Started: <b style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{fmtD(client.start)}</b></span>}
        {pendingComm > 0 && <span style={{ color: '#F59E0B', fontWeight: 600 }}>Comm owed: {fmtM(pendingComm)}</span>}
      </div>
      {(!client.depPaid || (!client.balPaid && client.bal > 0)) && (
        <div style={{ display: 'flex', gap: '6px', marginTop: '0.55rem', flexWrap: 'wrap' }}>
          {!client.depPaid && <span style={{ ...badge('#F59E0B'), fontSize: '0.67rem' }}>Deposit pending</span>}
          {client.depPaid && !client.balPaid && client.bal > 0 && <span style={{ ...badge('#6B8EFE'), fontSize: '0.67rem' }}>Balance {fmtM(client.bal)}{client.balNote ? ` — ${client.balNote}` : ''}</span>}
        </div>
      )}
    </div>
  );
}

/* ─── Pipeline stage row ─────────────────────────────────────────────────── */
function StageRow({ stage, count, stageClients, totalClients, partners, comms, onDrill }:
  { stage: Stage; count: number; stageClients: Client[]; totalClients: number; partners: Partner[]; comms: Commission[]; onDrill: (title: string, subtitle: string, content: React.ReactNode) => void }) {
  const [hov, setHov] = useState(false);
  const pct = totalClients > 0 ? (count / totalClients) * 100 : 0;
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={() => count > 0 && onDrill(STAGES[stage].label, `${count} client${count !== 1 ? 's' : ''} in this stage`, <>{[...stageClients].sort((a,b) => b.amount - a.amount).map(c => <ClientDrillCard key={c.id} client={c} partners={partners} comms={comms} />)}</>)}
      style={{ padding: '0.6rem 0.75rem', borderRadius: '10px', background: hov && count > 0 ? 'rgba(255,255,255,0.05)' : 'transparent', cursor: count > 0 ? 'pointer' : 'default', transition: 'background 0.2s', marginLeft: '-0.75rem', marginRight: '-0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: hov && count > 0 ? '#fff' : 'rgba(255,255,255,0.7)', transition: 'color 0.2s' }}>{STAGES[stage].label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: STAGES[stage].color }}>{count}</span>
          {count > 0 && <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', opacity: hov ? 1 : 0, transition: 'opacity 0.2s' }}>↗</span>}
        </div>
      </div>
      <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: STAGES[stage].color, borderRadius: '3px', transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)', boxShadow: `0 0 8px ${STAGES[stage].color}66` }} />
      </div>
    </div>
  );
}

/* ─── Commission breakdown row ───────────────────────────────────────────── */
function CommRow({ label, pending, paid, color, pendingComms, paidComms, commDrill, onDrill }:
  { label: string; pending: number; paid: number; color: string; pendingComms: Commission[]; paidComms: Commission[]; commDrill: (comms: Commission[], role: string) => React.ReactNode; onDrill: (title: string, subtitle: string, content: React.ReactNode) => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={() => onDrill(`${label} Commissions`, `${pendingComms.length} pending · ${fmtM(pending)} owed`, commDrill([...pendingComms, ...paidComms], label.toLowerCase().slice(0, -1)))}
      style={{ background: hov ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)', border: `1px solid ${hov ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '12px', padding: '1rem', cursor: 'pointer', transition: 'all 0.2s', transform: hov ? 'translateY(-2px)' : 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ fontWeight: 700, color, fontSize: '0.88rem' }}>{label}</span>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={badge(pending > 0 ? '#F59E0B' : '#94D96B')}>{pendingComms.length} pending</span>
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', opacity: hov ? 1 : 0, transition: 'opacity 0.2s' }}>↗</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        <div><div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600, marginBottom: '2px' }}>PENDING</div><div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F59E0B' }}>{fmtM(pending)}</div></div>
        <div><div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600, marginBottom: '2px' }}>PAID OUT</div><div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#94D96B' }}>{fmtM(paid)}</div></div>
      </div>
    </div>
  );
}

/* ─── Recent client table row ─────────────────────────────────────────────── */
function RecentClientRow({ c, pName, partners, comms, onDrill }:
  { c: Client; pName: (id: string) => string; partners: Partner[]; comms: Commission[]; onDrill: (title: string, subtitle: string, content: React.ReactNode) => void }) {
  const [hov, setHov] = useState(false);
  return (
    <tr onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={() => onDrill(c.company || c.name, `${c.pkg || 'No package'} · ${STAGES[c.stage].label}`, <ClientDrillCard client={c} partners={partners} comms={comms} />)}
      style={{ background: hov ? 'rgba(255,255,255,0.04)' : 'transparent', cursor: 'pointer', transition: 'background 0.15s' }}>
      <td style={tdStyle}><div style={{ fontWeight: 700, color: '#fff' }}>{c.name}</div>{c.company && <div style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.3)' }}>{c.company}</div>}</td>
      <td style={tdStyle}>{c.pkg || '—'}</td>
      <td style={tdStyle}><span style={{ color: '#94D96B', fontWeight: 700 }}>{fmtM(c.amount)}</span>{c.planT === 'recurring' && <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>/mo</span>}</td>
      <td style={tdStyle}><span style={badge(STAGES[c.stage].color)}>{STAGES[c.stage].label}</span></td>
      <td style={tdStyle}>{pName(c.setterId)}</td>
      <td style={tdStyle}>{pName(c.closerId)}</td>
    </tr>
  );
}

/* ─── All Clients drill (stage filter tabs + cards) ─────────────────────── */
function AllClientsDrill({ data }: { data: AppData }) {
  const [stageF, setStageF] = useState<Stage | 'all'>('all');
  const stages = Object.keys(STAGES) as Stage[];
  const shown = (stageF === 'all' ? [...data.clients] : data.clients.filter(c => c.stage === stageF))
    .sort((a, b) => b.amount - a.amount);
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.25rem' }}>
        <button onClick={() => setStageF('all')} style={{ border: 'none', borderRadius: '100px', padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', background: stageF === 'all' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)', color: stageF === 'all' ? '#fff' : 'rgba(255,255,255,0.5)' }}>
          All ({data.clients.length})
        </button>
        {stages.map(s => {
          const count = data.clients.filter(c => c.stage === s).length;
          if (count === 0) return null;
          return (
            <button key={s} onClick={() => setStageF(s)} style={{ border: `1px solid ${stageF === s ? STAGES[s].color + '88' : 'transparent'}`, borderRadius: '100px', padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', background: stageF === s ? STAGES[s].color + '22' : 'rgba(255,255,255,0.06)', color: stageF === s ? STAGES[s].color : 'rgba(255,255,255,0.5)' }}>
              {STAGES[s].label} ({count})
            </button>
          );
        })}
      </div>
      {shown.length === 0
        ? <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>No clients in this stage.</p>
        : shown.map(c => <ClientDrillCard key={c.id} client={c} partners={data.partners} comms={data.comms} />)
      }
    </div>
  );
}

/* ─── KPI card (top-level so React doesn't remount on parent re-renders) ─── */
function KpiCard({ label, value, sub, color, delay, onClick }: { label: string; value: string; sub?: string; color: string; delay: number; onClick?: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onClick}
      style={{ ...glassCard, borderTop: `3px solid ${color}`, animation: `cardReveal 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}s both`, cursor: onClick ? 'pointer' : 'default', transform: hov && onClick ? 'translateY(-5px)' : 'none', boxShadow: hov && onClick ? `0 16px 40px rgba(0,0,0,0.35), 0 0 0 1px ${color}28` : 'none', background: hov && onClick ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.03)', transition: 'transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s, background 0.25s' }}>
      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.07em', textTransform: 'uppercase' as const, marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
        {label}
        {onClick && <span style={{ opacity: hov ? 0.7 : 0.2, transition: 'opacity 0.2s', fontSize: '0.9rem' }}>↗</span>}
      </div>
      <div style={{ fontSize: '1.8rem', fontWeight: 800, color, letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.4rem' }}>{sub}</div>}
    </div>
  );
}

/* ─── Revenue & Growth Chart ─────────────────────────────────────────────── */
function RevenueChart({ data }: { data: AppData }) {
  const [hovIdx, setHovIdx]     = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const revPathRef = useRef<SVGPathElement>(null);
  const cliPathRef = useRef<SVGPathElement>(null);
  const [revLen, setRevLen] = useState(1000);
  const [cliLen, setCliLen] = useState(1000);

  // Last 12 months
  const pts = useMemo(() => {
    const months: string[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - i);
      months.push(d.toISOString().slice(0, 7));
    }
    const currentMonth = today().slice(0, 7);
    return months.map(m => {
      // Use start date (actual service start) for historical accuracy.
      // Historical months include churned clients; current month excludes them.
      const active = data.clients.filter(c => {
        const d = c.start || c.at;
        if (!d || d.slice(0, 7) > m) return false;
        if (m >= currentMonth) return c.stage !== 'churned' && c.stage !== 'paused';
        return true;
      });
      const newC = data.clients.filter(c => (c.start || c.at)?.startsWith(m));
      return {
        label:      new Date(m + '-15').toLocaleString('en-US', { month: 'short', year: '2-digit' }),
        revenue:    active.reduce((s, c) => s + monthlyVal(c), 0),
        clients:    active.length,
        newClients: newC.length,
      };
    });
  }, [data.clients]);

  useEffect(() => {
    const t = setTimeout(() => {
      setRevealed(true);
      if (revPathRef.current) setRevLen(revPathRef.current.getTotalLength());
      if (cliPathRef.current) setCliLen(cliPathRef.current.getTotalLength());
    }, 80);
    return () => clearTimeout(t);
  }, [pts]);

  const W = 900, H = 220, PL = 60, PR = 20, PT = 16, PB = 36;
  const iW = W - PL - PR, iH = H - PT - PB;

  const maxRev = Math.max(...pts.map(p => p.revenue), 1);
  const maxCli = Math.max(...pts.map(p => p.clients), 1);
  const x  = (i: number) => PL + (i / (pts.length - 1)) * iW;
  const yR = (v: number) => PT + iH - (v / maxRev) * iH;
  const yC = (v: number) => PT + iH - (v / maxCli) * iH;

  const smooth = (points: [number, number][]) => {
    if (points.length < 2) return `M${points[0]?.[0] ?? 0} ${points[0]?.[1] ?? 0}`;
    let d = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      const cx = (points[i-1][0] + points[i][0]) / 2;
      d += ` C ${cx} ${points[i-1][1]}, ${cx} ${points[i][1]}, ${points[i][0]} ${points[i][1]}`;
    }
    return d;
  };

  const revPts: [number,number][] = pts.map((p,i) => [x(i), yR(p.revenue)]);
  const cliPts: [number,number][] = pts.map((p,i) => [x(i), yC(p.clients)]);
  const revPath  = smooth(revPts);
  const cliPath  = smooth(cliPts);
  const revArea  = revPath  + ` L ${x(pts.length-1)} ${PT+iH} L ${x(0)} ${PT+iH} Z`;
  const cliArea  = cliPath  + ` L ${x(pts.length-1)} ${PT+iH} L ${x(0)} ${PT+iH} Z`;
  const fmtK = (v: number) => v >= 1000 ? `$${(v/1000).toFixed(1)}k` : `$${v}`;

  const tip = hovIdx !== null ? pts[hovIdx] : null;
  const tipX = hovIdx !== null ? (x(hovIdx) / W) * 100 : 0;
  const tipLeft = hovIdx !== null && hovIdx > pts.length * 0.65;

  return (
    <div style={{ ...glassCard, marginBottom: '1.25rem', animation: 'cardReveal 0.5s cubic-bezier(0.16,1,0.3,1) 0.42s both' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.1rem' }}>
        <div>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', letterSpacing: '-0.01em' }}>Revenue & Growth</div>
          <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>Cumulative MRR vs active clients · last 12 months</div>
        </div>
        <div style={{ display: 'flex', gap: '1.1rem', fontSize: '0.73rem' }}>
          {[['#94D96B','#26D9B0','MRR'],['#6B8EFE','#B47AFF','Clients']].map(([c1,c2,label]) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(255,255,255,0.45)' }}>
              <span style={{ width: '22px', height: '2.5px', background: `linear-gradient(to right,${c1},${c2})`, display: 'inline-block', borderRadius: '2px', boxShadow: `0 0 6px ${c1}88` }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative' }} onMouseLeave={() => setHovIdx(null)}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', overflow: 'visible', display: 'block' }}>
          <defs>
            <linearGradient id="rcRevGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#94D96B" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#94D96B" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="rcCliGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#6B8EFE" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6B8EFE" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="rcRevLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#94D96B" /><stop offset="100%" stopColor="#26D9B0" />
            </linearGradient>
            <linearGradient id="rcCliLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6B8EFE" /><stop offset="100%" stopColor="#B47AFF" />
            </linearGradient>
            <filter id="glowGreen"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <filter id="glowBlue"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>

          {/* Horizontal grid lines */}
          {[0.25, 0.5, 0.75, 1].map(t => (
            <g key={t}>
              <line x1={PL} y1={PT + iH*(1-t)} x2={PL+iW} y2={PT + iH*(1-t)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <text x={PL-6} y={PT + iH*(1-t) + 4} textAnchor="end" style={{ fontSize: '9px', fill: 'rgba(255,255,255,0.22)', fontFamily: 'DM Sans,sans-serif' }}>{fmtK(maxRev*t)}</text>
            </g>
          ))}

          {/* Area fills (fade in) */}
          <path d={revArea} fill="url(#rcRevGrad)" style={{ opacity: revealed ? 1 : 0, transition: 'opacity 1.2s ease 0.6s' }} />
          <path d={cliArea} fill="url(#rcCliGrad)" style={{ opacity: revealed ? 1 : 0, transition: 'opacity 1.2s ease 0.8s' }} />

          {/* Lines (stroke-dashoffset reveal) */}
          <path ref={revPathRef} d={revPath} fill="none" stroke="url(#rcRevLine)" strokeWidth="2.5" strokeLinecap="round"
            filter="url(#glowGreen)"
            strokeDasharray={revLen} strokeDashoffset={revealed ? 0 : revLen}
            style={{ transition: 'stroke-dashoffset 1.6s cubic-bezier(0.16,1,0.3,1) 0.1s' }} />
          <path ref={cliPathRef} d={cliPath} fill="none" stroke="url(#rcCliLine)" strokeWidth="2" strokeLinecap="round"
            filter="url(#glowBlue)"
            strokeDasharray={cliLen} strokeDashoffset={revealed ? 0 : cliLen}
            style={{ transition: 'stroke-dashoffset 1.6s cubic-bezier(0.16,1,0.3,1) 0.35s' }} />

          {/* Hover vertical line + dots */}
          {hovIdx !== null && (
            <>
              <line x1={x(hovIdx)} y1={PT} x2={x(hovIdx)} y2={PT+iH} stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 3" />
              <circle cx={x(hovIdx)} cy={yR(pts[hovIdx].revenue)} r="5" fill="#94D96B" stroke="#070b0f" strokeWidth="2.5" filter="url(#glowGreen)" />
              <circle cx={x(hovIdx)} cy={yC(pts[hovIdx].clients)} r="4.5" fill="#6B8EFE" stroke="#070b0f" strokeWidth="2.5" filter="url(#glowBlue)" />
            </>
          )}

          {/* Invisible hover zones */}
          {pts.map((_, i) => (
            <rect key={i} x={x(i) - iW/(pts.length*2)} y={PT} width={iW/pts.length} height={iH}
              fill="transparent" onMouseEnter={() => setHovIdx(i)} style={{ cursor: 'crosshair' }} />
          ))}

          {/* X axis labels */}
          {pts.map((p, i) => (
            <text key={i} x={x(i)} y={H-6} textAnchor="middle"
              style={{ fontSize: '9px', fill: hovIdx===i ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.28)', fontFamily: 'DM Sans,sans-serif', transition: 'fill 0.15s', fontWeight: hovIdx===i ? '700' : '400' }}>
              {p.label}
            </text>
          ))}
        </svg>

        {/* Tooltip */}
        {tip && (
          <div style={{ position: 'absolute', top: '8px', left: tipLeft ? 'auto' : `calc(${tipX}% + 14px)`, right: tipLeft ? `calc(${100-tipX}% + 14px)` : 'auto', background: 'rgba(13,17,23,0.97)', border: '1px solid rgba(255,255,255,0.13)', borderRadius: '12px', padding: '0.6rem 0.9rem', pointerEvents: 'none', zIndex: 10, minWidth: '130px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
            <div style={{ fontWeight: 700, color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', marginBottom: '6px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{tip.label}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
              <span style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.4)' }}>MRR</span>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#94D96B' }}>{fmtM(tip.revenue)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: tip.newClients > 0 ? '3px' : 0 }}>
              <span style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.4)' }}>Clients</span>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#6B8EFE' }}>{tip.clients}</span>
            </div>
            {tip.newClients > 0 && (
              <div style={{ fontSize: '0.7rem', color: '#26D9B0', marginTop: '4px', paddingTop: '4px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>+{tip.newClients} new this month</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Overview tab ────────────────────────────────────────────────────────── */
function OverviewTab({ data, setData }: { data: AppData; setData: (d: AppData) => void }) {
  const [drill, setDrill] = useState<{ title: string; subtitle: string; content: React.ReactNode } | null>(null);

  // Retainer MRR: only true recurring clients that are active (exclude at-risk / paused / churned)
  const retainerClients = data.clients.filter(c => c.planT === 'recurring' && !c.pkg.toLowerCase().includes('ppa') && c.stage !== 'churned' && c.stage !== 'at-risk' && c.stage !== 'paused');
  const retainerMRR   = retainerClients.reduce((s, c) => s + c.amount, 0);
  // Total Monthly Revenue: every non-churned, non-paused client — PPA @ $2k, appt packages treated as monthly
  const totalMonthlyClients = data.clients.filter(c => c.stage !== 'churned' && c.stage !== 'paused');
  const totalMonthly  = totalMonthlyClients.reduce((s, c) => s + monthlyVal(c), 0);
  const activeClients  = data.clients.filter(c => c.stage === 'active');
  const atRiskClients  = data.clients.filter(c => c.stage === 'at-risk');
  const lastMonthStr   = (() => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - 1); return d.toISOString().slice(0, 7); })();
  const lastMonthRev   = data.clients.filter(c => { const d = c.start || c.at; return d && d.slice(0, 7) <= lastMonthStr; }).reduce((s, c) => s + monthlyVal(c), 0);
  const momGrowthPct   = lastMonthRev > 0 ? ((totalMonthly - lastMonthRev) / lastMonthRev) * 100 : null;
  const projectedARR   = totalMonthly * 12;


  const stageCounts   = (Object.keys(STAGES) as Stage[]).map(s => ({ stage: s, count: data.clients.filter(c => c.stage === s).length, clients: data.clients.filter(c => c.stage === s) }));
  const recentClients = [...data.clients].sort((a, b) => (b.start || b.at).localeCompare(a.start || a.at)).slice(0, 8);
  const pName = (id: string) => data.partners.find(p => p.id === id)?.name || '—';

  const thisMonth        = today().slice(0, 7);
  const newThisMonth     = data.clients.filter(c => c.start && c.start.startsWith(thisMonth));
  const newMonthRevenue  = newThisMonth.reduce((s, c) => s + monthlyVal(c), 0);
  const cashOutstanding  = data.clients.reduce((s, c) =>
    s + (!c.depPaid ? c.deposit : 0) + (!c.balPaid && c.bal > 0 ? c.bal : 0), 0);
  const avgValue         = data.clients.filter(c => c.stage !== 'churned').length > 0
    ? data.clients.filter(c => c.stage !== 'churned').reduce((s, c) => s + c.amount, 0) / data.clients.filter(c => c.stage !== 'churned').length
    : 0;

  return (
    <div>
      {drill && (
        <DrillPanel title={drill.title} subtitle={drill.subtitle} onClose={() => setDrill(null)}>
          {drill.content}
        </DrillPanel>
      )}

      <div style={{ marginBottom: '2rem', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
        <h2 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.3rem', letterSpacing: '-0.03em' }}>Agency Overview</h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', margin: 0 }}>Click any metric to drill in</p>
      </div>

      {/* Row 1 — Revenue */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
        <KpiCard label="Retainer MRR" value={fmtM(retainerMRR)} sub={`${retainerClients.length} retainer client${retainerClients.length !== 1 ? 's' : ''}`} color="#94D96B" delay={0}
          onClick={() => setDrill({ title: 'Retainer MRR', subtitle: `${retainerClients.length} active recurring clients`, content: <>{retainerClients.sort((a,b) => b.amount - a.amount).map(c => <ClientDrillCard key={c.id} client={c} partners={data.partners} comms={data.comms} />)}</> })} />
        <KpiCard label="Total Monthly Revenue" value={fmtM(totalMonthly)} sub={`${totalMonthlyClients.length} active client${totalMonthlyClients.length !== 1 ? 's' : ''}`} color="#6B8EFE" delay={0.06}
          onClick={() => setDrill({ title: 'Total Monthly Revenue', subtitle: `${fmtM(totalMonthly)}/mo across all active clients`, content: <>{[...totalMonthlyClients].sort((a,b) => monthlyVal(b)-monthlyVal(a)).map(c => <ClientDrillCard key={c.id} client={c} partners={data.partners} comms={data.comms} />)}</> })} />
        <KpiCard label="Avg Client Value" value={fmtM(avgValue)} sub={`${data.clients.filter(c=>c.stage!=='churned').length} active clients`} color="#B47AFF" delay={0.12}
          onClick={() => setDrill({ title: 'All Active Clients by Value', subtitle: 'Sorted by monthly value', content: <>{[...data.clients].filter(c=>c.stage!=='churned').sort((a,b)=>monthlyVal(b)-monthlyVal(a)).map(c=><ClientDrillCard key={c.id} client={c} partners={data.partners} comms={data.comms}/>)}</> })} />
        <KpiCard label="Projected Annual Revenue" value={fmtM(projectedARR)} sub={`${fmtM(totalMonthly)}/mo × 12`} color="#F59E0B" delay={0.18}
          onClick={() => setDrill({ title: 'Projected Annual Revenue', subtitle: `Based on current monthly revenue run rate`, content: <>{[...totalMonthlyClients].sort((a,b) => monthlyVal(b)-monthlyVal(a)).map(c => <ClientDrillCard key={c.id} client={c} partners={data.partners} comms={data.comms} />)}</> })} />
      </div>

      {/* Row 2 — Operations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <KpiCard label="New Clients This Month" value={String(newThisMonth.length)} sub={newThisMonth.length > 0 ? `${fmtM(newMonthRevenue)} added · ${new Date().toLocaleString('en-US',{month:'long'})}` : `No new clients in ${new Date().toLocaleString('en-US',{month:'long'})}`} color="#26D9B0" delay={0.22}
          onClick={() => setDrill({ title: 'New Clients This Month', subtitle: `${newThisMonth.length} signed in ${new Date().toLocaleString('en-US',{month:'long',year:'numeric'})}`, content: newThisMonth.length === 0 ? <p style={{color:'rgba(255,255,255,0.4)'}}>No new clients this month.</p> : <>{[...newThisMonth].sort((a,b) => monthlyVal(b)-monthlyVal(a)).map(c => <ClientDrillCard key={c.id} client={c} partners={data.partners} comms={data.comms} />)}</> })} />
        <KpiCard label="Cash Outstanding" value={fmtM(cashOutstanding)} sub="Unpaid deposits & balances" color={cashOutstanding > 0 ? '#F59E0B' : '#94D96B'} delay={0.28}
          onClick={() => setDrill({ title: 'Cash Outstanding', subtitle: 'Clients with unpaid deposits or balances', content: <>{data.clients.filter(c=>!c.depPaid||(!c.balPaid&&c.bal>0)).map(c=><ClientDrillCard key={c.id} client={c} partners={data.partners} comms={data.comms}/>)}</> })} />
        <KpiCard label="MoM Revenue Growth" value={momGrowthPct === null ? '—' : `${momGrowthPct >= 0 ? '+' : ''}${momGrowthPct.toFixed(1)}%`} sub={lastMonthRev > 0 ? `${fmtM(lastMonthRev)} last mo → ${fmtM(totalMonthly)} this mo` : 'No prior month data'} color={momGrowthPct === null ? '#6B8EFE' : momGrowthPct >= 0 ? '#94D96B' : '#FE6462'} delay={0.34} />
        <KpiCard label="All Clients" value={String(data.clients.filter(c=>c.stage!=='churned').length)} sub={`${activeClients.length} active · ${atRiskClients.length} at risk`} color="#94D96B" delay={0.40}
          onClick={() => setDrill({ title: 'All Clients', subtitle: `${data.clients.length} total across all stages`, content: <AllClientsDrill data={data} /> })} />
      </div>

      {/* Chart */}
      <RevenueChart data={data} />

      {/* Pipeline breakdown + Recent Clients */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ ...glassCard, animation: 'cardReveal 0.5s cubic-bezier(0.16,1,0.3,1) 0.44s both' }}>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>Pipeline <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.28)', fontWeight: 500 }}>· click to drill in</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stageCounts.map(({ stage, count, clients: stageClients }) => (
              <StageRow key={stage} stage={stage} count={count} stageClients={stageClients} totalClients={data.clients.length} partners={data.partners} comms={data.comms}
                onDrill={(title, subtitle, content) => setDrill({ title, subtitle, content })} />
            ))}
          </div>
        </div>

        <div style={{ ...glassCard, animation: 'cardReveal 0.5s cubic-bezier(0.16,1,0.3,1) 0.48s both' }}>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>Recent Clients</div>
          {recentClients.length === 0 ? (
            <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem', textAlign: 'center', padding: '1.5rem 0' }}>No clients added yet.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Client', 'Package', 'Amount', 'Stage', 'Setter', 'Closer'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                <tbody>
                  {recentClients.map(c => (
                    <RecentClientRow key={c.id} c={c} pName={pName} partners={data.partners} comms={data.comms}
                      onDrill={(title, subtitle, content) => setDrill({ title, subtitle, content })} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Goals + Renewal Reminders */}
      {(() => {
        const thisMonth = today().slice(0, 7);
        const goal = (data.goals ?? []).find(g => g.month === thisMonth);
        const revProgress = goal ? Math.min(100, (totalMonthly / goal.revenueTarget) * 100) : 0;
        const newProgress = goal ? Math.min(100, (newThisMonth.length / goal.newClientsTarget) * 100) : 0;
        const in30 = new Date(); in30.setDate(in30.getDate() + 30);
        const renewals = data.clients.filter(c => {
          if (!c.nextDue || c.stage === 'churned' || c.stage === 'paused') return false;
          const d = new Date(c.nextDue); return d >= new Date() && d <= in30;
        }).sort((a, b) => a.nextDue.localeCompare(b.nextDue));
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            {/* Goals */}
            <div style={{ ...glassCard, animation: 'cardReveal 0.5s cubic-bezier(0.16,1,0.3,1) 0.52s both' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', letterSpacing: '-0.01em' }}>Monthly Goals</div>
                <button onClick={() => {
                  const rev = prompt('Revenue target ($):', goal ? String(goal.revenueTarget) : '');
                  const nc  = prompt('New clients target:', goal ? String(goal.newClientsTarget) : '');
                  if (!rev) return;
                  const updated = (data.goals ?? []).filter(g => g.month !== thisMonth);
                  setData({ ...data, goals: [...updated, { month: thisMonth, revenueTarget: parseFloat(rev) || 0, newClientsTarget: parseInt(nc || '0') || 0 }] });
                }} style={{ ...btn('ghost'), padding: '4px 12px', fontSize: '0.73rem' }}>
                  {goal ? 'Edit' : 'Set Goals'}
                </button>
              </div>
              {!goal ? (
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', textAlign: 'center', padding: '1.5rem 0' }}>No goals set for this month yet.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Revenue</span>
                      <span style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 700 }}>{fmtM(totalMonthly)} / {fmtM(goal.revenueTarget)}</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '6px', height: '8px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${revProgress}%`, background: revProgress >= 100 ? '#94D96B' : '#6B8EFE', borderRadius: '6px', transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)' }} />
                    </div>
                    <div style={{ fontSize: '0.72rem', color: revProgress >= 100 ? '#94D96B' : 'rgba(255,255,255,0.3)', marginTop: '4px' }}>{revProgress >= 100 ? '✓ Goal reached!' : `${revProgress.toFixed(0)}% — ${fmtM(goal.revenueTarget - totalMonthly)} to go`}</div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>New Clients</span>
                      <span style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 700 }}>{newThisMonth.length} / {goal.newClientsTarget}</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '6px', height: '8px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${newProgress}%`, background: newProgress >= 100 ? '#94D96B' : '#26D9B0', borderRadius: '6px', transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)' }} />
                    </div>
                    <div style={{ fontSize: '0.72rem', color: newProgress >= 100 ? '#94D96B' : 'rgba(255,255,255,0.3)', marginTop: '4px' }}>{newProgress >= 100 ? '✓ Goal reached!' : `${newProgress.toFixed(0)}% — ${goal.newClientsTarget - newThisMonth.length} more to go`}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Renewal Reminders */}
            <div style={{ ...glassCard, animation: 'cardReveal 0.5s cubic-bezier(0.16,1,0.3,1) 0.56s both' }}>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
                Renewals Next 30 Days <span style={{ fontSize: '0.75rem', fontWeight: 600, color: renewals.length > 0 ? '#F59E0B' : '#94D96B', marginLeft: '6px' }}>{renewals.length} due</span>
              </div>
              {renewals.length === 0 ? (
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', textAlign: 'center', padding: '1.5rem 0' }}>No renewals in the next 30 days.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {renewals.map(c => {
                    const daysOut = Math.round((new Date(c.nextDue).getTime() - new Date().getTime()) / 86400000);
                    const urgent = daysOut <= 7;
                    return (
                      <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.75rem', borderRadius: '8px', background: urgent ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${urgent ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)'}` }}>
                        <div>
                          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.83rem' }}>{c.company || c.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>{fmtM(monthlyVal(c))}/mo · due {fmtD(c.nextDue)}</div>
                        </div>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: urgent ? '#F59E0B' : 'rgba(255,255,255,0.4)' }}>{daysOut === 0 ? 'Today' : `${daysOut}d`}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function PipeCard({ c, color, partnerName, onEdit, onLog, onInvoice, PAY_STAT: PS }: { c: Client; color: string; partnerName: (id: string) => string; onEdit: (c: Client) => void; onLog: (c: Client) => void; onInvoice: (c: Client) => void; PAY_STAT: Record<PayStat, { label: string; color: string }> }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)', border: `1px solid ${hov ? color + '55' : 'rgba(255,255,255,0.07)'}`, borderRadius: '12px', padding: '0.85rem', transition: 'all 0.18s', transform: hov ? 'translateY(-2px)' : 'none', boxShadow: hov ? '0 6px 20px rgba(0,0,0,0.35)' : 'none' }}>
      <div onClick={() => onEdit(c)} style={{ cursor: 'pointer' }}>
        <div style={{ fontWeight: 700, fontSize: '0.83rem', color: '#fff', marginBottom: '2px', lineHeight: 1.2 }}>{c.company || c.name}</div>
        {c.company && <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>{c.name}</div>}
        <div style={{ fontSize: '0.82rem', fontWeight: 800, color, marginBottom: '6px' }}>{fmtM(c.amount)}{c.planT === 'recurring' && <span style={{ fontSize: '0.65rem', fontWeight: 400, color: 'rgba(255,255,255,0.3)' }}>/mo</span>}</div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {c.payStat !== 'current' && <span style={badge(PS[c.payStat].color)}>{PS[c.payStat].label}</span>}
          {!c.depPaid && <span style={badge('#F59E0B')}>Dep. Pending</span>}
          {c.depPaid && !c.balPaid && c.bal > 0 && <span style={badge('#26D9B0')}>Bal. {fmtM(c.bal)}</span>}
          {c.isUpsold && <span style={badge('#B47AFF')}>↑ Upsell</span>}
        </div>
        {(c.apptTotal || 0) > 0 && (
          <div style={{ marginTop: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>Appts</span>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>{c.apptDelivered || 0}/{c.apptTotal}</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '4px', height: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, ((c.apptDelivered || 0) / (c.apptTotal || 1)) * 100)}%`, background: '#26D9B0', borderRadius: '4px' }} />
            </div>
          </div>
        )}
        {(c.setterId || c.closerId) && (
          <div style={{ marginTop: '6px', fontSize: '0.68rem', color: 'rgba(255,255,255,0.28)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px' }}>
            {c.setterId && <span>Set: {partnerName(c.setterId)}</span>}
            {c.setterId && c.closerId && <span style={{ margin: '0 4px' }}>·</span>}
            {c.closerId && <span>Close: {partnerName(c.closerId)}</span>}
          </div>
        )}
      </div>
      {hov && (
        <div style={{ display: 'flex', gap: '4px', marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }} onClick={e => e.stopPropagation()}>
          <button onClick={() => onLog(c)} style={{ ...btn('ghost'), padding: '3px 8px', fontSize: '0.68rem', flex: 1 }}>Log</button>
          <button onClick={() => onInvoice(c)} style={{ ...btn('ghost'), padding: '3px 8px', fontSize: '0.68rem', flex: 1 }}>Invoice</button>
        </div>
      )}
    </div>
  );
}

// ─── Analytics Tab ────────────────────────────────────────────────────────────
function AnalyticsTab({ data }: { data: AppData }) {
  const [section, setSection] = useState<'leaderboard' | 'churn' | 'cashflow' | 'revenue'>('leaderboard');

  const partners = data.partners.filter(p => p.active !== false);
  const clients  = data.clients;
  const comms    = data.comms;

  /* ── Leaderboard ── */
  const leaderboard = useMemo(() => partners.map(p => {
    const closed     = clients.filter(c => c.closerId === p.id);
    const set        = clients.filter(c => c.setterId === p.id);
    const myComms    = comms.filter(c => c.partnerId === p.id);
    const earned     = myComms.reduce((s, c) => s + c.amount, 0);
    const paid       = myComms.filter(c => c.stat === 'paid').reduce((s, c) => s + c.amount, 0);
    const closedRev  = closed.reduce((s, c) => s + monthlyVal(c), 0);
    const upsells    = closed.filter(c => c.isUpsold).length;
    return { p, closed: closed.length, set: set.length, closedRev, earned, paid, upsells };
  }).sort((a, b) => b.closedRev - a.closedRev), [partners, clients, comms]);

  /* ── Churn Analysis ── */
  const churned = clients.filter(c => c.stage === 'churned');
  const active  = clients.filter(c => !['churned','paused'].includes(c.stage));
  const churnRate = clients.length > 0 ? (churned.length / clients.length * 100).toFixed(1) : '0';
  const avgLifespan = churned.length > 0 ? (() => {
    const days = churned.map(c => {
      const s = c.start || c.at; if (!s) return 0;
      return Math.round((new Date().getTime() - new Date(s).getTime()) / 86400000);
    });
    return Math.round(days.reduce((a, b) => a + b, 0) / days.length);
  })() : 0;
  const lostMRR = churned.reduce((s, c) => s + monthlyVal(c), 0);
  const churnByCloser = partners.map(p => ({
    name: p.name,
    churned: churned.filter(c => c.closerId === p.id).length,
    total: clients.filter(c => c.closerId === p.id).length,
  })).filter(x => x.total > 0);

  /* ── Cash Flow Forecast (next 90 days) ── */
  const cashflow = useMemo(() => {
    const months: { label: string; month: string; expected: number; clients: Client[] }[] = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() + i);
      const m = d.toISOString().slice(0, 7);
      const label = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      const due = active.filter(c => c.nextDue && c.nextDue.startsWith(m));
      const expected = due.reduce((s, c) => s + monthlyVal(c), 0)
        + active.filter(c => !c.depPaid && (c.nextDue || '').startsWith(m)).reduce((s, c) => s + c.deposit, 0)
        + active.filter(c => c.depPaid && !c.balPaid && c.bal > 0 && (c.nextDue || '').startsWith(m)).reduce((s, c) => s + c.bal, 0);
      months.push({ label, month: m, expected, clients: due });
    }
    return months;
  }, [active]);

  /* ── Revenue per Client ── */
  const revenuePerClient = useMemo(() => clients.map(c => {
    const start = c.start || c.at;
    const monthsActive = start ? Math.max(1, Math.round((new Date().getTime() - new Date(start).getTime()) / (30.44 * 86400000))) : 1;
    const collected = (c.depPaid ? c.deposit : 0) + (c.balPaid ? c.bal : 0) + (!c.isSplit ? (c.stage !== 'onboarding' ? c.amount : 0) : 0);
    const estimated = monthlyVal(c) * (c.stage === 'churned' ? monthsActive : monthsActive);
    return { c, monthsActive, collected, estimated };
  }).sort((a, b) => b.estimated - a.estimated), [clients]);

  const secBtn = (id: typeof section, label: string) => (
    <button key={id} onClick={() => setSection(id)} style={{ padding: '7px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, background: section === id ? 'rgba(255,255,255,0.12)' : 'transparent', color: section === id ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'all 0.15s' }}>{label}</button>
  );

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.2rem', letterSpacing: '-0.03em' }}>Analytics</h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.83rem', margin: 0 }}>Performance, churn, and revenue insights</p>
      </div>

      <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '4px', marginBottom: '1.75rem', width: 'fit-content' }}>
        {secBtn('leaderboard', 'Leaderboard')}
        {secBtn('churn', 'Churn Analysis')}
        {secBtn('cashflow', 'Cash Flow')}
        {secBtn('revenue', 'Revenue per Client')}
      </div>

      {/* ── Leaderboard ── */}
      {section === 'leaderboard' && (
        <div>
          {leaderboard.length === 0 ? <p style={{ color: 'rgba(255,255,255,0.3)' }}>No team members yet.</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {leaderboard.map((row, i) => (
                <div key={row.p.id} style={{ ...glassCard, padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', gap: '1rem', alignItems: 'center', animation: `cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.05}s both` }}>
                  <div>
                    <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>{row.p.name}</div>
                    <div style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{row.p.role}</div>
                  </div>
                  <div><div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginBottom: '2px' }}>CLOSED</div><div style={{ fontWeight: 800, color: '#94D96B', fontSize: '1.1rem' }}>{row.closed}</div></div>
                  <div><div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginBottom: '2px' }}>SET</div><div style={{ fontWeight: 800, color: '#6B8EFE', fontSize: '1.1rem' }}>{row.set}</div></div>
                  <div><div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginBottom: '2px' }}>REV CLOSED</div><div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>{fmtM(row.closedRev)}</div></div>
                  <div><div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginBottom: '2px' }}>EARNED</div><div style={{ fontWeight: 800, color: '#F59E0B', fontSize: '1rem' }}>{fmtM(row.earned)}</div></div>
                  <div><div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginBottom: '2px' }}>UPSELLS</div><div style={{ fontWeight: 800, color: '#B47AFF', fontSize: '1.1rem' }}>{row.upsells}</div></div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Churn Analysis ── */}
      {section === 'churn' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Churn Rate', value: `${churnRate}%`, color: '#FE6462' },
              { label: 'Churned Clients', value: churned.length, color: '#FE6462' },
              { label: 'Lost MRR', value: fmtM(lostMRR), color: '#FE6462' },
              { label: 'Avg Lifespan', value: avgLifespan > 0 ? `${avgLifespan}d` : '—', color: '#F59E0B' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ ...glassCard, borderLeft: `3px solid ${color}`, padding: '1rem 1.25rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: '0.3rem' }}>{label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color }}>{value}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={glassCard}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)', fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>Churned Clients</div>
              {churned.length === 0 ? <div style={{ padding: '1.5rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>No churned clients.</div> : churned.map(c => (
                <div key={c.id} style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div><div style={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem' }}>{c.company || c.name}</div><div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>Started {fmtD(c.start || c.at)}</div></div>
                  <div style={{ fontWeight: 800, color: '#FE6462', fontSize: '0.9rem' }}>{fmtM(monthlyVal(c))}</div>
                </div>
              ))}
            </div>
            <div style={glassCard}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)', fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>Churn by Closer</div>
              {churnByCloser.length === 0 ? <div style={{ padding: '1.5rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>No data yet.</div> : churnByCloser.map(row => (
                <div key={row.name} style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem' }}>{row.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{row.churned}/{row.total} churned</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(row.churned / row.total) * 100}%`, background: '#FE6462', borderRadius: '4px', transition: 'width 0.6s' }} />
                  </div>
                </div>
              ))}
              <div style={{ padding: '0.85rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>Active clients: {active.length} · Total revenue at risk: {fmtM(active.reduce((s, c) => s + monthlyVal(c), 0))}/mo</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Cash Flow Forecast ── */}
      {section === 'cashflow' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            {cashflow.map((m, i) => (
              <div key={m.month} style={{ ...glassCard, borderLeft: `3px solid ${i === 0 ? '#94D96B' : i === 1 ? '#6B8EFE' : '#B47AFF'}`, padding: '1.25rem 1.5rem', animation: `cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s both` }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.label}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '0.3rem' }}>{fmtM(m.expected)}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{m.clients.length} renewal{m.clients.length !== 1 ? 's' : ''} due</div>
                {m.clients.length > 0 && (
                  <div style={{ marginTop: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {m.clients.map(c => (
                      <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>{c.company || c.name}</span>
                        <span style={{ color: '#fff', fontWeight: 700 }}>{fmtM(monthlyVal(c))}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ ...glassCard, padding: '1.25rem 1.5rem' }}>
            <div style={{ fontWeight: 700, color: '#fff', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Outstanding Balances</div>
            {active.filter(c => !c.depPaid || (!c.balPaid && c.bal > 0)).length === 0
              ? <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>No outstanding balances.</div>
              : active.filter(c => !c.depPaid || (!c.balPaid && c.bal > 0)).map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.83rem' }}>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{c.company || c.name}</span>
                  <span style={{ color: '#F59E0B', fontWeight: 700 }}>{fmtM((!c.depPaid ? c.deposit : 0) + (!c.balPaid && c.bal > 0 ? c.bal : 0))} owed</span>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* ── Revenue per Client ── */}
      {section === 'revenue' && (
        <div style={{ ...glassCard, padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>{['Client', 'Package', 'Monthly Value', 'Months Active', 'Est. Total Revenue', 'Stage'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {revenuePerClient.map(({ c, monthsActive, estimated }) => (
                <tr key={c.id} style={{ transition: 'background 0.15s' }} onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={tdStyle}><div style={{ fontWeight: 700, color: '#fff' }}>{c.name}</div>{c.company && <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>{c.company}</div>}</td>
                  <td style={tdStyle}><div style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.7)' }}>{c.pkg || '—'}</div></td>
                  <td style={tdStyle}><div style={{ fontWeight: 800, color: '#94D96B' }}>{fmtM(monthlyVal(c))}</div></td>
                  <td style={tdStyle}><div style={{ color: 'rgba(255,255,255,0.7)' }}>{monthsActive} mo</div></td>
                  <td style={tdStyle}><div style={{ fontWeight: 800, color: '#fff' }}>{fmtM(estimated)}</div></td>
                  <td style={tdStyle}><span style={badge(STAGES[c.stage].color)}>{STAGES[c.stage].label}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Services Tab ─────────────────────────────────────────────────────────────
function ServicesTab({ data, setData }: { data: AppData; setData: (d: AppData) => void }) {
  const [modal, setModal] = useState<'add' | ServicePkg | null>(null);
  const [f, setF] = useState<Omit<ServicePkg, 'id'>>({ name: '', price: 0, planT: 'recurring', description: '' });

  const openAdd = () => { setF({ name: '', price: 0, planT: 'recurring', description: '' }); setModal('add'); };
  const openEdit = (pkg: ServicePkg) => { setF({ name: pkg.name, price: pkg.price, planT: pkg.planT, description: pkg.description }); setModal(pkg); };
  const save = () => {
    if (!f.name.trim()) return;
    if (modal === 'add') {
      setData({ ...data, packages: [...(data.packages ?? []), { ...f, id: uid() }] });
    } else {
      setData({ ...data, packages: (data.packages ?? []).map(p => p.id === (modal as ServicePkg).id ? { ...f, id: p.id } : p) });
    }
    setModal(null);
  };
  const del = (id: string) => setData({ ...data, packages: (data.packages ?? []).filter(p => p.id !== id) });

  const pkgs = data.packages ?? [];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.2rem', letterSpacing: '-0.03em' }}>Services & Packages</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.83rem', margin: 0 }}>Standard packages — select these when adding clients, then override price as needed</p>
        </div>
        <button onClick={openAdd} style={btn('primary')}>+ Add Package</button>
      </div>

      {pkgs.length === 0 ? (
        <div style={{ ...glassCard, padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.88rem' }}>
          No packages yet. Add your standard offerings above.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {pkgs.map((pkg, i) => (
            <div key={pkg.id} style={{ ...glassCard, padding: '1.25rem 1.5rem', borderLeft: `3px solid ${pkg.planT === 'recurring' ? '#94D96B' : '#6B8EFE'}`, animation: `cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.05}s both` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', lineHeight: 1.2 }}>{pkg.name}</div>
                <span style={{ ...badge(pkg.planT === 'recurring' ? '#94D96B' : '#6B8EFE') as React.CSSProperties }}>{pkg.planT === 'recurring' ? 'Recurring' : 'One-Time'}</span>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: pkg.planT === 'recurring' ? '#94D96B' : '#6B8EFE', marginBottom: '0.4rem' }}>
                {fmtM(pkg.price)}{pkg.planT === 'recurring' && <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'rgba(255,255,255,0.35)' }}>/mo</span>}
              </div>
              {pkg.description && <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.85rem', lineHeight: 1.4 }}>{pkg.description}</div>}
              <div style={{ display: 'flex', gap: '6px', marginTop: pkg.description ? 0 : '0.85rem' }}>
                <button onClick={() => openEdit(pkg)} style={{ ...btn('ghost'), padding: '4px 12px', fontSize: '0.75rem' }}>Edit</button>
                <button onClick={() => del(pkg.id)} style={{ ...btn('danger'), padding: '4px 12px', fontSize: '0.75rem' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backdropFilter: 'blur(6px)' }}>
          <div style={{ width: '100%', maxWidth: '480px', background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '2rem', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{modal === 'add' ? 'New Package' : 'Edit Package'}</h2>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.4rem', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div><label style={lbl}>Package Name *</label><input type="text" value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} placeholder="e.g. 15 Appointments" style={inp} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div><label style={lbl}>Price ($)</label><input type="number" value={f.price || ''} onChange={e => setF(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} style={inp} /></div>
                <div><label style={lbl}>Plan Type</label>
                  <select value={f.planT} onChange={e => setF(p => ({ ...p, planT: e.target.value as PlanT }))} style={{ ...inp, cursor: 'pointer' }}>
                    <option value="recurring">Recurring</option>
                    <option value="one-time">One-Time</option>
                  </select>
                </div>
              </div>
              <div><label style={lbl}>Description</label><input type="text" value={f.description} onChange={e => setF(p => ({ ...p, description: e.target.value }))} placeholder="e.g. 15 booked appointments/month" style={inp} /></div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <button onClick={() => setModal(null)} style={btn('ghost')}>Cancel</button>
              <button onClick={save} disabled={!f.name.trim()} style={{ ...btn('primary'), opacity: !f.name.trim() ? 0.4 : 1 }}>Save Package</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Activity Log Panel ───────────────────────────────────────────────────────
const ACTIVITY_ICONS: Record<Activity['type'], string> = { call: '📞', email: '✉️', note: '📝', payment: '💰', issue: '⚠️' };
function ActivityLog({ clientId, data, setData, onClose }: { clientId: string; data: AppData; setData: (d: AppData) => void; onClose: () => void }) {
  const [note, setNote] = useState('');
  const [type, setType] = useState<Activity['type']>('note');
  const acts = (data.activities ?? []).filter(a => a.clientId === clientId).sort((a, b) => b.at.localeCompare(a.at));
  const add = () => {
    if (!note.trim()) return;
    const act: Activity = { id: uid(), clientId, type, note: note.trim(), at: new Date().toISOString() };
    setData({ ...data, activities: [...(data.activities ?? []), act] });
    setNote('');
  };
  const del = (id: string) => setData({ ...data, activities: (data.activities ?? []).filter(a => a.id !== id) });
  return (
    <DrillPanel title="Activity Log" subtitle="Notes, calls, emails for this client" onClose={onClose}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        <select value={type} onChange={e => setType(e.target.value as Activity['type'])} style={{ ...inp, width: 'auto', cursor: 'pointer', flexShrink: 0 }}>
          {(['note','call','email','payment','issue'] as Activity['type'][]).map(t => <option key={t} value={t}>{ACTIVITY_ICONS[t]} {t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>
        <input value={note} onChange={e => setNote(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} placeholder="Add a note…" style={{ ...inp, flex: 1 }} />
        <button onClick={add} style={{ ...btn('primary'), flexShrink: 0 }}>Add</button>
      </div>
      {acts.length === 0 ? <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>No activity logged yet.</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {acts.map(a => (
            <div key={a.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '0.75rem 1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>{ACTIVITY_ICONS[a.type]}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#fff', fontSize: '0.85rem', lineHeight: 1.4 }}>{a.note}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>{new Date(a.at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</div>
              </div>
              <button onClick={() => del(a.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '1rem', padding: 0, flexShrink: 0 }}>×</button>
            </div>
          ))}
        </div>
      )}
    </DrillPanel>
  );
}

// ─── Invoice Modal ────────────────────────────────────────────────────────────
function InvoiceModal({ client, onClose }: { client: Client; onClose: () => void }) {
  const invNum = `INV-${client.id.slice(0, 6).toUpperCase()}`;
  const issueDate = today();
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem', overflowY: 'auto', backdropFilter: 'blur(6px)' }}>
      <div style={{ width: '100%', maxWidth: '640px', background: '#fff', borderRadius: '16px', padding: '3rem', color: '#111', marginTop: '40px', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FE6462', letterSpacing: '-0.03em' }}>REVCORE</div>
            <div style={{ fontSize: '0.78rem', color: '#888', marginTop: '4px' }}>Invoice #{invNum}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.78rem', color: '#888' }}>Issue Date</div>
            <div style={{ fontWeight: 700 }}>{fmtD(issueDate)}</div>
            {client.nextDue && <><div style={{ fontSize: '0.78rem', color: '#888', marginTop: '4px' }}>Due Date</div><div style={{ fontWeight: 700 }}>{fmtD(client.nextDue)}</div></>}
          </div>
        </div>
        <div style={{ borderTop: '2px solid #f0f0f0', borderBottom: '2px solid #f0f0f0', padding: '1.5rem 0', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.7rem', color: '#888', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '0.4rem' }}>BILLED TO</div>
          <div style={{ fontWeight: 800, fontSize: '1rem' }}>{client.name}</div>
          {client.company && <div style={{ color: '#555' }}>{client.company}</div>}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
          <thead><tr style={{ borderBottom: '1px solid #eee' }}>{['Description', 'Type', 'Amount'].map(h => <th key={h} style={{ textAlign: h === 'Amount' ? 'right' : 'left', padding: '8px 0', fontSize: '0.72rem', color: '#888', fontWeight: 700, letterSpacing: '0.06em' }}>{h}</th>)}</tr></thead>
          <tbody>
            <tr><td style={{ padding: '12px 0', fontWeight: 600 }}>{client.pkg || 'Services'}</td><td style={{ padding: '12px 0', color: '#666' }}>{client.planT === 'recurring' ? 'Monthly Retainer' : 'One-Time'}</td><td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 800, fontSize: '1.1rem' }}>{fmtM(monthlyVal(client))}</td></tr>
          </tbody>
        </table>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '3rem', paddingTop: '1rem', borderTop: '2px solid #111' }}>
          <div style={{ fontSize: '0.85rem', color: '#888' }}>Total Due</div>
          <div style={{ fontWeight: 900, fontSize: '1.4rem' }}>{fmtM(monthlyVal(client))}</div>
        </div>
        {client.notes && <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8f8f8', borderRadius: '8px', fontSize: '0.8rem', color: '#555' }}><strong>Notes:</strong> {client.notes}</div>}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <button onClick={onClose} style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>Close</button>
          <button onClick={() => window.print()} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#111', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>Print / Save PDF</button>
        </div>
      </div>
    </div>
  );
}

// ─── Whop Import Modal ────────────────────────────────────────────────────────
interface WhopRow { name: string; email: string; startDate: string; latestPayDate: string; pkg: string; selected: boolean; exists: boolean; startDateNote?: string; }

function parseWhopCSV(raw: string): WhopRow[] {
  const lines = raw.trim().split('\n').map(l => l.trimEnd());
  if (lines.length < 2) return [];

  // Detect delimiter: tab or comma
  const delim = lines[0].includes('\t') ? '\t' : ',';
  const splitRow = (line: string) => {
    if (delim === '\t') return line.split('\t');
    // CSV split respecting quotes
    const cells: string[] = [];
    let cur = '', inQ = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') { inQ = !inQ; }
      else if (line[i] === ',' && !inQ) { cells.push(cur); cur = ''; }
      else { cur += line[i]; }
    }
    cells.push(cur);
    return cells;
  };

  const headers = splitRow(lines[0]).map(h => h.replace(/"/g, '').trim().toLowerCase());
  const col = (name: string) => headers.findIndex(h => h.includes(name));

  const colPaidAt   = col('paid at');
  const colStatus   = col('status');
  const colDesc     = col('description');
  const colEmail    = col('email');
  const colName     = col('customer name');

  if (colName === -1 || colPaidAt === -1) return [];

  const IGNORE_DESCS = ['remaining balance due', 'manual charge', 'meta ad spend', 'deposit'];
  const isRecurring = (desc: string) => !IGNORE_DESCS.some(ig => desc.toLowerCase().includes(ig));

  // Parse rows
  const customerMap = new Map<string, { name: string; email: string; dates: string[]; recurringDates: string[]; descs: string[] }>();

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const cells = splitRow(lines[i]).map(c => c.replace(/"/g, '').trim());
    const status = colStatus >= 0 ? cells[colStatus]?.toLowerCase() : 'paid';
    if (status && status !== 'paid') continue;
    const name  = cells[colName]  ?? '';
    const email = colEmail >= 0 ? (cells[colEmail] ?? '') : '';
    const paidAt = cells[colPaidAt] ?? '';
    const desc  = colDesc >= 0 ? (cells[colDesc] ?? '') : '';
    if (!name) continue;
    const key = email || name.toLowerCase();
    if (!customerMap.has(key)) customerMap.set(key, { name, email, dates: [], recurringDates: [], descs: [] });
    const entry = customerMap.get(key)!;
    if (paidAt) {
      entry.dates.push(paidAt);
      // Track recurring payment dates separately (not one-time deposits/balance/ad spend)
      if (desc && isRecurring(desc)) entry.recurringDates.push(paidAt);
    }
    if (desc) entry.descs.push(desc);
  }

  const cleanPkg = (descs: string[]) => {
    const real = descs.find(d => !['remaining balance due', 'manual charge', 'meta ad spend'].some(ig => d.toLowerCase().includes(ig)));
    if (!real) return descs[0] ?? '';
    return real
      .replace(/\s*deposit$/i, '')
      .replace(/\s*½\s*deposit$/i, '')
      .replace(/\bRevCore\s*/i, '')
      .trim();
  };

  const rows: WhopRow[] = [];
  customerMap.forEach(({ name, email, dates, recurringDates, descs }) => {
    if (!dates.length) return;
    const sortedAll = [...dates].sort();
    const startDate = sortedAll[0].slice(0, 10);
    // Latest recurring payment = basis for nextDue; fall back to any latest payment
    const latestSorted = (recurringDates.length > 0 ? recurringDates : dates).sort();
    const latestPayDate = latestSorted[latestSorted.length - 1].slice(0, 10);
    rows.push({ name, email, startDate, latestPayDate, pkg: cleanPkg(descs), selected: true, exists: false });
  });
  return rows.sort((a, b) => a.startDate.localeCompare(b.startDate));
}

function WhopImportModal({ onClose, onImport, existingClients }: {
  onClose: () => void;
  onImport: (rows: WhopRow[]) => void;
  existingClients: Client[];
}) {
  const [raw, setRaw] = useState('');
  const [rows, setRows] = useState<WhopRow[]>([]);
  const [parsed, setParsed] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [editDateIdx, setEditDateIdx] = useState<number | null>(null);

  const parse = () => {
    const parsed = parseWhopCSV(raw).map(r => ({
      ...r,
      exists: existingClients.some(c =>
        c.name.toLowerCase() === r.name.toLowerCase() ||
        (r.email && c.notes?.toLowerCase().includes(r.email.toLowerCase()))
      ),
    }));
    const sel = new Set(parsed.map((r, i) => r.exists ? -1 : i).filter(i => i >= 0));
    setRows(parsed);
    setSelected(sel);
    setParsed(true);
  };

  const toggle = (i: number) => setSelected(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const toggleAll = () => {
    const nonExisting = rows.map((r, i) => r.exists ? -1 : i).filter(i => i >= 0);
    setSelected(s => s.size === nonExisting.length ? new Set() : new Set(nonExisting));
  };

  const doImport = () => {
    const toImport = rows.filter((_, i) => selected.has(i));
    onImport(toImport);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem', overflowY: 'auto', backdropFilter: 'blur(6px)' }}>
      <div style={{ width: '100%', maxWidth: '740px', background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '2rem', marginTop: '60px', boxShadow: '0 40px 80px rgba(0,0,0,0.7)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.2rem', letterSpacing: '-0.02em' }}>Import from Whop</h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', margin: 0 }}>Paste your Whop CSV export below. Columns needed: Customer name, Paid at, Description, Email, Status.</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.4rem', lineHeight: 1, padding: 0 }}>×</button>
        </div>

        {!parsed ? (
          <>
            <textarea
              value={raw}
              onChange={e => setRaw(e.target.value)}
              placeholder={'Paste CSV or TSV data from Whop export here...\n\nInclude the header row. Supports both comma and tab delimited formats.'}
              style={{ ...inp, height: '260px', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.78rem', lineHeight: 1.5 }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button onClick={onClose} style={btn('ghost')}>Cancel</button>
              <button onClick={parse} disabled={!raw.trim()} style={{ ...btn('primary'), opacity: raw.trim() ? 1 : 0.4 }}>Parse Data</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.5)' }}>
                Found <b style={{ color: '#fff' }}>{rows.length}</b> unique customers ·{' '}
                <b style={{ color: '#94D96B' }}>{selected.size}</b> selected to import ·{' '}
                <b style={{ color: '#F59E0B' }}>{rows.filter(r => r.exists).length}</b> already exist
              </div>
              <button onClick={toggleAll} style={{ ...btn('ghost'), fontSize: '0.75rem', padding: '4px 12px' }}>
                {selected.size === rows.filter(r => !r.exists).length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div style={{ maxHeight: '380px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1.25rem' }}>
              {rows.map((r, i) => (
                <div key={i} onClick={() => !r.exists && toggle(i)} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 0.85rem', borderRadius: '10px',
                  background: r.exists ? 'rgba(255,255,255,0.02)' : selected.has(i) ? 'rgba(148,217,107,0.07)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${r.exists ? 'rgba(255,255,255,0.04)' : selected.has(i) ? 'rgba(148,217,107,0.2)' : 'rgba(255,255,255,0.07)'}`,
                  cursor: r.exists ? 'default' : 'pointer', opacity: r.exists ? 0.45 : 1, transition: 'all 0.15s',
                }}>
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0,
                    background: selected.has(i) ? '#94D96B22' : 'rgba(255,255,255,0.06)',
                    border: `2px solid ${selected.has(i) ? '#94D96B' : 'rgba(255,255,255,0.15)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {selected.has(i) && <span style={{ color: '#94D96B', fontSize: '11px', lineHeight: 1 }}>✓</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>{r.name}</span>
                      {r.exists && <span style={badge('#F59E0B')}>Already exists</span>}
                    </div>
                    {r.email && <div style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.3)', marginTop: '1px' }}>{r.email}</div>}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6B8EFE' }}>{r.pkg || '—'}</div>
                    {editDateIdx === i ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }} onClick={e => e.stopPropagation()}>
                        <input
                          type="date"
                          defaultValue={r.startDate}
                          onBlur={e => {
                            const val = e.target.value;
                            if (val && val !== r.startDate) {
                              setRows(prev => prev.map((row, idx) => idx === i ? { ...row, startDate: val, startDateNote: `Updated from ${row.startDate}` } : row));
                            }
                            setEditDateIdx(null);
                          }}
                          autoFocus
                          style={{ ...inp, padding: '2px 6px', fontSize: '0.72rem', width: '130px' }}
                        />
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); if (!r.exists) setEditDateIdx(i); }}>
                        <span style={{ fontSize: '0.72rem', color: r.startDateNote ? '#F59E0B' : 'rgba(255,255,255,0.3)' }}>
                          Started {fmtD(r.startDate)}
                        </span>
                        {!r.exists && <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.2)' }}>✎</span>}
                        {r.startDateNote && <span style={{ fontSize: '0.62rem', color: '#F59E0B' }}>edited</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(107,142,254,0.08)', border: '1px solid rgba(107,142,254,0.2)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1.25rem' }}>
              Clients will be imported as <b style={{ color: '#fff' }}>Onboarding</b> stage with amount $0. Edit each client after import to set amounts, commissions, and other details.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setParsed(false)} style={btn('ghost')}>← Back</button>
              <button onClick={onClose} style={btn('ghost')}>Cancel</button>
              <button onClick={doImport} disabled={selected.size === 0} style={{ ...btn('primary'), opacity: selected.size > 0 ? 1 : 0.4 }}>
                Import {selected.size} Client{selected.size !== 1 ? 's' : ''}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Clients Tab ──────────────────────────────────────────────────────────────
function ClientsTab({ data, setData, partners }: { data: AppData; setData: (d: AppData) => void; partners: Partner[] }) {
  const [search, setSearch] = useState('');
  const [stageF, setStageF] = useState<Stage | 'all'>('all');
  const [partnerF, setPartnerF] = useState('all');
  const [modal, setModal] = useState<'add' | Client | null>(null);
  const [delId, setDelId] = useState<string | null>(null);
  const [view, setView] = useState<'pipeline' | 'table'>('pipeline');
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<Stage | null>(null);
  const [activityClient, setActivityClient] = useState<Client | null>(null);
  const [invoiceClient, setInvoiceClient] = useState<Client | null>(null);
  const [whopImport, setWhopImport] = useState(false);

  const filtered = useMemo(() => data.clients.filter(c => {
    const q = search.toLowerCase();
    if (q && !c.name.toLowerCase().includes(q) && !c.company.toLowerCase().includes(q) && !c.pkg.toLowerCase().includes(q)) return false;
    if (stageF !== 'all' && c.stage !== stageF) return false;
    if (partnerF !== 'all' && c.setterId !== partnerF && c.closerId !== partnerF) return false;
    return true;
  }), [data.clients, search, stageF, partnerF]);

  const partnerName = (id: string) => partners.find(p => p.id === id)?.name || '—';

  const saveClient = (f: Omit<Client, 'id' | 'at'>, isNew: boolean) => {
    if (isNew) {
      const newC: Client = { ...f, id: uid(), at: today() };
      const newComms = genInitComms(newC);
      setData({ ...data, clients: [...data.clients, newC], comms: [...data.comms, ...newComms] });
    } else {
      setData({ ...data, clients: data.clients.map(c => c.id === (modal as Client).id ? { ...f, id: c.id, at: c.at } : c) });
    }
    setModal(null);
  };

  const deleteClient = (id: string) => {
    setData({ ...data, clients: data.clients.filter(c => c.id !== id), comms: data.comms.filter(c => c.clientId !== id) });
    setDelId(null);
  };

  const togglePayStatus = (c: Client, stat: PayStat) => {
    setData({ ...data, clients: data.clients.map(x => x.id === c.id ? { ...x, payStat: stat } : x) });
  };

  const importFromWhop = (rows: WhopRow[]) => {
    const newClients: Client[] = rows.map(r => {
      // nextDue = latest recurring payment + 1 month
      const latestDate = new Date(r.latestPayDate + 'T00:00:00');
      latestDate.setMonth(latestDate.getMonth() + 1);
      const nextDue = latestDate.toISOString().slice(0, 10);
      return ({
      id: uid(), name: r.name, company: '', pkg: r.pkg,
      planT: 'recurring' as PlanT, start: r.startDate, renewal: '', amount: 0,
      nextDue, setterId: '', closerId: '',
      setterInitT: 'none' as InitCommT, setterInitV: 0,
      closerInitT: 'none' as InitCommT, closerInitV: 0,
      ongoingT: 'none' as OngoingT, ongoingFor: 'none' as CommFor, ongoingV: 0,
      isSplit: false, deposit: 0, bal: 0, balNote: '',
      depPaid: false, balPaid: false,
      stage: 'onboarding' as Stage, payStat: 'current' as PayStat,
      ghlId: '', notes: [r.email ? `Email: ${r.email}` : '', r.startDateNote ? `Start date updated (original: ${r.startDateNote.replace('Updated from ', '')})` : ''].filter(Boolean).join(' | '), at: today(),
    });
    });
    setData({ ...data, clients: [...data.clients, ...newClients] });
    setWhopImport(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.2rem', letterSpacing: '-0.03em' }}>Clients</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.83rem', margin: 0 }}>{data.clients.length} closed client{data.clients.length !== 1 ? 's' : ''}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '3px' }}>
            {(['pipeline', 'table'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{ padding: '5px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, background: view === v ? 'rgba(255,255,255,0.12)' : 'transparent', color: view === v ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'all 0.15s' }}>
                {v === 'pipeline' ? '⬛ Pipeline' : '☰ Table'}
              </button>
            ))}
          </div>
          <button onClick={() => setWhopImport(true)} style={btn('ghost')}>↑ Import Whop</button>
          <button onClick={() => setModal('add')} style={btn('primary')}>+ Add Client</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total MRR', value: fmtM(data.clients.filter(c => c.planT === 'recurring').reduce((s, c) => s + c.amount, 0)), color: '#94D96B' },
          { label: 'Active Clients', value: data.clients.filter(c => c.stage === 'active').length, color: '#94D96B' },
          { label: 'At Risk', value: data.clients.filter(c => c.stage === 'at-risk').length, color: '#F59E0B' },
          { label: 'Upsells', value: data.clients.filter(c => c.isUpsold).length, color: '#B47AFF' },
        ].map(({ label, value, color }, i) => (
          <div key={label} style={{ ...glassCard, borderLeft: `3px solid ${color}`, padding: '1rem 1.25rem', animation: `cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s both` }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: '0.3rem' }}>{label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients…" style={{ ...inp, width: '220px' }} />
        {view === 'table' && (
          <select value={stageF} onChange={e => setStageF(e.target.value as Stage | 'all')} style={{ ...inp, width: 'auto', cursor: 'pointer' }}>
            <option value="all">All Stages</option>
            {(Object.keys(STAGES) as Stage[]).map(s => <option key={s} value={s}>{STAGES[s].label}</option>)}
          </select>
        )}
        <select value={partnerF} onChange={e => setPartnerF(e.target.value)} style={{ ...inp, width: 'auto', cursor: 'pointer' }}>
          <option value="all">All Team Members</option>
          {partners.filter(p => p.active !== false).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {view === 'pipeline' ? (
        <div style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', minWidth: 'max-content' }}>
            {(Object.keys(STAGES) as Stage[]).map(stage => {
              const stageClients = data.clients.filter(c => {
                if (c.stage !== stage) return false;
                const q = search.toLowerCase();
                if (q && !c.name.toLowerCase().includes(q) && !c.company.toLowerCase().includes(q) && !c.pkg.toLowerCase().includes(q)) return false;
                if (partnerF !== 'all' && c.setterId !== partnerF && c.closerId !== partnerF) return false;
                return true;
              });
              const { label, color } = STAGES[stage];
              const colValue = stageClients.reduce((s, c) => s + c.amount, 0);
              const isDragTarget = dragOverStage === stage;
              return (
                <div key={stage} style={{ width: '240px', flexShrink: 0 }}
                  onDragOver={e => { e.preventDefault(); setDragOverStage(stage); }}
                  onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverStage(null); }}
                  onDrop={e => {
                    e.preventDefault();
                    if (dragId) setData({ ...data, clients: data.clients.map(cl => cl.id === dragId ? { ...cl, stage } : cl) });
                    setDragId(null); setDragOverStage(null);
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem', padding: '0 2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
                      <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)' }}>{label}</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>{stageClients.length}</span>
                  </div>
                  {colValue > 0 && <div style={{ fontSize: '0.72rem', color, fontWeight: 700, marginBottom: '0.7rem', padding: '0 2px' }}>{fmtM(colValue)}{stageClients.some(c => c.planT === 'recurring') ? '/mo' : ''}</div>}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', minHeight: '60px', borderRadius: '12px', border: `1.5px dashed ${isDragTarget ? color : 'transparent'}`, padding: isDragTarget ? '6px' : '0', transition: 'all 0.15s', background: isDragTarget ? `${color}0d` : 'transparent' }}>
                    {stageClients.length === 0 ? (
                      <div style={{ border: `1px dashed ${isDragTarget ? color : 'rgba(255,255,255,0.08)'}`, borderRadius: '10px', padding: '1.2rem', textAlign: 'center', color: isDragTarget ? color : 'rgba(255,255,255,0.18)', fontSize: '0.75rem', transition: 'all 0.15s' }}>
                        {isDragTarget ? 'Drop here' : 'Empty'}
                      </div>
                    ) : stageClients.map(c => (
                      <div key={c.id} draggable
                        onDragStart={e => { e.dataTransfer.effectAllowed = 'move'; setDragId(c.id); }}
                        onDragEnd={() => { setDragId(null); setDragOverStage(null); }}
                        style={{ opacity: dragId === c.id ? 0.4 : 1, transition: 'opacity 0.15s', cursor: 'grab' }}>
                        <PipeCard c={c} color={color} partnerName={partnerName} onEdit={setModal} onLog={setActivityClient} onInvoice={setInvoiceClient} PAY_STAT={PAY_STAT} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ ...glassCard, padding: 0, overflow: 'hidden' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.88rem' }}>No clients found. Add your first closed client above.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>{['Client', 'Package', 'Stage', 'Payment', 'Next Due', 'Setter', 'Closer', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c.id} onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')} style={{ transition: 'background 0.15s' }}>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 700, color: '#fff' }}>{c.name}</div>
                        {c.company && <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{c.company}</div>}
                        {c.isSplit && (
                          <div style={{ marginTop: '3px', display: 'flex', gap: '4px' }}>
                            <span style={badge(c.depPaid ? '#94D96B' : '#F59E0B')}>{c.depPaid ? 'Dep. Paid' : 'Dep. Pending'}</span>
                            <span style={badge(c.balPaid ? '#94D96B' : '#F59E0B')}>{c.balPaid ? 'Bal. Paid' : 'Bal. Pending'}</span>
                          </div>
                        )}
                        {c.isUpsold && <div style={{ marginTop: '3px' }}><span style={badge('#B47AFF')}>↑ Upsell</span></div>}
                      </td>
                      <td style={tdStyle}><div>{c.pkg || '—'}</div><div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{c.planT === 'recurring' ? `${fmtM(c.amount)}/mo` : fmtM(c.amount)}</div></td>
                      <td style={tdStyle}><span style={badge(STAGES[c.stage].color)}>{STAGES[c.stage].label}</span></td>
                      <td style={tdStyle}>
                        <span style={badge(PAY_STAT[c.payStat].color)}>{PAY_STAT[c.payStat].label}</span>
                        {c.payStat !== 'current' && <button onClick={() => togglePayStatus(c, 'current')} style={{ ...btn('ghost'), padding: '2px 8px', fontSize: '0.7rem', marginLeft: '4px' }}>Mark current</button>}
                      </td>
                      <td style={tdStyle}>{fmtD(c.nextDue)}</td>
                      <td style={tdStyle}>{partnerName(c.setterId)}</td>
                      <td style={tdStyle}>{partnerName(c.closerId)}</td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => setModal(c)} style={{ ...btn('ghost'), padding: '4px 10px' }}>Edit</button>
                          <button onClick={() => setActivityClient(c)} style={{ ...btn('ghost'), padding: '4px 10px' }}>Log</button>
                          <button onClick={() => setInvoiceClient(c)} style={{ ...btn('ghost'), padding: '4px 10px' }}>Invoice</button>
                          <button onClick={() => setDelId(c.id)} style={{ ...btn('danger'), padding: '4px 10px' }}>Del</button>
                          {c.ghlId && <a href={`https://app.gohighlevel.com/contacts/${c.ghlId}`} target="_blank" rel="noreferrer" style={{ ...btn('ghost'), padding: '4px 10px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', fontSize: '0.75rem' }}>GHL ↗</a>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {delId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2rem', maxWidth: '360px', width: '90%' }}>
            <h3 style={{ color: '#fff', margin: '0 0 0.5rem', fontWeight: 800 }}>Delete Client?</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', margin: '0 0 1.5rem' }}>This will permanently remove the client and all associated commissions.</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setDelId(null)} style={btn('ghost')}>Cancel</button>
              <button onClick={() => deleteClient(delId)} style={btn('danger')}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {modal && <ClientModal client={modal === 'add' ? undefined : modal} partners={partners} packages={data.packages ?? []} onSave={saveClient} onClose={() => setModal(null)} />}
      {activityClient && <ActivityLog clientId={activityClient.id} data={data} setData={setData} onClose={() => setActivityClient(null)} />}
      {invoiceClient && <InvoiceModal client={invoiceClient} onClose={() => setInvoiceClient(null)} />}
      {whopImport && <WhopImportModal onClose={() => setWhopImport(false)} onImport={importFromWhop} existingClients={data.clients} />}
    </div>
  );
}

// ─── Team Tab ─────────────────────────────────────────────────────────────────
function TeamTab({ data, setData }: { data: AppData; setData: (d: AppData) => void }) {
  const [selected, setSelected] = useState<string>('all');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'setter' | 'closer' | 'both'>('closer');
  const [delId, setDelId] = useState<string | null>(null);
  const partners = data.partners;

  const addMember = () => {
    if (!newName.trim()) return;
    setData({ ...data, partners: [...data.partners, { id: uid(), name: newName.trim(), role: newRole }] });
    setNewName('');
  };
  const deleteMember = (id: string) => {
    setData({ ...data, partners: data.partners.filter(p => p.id !== id) });
    setDelId(null);
  };
  const terminateMember   = (id: string) => setData({ ...data, partners: data.partners.map(p => p.id === id ? { ...p, active: false } : p) });
  const reactivateMember  = (id: string) => setData({ ...data, partners: data.partners.map(p => p.id === id ? { ...p, active: true  } : p) });

  const getMetrics = (partnerId: string) => {
    const myClients = data.clients.filter(c => partnerId === 'all' ? true : c.setterId === partnerId || c.closerId === partnerId);
    const myComms = data.comms.filter(c => partnerId === 'all' ? true : c.partnerId === partnerId);
    const totalEarned   = myComms.reduce((s, c) => s + c.amount, 0);
    const paidOut       = myComms.filter(c => c.stat === 'paid').reduce((s, c) => s + c.amount, 0);
    const pendingPayout = myComms.filter(c => c.stat === 'pending').reduce((s, c) => s + c.amount, 0);
    const setterPending = myComms.filter(c => c.role === 'setter' && c.stat === 'pending').reduce((s, c) => s + c.amount, 0);
    const setterPaid    = myComms.filter(c => c.role === 'setter' && c.stat === 'paid').reduce((s, c) => s + c.amount, 0);
    const closerPending = myComms.filter(c => c.role === 'closer' && c.stat === 'pending').reduce((s, c) => s + c.amount, 0);
    const closerPaid    = myComms.filter(c => c.role === 'closer' && c.stat === 'paid').reduce((s, c) => s + c.amount, 0);
    const ongoingPerCycle = myClients.reduce((s, c) => {
      if (c.ongoingFor === 'both') return s + calcOngoing(c) / 2;
      if ((c.ongoingFor === 'closer' && (partnerId === 'all' || c.closerId === partnerId)) ||
          (c.ongoingFor === 'setter' && (partnerId === 'all' || c.setterId === partnerId))) return s + calcOngoing(c);
      return s;
    }, 0);
    return { myClients, totalEarned, paidOut, pendingPayout, setterPending, setterPaid, closerPending, closerPaid, ongoingPerCycle };
  };

  const pName = (id: string) => partners.find(p => p.id === id)?.name || '—';
  const m = getMetrics(selected);

  return (
    <div>
      <div style={{ marginBottom: '2rem', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.2rem', letterSpacing: '-0.03em' }}>Team</h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.83rem', margin: 0 }}>Commission performance & team management</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* Roster + Add */}
        <div>
          <div style={{ ...glassCard, marginBottom: '1rem', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) 0.05s both' }}>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', marginBottom: '1rem' }}>Add Team Member</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Full name" style={inp} onKeyDown={e => e.key === 'Enter' && addMember()}
                onFocus={e => e.target.style.borderColor = 'rgba(254,100,98,0.6)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
              <select value={newRole} onChange={e => setNewRole(e.target.value as typeof newRole)} style={{ ...inp, cursor: 'pointer' }}>
                <option value="setter">Setter</option>
                <option value="closer">Closer</option>
                <option value="both">Both</option>
              </select>
              <button onClick={addMember} style={btn('primary')}>Add Member</button>
            </div>
          </div>

          <div style={{ ...glassCard, animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Active Roster ({partners.filter(p => p.active !== false).length})
            </div>
            {partners.filter(p => p.active !== false).length === 0 ? (
              <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.83rem' }}>No active team members.</div>
            ) : partners.filter(p => p.active !== false).map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                onClick={() => setSelected(selected === p.id ? 'all' : p.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: selected === p.id ? 'rgba(254,100,98,0.25)' : 'rgba(254,100,98,0.1)', border: `1px solid ${selected === p.id ? 'rgba(254,100,98,0.6)' : 'rgba(254,100,98,0.25)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem', fontWeight: 800, color: '#FE6462', transition: 'all 0.2s' }}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: selected === p.id ? '#fff' : 'rgba(255,255,255,0.8)', fontSize: '0.86rem' }}>{p.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', textTransform: 'capitalize' }}>{p.role}</div>
                  </div>
                </div>
                <div onClick={e => e.stopPropagation()}>
                  <button onClick={() => terminateMember(p.id)} style={{ ...btn('danger'), padding: '3px 10px', fontSize: '0.68rem' }}>Terminate</button>
                </div>
              </div>
            ))}

            {partners.filter(p => p.active === false).length > 0 && (
              <>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '1.25rem', marginBottom: '0.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  Terminated ({partners.filter(p => p.active === false).length})
                </div>
                {partners.filter(p => p.active === false).map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', opacity: 0.45 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)' }}>
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'rgba(255,255,255,0.5)', fontSize: '0.84rem' }}>{p.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', textTransform: 'capitalize' }}>{p.role}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => reactivateMember(p.id)} style={{ ...btn('ghost'), padding: '3px 10px', fontSize: '0.68rem' }}>Reactivate</button>
                      <button onClick={() => setDelId(p.id)} style={{ ...btn('danger'), padding: '3px 8px', fontSize: '0.68rem' }}>×</button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Metrics panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) 0.08s both' }}>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{selected === 'all' ? 'All Team' : pName(selected)}</div>
            <select value={selected} onChange={e => setSelected(e.target.value)} style={{ ...inp, width: 'auto', cursor: 'pointer' }}>
              <option value="all">All Team Members</option>
              {partners.filter(p => p.active !== false).map(p => <option key={p.id} value={p.id}>{p.name} ({p.role})</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            {[
              { label: 'Total Commissions', value: fmtM(m.totalEarned), color: '#FE6462', delay: 0.12 },
              { label: 'Pending Payout', value: fmtM(m.pendingPayout), color: '#F59E0B', delay: 0.16 },
              { label: 'Total Paid Out', value: fmtM(m.paidOut), color: '#94D96B', delay: 0.20 },
              { label: 'Ongoing / Cycle', value: fmtM(m.ongoingPerCycle), color: '#6B8EFE', delay: 0.24 },
            ].map(({ label, value, color, delay }) => (
              <div key={label} style={{ ...glassCard, borderLeft: `3px solid ${color}`, padding: '1rem 1.25rem', animation: `cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) ${delay}s both` }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: '0.3rem' }}>{label}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Setter / Closer split cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) 0.28s both' }}>
            <div style={{ ...glassCard, borderTop: '2px solid #FE6462' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FE6462', marginBottom: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Setter Commissions</div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div><div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginBottom: '2px' }}>PENDING</div><div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F59E0B' }}>{fmtM(m.setterPending)}</div></div>
                <div><div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginBottom: '2px' }}>PAID OUT</div><div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#94D96B' }}>{fmtM(m.setterPaid)}</div></div>
              </div>
            </div>
            <div style={{ ...glassCard, borderTop: '2px solid #6B8EFE' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B8EFE', marginBottom: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Closer Commissions</div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div><div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginBottom: '2px' }}>PENDING</div><div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F59E0B' }}>{fmtM(m.closerPending)}</div></div>
                <div><div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginBottom: '2px' }}>PAID OUT</div><div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#94D96B' }}>{fmtM(m.closerPaid)}</div></div>
              </div>
            </div>
          </div>

          {/* Client breakdown */}
          <div style={{ ...glassCard, padding: 0, overflow: 'hidden', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) 0.32s both' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>Client Breakdown</div>
            {m.myClients.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.83rem' }}>No clients.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr>{['Client', 'Amount', 'Setter', 'Closer', 'Init Comm', 'Stage'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                  <tbody>
                    {m.myClients.map(c => {
                      const myInit = selected === 'all'
                        ? calcInit(c, 'setter') + calcInit(c, 'closer')
                        : (c.setterId === selected ? calcInit(c, 'setter') : 0) + (c.closerId === selected ? calcInit(c, 'closer') : 0);
                      return (
                        <tr key={c.id}>
                          <td style={tdStyle}><div style={{ fontWeight: 700, color: '#fff' }}>{c.name}</div>{c.company && <div style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.3)' }}>{c.company}</div>}</td>
                          <td style={tdStyle}><span style={{ color: '#94D96B', fontWeight: 700 }}>{fmtM(c.amount)}</span>{c.planT === 'recurring' && <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>/mo</span>}</td>
                          <td style={tdStyle}><span style={{ color: c.setterId === selected && selected !== 'all' ? '#FE6462' : 'inherit' }}>{pName(c.setterId)}</span></td>
                          <td style={tdStyle}><span style={{ color: c.closerId === selected && selected !== 'all' ? '#6B8EFE' : 'inherit' }}>{pName(c.closerId)}</span></td>
                          <td style={tdStyle}><span style={{ color: '#94D96B', fontWeight: 700 }}>{fmtM(myInit)}</span></td>
                          <td style={tdStyle}><span style={badge(STAGES[c.stage].color)}>{STAGES[c.stage].label}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {delId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '1.75rem', maxWidth: '360px', width: '90%' }}>
            <h3 style={{ color: '#fff', margin: '0 0 0.5rem', fontWeight: 800 }}>Remove Team Member?</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', margin: '0 0 1.5rem' }}>Their commission records will remain but they'll be unlinked from new clients.</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setDelId(null)} style={btn('ghost')}>Cancel</button>
              <button onClick={() => deleteMember(delId)} style={btn('danger')}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Payouts Tab ──────────────────────────────────────────────────────────────
function PayoutsTab({ data, setData, partners }: { data: AppData; setData: (d: AppData) => void; partners: Partner[] }) {
  const [filter, setFilter] = useState<'pending' | 'paid' | 'all'>('pending');
  const [addModal, setAddModal] = useState(false);
  const [newP, setNewP] = useState({ clientId: '', partnerId: '', role: 'closer' as 'setter' | 'closer', commT: 'initial' as 'initial' | 'renewal', amount: 0, due: today(), notes: '' });

  const pName = (id: string) => partners.find(p => p.id === id)?.name || '—';
  const cName = (id: string) => data.clients.find(c => c.id === id)?.name || '—';
  const shown = data.comms.filter(c => filter === 'all' || c.stat === filter);

  const markPaid    = (id: string) => setData({ ...data, comms: data.comms.map(c => c.id === id ? { ...c, stat: 'paid', paid: today() } : c) });
  const markPending = (id: string) => setData({ ...data, comms: data.comms.map(c => c.id === id ? { ...c, stat: 'pending', paid: '' } : c) });
  const addComm     = () => {
    if (!newP.clientId || !newP.partnerId || !newP.amount) return;
    setData({ ...data, comms: [...data.comms, { ...newP, id: uid(), stat: 'pending', paid: '' }] });
    setAddModal(false);
    setNewP({ clientId: '', partnerId: '', role: 'closer', commT: 'initial', amount: 0, due: today(), notes: '' });
  };
  const deleteComm = (id: string) => setData({ ...data, comms: data.comms.filter(c => c.id !== id) });

  const pendingTotal   = data.comms.filter(c => c.stat === 'pending').reduce((s, c) => s + c.amount, 0);
  const setterPending  = data.comms.filter(c => c.stat === 'pending' && c.role === 'setter').reduce((s, c) => s + c.amount, 0);
  const closerPending  = data.comms.filter(c => c.stat === 'pending' && c.role === 'closer').reduce((s, c) => s + c.amount, 0);
  const totalPaidOut   = data.comms.filter(c => c.stat === 'paid').reduce((s, c) => s + c.amount, 0);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.2rem', letterSpacing: '-0.03em' }}>Commission Payouts</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.83rem', margin: 0 }}>Mark commissions as paid once transferred</p>
        </div>
        <button onClick={() => setAddModal(true)} style={btn('ghost')}>+ Add Commission</button>
      </div>

      {/* Commission Ledger — per partner */}
      {partners.length > 0 && (
        <div style={{ ...glassCard, marginBottom: '1.5rem', padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)', fontWeight: 700, color: '#fff', fontSize: '0.88rem', letterSpacing: '-0.01em' }}>Commission Ledger</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>{['Team Member', 'Role', 'Total Earned', 'Paid Out', 'Outstanding', 'Action'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
            <tbody>
              {partners.map(p => {
                const myComms  = data.comms.filter(c => c.partnerId === p.id);
                const earned   = myComms.reduce((s, c) => s + c.amount, 0);
                const paid     = myComms.filter(c => c.stat === 'paid').reduce((s, c) => s + c.amount, 0);
                const owed     = earned - paid;
                return (
                  <tr key={p.id} onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')} style={{ transition: 'background 0.15s' }}>
                    <td style={tdStyle}><div style={{ fontWeight: 700, color: '#fff' }}>{p.name}</div></td>
                    <td style={tdStyle}><span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>{p.role}</span></td>
                    <td style={tdStyle}><div style={{ fontWeight: 700, color: '#fff' }}>{fmtM(earned)}</div></td>
                    <td style={tdStyle}><div style={{ fontWeight: 700, color: '#94D96B' }}>{fmtM(paid)}</div></td>
                    <td style={tdStyle}><div style={{ fontWeight: 800, color: owed > 0 ? '#F59E0B' : '#94D96B' }}>{fmtM(owed)}</div></td>
                    <td style={tdStyle}>
                      {owed > 0 && (
                        <button onClick={() => {
                          setData({ ...data, comms: data.comms.map(c => c.partnerId === p.id && c.stat === 'pending' ? { ...c, stat: 'paid', paid: today() } : c) });
                        }} style={{ ...btn('success'), padding: '4px 12px', fontSize: '0.75rem' }}>Mark All Paid</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Pending', value: fmtM(pendingTotal), color: '#F59E0B', delay: 0 },
          { label: 'Setter Pending', value: fmtM(setterPending), color: '#FE6462', delay: 0.06 },
          { label: 'Closer Pending', value: fmtM(closerPending), color: '#6B8EFE', delay: 0.12 },
          { label: 'Total Paid Out', value: fmtM(totalPaidOut), color: '#94D96B', delay: 0.18 },
        ].map(({ label, value, color, delay }) => (
          <div key={label} style={{ ...glassCard, borderLeft: `3px solid ${color}`, padding: '1rem 1.25rem', animation: `cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) ${delay}s both` }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: '0.3rem' }}>{label}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {(['pending', 'paid', 'all'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ ...btn(filter === f ? 'primary' : 'ghost'), textTransform: 'capitalize' }}>{f}</button>
        ))}
      </div>

      <div style={{ ...glassCard, padding: 0, overflow: 'hidden' }}>
        {shown.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>No commissions to show.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['Partner', 'Client', 'Type', 'Role', 'Amount', 'Due', 'Status', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
              <tbody>
                {shown.map(c => (
                  <tr key={c.id} onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')} style={{ transition: 'background 0.15s' }}>
                    <td style={tdStyle}><span style={{ fontWeight: 700, color: '#fff' }}>{pName(c.partnerId)}</span></td>
                    <td style={tdStyle}>{cName(c.clientId)}</td>
                    <td style={tdStyle}><span style={{ textTransform: 'capitalize' }}>{c.commT}</span></td>
                    <td style={tdStyle}><span style={{ textTransform: 'capitalize', color: c.role === 'closer' ? '#6B8EFE' : '#FE6462', fontWeight: 700 }}>{c.role}</span></td>
                    <td style={tdStyle}><span style={{ fontWeight: 700, color: c.stat === 'paid' ? '#94D96B' : '#F59E0B', fontSize: '0.95rem' }}>{fmtM(c.amount)}</span></td>
                    <td style={tdStyle}>{fmtD(c.due)}</td>
                    <td style={tdStyle}>
                      <span style={badge(c.stat === 'paid' ? '#94D96B' : '#F59E0B')}>{c.stat === 'paid' ? 'Paid' : 'Pending'}</span>
                      {c.stat === 'paid' && c.paid && <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{fmtD(c.paid)}</div>}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {c.stat === 'pending'
                          ? <button onClick={() => markPaid(c.id)} style={{ ...btn('success'), padding: '4px 10px', fontSize: '0.75rem' }}>Mark Paid</button>
                          : <button onClick={() => markPending(c.id)} style={{ ...btn('ghost'), padding: '4px 10px', fontSize: '0.75rem' }}>Undo</button>}
                        <button onClick={() => deleteComm(c.id)} style={{ ...btn('danger'), padding: '4px 10px', fontSize: '0.75rem' }}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {addModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}>
          <div style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '1.75rem', width: '90%', maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ color: '#fff', margin: 0, fontWeight: 800 }}>Add Commission Entry</h3>
              <button onClick={() => setAddModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.3rem', lineHeight: 1, padding: 0 }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div><label style={lbl}>Partner</label>
                <select value={newP.partnerId} onChange={e => setNewP(p => ({ ...p, partnerId: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}>
                  <option value="">— Select —</option>{partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div><label style={lbl}>Client</label>
                <select value={newP.clientId} onChange={e => setNewP(p => ({ ...p, clientId: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}>
                  <option value="">— Select —</option>{data.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div><label style={lbl}>Role</label>
                <select value={newP.role} onChange={e => setNewP(p => ({ ...p, role: e.target.value as 'setter' | 'closer' }))} style={{ ...inp, cursor: 'pointer' }}>
                  <option value="setter">Setter</option><option value="closer">Closer</option>
                </select>
              </div>
              <div><label style={lbl}>Type</label>
                <select value={newP.commT} onChange={e => setNewP(p => ({ ...p, commT: e.target.value as 'initial' | 'renewal' }))} style={{ ...inp, cursor: 'pointer' }}>
                  <option value="initial">Initial</option><option value="renewal">Renewal</option>
                </select>
              </div>
              <div><label style={lbl}>Amount ($)</label>
                <input type="number" value={newP.amount || ''} onChange={e => setNewP(p => ({ ...p, amount: parseFloat(e.target.value) || 0 }))} style={inp} />
              </div>
              <div><label style={lbl}>Due Date</label>
                <input type="date" value={newP.due} onChange={e => setNewP(p => ({ ...p, due: e.target.value }))} style={inp} />
              </div>
              <div style={{ gridColumn: '1/-1' }}><label style={lbl}>Notes</label>
                <input type="text" value={newP.notes} onChange={e => setNewP(p => ({ ...p, notes: e.target.value }))} placeholder="Optional…" style={inp} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button onClick={() => setAddModal(false)} style={btn('ghost')}>Cancel</button>
              <button onClick={addComm} style={btn('primary')}>Add Commission</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Payments Tab ─────────────────────────────────────────────────────────────
function PaymentsTab({ data, setData }: { data: AppData; setData: (d: AppData) => void }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(() => today().slice(0, 7)); // 'YYYY-MM'
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [editDueDateId, setEditDueDateId] = useState<string | null>(null);
  const [editDueDateVal, setEditDueDateVal] = useState('');

  // All non-churned, non-paused clients — everyone with active billing regardless of planT label
  const activeClients = data.clients.filter(c => c.stage !== 'churned' && c.stage !== 'paused');

  // Find what date the 30-day billing cycle lands on in a given month (walks 30-day steps from baseDate)
  // Returns null if the cycle doesn't land in that month (e.g. skips due to 31-day months)
  const findDueDateInMonth = (baseDate: string, month: string): string | null => {
    const [year, mon] = month.split('-').map(Number);
    const monthStart = new Date(year, mon - 1, 1);
    const monthEnd = new Date(year, mon, 0);
    let d = new Date(baseDate + 'T00:00:00');
    // Walk backward until before month
    while (d > monthEnd) d = new Date(d.getTime() - 30 * 86400000);
    // Walk forward until in or past month
    while (d < monthStart) d = new Date(d.getTime() + 30 * 86400000);
    if (d >= monthStart && d <= monthEnd) return d.toISOString().slice(0, 10);
    return null; // cycle skips this month
  };

  // Generate payment records for a given month, only for clients NOT already in excludeIds
  const ensureRecordsForMonth = (month: string, excludeClientIds: Set<string> = new Set()) => {
    const newRecords: PaymentRecord[] = [];
    const [year, mon] = month.split('-').map(Number);
    const monthEnd = new Date(year, mon, 0); // last day of month

    activeClients.forEach(c => {
      if (excludeClientIds.has(c.id)) return;
      // Use nextDue if set, otherwise fall back to start date
      const baseDate = c.nextDue || c.start;
      if (!baseDate) return;
      const startDate = new Date((c.start || baseDate) + 'T00:00:00');
      // Only show if client started on or before end of this month
      if (startDate > monthEnd) return;
      const dueDateStr = findDueDateInMonth(baseDate, month);
      if (!dueDateStr) return; // 30-day cycle skips this month
      newRecords.push({
        id: uid(),
        clientId: c.id,
        month,
        dueDate: dueDateStr,
        amount: monthlyVal(c),
        paid: false,
        paidAt: '',
      });
    });
    return newRecords;
  };

  // Always merge saved records with any missing clients (handles clients added after month was first viewed)
  const monthRecords = useMemo(() => {
    const existing = data.paymentRecords.filter(r => r.month === selectedMonth);
    const existingClientIds = new Set(existing.map(r => r.clientId));
    const missing = ensureRecordsForMonth(selectedMonth, existingClientIds);
    return [...existing, ...missing];
  }, [data.paymentRecords, selectedMonth, activeClients.map(c => c.id + c.amount + c.nextDue).join(',')]);

  const markPaid = (recordId: string) => {
    // Check if this record exists in data already
    const existingIdx = data.paymentRecords.findIndex(r => r.id === recordId);
    let updatedRecords: PaymentRecord[];
    if (existingIdx >= 0) {
      updatedRecords = data.paymentRecords.map(r =>
        r.id === recordId ? { ...r, paid: true, paidAt: today() } : r
      );
    } else {
      // Record was generated but not yet saved — find it in monthRecords and save with paid=true
      const rec = monthRecords.find(r => r.id === recordId);
      if (!rec) return;
      updatedRecords = [...data.paymentRecords, { ...rec, paid: true, paidAt: today() }];
    }

    // Advance client.nextDue by exactly 30 days after marking paid
    const record = monthRecords.find(r => r.id === recordId);
    let updatedClients = data.clients;
    if (record) {
      updatedClients = data.clients.map(c => {
        if (c.id !== record.clientId) return c;
        const nd = new Date((c.nextDue || record.dueDate) + 'T00:00:00');
        nd.setDate(nd.getDate() + 30);
        return { ...c, nextDue: nd.toISOString().slice(0, 10), payStat: 'current' as PayStat };
      });
    }

    setData({ ...data, paymentRecords: updatedRecords, clients: updatedClients });
  };

  const markUnpaid = (recordId: string) => {
    const existing = data.paymentRecords.find(r => r.id === recordId);
    if (!existing) return;
    const updatedRecords = data.paymentRecords.map(r =>
      r.id === recordId ? { ...r, paid: false, paidAt: '' } : r
    );
    setData({ ...data, paymentRecords: updatedRecords });
  };

  const saveGeneratedRecords = (records: PaymentRecord[]) => {
    const newOnes = records.filter(r => !data.paymentRecords.find(ex => ex.id === r.id));
    if (newOnes.length > 0) {
      setData({ ...data, paymentRecords: [...data.paymentRecords, ...newOnes] });
    }
  };

  // Monthly summary
  const totalExpected = monthRecords.reduce((s, r) => s + r.amount, 0);
  const totalPaid = monthRecords.filter(r => r.paid).reduce((s, r) => s + r.amount, 0);
  const totalRemaining = totalExpected - totalPaid;
  const pctCollected = totalExpected > 0 ? Math.round((totalPaid / totalExpected) * 100) : 0;

  // Weekly view
  const weekStart = getWeekStart(weekOffset);
  const weekDays: Date[] = Array.from({ length: 7 }, (_, i) => { const d = new Date(weekStart); d.setDate(d.getDate() + i); return d; });
  const weekLabel = `${weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayStr = today();

  const paymentsForDay = (day: Date): PaymentRecord[] => {
    const ds = day.toISOString().slice(0, 10);
    return monthRecords.filter(r => r.dueDate === ds);
  };

  const getClient = (clientId: string) => data.clients.find(c => c.id === clientId);

  // Prev/next month nav
  const changeMonth = (dir: number) => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const d = new Date(y, m - 1 + dir, 1);
    setSelectedMonth(d.toISOString().slice(0, 7));
  };
  const monthLabel = new Date(selectedMonth + '-01T00:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const unpaidClients = monthRecords.filter(r => !r.paid).map(r => getClient(r.clientId)).filter(Boolean) as Client[];

  // Last paid record per client (across all months)
  const lastPaidMap = useMemo(() => {
    const map = new Map<string, PaymentRecord>();
    data.paymentRecords
      .filter(r => r.paid && r.paidAt)
      .sort((a, b) => a.paidAt.localeCompare(b.paidAt))
      .forEach(r => map.set(r.clientId, r));
    return map;
  }, [data.paymentRecords]);

  // Returns the last payment date for a client — from a marked record, or derived from nextDue - 1 month
  const getLastPaymentDate = (clientId: string): string | null => {
    const rec = lastPaidMap.get(clientId);
    if (rec?.paidAt) return rec.paidAt;
    const client = data.clients.find(c => c.id === clientId);
    if (client?.nextDue) {
      const d = new Date(client.nextDue + 'T00:00:00');
      d.setMonth(d.getMonth() - 1);
      return d.toISOString().slice(0, 10);
    }
    return null;
  };

  const daysAgo = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr + 'T00:00:00').getTime()) / 86400000);
    if (diff === 0) return 'today';
    if (diff === 1) return '1 day ago';
    return `${diff} days ago`;
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.2rem', letterSpacing: '-0.03em' }}>Payments Tracker</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.83rem', margin: 0 }}>Track monthly billing for all active clients</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => changeMonth(-1)} style={btn('ghost')}>← Prev</button>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 700, minWidth: '160px', textAlign: 'center' }}>{monthLabel}</span>
          <button onClick={() => changeMonth(1)} style={btn('ghost')}>Next →</button>
          {selectedMonth !== today().slice(0, 7) && (
            <button onClick={() => setSelectedMonth(today().slice(0, 7))} style={btn('primary')}>This Month</button>
          )}
        </div>
      </div>

      {/* Monthly summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Expected', value: fmtM(totalExpected), color: '#6B8EFE' },
          { label: 'Total Paid', value: fmtM(totalPaid), color: '#94D96B' },
          { label: 'Remaining', value: fmtM(totalRemaining), color: totalRemaining > 0 ? '#F59E0B' : '#94D96B' },
          { label: '% Collected', value: `${pctCollected}%`, color: pctCollected >= 100 ? '#94D96B' : pctCollected >= 75 ? '#6B8EFE' : '#F59E0B' },
        ].map(stat => (
          <div key={stat.label} style={{ ...glassCard, borderLeft: `3px solid ${stat.color}`, padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>{stat.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.color, letterSpacing: '-0.03em' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes todayGlow {
          0%, 100% { box-shadow: 0 0 0 1px rgba(254,100,98,0.5), 0 0 16px rgba(254,100,98,0.12); }
          50%       { box-shadow: 0 0 0 1px rgba(254,100,98,0.9), 0 0 28px rgba(254,100,98,0.28); }
        }
        .payments-today-cell {
          animation: todayGlow 2.4s ease-in-out infinite;
          border-color: rgba(254,100,98,0.7) !important;
        }
      `}</style>

      {/* Weekly calendar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>Week View</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => setWeekOffset(w => w - 1)} style={btn('ghost')}>← Prev</button>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', fontWeight: 600, minWidth: '200px', textAlign: 'center' }}>{weekLabel}</span>
          <button onClick={() => setWeekOffset(w => w + 1)} style={btn('ghost')}>Next →</button>
          {weekOffset !== 0 && <button onClick={() => setWeekOffset(0)} style={btn('ghost')}>Today</button>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '2rem' }}>
        {weekDays.map((day, i) => {
          const dayPayments = paymentsForDay(day);
          const isToday = day.toISOString().slice(0, 10) === todayStr;
          return (
            <div key={i} className={isToday ? 'payments-today-cell' : ''} style={{ ...glassCard, minHeight: '130px', padding: '0.75rem', borderColor: isToday ? 'rgba(254,100,98,0.7)' : 'rgba(255,255,255,0.07)' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>{dayNames[i]}</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: isToday ? '#FE6462' : '#fff', lineHeight: 1 }}>{day.getDate()}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {dayPayments.map((rec) => {
                  const client = getClient(rec.clientId);
                  if (!client) return null;
                  const isAtRisk = client.stage === 'at-risk';
                  const color = rec.paid ? '#94D96B' : isAtRisk ? '#F59E0B' : '#6B8EFE';
                  return (
                    <div
                      key={rec.id}
                      onClick={() => {
                        // Ensure record is saved before selection
                        if (!data.paymentRecords.find(r => r.id === rec.id)) {
                          saveGeneratedRecords(monthRecords);
                        }
                        setSelectedClient(selectedClient === rec.id ? null : rec.id);
                      }}
                      style={{
                        padding: '4px 6px', borderRadius: '6px', fontSize: '0.67rem', fontWeight: 700,
                        lineHeight: 1.3, cursor: 'pointer',
                        background: rec.paid ? 'rgba(148,217,107,0.13)' : isAtRisk ? 'rgba(245,158,11,0.13)' : 'rgba(107,142,254,0.13)',
                        color,
                        border: `1px solid ${color}40`,
                        textDecoration: rec.paid ? 'line-through' : 'none',
                        opacity: rec.paid ? 0.6 : 1,
                      }}
                    >
                      {client.name}
                      {isAtRisk && !rec.paid && <span style={{ marginLeft: '3px', opacity: 0.7 }}>⚠</span>}
                      <div style={{ fontSize: '0.62rem', fontWeight: 600, color, opacity: 0.75, marginTop: '1px' }}>{fmtM(rec.amount)}</div>
                    </div>
                  );
                })}
                {dayPayments.length === 0 && <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.12)' }}>—</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full month payment list */}
      <div style={glassCard}>
        <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>{monthLabel} — All Payments ({monthRecords.length} clients)</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ fontSize: '0.72rem', color: '#94D96B', fontWeight: 600 }}>{monthRecords.filter(r => r.paid).length} paid</span>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>·</span>
            <span style={{ fontSize: '0.72rem', color: '#F59E0B', fontWeight: 600 }}>{monthRecords.filter(r => !r.paid).length} pending</span>
          </div>
        </div>

        {monthRecords.length === 0 ? (
          <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.83rem' }}>No active recurring clients found.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {monthRecords
              .sort((a, b) => {
                // Unpaid at-risk first, then unpaid, then paid
                const ca = getClient(a.clientId);
                const cb = getClient(b.clientId);
                if (!a.paid && ca?.stage === 'at-risk') return -1;
                if (!b.paid && cb?.stage === 'at-risk') return 1;
                if (!a.paid && b.paid) return -1;
                if (a.paid && !b.paid) return 1;
                return a.dueDate.localeCompare(b.dueDate);
              })
              .map((rec) => {
                const client = getClient(rec.clientId);
                if (!client) return null;
                const isAtRisk = client.stage === 'at-risk';
                const isSelected = selectedClient === rec.id;
                const accentColor = rec.paid ? '#94D96B' : isAtRisk ? '#F59E0B' : 'rgba(255,255,255,0.25)';
                const lastPaymentDate = rec.paid && rec.paidAt ? rec.paidAt : getLastPaymentDate(rec.clientId);
                return (
                  <div
                    key={rec.id}
                    style={{
                      padding: '0.85rem 1rem', borderRadius: '12px',
                      background: isSelected ? 'rgba(255,255,255,0.06)' : 'transparent',
                      border: `1px solid ${isSelected ? 'rgba(255,255,255,0.12)' : 'transparent'}`,
                      transition: 'background 0.2s, border-color 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                      onClick={() => setSelectedClient(isSelected ? null : rec.id)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {/* Paid checkbox */}
                        <div style={{
                          width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0,
                          background: rec.paid ? '#94D96B22' : 'rgba(255,255,255,0.05)',
                          border: `2px solid ${rec.paid ? '#94D96B' : 'rgba(255,255,255,0.15)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s',
                        }}>
                          {rec.paid && <span style={{ color: '#94D96B', fontSize: '12px', lineHeight: 1 }}>✓</span>}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: 700, color: rec.paid ? 'rgba(255,255,255,0.4)' : '#fff', fontSize: '0.9rem', textDecoration: rec.paid ? 'line-through' : 'none' }}>{client.name}</span>
                            {client.company && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem' }}>{client.company}</span>}
                            {isAtRisk && <span style={badge('#F59E0B')}>At Risk</span>}
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '2px', flexWrap: 'wrap' }}>
                            <span>Due {fmtD(rec.dueDate)}</span>
                            {rec.paid && rec.paidAt && <><span>·</span><span style={{ color: '#94D96B' }}>Paid {fmtD(rec.paidAt)}</span></>}
                            {lastPaymentDate && (
                              <>
                                <span>·</span>
                                <span style={{ color: 'rgba(255,255,255,0.4)' }}>
                                  Last paid: {fmtD(lastPaymentDate)}
                                </span>
                                <span style={{ color: rec.paid ? 'rgba(255,255,255,0.25)' : '#F59E0B', fontWeight: 600 }}>
                                  ({daysAgo(lastPaymentDate)})
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontWeight: 800, color: accentColor, fontSize: '1rem' }}>{fmtM(rec.amount)}</span>
                        <span style={badge(rec.paid ? '#94D96B' : isAtRisk ? '#F59E0B' : 'rgba(255,255,255,0.4)')}>{rec.paid ? 'Paid' : isAtRisk ? 'At Risk' : 'Pending'}</span>
                      </div>
                    </div>
                    {/* Action row */}
                    {isSelected && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.75rem', paddingLeft: '2.25rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          {!rec.paid ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); markPaid(rec.id); setSelectedClient(null); }}
                              style={{ ...btn('success'), fontSize: '0.8rem', padding: '6px 16px' }}
                            >
                              Mark Paid
                            </button>
                          ) : (
                            <button
                              onClick={(e) => { e.stopPropagation(); markUnpaid(rec.id); setSelectedClient(null); }}
                              style={{ ...btn('ghost'), fontSize: '0.8rem', padding: '6px 16px' }}
                            >
                              Mark Unpaid
                            </button>
                          )}
                          {isAtRisk && !rec.paid && (
                            <span style={{ fontSize: '0.78rem', color: '#F59E0B', alignSelf: 'center' }}>This client is at risk — follow up before charging.</span>
                          )}
                        </div>
                        {/* Due date editor — set new anchor date, repeats every 30 days */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Change billing start date:</span>
                          <input
                            type="date"
                            value={editDueDateId === rec.id ? editDueDateVal : (client.nextDue || '')}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => { setEditDueDateId(rec.id); setEditDueDateVal(e.target.value); }}
                            style={{ ...inp, padding: '4px 8px', fontSize: '0.8rem', width: 'auto', height: 'auto' }}
                          />
                          {editDueDateId === rec.id && editDueDateVal && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const updatedClients = data.clients.map(c =>
                                  c.id === client.id ? { ...c, nextDue: editDueDateVal } : c
                                );
                                setData({ ...data, clients: updatedClients });
                                setEditDueDateId(null);
                                setEditDueDateVal('');
                              }}
                              style={{ ...btn('primary'), fontSize: '0.78rem', padding: '4px 12px' }}
                            >
                              Save
                            </button>
                          )}
                          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>repeats every 30 days</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#94D96B' }} /><span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>Paid</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#6B8EFE' }} /><span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>Pending</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#F59E0B' }} /><span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>At Risk</span></div>
      </div>
    </div>
  );
}

// ─── Calendar Tab ─────────────────────────────────────────────────────────────
function CalendarTab({ data }: { data: AppData }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const weekStart = getWeekStart(weekOffset);
  const weekDays: Date[] = Array.from({ length: 7 }, (_, i) => { const d = new Date(weekStart); d.setDate(d.getDate() + i); return d; });
  const weekEnd = weekDays[6];

  const eventsForDay = (day: Date) => {
    const ds = day.toISOString().slice(0, 10);
    const payments = data.clients.filter(c => c.nextDue === ds).map(c => ({ type: 'payment' as const, client: c, date: day }));
    const checkins = data.clients.flatMap(c => {
      const dates = getBiweekly(c.start, new Date(weekStart), new Date(weekEnd));
      return dates.filter(d => d.toISOString().slice(0, 10) === ds).map(() => ({ type: 'checkin' as const, client: c, date: day }));
    });
    return [...payments, ...checkins];
  };

  const weekLabel = `${weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayStr = today();
  const upcoming = data.clients.filter(c => c.nextDue && c.nextDue >= todayStr).sort((a, b) => a.nextDue.localeCompare(b.nextDue)).slice(0, 10);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.2rem', letterSpacing: '-0.03em' }}>Calendar</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.83rem', margin: 0 }}>Payments due + bi-weekly check-in reminders</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => setWeekOffset(w => w - 1)} style={btn('ghost')}>← Prev</button>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: 600, minWidth: '200px', textAlign: 'center' }}>{weekLabel}</span>
          <button onClick={() => setWeekOffset(w => w + 1)} style={btn('ghost')}>Next →</button>
          {weekOffset !== 0 && <button onClick={() => setWeekOffset(0)} style={btn('primary')}>Today</button>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '2rem' }}>
        {weekDays.map((day, i) => {
          const events = eventsForDay(day);
          const isToday = day.toISOString().slice(0, 10) === todayStr;
          return (
            <div key={i} style={{ ...glassCard, minHeight: '120px', padding: '0.75rem', borderColor: isToday ? 'rgba(254,100,98,0.4)' : 'rgba(255,255,255,0.07)', boxShadow: isToday ? '0 0 20px rgba(254,100,98,0.1)' : 'none' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>{dayNames[i]}</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: isToday ? '#FE6462' : '#fff', lineHeight: 1 }}>{day.getDate()}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {events.map((ev, j) => (
                  <div key={j} style={{ padding: '3px 6px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 600, lineHeight: 1.3,
                    background: ev.type === 'payment' ? 'rgba(148,217,107,0.15)' : 'rgba(107,142,254,0.15)',
                    color: ev.type === 'payment' ? '#94D96B' : '#6B8EFE',
                    border: `1px solid ${ev.type === 'payment' ? 'rgba(148,217,107,0.3)' : 'rgba(107,142,254,0.3)'}` }}>
                    {ev.type === 'payment' ? '💳 ' : '📞 '}{ev.client.name}
                    {ev.type === 'payment' && <span style={{ opacity: 0.7 }}> · {fmtM(ev.client.amount)}</span>}
                  </div>
                ))}
                {events.length === 0 && <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.12)' }}>—</div>}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#94D96B' }} /><span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>Payment Due</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#6B8EFE' }} /><span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>Bi-Weekly Check-In</span></div>
      </div>

      <div style={glassCard}>
        <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginBottom: '1rem' }}>Upcoming Payments (Next 30 Days)</div>
        {upcoming.length === 0 ? (
          <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.83rem' }}>No upcoming payments logged.</div>
        ) : upcoming.map(c => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>{c.name}</span>
              {c.company && <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', marginLeft: '6px' }}>{c.company}</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: '#94D96B', fontWeight: 700, fontSize: '0.88rem' }}>{fmtM(c.amount)}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{fmtD(c.nextDue)}</span>
              <span style={badge(PAY_STAT[c.payStat].color)}>{PAY_STAT[c.payStat].label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── My Dashboard Tab ─────────────────────────────────────────────────────────
function MyDashboardTab({ data, session }: { data: AppData; session: Session }) {
  const myClients = data.clients.filter(c => session.partnerId && (c.setterId === session.partnerId || c.closerId === session.partnerId) && c.stage !== 'churned');
  const myComms = data.comms.filter(c => c.partnerId === session.partnerId);
  const pendingTotal = myComms.filter(c => c.stat === 'pending').reduce((s, c) => s + c.amount, 0);
  const paidTotal = myComms.filter(c => c.stat === 'paid').reduce((s, c) => s + c.amount, 0);
  return (
    <div>
      <div style={{ marginBottom: '2rem', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.2rem', letterSpacing: '-0.03em' }}>Welcome back, {session.name.split(' ')[0]}</h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.83rem', margin: 0 }}>{ROLE_LABELS[session.role]} · Your activity at a glance</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Active Clients', value: myClients.filter(c => c.stage === 'active').length, color: '#94D96B' },
          { label: 'Total Assigned', value: myClients.length, color: '#6B8EFE' },
          { label: 'Pending Commissions', value: fmtM(pendingTotal), color: '#F59E0B' },
          { label: 'Paid to Date', value: fmtM(paidTotal), color: '#94D96B' },
        ].map((m, i) => (
          <div key={m.label} style={{ ...card, borderColor: m.color + '22', animation: `cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s both` }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{m.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>
      <div style={{ ...glassCard, animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) 0.24s both' }}>
        <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', marginBottom: '1rem' }}>My Recent Clients</div>
        {myClients.length === 0
          ? <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.83rem', margin: 0 }}>No clients assigned yet.</p>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {myClients.slice(0, 6).map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div><span style={{ color: '#fff', fontWeight: 600, fontSize: '0.88rem' }}>{c.name}</span><span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', marginLeft: '0.5rem' }}>{c.company}</span></div>
                  <span style={badge(STAGES[c.stage].color)}>{STAGES[c.stage].label}</span>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
}

// ─── My Clients Tab ───────────────────────────────────────────────────────────
function MyClientsTab({ data, session }: { data: AppData; session: Session }) {
  const myClients = data.clients.filter(c => session.partnerId && (c.setterId === session.partnerId || c.closerId === session.partnerId));
  return (
    <div>
      <div style={{ marginBottom: '1.5rem', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.2rem', letterSpacing: '-0.03em' }}>My Clients</h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.83rem', margin: 0 }}>{myClients.length} client{myClients.length !== 1 ? 's' : ''} assigned to you</p>
      </div>
      {myClients.length === 0
        ? <div style={{ ...glassCard, textAlign: 'center', padding: '3rem' }}><p style={{ color: 'rgba(255,255,255,0.3)', margin: 0 }}>No clients assigned yet.</p></div>
        : <div style={{ ...glassCard, padding: 0, overflow: 'hidden', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) 0.06s both' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['Client', 'Company', 'Package', 'Stage', 'Pay Status', 'Monthly Value', 'Your Role'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
              <tbody>
                {myClients.map(c => {
                  const isSetter = c.setterId === session.partnerId, isCloser = c.closerId === session.partnerId;
                  return (
                    <tr key={c.id} onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.02)')} onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
                      <td style={tdStyle}><span style={{ fontWeight: 600, color: '#fff' }}>{c.name}</span></td>
                      <td style={tdStyle}>{c.company}</td>
                      <td style={tdStyle}>{c.pkg}</td>
                      <td style={tdStyle}><span style={badge(STAGES[c.stage].color)}>{STAGES[c.stage].label}</span></td>
                      <td style={tdStyle}><span style={badge(PAY_STAT[c.payStat].color)}>{PAY_STAT[c.payStat].label}</span></td>
                      <td style={tdStyle}>{fmtM(monthlyVal(c))}</td>
                      <td style={tdStyle}><span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>{isSetter && isCloser ? 'Both' : isSetter ? 'Setter' : 'Closer'}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
      }
    </div>
  );
}

// ─── My Ledger Tab ────────────────────────────────────────────────────────────
function MyLedgerTab({ data, session }: { data: AppData; session: Session }) {
  const myComms = data.comms.filter(c => c.partnerId === session.partnerId);
  const pending = myComms.filter(c => c.stat === 'pending');
  const paid = myComms.filter(c => c.stat === 'paid');
  return (
    <div>
      <div style={{ marginBottom: '1.5rem', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.2rem', letterSpacing: '-0.03em' }}>My Ledger</h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.83rem', margin: 0 }}>All commissions tied to your deals</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ ...card, borderColor: '#F59E0B22', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) 0.06s both' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Pending</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F59E0B' }}>{fmtM(pending.reduce((s, c) => s + c.amount, 0))}</div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>{pending.length} entr{pending.length !== 1 ? 'ies' : 'y'}</div>
        </div>
        <div style={{ ...card, borderColor: '#94D96B22', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) 0.12s both' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Paid to Date</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#94D96B' }}>{fmtM(paid.reduce((s, c) => s + c.amount, 0))}</div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>{paid.length} entr{paid.length !== 1 ? 'ies' : 'y'}</div>
        </div>
      </div>
      {myComms.length === 0
        ? <div style={{ ...glassCard, textAlign: 'center', padding: '3rem' }}><p style={{ color: 'rgba(255,255,255,0.3)', margin: 0 }}>No commissions recorded yet.</p></div>
        : <div style={{ ...glassCard, padding: 0, overflow: 'hidden', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) 0.18s both' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['Client', 'Company', 'Type', 'Amount', 'Due Date', 'Status', 'Paid On'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
              <tbody>
                {myComms.map(c => {
                  const cl = data.clients.find(x => x.id === c.clientId);
                  return (
                    <tr key={c.id} onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.02)')} onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
                      <td style={tdStyle}><span style={{ fontWeight: 600, color: '#fff' }}>{cl?.name || '—'}</span></td>
                      <td style={tdStyle}>{cl?.company || '—'}</td>
                      <td style={tdStyle}><span style={{ textTransform: 'capitalize', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{c.commT} · {c.role}</span></td>
                      <td style={{ ...tdStyle, fontWeight: 700, color: '#FEB64A' }}>{fmtM(c.amount)}</td>
                      <td style={tdStyle}>{c.due ? fmtD(c.due) : '—'}</td>
                      <td style={tdStyle}><span style={badge(c.stat === 'paid' ? '#94D96B' : '#F59E0B')}>{c.stat === 'paid' ? 'Paid' : 'Pending'}</span></td>
                      <td style={tdStyle}>{c.stat === 'paid' && c.paid ? fmtD(c.paid) : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
      }
    </div>
  );
}

// ─── Goals Tab (setter/closer) ────────────────────────────────────────────────
function GoalsTab({ data, setData, session }: { data: AppData; setData: (d: AppData) => void; session: Session }) {
  const weekStart = getMonday();
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart + 'T00:00:00'); d.setDate(d.getDate() + i); return d.toISOString().slice(0, 10);
  });

  const myGoal = data.teamGoals.find(g => g.partnerId === session.partnerId);
  const myTasks = data.tasks.filter(t => t.assignedToPartnerId === session.partnerId);
  const weekLogs = data.dailyLogs.filter(l => l.partnerId === session.partnerId && l.date >= weekStart && l.date <= weekDates[6]);

  const todayStr = today();
  const todayLog = weekLogs.find(l => l.date === todayStr);

  const [logForm, setLogForm] = useState({ dials: todayLog?.dials ?? 0, bookedAppts: todayLog?.bookedAppts ?? 0, attendedAppts: todayLog?.attendedAppts ?? 0, notes: todayLog?.notes ?? '' });
  const [logSaved, setLogSaved] = useState(false);

  // Re-init form if todayLog changes
  useEffect(() => {
    setLogForm({ dials: todayLog?.dials ?? 0, bookedAppts: todayLog?.bookedAppts ?? 0, attendedAppts: todayLog?.attendedAppts ?? 0, notes: todayLog?.notes ?? '' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayLog?.id]);

  const saveLog = () => {
    const existing = data.dailyLogs.find(l => l.partnerId === session.partnerId && l.date === todayStr);
    let newLogs: DailyLog[];
    if (existing) {
      newLogs = data.dailyLogs.map(l => l.id === existing.id ? { ...l, ...logForm, submittedAt: new Date().toISOString() } : l);
    } else {
      newLogs = [...data.dailyLogs, { id: uid(), partnerId: session.partnerId, date: todayStr, ...logForm, submittedAt: new Date().toISOString() }];
    }
    setData({ ...data, dailyLogs: newLogs });
    setLogSaved(true);
    setTimeout(() => setLogSaved(false), 2500);
  };

  const toggleTask = (taskId: string, done: boolean) => {
    setData({ ...data, tasks: data.tasks.map(t => t.id === taskId ? { ...t, isCompleted: done, completedAt: done ? new Date().toISOString() : '' } : t) });
  };

  // Weekly totals
  const weekDials    = weekLogs.reduce((s, l) => s + l.dials, 0);
  const weekBooked   = weekLogs.reduce((s, l) => s + l.bookedAppts, 0);
  const weekAttended = weekLogs.reduce((s, l) => s + l.attendedAppts, 0);
  const showRate     = weekBooked > 0 ? Math.round((weekAttended / weekBooked) * 100) : null;

  const goalDialsWeek = myGoal ? myGoal.dialsPerDay * 5 : 0;
  const pct = (val: number, target: number) => target > 0 ? Math.min(100, Math.round((val / target) * 100)) : 0;

  const progressBar = (val: number, target: number, color: string) => (
    <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '100px', height: '7px', overflow: 'hidden', marginTop: '6px' }}>
      <div style={{ width: `${pct(val, target)}%`, height: '100%', background: color, borderRadius: '100px', transition: 'width 0.5s ease' }} />
    </div>
  );

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div>
      <div style={{ marginBottom: '2rem', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.2rem', letterSpacing: '-0.03em' }}>Goals & Tasks</h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.83rem', margin: 0 }}>Week of {fmtD(weekStart)}</p>
      </div>

      {/* Weekly progress cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) 0.05s both' }}>
        {[
          { label: 'Dials This Week', val: weekDials, target: goalDialsWeek, color: '#6B8EFE', suffix: myGoal ? `/ ${goalDialsWeek}` : '' },
          { label: 'Booked Appts', val: weekBooked, target: myGoal?.bookedPerWeek ?? 0, color: '#FEB64A', suffix: myGoal ? `/ ${myGoal.bookedPerWeek}` : '' },
          { label: 'Attended Appts', val: weekAttended, target: myGoal?.attendedPerWeek ?? 0, color: '#94D96B', suffix: myGoal ? `/ ${myGoal.attendedPerWeek}` : '' },
          { label: 'Show Rate', val: showRate ?? 0, target: 100, color: '#26D9B0', suffix: showRate !== null ? '%' : '', override: showRate !== null ? `${showRate}%` : 'N/A' },
        ].map(({ label, val, target, color, suffix, override }) => (
          <div key={label} style={{ ...card }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{label}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>
              {override ?? val}<span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)', fontWeight: 500, marginLeft: '4px' }}>{!override && suffix}</span>
            </div>
            {target > 0 && progressBar(val, target, color)}
          </div>
        ))}
      </div>

      {/* Today's check-in */}
      <div style={{ ...glassCard, marginBottom: '1.5rem', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}>
        <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginBottom: '0.15rem' }}>Today's Check-in</div>
        <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginBottom: '1.25rem' }}>{fmtD(todayStr)}{todayLog ? ' — already submitted, edit and save to update' : ''}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
          {([['Dials Made', 'dials'], ['Booked Appts', 'bookedAppts'], ['Attended Appts', 'attendedAppts']] as const).map(([label, field]) => (
            <div key={field}>
              <label style={lbl}>{label}</label>
              <input type="number" min={0} value={logForm[field]} onChange={e => setLogForm(f => ({ ...f, [field]: Number(e.target.value) }))} style={inp} />
            </div>
          ))}
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={lbl}>Notes (optional)</label>
          <input value={logForm.notes} onChange={e => setLogForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any blockers, wins, or context..." style={inp} />
        </div>
        <button onClick={saveLog} style={{ ...btn(logSaved ? 'success' : 'primary') }}>
          {logSaved ? 'Saved!' : todayLog ? 'Update Check-in' : 'Submit Check-in'}
        </button>
      </div>

      {/* Weekly breakdown table */}
      <div style={{ ...glassCard, padding: 0, overflow: 'hidden', marginBottom: '1.5rem', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) 0.15s both' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>Weekly Breakdown</div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>{['Day', 'Date', 'Dials', 'Booked', 'Attended', 'Notes'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
          <tbody>
            {weekDates.map((date, i) => {
              const log = weekLogs.find(l => l.date === date);
              const isToday = date === todayStr;
              return (
                <tr key={date} style={{ background: isToday ? 'rgba(107,142,254,0.05)' : undefined }}>
                  <td style={{ ...tdStyle, fontWeight: 700, color: isToday ? '#6B8EFE' : 'rgba(255,255,255,0.5)' }}>{dayLabels[i]}</td>
                  <td style={tdStyle}>{fmtD(date)}</td>
                  <td style={{ ...tdStyle, fontWeight: log?.dials ? 600 : undefined }}>{log?.dials ?? '—'}</td>
                  <td style={{ ...tdStyle, fontWeight: log?.bookedAppts ? 600 : undefined }}>{log?.bookedAppts ?? '—'}</td>
                  <td style={{ ...tdStyle, fontWeight: log?.attendedAppts ? 600 : undefined }}>{log?.attendedAppts ?? '—'}</td>
                  <td style={{ ...tdStyle, color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{log?.notes || '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Tasks */}
      <div style={{ animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) 0.2s both' }}>
        <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', marginBottom: '0.75rem' }}>My Tasks</div>
        {myTasks.length === 0
          ? <div style={{ ...glassCard, textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>No tasks assigned yet.</div>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {myTasks.map(task => (
                <div key={task.id} style={{ ...card, display: 'flex', alignItems: 'flex-start', gap: '0.85rem', opacity: task.isCompleted ? 0.55 : 1 }}>
                  <input type="checkbox" checked={task.isCompleted} onChange={e => toggleTask(task.id, e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: '#94D96B', marginTop: '2px', flexShrink: 0, cursor: 'pointer' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.87rem', textDecoration: task.isCompleted ? 'line-through' : 'none' }}>{task.title}</div>
                    {task.description && <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{task.description}</div>}
                    {task.dueDate && <div style={{ fontSize: '0.72rem', color: task.isCompleted ? 'rgba(255,255,255,0.3)' : '#F59E0B', marginTop: '4px', fontWeight: 600 }}>Due {fmtD(task.dueDate)}</div>}
                  </div>
                  {task.isCompleted && <span style={badge('#94D96B')}>Done</span>}
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
}

// ─── Goals Management Tab (managers) ─────────────────────────────────────────
function GoalsManagementTab({ data, setData, session }: { data: AppData; setData: (d: AppData) => void; session: Session }) {
  const weekStart = getMonday();
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart + 'T00:00:00'); d.setDate(d.getDate() + i); return d.toISOString().slice(0, 10);
  });
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const teamMembers = data.partners.filter(p => p.active !== false);
  const [selectedMember, setSelectedMember] = useState<string>(teamMembers[0]?.id ?? '');
  const [goalForm, setGoalForm] = useState({ dialsPerDay: 0, bookedPerWeek: 0, attendedPerWeek: 0 });
  const [goalSaved, setGoalSaved] = useState(false);

  // Task form
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', dueDate: '' });
  const [taskMember, setTaskMember] = useState(teamMembers[0]?.id ?? '');

  // Load goal when member changes
  useEffect(() => {
    const g = data.teamGoals.find(g => g.partnerId === selectedMember);
    setGoalForm({ dialsPerDay: g?.dialsPerDay ?? 0, bookedPerWeek: g?.bookedPerWeek ?? 0, attendedPerWeek: g?.attendedPerWeek ?? 0 });
  }, [selectedMember, data.teamGoals]);

  const saveGoal = () => {
    const existing = data.teamGoals.find(g => g.partnerId === selectedMember);
    let newGoals: TeamGoal[];
    if (existing) {
      newGoals = data.teamGoals.map(g => g.partnerId === selectedMember ? { ...g, ...goalForm, setBy: session.userId, updatedAt: new Date().toISOString() } : g);
    } else {
      newGoals = [...data.teamGoals, { id: uid(), partnerId: selectedMember, ...goalForm, setBy: session.userId, updatedAt: new Date().toISOString() }];
    }
    setData({ ...data, teamGoals: newGoals });
    setGoalSaved(true); setTimeout(() => setGoalSaved(false), 2500);
  };

  const addTask = () => {
    if (!taskForm.title.trim()) return;
    const newTask: Task = { id: uid(), assignedToPartnerId: taskMember, assignedByUserId: session.userId, title: taskForm.title, description: taskForm.description, dueDate: taskForm.dueDate, isCompleted: false, completedAt: '', createdAt: new Date().toISOString() };
    setData({ ...data, tasks: [...data.tasks, newTask] });
    setTaskForm({ title: '', description: '', dueDate: '' });
    setShowTaskForm(false);
  };

  const deleteTask = (taskId: string) => setData({ ...data, tasks: data.tasks.filter(t => t.id !== taskId) });

  // Team activity view
  const getMemberWeekLogs = (partnerId: string) =>
    data.dailyLogs.filter(l => l.partnerId === partnerId && l.date >= weekStart && l.date <= weekDates[6]);

  return (
    <div>
      <div style={{ marginBottom: '2rem', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.2rem', letterSpacing: '-0.03em' }}>Goals & Tasks</h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.83rem', margin: 0 }}>Set team targets, assign tasks, and track weekly activity</p>
      </div>

      {/* Team activity summary */}
      <div style={{ ...glassCard, padding: 0, overflow: 'hidden', marginBottom: '1.5rem', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) 0.05s both' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>Team Activity — Week of {fmtD(weekStart)}</div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>{['Team Member', 'Role', 'Goal (D/B/A)', 'Dials', 'Booked', 'Attended', 'Show Rate', 'Days Logged'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
          <tbody>
            {teamMembers.map(p => {
              const logs = getMemberWeekLogs(p.id);
              const goal = data.teamGoals.find(g => g.partnerId === p.id);
              const dials = logs.reduce((s, l) => s + l.dials, 0);
              const booked = logs.reduce((s, l) => s + l.bookedAppts, 0);
              const attended = logs.reduce((s, l) => s + l.attendedAppts, 0);
              const showRate = booked > 0 ? `${Math.round((attended / booked) * 100)}%` : '—';
              const daysLogged = logs.length;
              return (
                <tr key={p.id} onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.02)')} onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
                  <td style={{ ...tdStyle, fontWeight: 600, color: '#fff' }}>{p.name}</td>
                  <td style={tdStyle}><span style={{ textTransform: 'capitalize', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{p.role}</span></td>
                  <td style={{ ...tdStyle, fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>{goal ? `${goal.dialsPerDay * 5} / ${goal.bookedPerWeek} / ${goal.attendedPerWeek}` : 'Not set'}</td>
                  <td style={{ ...tdStyle, fontWeight: dials > 0 ? 700 : undefined, color: dials > 0 ? '#6B8EFE' : 'rgba(255,255,255,0.3)' }}>{dials || '—'}</td>
                  <td style={{ ...tdStyle, fontWeight: booked > 0 ? 700 : undefined, color: booked > 0 ? '#FEB64A' : 'rgba(255,255,255,0.3)' }}>{booked || '—'}</td>
                  <td style={{ ...tdStyle, fontWeight: attended > 0 ? 700 : undefined, color: attended > 0 ? '#94D96B' : 'rgba(255,255,255,0.3)' }}>{attended || '—'}</td>
                  <td style={{ ...tdStyle, fontWeight: 600, color: '#26D9B0' }}>{showRate}</td>
                  <td style={tdStyle}><span style={{ ...badge(daysLogged >= 5 ? '#94D96B' : daysLogged > 0 ? '#F59E0B' : '#FE6462') }}>{daysLogged}/5 days</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Two column: set goals + tasks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.2fr)', gap: '1.25rem', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}>
        {/* Set goals */}
        <div style={glassCard}>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', marginBottom: '1rem' }}>Set Weekly Goals</div>
          <div style={{ marginBottom: '0.9rem' }}>
            <label style={lbl}>Team Member</label>
            <select value={selectedMember} onChange={e => setSelectedMember(e.target.value)} style={{ ...inp }}>
              {teamMembers.map(p => <option key={p.id} value={p.id}>{p.name} ({p.role})</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label style={lbl}>Dials / Day</label>
              <input type="number" min={0} value={goalForm.dialsPerDay} onChange={e => setGoalForm(f => ({ ...f, dialsPerDay: Number(e.target.value) }))} style={inp} />
            </div>
            <div>
              <label style={lbl}>Booked / Wk</label>
              <input type="number" min={0} value={goalForm.bookedPerWeek} onChange={e => setGoalForm(f => ({ ...f, bookedPerWeek: Number(e.target.value) }))} style={inp} />
            </div>
            <div>
              <label style={lbl}>Attended / Wk</label>
              <input type="number" min={0} value={goalForm.attendedPerWeek} onChange={e => setGoalForm(f => ({ ...f, attendedPerWeek: Number(e.target.value) }))} style={inp} />
            </div>
          </div>
          <button onClick={saveGoal} style={btn(goalSaved ? 'success' : 'primary')}>{goalSaved ? 'Saved!' : 'Save Goals'}</button>
        </div>

        {/* Tasks */}
        <div style={glassCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>Assigned Tasks</div>
            <button onClick={() => setShowTaskForm(v => !v)} style={btn('ghost')}>{showTaskForm ? 'Cancel' : '+ New Task'}</button>
          </div>
          {showTaskForm && (
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={lbl}>Assign To</label>
                <select value={taskMember} onChange={e => setTaskMember(e.target.value)} style={inp}>
                  {teamMembers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={lbl}>Task Title</label>
                <input value={taskForm.title} onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Complete onboarding call" style={inp} />
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={lbl}>Description (optional)</label>
                <input value={taskForm.description} onChange={e => setTaskForm(f => ({ ...f, description: e.target.value }))} placeholder="Details..." style={inp} />
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={lbl}>Due Date (optional)</label>
                <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm(f => ({ ...f, dueDate: e.target.value }))} style={inp} />
              </div>
              <button onClick={addTask} style={btn('primary')}>Add Task</button>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '340px', overflowY: 'auto' }}>
            {data.tasks.length === 0
              ? <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.83rem', textAlign: 'center', padding: '1.5rem 0' }}>No tasks yet.</div>
              : data.tasks.map(task => {
                  const member = data.partners.find(p => p.id === task.assignedToPartnerId);
                  return (
                    <div key={task.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', opacity: task.isCompleted ? 0.55 : 1 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.84rem', textDecoration: task.isCompleted ? 'line-through' : 'none' }}>{task.title}</div>
                        <div style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                          {member?.name ?? 'Unknown'}{task.dueDate ? ` · Due ${fmtD(task.dueDate)}` : ''}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        {task.isCompleted && <span style={badge('#94D96B')}>Done</span>}
                        <button onClick={() => deleteTask(task.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,100,98,0.5)', cursor: 'pointer', fontSize: '0.75rem', padding: '2px 6px', fontFamily: 'inherit' }}>✕</button>
                      </div>
                    </div>
                  );
                })
            }
          </div>
        </div>
      </div>

      {/* Daily breakdown per member */}
      <div style={{ marginTop: '1.5rem', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) 0.15s both' }}>
        <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', marginBottom: '0.75rem' }}>Daily Activity Detail</div>
        {teamMembers.map(p => {
          const logs = getMemberWeekLogs(p.id);
          return (
            <div key={p.id} style={{ ...glassCard, padding: 0, overflow: 'hidden', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)', fontWeight: 700, color: '#fff', fontSize: '0.84rem' }}>{p.name} <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.35)', textTransform: 'capitalize' }}>· {p.role}</span></div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Day', 'Dials', 'Booked', 'Attended', 'Notes'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                <tbody>
                  {weekDates.map((date, i) => {
                    const log = logs.find(l => l.date === date);
                    const isToday = date === today();
                    return (
                      <tr key={date} style={{ background: isToday ? 'rgba(107,142,254,0.04)' : undefined }}>
                        <td style={{ ...tdStyle, fontWeight: 700, color: isToday ? '#6B8EFE' : 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{dayLabels[i]}</td>
                        <td style={{ ...tdStyle, color: log?.dials ? '#6B8EFE' : 'rgba(255,255,255,0.2)' }}>{log?.dials ?? '—'}</td>
                        <td style={{ ...tdStyle, color: log?.bookedAppts ? '#FEB64A' : 'rgba(255,255,255,0.2)' }}>{log?.bookedAppts ?? '—'}</td>
                        <td style={{ ...tdStyle, color: log?.attendedAppts ? '#94D96B' : 'rgba(255,255,255,0.2)' }}>{log?.attendedAppts ?? '—'}</td>
                        <td style={{ ...tdStyle, color: 'rgba(255,255,255,0.35)', fontSize: '0.77rem' }}>{log?.notes || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── User Management Section ──────────────────────────────────────────────────
function UserManagementSection({ data, setData }: { data: AppData; setData: (d: AppData) => void }) {
  const [users, setUsers] = useState<RcUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newU, setNewU] = useState({ name: '', email: '', username: '', password: '', role: 'setter' as UserRole });
  const [creating, setCreating] = useState(false);
  const [createErr, setCreateErr] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [lastCreds, setLastCreds] = useState<{ username: string; password: string } | null>(null);
  const [editRoleId, setEditRoleId] = useState<string | null>(null);
  const [editRoleVal, setEditRoleVal] = useState<UserRole>('setter');
  const [savingRole, setSavingRole] = useState(false);
  const [resetPassId, setResetPassId] = useState<string | null>(null);
  const [newPassPlain, setNewPassPlain] = useState<string | null>(null);
  const [editPartnerId, setEditPartnerId] = useState<string | null>(null);
  const [editPartnerVal, setEditPartnerVal] = useState('');
  const [savingPartner, setSavingPartner] = useState(false);

  const refreshUsers = async () => {
    if (!supabase) return;
    const { data: u } = await supabase.from('rc_users').select('*').order('created_at', { ascending: false });
    setUsers((u || []) as RcUser[]);
  };

  useEffect(() => {
    if (!supabase) { setLoadingUsers(false); return; }
    refreshUsers().then(() => setLoadingUsers(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setCreateErr(''); setCreating(true);
    try {
      if (!supabase) throw new Error('No database');
      const pass = newU.password || generatePassword();
      const hash = await hashPassword(pass);
      const userId = uid();
      // partner_id = userId so setter/closer links work automatically
      const user: RcUser = { id: userId, username: newU.username.toLowerCase().trim(), email: newU.email.trim(), name: newU.name.trim(), role: newU.role, partner_id: userId, password_hash: hash, is_active: true, created_at: new Date().toISOString() };
      const { error } = await supabase.from('rc_users').insert(user);
      if (error) { setCreateErr(error.message); return; }
      // Auto-create partner entry in AppData so they appear in setter/closer dropdowns
      const partnerRole: Partner['role'] = newU.role === 'setter' ? 'setter' : newU.role === 'closer' ? 'closer' : 'both';
      const newPartner: Partner = { id: userId, name: newU.name.trim(), role: partnerRole, active: true };
      setData({ ...data, partners: [...data.partners, newPartner] });
      setLastCreds({ username: user.username, password: pass });
      await refreshUsers();
      setNewU({ name: '', email: '', username: '', password: '', role: 'setter' });
      setShowCreate(false);
    } catch (ex: unknown) { setCreateErr(ex instanceof Error ? ex.message : 'Failed'); }
    finally { setCreating(false); }
  };

  const toggleActive = async (u: RcUser) => {
    if (!supabase) return;
    const nowActive = !u.is_active;
    await supabase.from('rc_users').update({ is_active: nowActive }).eq('id', u.id);
    // Sync partner active flag — terminated members stay in AppData for history but hidden from dropdowns
    const pid = u.partner_id || u.id;
    if (data.partners.find(p => p.id === pid)) {
      setData({ ...data, partners: data.partners.map(p => p.id === pid ? { ...p, active: nowActive } : p) });
    }
    await refreshUsers();
  };

  const saveRole = async (userId: string) => {
    if (!supabase) return;
    setSavingRole(true);
    await supabase.from('rc_users').update({ role: editRoleVal }).eq('id', userId);
    await refreshUsers();
    setSavingRole(false);
    setEditRoleId(null);
  };

  const resetPassword = async (u: RcUser) => {
    if (!supabase) return;
    setResetPassId(u.id);
    const newPass = generatePassword();
    const hash = await hashPassword(newPass);
    await supabase.from('rc_users').update({ password_hash: hash }).eq('id', u.id);
    setNewPassPlain(newPass);
    setResetPassId(null);
  };

  const savePartnerLink = async (userId: string) => {
    if (!supabase) return;
    setSavingPartner(true);
    await supabase.from('rc_users').update({ partner_id: editPartnerVal }).eq('id', userId);
    await refreshUsers();
    setSavingPartner(false);
    setEditPartnerId(null);
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(key); setTimeout(() => setCopied(null), 2000); });
  };

  const CopyBtn = ({ text, k }: { text: string; k: string }) => (
    <button type="button" onClick={() => copy(text, k)} style={{ background: copied === k ? 'rgba(148,217,107,0.15)' : 'rgba(255,255,255,0.07)', border: `1px solid ${copied === k ? 'rgba(148,217,107,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '6px', color: copied === k ? '#94D96B' : 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', padding: '3px 10px', fontFamily: 'DM Sans', transition: 'all 0.2s' }}>
      {copied === k ? 'Copied!' : 'Copy'}
    </button>
  );

  return (
    <div style={{ ...glassCard, marginBottom: '1rem', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) 0.18s both' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>Team Access</div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.83rem', margin: '0.2rem 0 0' }}>Create and manage team member logins.</p>
        </div>
        <button onClick={() => { setShowCreate(v => !v); setCreateErr(''); setLastCreds(null); }} style={btn('primary')}>+ New User</button>
      </div>

      {lastCreds && (
        <div style={{ background: 'rgba(148,217,107,0.08)', border: '1px solid rgba(148,217,107,0.25)', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ fontWeight: 700, color: '#94D96B', fontSize: '0.83rem', marginBottom: '0.6rem' }}>User created — share these credentials:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', width: '72px' }}>Username</span>
              <code style={{ color: '#fff', fontSize: '0.83rem', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '6px', flex: 1 }}>{lastCreds.username}</code>
              <CopyBtn text={lastCreds.username} k="user" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', width: '72px' }}>Password</span>
              <code style={{ color: '#fff', fontSize: '0.83rem', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '6px', flex: 1 }}>{lastCreds.password}</code>
              <CopyBtn text={lastCreds.password} k="pass" />
            </div>
          </div>
          <button onClick={() => setLastCreds(null)} style={{ marginTop: '0.75rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', cursor: 'pointer', padding: 0, fontFamily: 'DM Sans' }}>Dismiss</button>
        </div>
      )}

      {showCreate && (
        <form onSubmit={handleCreate} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem', marginBottom: '1rem' }}>New Team Member</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div>
              <label style={lbl}>Full Name</label>
              <input value={newU.name} onChange={e => { const n = e.target.value; setNewU(p => ({ ...p, name: n, username: p.username || generateUsername(n) })); }} placeholder="Jane Smith" required style={inp} onFocus={e => e.target.style.borderColor='rgba(254,100,98,0.6)'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.12)'} />
            </div>
            <div>
              <label style={lbl}>Email (optional)</label>
              <input value={newU.email} onChange={e => setNewU(p => ({ ...p, email: e.target.value }))} placeholder="jane@email.com" style={inp} onFocus={e => e.target.style.borderColor='rgba(254,100,98,0.6)'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.12)'} />
            </div>
            <div>
              <label style={lbl}>Username</label>
              <input value={newU.username} onChange={e => setNewU(p => ({ ...p, username: e.target.value }))} placeholder="jane.smith42" required style={inp} onFocus={e => e.target.style.borderColor='rgba(254,100,98,0.6)'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.12)'} />
            </div>
            <div>
              <label style={lbl}>Role</label>
              <select value={newU.role} onChange={e => setNewU(p => ({ ...p, role: e.target.value as UserRole }))} style={{ ...inp, cursor: 'pointer' }}>
                {(Object.keys(ROLE_LABELS) as UserRole[]).filter(r => r !== 'super_admin').map(r => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={lbl}>Password</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input value={newU.password} onChange={e => setNewU(p => ({ ...p, password: e.target.value }))} placeholder="Leave blank to auto-generate" style={{ ...inp, flex: 1 }} onFocus={e => e.target.style.borderColor='rgba(254,100,98,0.6)'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.12)'} />
                <button type="button" onClick={() => setNewU(p => ({ ...p, password: generatePassword() }))} style={{ ...btn('ghost'), whiteSpace: 'nowrap', fontSize: '0.72rem', padding: '0 0.75rem' }}>Gen</button>
              </div>
            </div>
          </div>
          {createErr && <div style={{ background: 'rgba(254,100,98,0.1)', border: '1px solid rgba(254,100,98,0.3)', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#FE6462', fontSize: '0.82rem', marginBottom: '0.75rem' }}>{createErr}</div>}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" disabled={creating} style={btn('primary')}>{creating ? 'Creating…' : 'Create User'}</button>
            <button type="button" onClick={() => setShowCreate(false)} style={btn('ghost')}>Cancel</button>
          </div>
        </form>
      )}

      {/* Reset password result banner */}
      {newPassPlain && (
        <div style={{ background: 'rgba(107,142,254,0.08)', border: '1px solid rgba(107,142,254,0.25)', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ fontWeight: 700, color: '#6B8EFE', fontSize: '0.83rem', marginBottom: '0.6rem' }}>Password reset — new credentials:</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', width: '72px' }}>Password</span>
            <code style={{ color: '#fff', fontSize: '0.83rem', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '6px', flex: 1 }}>{newPassPlain}</code>
            <CopyBtn text={newPassPlain} k="resetpass" />
          </div>
          <button onClick={() => setNewPassPlain(null)} style={{ marginTop: '0.75rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', cursor: 'pointer', padding: 0, fontFamily: 'DM Sans' }}>Dismiss</button>
        </div>
      )}

      {loadingUsers
        ? <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.83rem', padding: '0.5rem 0' }}>Loading…</div>
        : users.length === 0
          ? <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.83rem', padding: '0.5rem 0' }}>No team members yet.</div>
          : (() => {
              const active = users.filter(u => u.is_active);
              const former = users.filter(u => !u.is_active);

              const renderUser = (u: RcUser) => {
                const pid = u.partner_id || u.id;
                const isEditingRole = editRoleId === u.id;
                const clientCount = data.clients.filter(c => c.setterId === pid || c.closerId === pid).length;
                const commCount = data.comms.filter(c => c.partnerId === pid).length;
                return (
                  <div key={u.id} style={{ padding: '0.9rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '120px' }}>
                        <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>{u.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                          <code style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem' }}>@{u.username}</code>
                          <CopyBtn text={u.username} k={`un-${u.id}`} />
                        </div>
                      </div>

                      {/* Counts */}
                      {(clientCount > 0 || commCount > 0) && (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {clientCount > 0 && <span style={{ fontSize: '0.7rem', color: '#94D96B', fontWeight: 600 }}>{clientCount} client{clientCount !== 1 ? 's' : ''}</span>}
                          {commCount > 0 && <span style={{ fontSize: '0.7rem', color: '#6B8EFE', fontWeight: 600 }}>{commCount} comm{commCount !== 1 ? 's' : ''}</span>}
                        </div>
                      )}

                      {/* Role edit */}
                      {isEditingRole ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <select value={editRoleVal} onChange={e => setEditRoleVal(e.target.value as UserRole)} style={{ ...inp, padding: '4px 8px', fontSize: '0.78rem', width: 'auto', cursor: 'pointer' }}>
                            {(Object.keys(ROLE_LABELS) as UserRole[]).filter(r => r !== 'super_admin').map(r => (
                              <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                            ))}
                          </select>
                          <button onClick={() => saveRole(u.id)} disabled={savingRole} style={{ ...btn('primary'), fontSize: '0.72rem', padding: '4px 12px' }}>{savingRole ? '…' : 'Save'}</button>
                          <button onClick={() => setEditRoleId(null)} style={{ ...btn('ghost'), fontSize: '0.72rem', padding: '4px 10px' }}>✕</button>
                        </div>
                      ) : (
                        <button onClick={() => { setEditRoleId(u.id); setEditRoleVal(u.role); }} title="Change role"
                          style={{ ...badge(ROLE_COLORS[u.role]), cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          {ROLE_LABELS[u.role]} <span style={{ opacity: 0.5, fontSize: '0.65rem' }}>✎</span>
                        </button>
                      )}

                      <button onClick={() => resetPassword(u)} disabled={resetPassId === u.id}
                        style={{ ...btn('ghost'), fontSize: '0.7rem', padding: '3px 10px', opacity: resetPassId === u.id ? 0.5 : 1 }}>
                        {resetPassId === u.id ? '…' : '↺ Password'}
                      </button>
                      <button onClick={() => toggleActive(u)} style={{ ...btn(u.is_active ? 'danger' : 'ghost'), fontSize: '0.7rem', padding: '3px 12px' }}>
                        {u.is_active ? 'Terminate' : 'Restore'}
                      </button>
                    </div>
                  </div>
                );
              };

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {active.map(renderUser)}
                  {former.length > 0 && (
                    <>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.75rem', marginBottom: '2px' }}>
                        Former Members — login disabled, history preserved
                      </div>
                      {former.map(renderUser)}
                    </>
                  )}
                </div>
              );
            })()
      }
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────
function SettingsTab({ data, setData, session }: { data: AppData; setData: (d: AppData) => void; session: Session }) {
  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `revcore-tracker-${today()}.json`; a.click();
    URL.revokeObjectURL(url);
  };
  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { try { const d = JSON.parse(ev.target?.result as string); setData(d); } catch { alert('Invalid file.'); } };
    reader.readAsText(file);
  };

  return (
    <div style={{ maxWidth: '560px' }}>
      <div style={{ marginBottom: '2rem', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.2rem', letterSpacing: '-0.03em' }}>Settings</h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.83rem', margin: 0 }}>Manage your account, data, and team access</p>
      </div>

      {session.role === 'super_admin' && <UserManagementSection data={data} setData={setData} />}

      <div style={{ ...glassCard, marginBottom: '1rem', animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) 0.06s both' }}>
        <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', marginBottom: '0.4rem' }}>Data Management</div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.83rem', margin: '0 0 1.25rem' }}>Export your tracker data as JSON, or import a backup.</p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={exportData} style={btn('ghost')}>Export JSON</button>
          <label style={{ ...btn('ghost'), cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
            Import JSON<input type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      <div style={{ ...glassCard, animation: 'cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) 0.12s both' }}>
        <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', marginBottom: '0.4rem' }}>Summary</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
          {[
            { label: 'Total Clients', value: data.clients.length },
            { label: 'Team Members', value: data.partners.length },
            { label: 'Commission Entries', value: data.comms.length },
            { label: 'Pending Payouts', value: data.comms.filter(c => c.stat === 'pending').length },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{label}</span>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ onLogout, session }: { onLogout: () => void; session: Session }) {
  const roleTabs = ROLE_TABS[session.role];
  const [tab, setTab] = useState<Tab>(roleTabs[0]?.id ?? 'overview');
  const [data, setDataRaw] = useState<AppData>(normalizeData({}));
  const [syncStatus, setSyncStatus] = useState<'connecting' | 'live' | 'offline'>('connecting');
  const isSaving = useRef(false);

  // Initial load
  useEffect(() => {
    const loadLocal = () => {
      try { const s = localStorage.getItem(STORE); if (s) setDataRaw(normalizeData(JSON.parse(s))); } catch {}
      setSyncStatus('offline');
    };
    if (hasSupabase && supabase) {
      (async () => {
        try {
          const { data: row, error } = await supabase!.from('rc_tracker_data').select('value').eq('key', 'appData').single();
          if (error || !row?.value) { loadLocal(); return; }
          setDataRaw(normalizeData(row.value as Partial<AppData>));
          setSyncStatus('live');
        } catch { loadLocal(); }
      })();
    } else {
      loadLocal();
    }
  }, []);

  // Realtime subscription — push remote changes to all connected clients
  useEffect(() => {
    if (!hasSupabase || !supabase) return;
    const channel = supabase
      .channel('tracker-realtime')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rc_tracker_data', filter: 'key=eq.appData' },
        (payload) => {
          // Ignore updates we triggered ourselves
          if (isSaving.current) return;
          const incoming = (payload.new as { value: AppData }).value;
          if (incoming) { const nd = normalizeData(incoming as Partial<AppData>); setDataRaw(nd); try { localStorage.setItem(STORE, JSON.stringify(nd)); } catch {} }
        })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setSyncStatus('live');
        if (status === 'CLOSED' || status === 'CHANNEL_ERROR') setSyncStatus('offline');
      });
    return () => { supabase!.removeChannel(channel); };
  }, []);

  const setData = (d: AppData) => {
    setDataRaw(d);
    try { localStorage.setItem(STORE, JSON.stringify(d)); } catch {}
    if (hasSupabase && supabase) {
      isSaving.current = true;
      supabase.from('rc_tracker_data').upsert({ key: 'appData', value: d }, { onConflict: 'key' })
        .then(() => { setTimeout(() => { isSaving.current = false; }, 500); });
    }
  };

  const tabs = roleTabs;

  const pendingCount = data.comms.filter(c => c.stat === 'pending').length;

  return (
    <div style={{ minHeight: '100vh', background: '#070b0f', fontFamily: 'DM Sans, sans-serif', color: '#fff', paddingTop: '0', position: 'relative' }}>
      <SpaceBackground fixed />

      {/* Floating sign-out */}
      <div style={{ position: 'fixed', top: '20px', right: '24px', zIndex: 200, display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Sync status indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '100px', padding: '3px 10px', backdropFilter: 'blur(8px)' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: syncStatus === 'live' ? '#94D96B' : syncStatus === 'offline' ? '#F59E0B' : '#6B8EFE', boxShadow: syncStatus === 'live' ? '0 0 6px #94D96B' : 'none', animation: syncStatus === 'connecting' ? 'starPulse 1.2s ease infinite' : 'none' }} />
          <span style={{ fontSize: '0.68rem', fontWeight: 600, color: syncStatus === 'live' ? '#94D96B' : syncStatus === 'offline' ? '#F59E0B' : '#6B8EFE' }}>
            {syncStatus === 'live' ? 'Live' : syncStatus === 'offline' ? 'Offline' : 'Connecting…'}
          </span>
        </div>
        {pendingCount > 0 && (session.role === 'super_admin' || session.role === 'admin') && (
          <button onClick={() => setTab('team')} style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '100px', padding: '3px 12px', fontSize: '0.73rem', fontWeight: 700, color: '#F59E0B', backdropFilter: 'blur(8px)', cursor: 'pointer' }}>
            {pendingCount} pending
          </button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.4)', border: `1px solid ${ROLE_COLORS[session.role]}30`, borderRadius: '100px', padding: '3px 10px 3px 6px', backdropFilter: 'blur(8px)' }}>
          <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: ROLE_COLORS[session.role] + '25', border: `1px solid ${ROLE_COLORS[session.role]}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 800, color: ROLE_COLORS[session.role] }}>{session.name.charAt(0).toUpperCase()}</span>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>{session.name.split(' ')[0]}</span>
          <span style={{ fontSize: '0.65rem', color: ROLE_COLORS[session.role], fontWeight: 700, opacity: 0.8 }}>{ROLE_LABELS[session.role]}</span>
        </div>
        <button onClick={onLogout} style={{ ...btn('ghost'), fontSize: '0.78rem', padding: '5px 14px', backdropFilter: 'blur(8px)' }}>Sign out</button>
      </div>

      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 clamp(1.5rem, 4vw, 3rem)', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', maxWidth: '1400px', margin: '0 auto', overflowX: 'auto' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '1rem 1.25rem', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'inherit', whiteSpace: 'nowrap', color: tab === t.id ? '#FE6462' : 'rgba(255,255,255,0.4)', borderBottom: tab === t.id ? '2px solid #FE6462' : '2px solid transparent', transition: 'color 0.2s', marginBottom: '-1px', position: 'relative' }}>
              {t.label}
              {t.id === 'team' && pendingCount > 0 && (session.role === 'super_admin' || session.role === 'admin') && <span style={{ position: 'absolute', top: '8px', right: '6px', width: '7px', height: '7px', borderRadius: '50%', background: '#F59E0B' }} />}
            </button>
          ))}
        </div>
      </div>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 4vw, 3rem)', position: 'relative', zIndex: 1 }}>
        {tab === 'overview'      && <OverviewTab  data={data} setData={setData} />}
        {tab === 'clients'       && <ClientsTab   data={data} setData={setData} partners={data.partners} />}
        {tab === 'services'      && <ServicesTab   data={data} setData={setData} />}
        {tab === 'analytics'     && <AnalyticsTab  data={data} />}
        {tab === 'team'          && <><TeamTab data={data} setData={setData} /><div style={{ marginTop: '2.5rem' }}><PayoutsTab data={data} setData={setData} partners={data.partners} /></div></>}
        {tab === 'calendar'      && <CalendarTab  data={data} />}
        {tab === 'payments'      && <PaymentsTab  data={data} setData={setData} />}
        {tab === 'settings'      && <SettingsTab  data={data} setData={setData} session={session} />}
        {tab === 'my-dashboard'  && <MyDashboardTab data={data} session={session} />}
        {tab === 'my-clients'    && <MyClientsTab   data={data} session={session} />}
        {tab === 'my-ledger'     && <MyLedgerTab    data={data} session={session} />}
        {tab === 'goals'         && <GoalsTab        data={data} setData={setData} session={session} />}
        {tab === 'goals-mgmt'    && <GoalsManagementTab data={data} setData={setData} session={session} />}
      </main>

      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes drillSlideIn { from { transform:translateX(100%) } to { transform:translateX(0) } }
        @keyframes drillFadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes trackerFadeUp { from { opacity:0; transform:translateY(28px) } to { opacity:1; transform:translateY(0) } }
        @keyframes cardReveal { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes starPulse { 0%,100% { transform:scale(1); opacity:1 } 50% { transform:scale(0.4); opacity:0.1 } }
        @media (max-width:700px) { table { font-size:0.78rem } }
        input[type="date"]::-webkit-calendar-picker-indicator { filter:invert(0.6); cursor:pointer }
        select option { background:#1a1f28 }
        ::-webkit-scrollbar { width:6px; height:6px }
        ::-webkit-scrollbar-track { background:transparent }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.12); border-radius:3px }
      `}</style>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TrackerPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('rcTrackerSession');
    if (stored) { try { setSession(JSON.parse(stored)); } catch {} }
    setChecked(true);
  }, []);

  const logout = () => { sessionStorage.removeItem('rcTrackerSession'); setSession(null); };

  if (!checked) return null;
  if (!session) return <Login onLogin={(s) => setSession(s)} />;
  return <Dashboard onLogout={logout} session={session} />;
}
