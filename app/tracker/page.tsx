'use client';
import { useState, useEffect, useMemo } from 'react';
import { supabase, hasSupabase } from '@/lib/supabase';

// ─── Constants ────────────────────────────────────────────────────────────────
const PASS  = 'revcore2024';
const STORE = 'rcTrackerV1';

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab       = 'clients' | 'partners' | 'payouts' | 'calendar' | 'settings';
type Stage     = 'onboarding' | 'active' | 'at-risk' | 'paused' | 'churned';
type PlanT     = 'recurring' | 'one-time';
type InitCommT = 'pct' | 'fixed' | 'none';
type OngoingT  = 'pct-renewal' | 'rev-share' | 'none';
type CommFor   = 'closer' | 'setter' | 'both' | 'none';
type CommStat  = 'pending' | 'paid';
type PayStat   = 'current' | 'overdue' | 'failed';

interface Partner {
  id: string; name: string; role: 'setter' | 'closer' | 'both';
}
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
}
interface Commission {
  id: string; clientId: string; partnerId: string; role: 'setter' | 'closer';
  commT: 'initial' | 'renewal'; amount: number;
  due: string; paid: string; stat: CommStat; notes: string;
}
interface AppData { partners: Partner[]; clients: Client[]; comms: Commission[]; }

// ─── Helpers ──────────────────────────────────────────────────────────────────
const uid     = () => Math.random().toString(36).slice(2, 10);
const fmtD    = (d: string) => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const fmtM    = (n: number) => '$' + (n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const today   = () => new Date().toISOString().slice(0, 10);

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
  onboarding: { label: 'Onboarding', color: '#6B8EFE' },
  active:     { label: 'Active',     color: '#94D96B' },
  'at-risk':  { label: 'At Risk',    color: '#F59E0B' },
  paused:     { label: 'Paused',     color: 'rgba(255,255,255,0.35)' },
  churned:    { label: 'Churned',    color: '#FE6462' },
};
const PAY_STAT: Record<PayStat, { label: string; color: string }> = {
  current: { label: 'Current', color: '#94D96B' },
  overdue: { label: 'Overdue', color: '#F59E0B' },
  failed:  { label: 'Failed',  color: '#FE6462' },
};

const blankC = (): Omit<Client, 'id' | 'at'> => ({
  name: '', company: '', pkg: '', planT: 'recurring', start: '', renewal: '', amount: 0, nextDue: '',
  setterId: '', closerId: '',
  setterInitT: 'none', setterInitV: 0,
  closerInitT: 'none', closerInitV: 0,
  ongoingT: 'none', ongoingFor: 'none', ongoingV: 0,
  isSplit: false, deposit: 0, bal: 0, balNote: '', depPaid: false, balPaid: false,
  stage: 'onboarding', payStat: 'current', ghlId: '', notes: '',
});

// ─── Common styles ────────────────────────────────────────────────────────────
const card: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem 1.5rem' };
const inp: React.CSSProperties  = { width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '0.65rem 0.85rem', color: '#fff', fontSize: '0.88rem', fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box' };
const lbl: React.CSSProperties  = { display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.35rem' };
const badge = (color: string): React.CSSProperties => ({ display: 'inline-block', padding: '2px 10px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 700, background: color + '22', color, border: `1px solid ${color}44` });
const btn = (variant: 'primary' | 'ghost' | 'danger' = 'primary'): React.CSSProperties => ({
  border: 'none', borderRadius: '8px', padding: '0.55rem 1.1rem', fontSize: '0.83rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
  ...(variant === 'primary' ? { background: '#FE6462', color: '#fff' } :
      variant === 'danger'  ? { background: 'rgba(254,100,98,0.12)', color: '#FE6462', border: '1px solid rgba(254,100,98,0.3)' } :
                              { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }),
});
const metricCard = (color = '#FE6462'): React.CSSProperties => ({ ...card, display: 'flex', flexDirection: 'column', gap: '0.35rem', borderLeft: `3px solid ${color}` });

// ─── Login ────────────────────────────────────────────────────────────────────
function Login({ onLogin }: { onLogin: () => void }) {
  const [pass, setPass] = useState(''); const [show, setShow] = useState(false); const [err, setErr] = useState(''); const [loading, setLoading] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setErr('');
    if (pass !== PASS) { setErr('Incorrect password.'); return; }
    setLoading(true);
    setTimeout(() => { sessionStorage.setItem('rcTrackerAuth', '1'); onLogin(); }, 600);
  };
  return (
    <div style={{ minHeight: '100vh', background: '#070b0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'DM Sans, sans-serif', paddingTop: 'calc(80px + 2rem)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-120px', right: '-80px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(254,100,98,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1, animation: 'trackerFadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '68px', height: '68px', background: 'rgba(254,100,98,0.1)', border: '1px solid rgba(254,100,98,0.25)', borderRadius: '18px', marginBottom: '1.25rem' }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FE6462" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
          </div>
          <h1 style={{ color: '#fff', fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.04em', margin: '0 0 0.4rem', lineHeight: 1.1 }}>RevCore<br />Financial Tracker</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', margin: 0 }}>Internal use only · Authorized access required</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2rem' }}>
          <form onSubmit={submit}>
            <label style={lbl}>Access Password</label>
            <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
              <input type={show ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)} placeholder="Enter password" required style={{ ...inp, paddingRight: '3rem' }}
                onFocus={e => e.target.style.borderColor = 'rgba(254,100,98,0.6)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
              <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 0 }}>
                {show ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                       : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
              </button>
            </div>
            {err && <div style={{ background: 'rgba(254,100,98,0.1)', border: '1px solid rgba(254,100,98,0.3)', borderRadius: '8px', padding: '0.65rem 1rem', color: '#FE6462', fontSize: '0.83rem', marginBottom: '1rem' }}>{err}</div>}
            <button type="submit" disabled={loading} style={{ ...btn('primary'), width: '100%', padding: '0.85rem', fontSize: '0.92rem' }}>
              {loading ? 'Authenticating…' : 'Access Tracker'}
            </button>
          </form>
        </div>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.18)', fontSize: '0.73rem', marginTop: '1.25rem' }}>RevCore Internal Tools · Confidential</p>
      </div>
      <style>{`@keyframes trackerFadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

// ─── Client Modal ─────────────────────────────────────────────────────────────
function ClientModal({ client, partners, onSave, onClose }: { client?: Client; partners: Partner[]; onSave: (c: Omit<Client, 'id' | 'at'>, isNew: boolean) => void; onClose: () => void }) {
  const [f, setF] = useState<Omit<Client, 'id' | 'at'>>(client ? { ...client } : blankC());
  const set = (k: keyof typeof f, v: unknown) => setF(p => ({ ...p, [k]: v }));
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
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem', overflowY: 'auto', backdropFilter: 'blur(4px)' }}>
      <div style={{ width: '100%', maxWidth: '680px', background: '#0f1318', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2rem', marginTop: '80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>{client ? 'Edit Client' : 'Add New Client'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.4rem', lineHeight: 1, padding: 0 }}>×</button>
        </div>

        {/* Basic Info */}
        {section('Client Info')}
        <div style={gr}>
          {field('Client Name *', txtInp(f.name, v => set('name', v), 'John Smith'))}
          {field('Company', txtInp(f.company, v => set('company', v), 'Acme Inc.'))}
          {field('Package', txtInp(f.pkg, v => set('pkg', v), 'Growth Package'))}
          {field('GHL Contact ID', txtInp(f.ghlId, v => set('ghlId', v), 'GHL-XXXXXXXXX'))}
        </div>

        {/* Payment */}
        {section('Payment Details')}
        <div style={gr}>
          {field('Plan Type', sel(f.planT, v => set('planT', v as PlanT), [['recurring', 'Recurring'], ['one-time', 'One-Time']]))}
          {field('Payment Amount ($)', numInp(f.amount, v => set('amount', v)))}
          {field('Start Date', dateInp(f.start, v => set('start', v)))}
          {f.planT === 'recurring' ? field('Renewal Date', dateInp(f.renewal, v => set('renewal', v))) : <div />}
          {field('Next Due Date', dateInp(f.nextDue, v => set('nextDue', v)))}
          {field('Payment Status', sel(f.payStat, v => set('payStat', v as PayStat), [['current', 'Current'], ['overdue', 'Overdue'], ['failed', 'Failed']]))}
        </div>

        {/* Split Payment */}
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

        {/* Sales Team */}
        {section('Sales Team')}
        <div style={gr}>
          {field('Setter', sel(f.setterId, v => set('setterId', v), [['', '— None —'], ...partners.map(p => [p.id, p.name] as [string, string])]))}
          {field('Closer', sel(f.closerId, v => set('closerId', v), [['', '— None —'], ...partners.map(p => [p.id, p.name] as [string, string])]))}
        </div>

        {/* Initial Commissions */}
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

        {/* Ongoing Commissions */}
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

        {/* Stage & Notes */}
        {section('Status & Notes')}
        <div style={gr}>
          {field('Pipeline Stage', sel(f.stage, v => set('stage', v as Stage), [['onboarding','Onboarding'],['active','Active'],['at-risk','At Risk'],['paused','Paused'],['churned','Churned']]))}
          <div />
        </div>
        <div style={{ marginTop: '0.75rem' }}>{field('Notes', <textarea value={f.notes} onChange={e => set('notes', e.target.value)} rows={3} placeholder="Any relevant notes…" style={{ ...inp, resize: 'vertical', lineHeight: 1.5 }} />)}</div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={onClose} style={btn('ghost')}>Cancel</button>
          <button onClick={() => { if (!f.name.trim()) return; onSave(f, !client); }} style={btn('primary')}>{client ? 'Save Changes' : 'Add Client'}</button>
        </div>
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

  const thStyle: React.CSSProperties = { textAlign: 'left', padding: '0.65rem 0.85rem', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap', borderBottom: '1px solid rgba(255,255,255,0.07)' };
  const tdStyle: React.CSSProperties = { padding: '0.75rem 0.85rem', fontSize: '0.84rem', color: 'rgba(255,255,255,0.8)', borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.2rem', letterSpacing: '-0.02em' }}>Clients</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.83rem', margin: 0 }}>{data.clients.length} closed client{data.clients.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setModal('add')} style={btn('primary')}>+ Add Client</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients…" style={{ ...inp, width: '220px' }} />
        <select value={stageF} onChange={e => setStageF(e.target.value as Stage | 'all')} style={{ ...inp, width: 'auto', cursor: 'pointer' }}>
          <option value="all">All Stages</option>
          {(Object.keys(STAGES) as Stage[]).map(s => <option key={s} value={s}>{STAGES[s].label}</option>)}
        </select>
        <select value={partnerF} onChange={e => setPartnerF(e.target.value)} style={{ ...inp, width: 'auto', cursor: 'pointer' }}>
          <option value="all">All Partners</option>
          {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {/* Summary bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total MRR', value: fmtM(data.clients.filter(c => c.planT === 'recurring').reduce((s, c) => s + c.amount, 0)), color: '#94D96B' },
          { label: 'Active Clients', value: data.clients.filter(c => c.stage === 'active').length, color: '#94D96B' },
          { label: 'At Risk', value: data.clients.filter(c => c.stage === 'at-risk').length, color: '#F59E0B' },
          { label: 'Failed Payments', value: data.clients.filter(c => c.payStat === 'failed').length, color: '#FE6462' },
        ].map(({ label, value, color }) => (
          <div key={label} style={metricCard(color)}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.88rem' }}>No clients found. Add your first closed client above.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Client', 'Package', 'Stage', 'Payment', 'Next Due', 'Setter', 'Closer', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} style={{ transition: 'background 0.15s' }} onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{c.name}</div>
                      {c.company && <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{c.company}</div>}
                      {c.isSplit && (
                        <div style={{ marginTop: '3px', display: 'flex', gap: '4px' }}>
                          <span style={badge(c.depPaid ? '#94D96B' : '#F59E0B')}>{c.depPaid ? 'Dep. Paid' : 'Dep. Pending'}</span>
                          <span style={badge(c.balPaid ? '#94D96B' : '#F59E0B')}>{c.balPaid ? 'Bal. Paid' : 'Bal. Pending'}</span>
                        </div>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <div>{c.pkg || '—'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{c.planT === 'recurring' ? `${fmtM(c.amount)}/mo` : fmtM(c.amount)}</div>
                    </td>
                    <td style={tdStyle}><span style={badge(STAGES[c.stage].color)}>{STAGES[c.stage].label}</span></td>
                    <td style={tdStyle}>
                      <span style={badge(PAY_STAT[c.payStat].color)}>{PAY_STAT[c.payStat].label}</span>
                      {c.payStat !== 'current' && (
                        <button onClick={() => togglePayStatus(c, 'current')} style={{ ...btn('ghost'), padding: '2px 8px', fontSize: '0.7rem', marginLeft: '4px' }}>Mark current</button>
                      )}
                    </td>
                    <td style={tdStyle}>{fmtD(c.nextDue)}</td>
                    <td style={tdStyle}>{partnerName(c.setterId)}</td>
                    <td style={tdStyle}>{partnerName(c.closerId)}</td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => setModal(c)} style={{ ...btn('ghost'), padding: '4px 10px' }}>Edit</button>
                        <button onClick={() => setDelId(c.id)} style={{ ...btn('danger'), padding: '4px 10px' }}>Del</button>
                        {c.ghlId && (
                          <a href={`https://app.gohighlevel.com/contacts/${c.ghlId}`} target="_blank" rel="noreferrer"
                            style={{ ...btn('ghost'), padding: '4px 10px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                            GHL ↗
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm delete */}
      {delId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0f1318', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '2rem', maxWidth: '360px', width: '90%' }}>
            <h3 style={{ color: '#fff', margin: '0 0 0.5rem', fontWeight: 800 }}>Delete Client?</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', margin: '0 0 1.5rem' }}>This will permanently remove the client and all associated commissions.</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setDelId(null)} style={btn('ghost')}>Cancel</button>
              <button onClick={() => deleteClient(delId)} style={btn('danger')}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <ClientModal client={modal === 'add' ? undefined : modal} partners={partners} onSave={saveClient} onClose={() => setModal(null)} />
      )}
    </div>
  );
}

// ─── Partners Tab ─────────────────────────────────────────────────────────────
function PartnersTab({ data }: { data: AppData }) {
  const [selected, setSelected] = useState<string>('all');
  const partners = data.partners;

  const getMetrics = (partnerId: string) => {
    const myClients = data.clients.filter(c =>
      partnerId === 'all' ? true : c.setterId === partnerId || c.closerId === partnerId
    );
    const totalRev = myClients.reduce((s, c) => s + c.amount, 0);
    const myComms = data.comms.filter(c => partnerId === 'all' ? true : c.partnerId === partnerId);
    const totalEarned   = myComms.reduce((s, c) => s + c.amount, 0);
    const paidOut       = myComms.filter(c => c.stat === 'paid').reduce((s, c) => s + c.amount, 0);
    const pendingPayout = myComms.filter(c => c.stat === 'pending').reduce((s, c) => s + c.amount, 0);
    const initEarned    = myComms.filter(c => c.commT === 'initial').reduce((s, c) => s + c.amount, 0);
    const renewalEarned = myComms.filter(c => c.commT === 'renewal').reduce((s, c) => s + c.amount, 0);
    const ongoingPerCycle = myClients.reduce((s, c) => {
      let amt = 0;
      if (c.ongoingFor === 'both') amt = calcOngoing(c) / 2;
      else if ((c.ongoingFor === 'closer' && (partnerId === 'all' || c.closerId === partnerId)) ||
               (c.ongoingFor === 'setter' && (partnerId === 'all' || c.setterId === partnerId))) amt = calcOngoing(c);
      return s + amt;
    }, 0);
    return { myClients, totalRev, totalEarned, paidOut, pendingPayout, initEarned, renewalEarned, ongoingPerCycle };
  };

  const pName = (id: string) => partners.find(p => p.id === id)?.name || '—';
  const m = getMetrics(selected);

  const thStyle: React.CSSProperties = { textAlign: 'left', padding: '0.65rem 0.85rem', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.07)' };
  const tdStyle: React.CSSProperties = { padding: '0.75rem 0.85rem', fontSize: '0.84rem', color: 'rgba(255,255,255,0.8)', borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.2rem', letterSpacing: '-0.02em' }}>Partner Dashboard</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.83rem', margin: 0 }}>Revenue & commission breakdown per partner</p>
        </div>
        <select value={selected} onChange={e => setSelected(e.target.value)} style={{ ...inp, width: 'auto', cursor: 'pointer' }}>
          <option value="all">All Partners</option>
          {partners.map(p => <option key={p.id} value={p.id}>{p.name} ({p.role})</option>)}
        </select>
      </div>

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem', marginBottom: '1.5rem' }}>
        <div style={metricCard('#94D96B')}><div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Total Closed Revenue</div><div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#94D96B' }}>{fmtM(m.totalRev)}</div></div>
        <div style={metricCard('#FE6462')}><div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Total Commission Earned</div><div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FE6462' }}>{fmtM(m.totalEarned)}</div><div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>Init: {fmtM(m.initEarned)} · Renewals: {fmtM(m.renewalEarned)}</div></div>
        <div style={metricCard('#F59E0B')}><div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Pending Payout</div><div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F59E0B' }}>{fmtM(m.pendingPayout)}</div></div>
        <div style={metricCard('#6B8EFE')}><div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Ongoing / Cycle</div><div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#6B8EFE' }}>{fmtM(m.ongoingPerCycle)}</div></div>
      </div>

      {/* Per-client breakdown */}
      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: '0.88rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>Client Breakdown</div>
        {m.myClients.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>No clients for this partner.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['Client', 'Package', 'Amount', 'Setter', 'Closer', 'Init Comm', 'Ongoing/Cycle', 'Stage'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {m.myClients.map(c => {
                  const isMe = (role: 'setter' | 'closer') => selected === 'all' || (role === 'setter' ? c.setterId : c.closerId) === selected;
                  const myInit = selected === 'all'
                    ? calcInit(c, 'setter') + calcInit(c, 'closer')
                    : (c.setterId === selected ? calcInit(c, 'setter') : 0) + (c.closerId === selected ? calcInit(c, 'closer') : 0);
                  let myOngoing = 0;
                  if (c.ongoingFor === 'both') myOngoing = calcOngoing(c) / 2;
                  else if (c.ongoingFor === 'closer' && (selected === 'all' || c.closerId === selected)) myOngoing = calcOngoing(c);
                  else if (c.ongoingFor === 'setter' && (selected === 'all' || c.setterId === selected)) myOngoing = calcOngoing(c);

                  return (
                    <tr key={c.id}>
                      <td style={tdStyle}><div style={{ fontWeight: 700, color: '#fff' }}>{c.name}</div>{c.company && <div style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.3)' }}>{c.company}</div>}</td>
                      <td style={tdStyle}>{c.pkg || '—'}</td>
                      <td style={tdStyle}>{fmtM(c.amount)}{c.planT === 'recurring' && <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>/mo</span>}</td>
                      <td style={tdStyle}><span style={{ color: isMe('setter') && selected !== 'all' ? '#FE6462' : 'inherit' }}>{pName(c.setterId)}</span></td>
                      <td style={tdStyle}><span style={{ color: isMe('closer') && selected !== 'all' ? '#6B8EFE' : 'inherit' }}>{pName(c.closerId)}</span></td>
                      <td style={tdStyle}><span style={{ color: '#94D96B', fontWeight: 700 }}>{fmtM(myInit)}</span></td>
                      <td style={tdStyle}><span style={{ color: '#6B8EFE', fontWeight: 700 }}>{myOngoing > 0 ? fmtM(myOngoing) : '—'}</span></td>
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

  const markPaid = (id: string) => {
    setData({ ...data, comms: data.comms.map(c => c.id === id ? { ...c, stat: 'paid', paid: today() } : c) });
  };
  const markPending = (id: string) => {
    setData({ ...data, comms: data.comms.map(c => c.id === id ? { ...c, stat: 'pending', paid: '' } : c) });
  };
  const addComm = () => {
    if (!newP.clientId || !newP.partnerId || !newP.amount) return;
    const comm: Commission = { ...newP, id: uid(), stat: 'pending', paid: '' };
    setData({ ...data, comms: [...data.comms, comm] });
    setAddModal(false);
    setNewP({ clientId: '', partnerId: '', role: 'closer', commT: 'initial', amount: 0, due: today(), notes: '' });
  };
  const deleteComm = (id: string) => setData({ ...data, comms: data.comms.filter(c => c.id !== id) });

  const pendingTotal = data.comms.filter(c => c.stat === 'pending').reduce((s, c) => s + c.amount, 0);

  const thStyle: React.CSSProperties = { textAlign: 'left', padding: '0.65rem 0.85rem', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.07)' };
  const tdStyle: React.CSSProperties = { padding: '0.75rem 0.85rem', fontSize: '0.84rem', color: 'rgba(255,255,255,0.8)', borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.2rem', letterSpacing: '-0.02em' }}>Commission Payouts</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.83rem', margin: 0 }}>Mark commissions as paid once transferred</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setAddModal(true)} style={btn('ghost')}>+ Add Commission</button>
        </div>
      </div>

      {/* Pending total banner */}
      {pendingTotal > 0 && (
        <div style={{ ...card, background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>Total Pending Payouts</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F59E0B', letterSpacing: '-0.03em' }}>{fmtM(pendingTotal)}</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
            {data.comms.filter(c => c.stat === 'pending').length} commission{data.comms.filter(c => c.stat === 'pending').length !== 1 ? 's' : ''} unpaid
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {(['pending', 'paid', 'all'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ ...btn(filter === f ? 'primary' : 'ghost'), textTransform: 'capitalize' }}>{f}</button>
        ))}
      </div>

      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        {shown.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>No commissions to show.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['Partner', 'Client', 'Type', 'Role', 'Amount', 'Due', 'Status', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {shown.map(c => (
                  <tr key={c.id}>
                    <td style={tdStyle}><span style={{ fontWeight: 700, color: '#fff' }}>{pName(c.partnerId)}</span></td>
                    <td style={tdStyle}>{cName(c.clientId)}</td>
                    <td style={tdStyle}><span style={{ textTransform: 'capitalize' }}>{c.commT}</span></td>
                    <td style={tdStyle}><span style={{ textTransform: 'capitalize', color: c.role === 'closer' ? '#6B8EFE' : '#FE6462' }}>{c.role}</span></td>
                    <td style={tdStyle}><span style={{ fontWeight: 700, color: c.stat === 'paid' ? '#94D96B' : '#F59E0B' }}>{fmtM(c.amount)}</span></td>
                    <td style={tdStyle}>{fmtD(c.due)}</td>
                    <td style={tdStyle}>
                      <span style={badge(c.stat === 'paid' ? '#94D96B' : '#F59E0B')}>{c.stat === 'paid' ? 'Paid' : 'Pending'}</span>
                      {c.stat === 'paid' && c.paid && <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{fmtD(c.paid)}</div>}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {c.stat === 'pending'
                          ? <button onClick={() => markPaid(c.id)} style={{ ...btn('primary'), padding: '4px 10px', background: '#94D96B', fontSize: '0.75rem' }}>Mark Paid</button>
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

      {/* Add commission modal */}
      {addModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0f1318', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.75rem', width: '90%', maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ color: '#fff', margin: 0, fontWeight: 800 }}>Add Commission Entry</h3>
              <button onClick={() => setAddModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.3rem', lineHeight: 1, padding: 0 }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div><label style={lbl}>Partner</label>
                <select value={newP.partnerId} onChange={e => setNewP(p => ({ ...p, partnerId: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}>
                  <option value="">— Select —</option>
                  {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div><label style={lbl}>Client</label>
                <select value={newP.clientId} onChange={e => setNewP(p => ({ ...p, clientId: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}>
                  <option value="">— Select —</option>
                  {data.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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

// ─── Calendar Tab ─────────────────────────────────────────────────────────────
function CalendarTab({ data }: { data: AppData }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const weekStart = getWeekStart(weekOffset);
  const weekDays: Date[] = Array.from({ length: 7 }, (_, i) => { const d = new Date(weekStart); d.setDate(d.getDate() + i); return d; });
  const weekEnd   = weekDays[6];

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

  // Upcoming payments in next 30 days
  const upcoming = data.clients
    .filter(c => c.nextDue && c.nextDue >= todayStr)
    .sort((a, b) => a.nextDue.localeCompare(b.nextDue))
    .slice(0, 10);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.2rem', letterSpacing: '-0.02em' }}>Calendar</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.83rem', margin: 0 }}>Payments due + bi-weekly check-in reminders</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => setWeekOffset(w => w - 1)} style={btn('ghost')}>← Prev</button>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: 600, minWidth: '200px', textAlign: 'center' }}>{weekLabel}</span>
          <button onClick={() => setWeekOffset(w => w + 1)} style={btn('ghost')}>Next →</button>
          {weekOffset !== 0 && <button onClick={() => setWeekOffset(0)} style={btn('primary')}>Today</button>}
        </div>
      </div>

      {/* Week grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '2rem' }}>
        {weekDays.map((day, i) => {
          const events = eventsForDay(day);
          const isToday = day.toISOString().slice(0, 10) === todayStr;
          return (
            <div key={i} style={{ ...card, minHeight: '120px', padding: '0.75rem', borderColor: isToday ? 'rgba(254,100,98,0.4)' : 'rgba(255,255,255,0.08)' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>{dayNames[i]}</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: isToday ? '#FE6462' : '#fff', lineHeight: 1 }}>{day.getDate()}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {events.map((ev, j) => (
                  <div key={j} style={{ padding: '3px 6px', borderRadius: '5px', fontSize: '0.68rem', fontWeight: 600, lineHeight: 1.3,
                    background: ev.type === 'payment' ? 'rgba(148,217,107,0.15)' : 'rgba(107,142,254,0.15)',
                    color: ev.type === 'payment' ? '#94D96B' : '#6B8EFE',
                    border: `1px solid ${ev.type === 'payment' ? 'rgba(148,217,107,0.3)' : 'rgba(107,142,254,0.3)'}` }}>
                    {ev.type === 'payment' ? '💳 ' : '📞 '}{ev.client.name}
                    {ev.type === 'payment' && <span style={{ opacity: 0.7 }}> · {fmtM(ev.client.amount)}</span>}
                  </div>
                ))}
                {events.length === 0 && <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.15)' }}>—</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#94D96B' }} /><span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>Payment Due</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#6B8EFE' }} /><span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>Bi-Weekly Check-In</span></div>
      </div>

      {/* Upcoming payments list */}
      <div style={{ ...card }}>
        <div style={{ fontWeight: 700, color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', marginBottom: '1rem' }}>Upcoming Payments (Next 30 Days)</div>
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

// ─── Settings Tab ─────────────────────────────────────────────────────────────
function SettingsTab({ data, setData }: { data: AppData; setData: (d: AppData) => void }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState<'setter' | 'closer' | 'both'>('closer');
  const [delId, setDelId] = useState<string | null>(null);

  const addPartner = () => {
    if (!name.trim()) return;
    setData({ ...data, partners: [...data.partners, { id: uid(), name: name.trim(), role }] });
    setName('');
  };
  const deletePartner = (id: string) => {
    setData({ ...data, partners: data.partners.filter(p => p.id !== id) });
    setDelId(null);
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.2rem', letterSpacing: '-0.02em' }}>Settings</h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.83rem', margin: 0 }}>Manage partners and team members</p>
      </div>

      {/* Add partner */}
      <div style={{ ...card, marginBottom: '1.5rem' }}>
        <div style={{ fontWeight: 700, color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '1rem' }}>Add Partner / Team Member</div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" style={{ ...inp, flex: 1, minWidth: '160px' }} onKeyDown={e => e.key === 'Enter' && addPartner()} />
          <select value={role} onChange={e => setRole(e.target.value as typeof role)} style={{ ...inp, width: 'auto', cursor: 'pointer' }}>
            <option value="setter">Setter</option>
            <option value="closer">Closer</option>
            <option value="both">Both</option>
          </select>
          <button onClick={addPartner} style={btn('primary')}>Add</button>
        </div>
      </div>

      {/* Partner list */}
      <div style={card}>
        <div style={{ fontWeight: 700, color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '1rem' }}>Team Members ({data.partners.length})</div>
        {data.partners.length === 0 ? (
          <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.83rem' }}>No partners added yet.</div>
        ) : data.partners.map(p => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(254,100,98,0.15)', border: '1px solid rgba(254,100,98,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, color: '#FE6462' }}>
                {p.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>{p.name}</div>
                <div style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.35)', textTransform: 'capitalize' }}>{p.role}</div>
              </div>
            </div>
            <button onClick={() => setDelId(p.id)} style={{ ...btn('danger'), padding: '4px 10px', fontSize: '0.75rem' }}>Remove</button>
          </div>
        ))}
      </div>

      {/* Confirm delete */}
      {delId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0f1318', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.75rem', maxWidth: '360px', width: '90%' }}>
            <h3 style={{ color: '#fff', margin: '0 0 0.5rem', fontWeight: 800 }}>Remove Partner?</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', margin: '0 0 1.5rem' }}>Their commission records will remain but they'll be unlinked from new clients.</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setDelId(null)} style={btn('ghost')}>Cancel</button>
              <button onClick={() => deletePartner(delId)} style={btn('danger')}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('clients');
  const [data, setDataRaw] = useState<AppData>({ partners: [], clients: [], comms: [] });

  useEffect(() => {
    const loadLocal = () => { try { const s = localStorage.getItem(STORE); if (s) setDataRaw(JSON.parse(s)); } catch {} };
    if (hasSupabase && supabase) {
      (async () => {
        try {
          const { data: row } = await supabase!.from('rc_tracker_data').select('value').eq('key', 'appData').single();
          if (row?.value) setDataRaw(row.value as AppData); else loadLocal();
        } catch { loadLocal(); }
      })();
    } else {
      loadLocal();
    }
  }, []);

  const setData = (d: AppData) => {
    setDataRaw(d);
    try { localStorage.setItem(STORE, JSON.stringify(d)); } catch {}
    if (hasSupabase && supabase) {
      supabase.from('rc_tracker_data').upsert({ key: 'appData', value: d }, { onConflict: 'key' }).then(() => {});
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'clients',  label: 'Clients' },
    { id: 'partners', label: 'Partners' },
    { id: 'payouts',  label: 'Payouts' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'settings', label: 'Settings' },
  ];

  const pendingCount = data.comms.filter(c => c.stat === 'pending').length;

  return (
    <div style={{ minHeight: '100vh', background: '#070b0f', fontFamily: 'DM Sans, sans-serif', color: '#fff', paddingTop: '80px' }}>
      {/* Header */}
      <header style={{ position: 'sticky', top: 80, zIndex: 100, background: 'rgba(7,11,15,0.96)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 clamp(1.5rem, 4vw, 3rem)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FE6462" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.01em' }}>RevCore Tracker</span>
            <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.12)' }} />
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Internal</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {pendingCount > 0 && (
              <div style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '100px', padding: '3px 10px', fontSize: '0.73rem', fontWeight: 700, color: '#F59E0B' }}>
                {pendingCount} payout{pendingCount !== 1 ? 's' : ''} pending
              </div>
            )}
            <button onClick={onLogout} style={{ ...btn('ghost'), fontSize: '0.78rem', padding: '5px 12px' }}>Sign out</button>
          </div>
        </div>
      </header>

      {/* Tab nav */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 clamp(1.5rem, 4vw, 3rem)' }}>
        <div style={{ display: 'flex', maxWidth: '1400px', margin: '0 auto', overflowX: 'auto' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '1rem 1.25rem', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'inherit', whiteSpace: 'nowrap', color: tab === t.id ? '#FE6462' : 'rgba(255,255,255,0.4)', borderBottom: tab === t.id ? '2px solid #FE6462' : '2px solid transparent', transition: 'all 0.2s', marginBottom: '-1px', position: 'relative' }}>
              {t.label}
              {t.id === 'payouts' && pendingCount > 0 && (
                <span style={{ position: 'absolute', top: '8px', right: '6px', width: '7px', height: '7px', borderRadius: '50%', background: '#F59E0B' }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 4vw, 3rem)' }}>
        {tab === 'clients'  && <ClientsTab  data={data} setData={setData} partners={data.partners} />}
        {tab === 'partners' && <PartnersTab data={data} />}
        {tab === 'payouts'  && <PayoutsTab  data={data} setData={setData} partners={data.partners} />}
        {tab === 'calendar' && <CalendarTab data={data} />}
        {tab === 'settings' && <SettingsTab data={data} setData={setData} />}
      </main>

      <style>{`
        @media (max-width: 700px) { table { font-size: 0.78rem; } }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.6); cursor: pointer; }
        select option { background: #1a1f28; }
      `}</style>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TrackerPage() {
  const [auth, setAuth]       = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setAuth(sessionStorage.getItem('rcTrackerAuth') === '1');
    setChecked(true);
  }, []);

  const logout = () => { sessionStorage.removeItem('rcTrackerAuth'); setAuth(false); };

  if (!checked) return null;
  if (!auth) return <Login onLogin={() => setAuth(true)} />;
  return <Dashboard onLogout={logout} />;
}
