import { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileCheck2,
  Filter,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
  XCircle,
} from 'lucide-react';
import { AdminStats } from '../../types';

interface AdminDashboardProps {
  stats?: AdminStats;
  isManager: boolean;
  onBack: () => void;
}

type QueueStatus = 'Needs review' | 'Verified' | 'Waiting';

const queueItems = [
  { id: 'verification-1', title: 'Video verification request', owner: 'Nour El Din', detail: 'UX Research · submitted 18 min ago', status: 'Needs review' as QueueStatus, tone: 'amber' },
  { id: 'demo-1', title: 'New teaching demo', owner: 'Mariam Hassan', detail: 'Advanced React Patterns · submitted 42 min ago', status: 'Needs review' as QueueStatus, tone: 'amber' },
  { id: 'report-1', title: 'Community report', owner: 'Omar Khaled', detail: 'Review needs a second look · submitted 1 hr ago', status: 'Waiting' as QueueStatus, tone: 'blue' },
  { id: 'verification-2', title: 'Profile verification request', owner: 'Salma Adel', detail: 'Business English · submitted yesterday', status: 'Verified' as QueueStatus, tone: 'emerald' },
];

const activityItems = [
  ['09:42', 'Verification approved', 'Salma Adel is now verified'],
  ['09:18', 'Demo published', 'Advanced React Patterns is live'],
  ['08:56', 'Report assigned', 'Community report sent to review queue'],
  ['08:31', 'New members', '27 members joined today'],
];

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

export default function AdminDashboard({ stats, isManager, onBack }: AdminDashboardProps) {
  const [section, setSection] = useState<'overview' | 'members' | 'content' | 'settings'>('overview');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'All' | QueueStatus>('All');
  const [notice, setNotice] = useState('');

  const fallbackStats: AdminStats = {
    total_users: 12847,
    total_exchanges: 5234,
    total_revenue: 125430,
    active_users_today: 2341,
    new_users_this_week: 487,
    average_rating: 4.72,
    most_popular_skills: ['React', 'Python', 'UI/UX Design', 'Arabic', 'Guitar'],
    verified_users_count: 8932,
  };
  const data = stats || fallbackStats;

  const filteredQueue = useMemo(() => queueItems.filter((item) => {
    const matchesFilter = filter === 'All' || item.status === filter;
    const haystack = `${item.title} ${item.owner} ${item.detail}`.toLowerCase();
    return matchesFilter && haystack.includes(query.toLowerCase());
  }), [filter, query]);

  if (!isManager) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 pt-28 pb-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600"><ShieldCheck /></div>
          <h1 className="text-2xl font-bold text-slate-900">Manager access required</h1>
          <p className="mt-3 text-slate-500">This workspace is restricted to approved managers. Ask an administrator to assign the manager role to your account.</p>
          <button onClick={onBack} className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">Return to platform</button>
        </div>
      </div>
    );
  }

  const navItems = [
    ['overview', 'Overview', BarChart3],
    ['members', 'Members', Users],
    ['content', 'Content review', FileCheck2],
    ['settings', 'Workspace settings', Settings2],
  ] as const;

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2800);
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb] pt-16 text-slate-900">
      <div className="mx-auto flex max-w-[1480px] flex-col lg:flex-row">
        <aside className="border-b border-slate-200 bg-[#10212b] px-4 py-5 text-white lg:min-h-[calc(100vh-4rem)] lg:w-64 lg:border-b-0 lg:px-5">
          <div className="mb-8 flex items-center justify-between lg:block">
            <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-300">Mind2Mind</p><h2 className="mt-2 text-xl font-bold">Manager console</h2><p className="mt-1 text-xs text-slate-400">إدارة أسهل للمدير</p></div>
            <button onClick={onBack} className="rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white">Exit</button>
          </div>
          <nav className="grid grid-cols-2 gap-2 lg:block lg:space-y-2">
            {navItems.map(([key, label, Icon]) => <button key={key} onClick={() => setSection(key)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${section === key ? 'bg-teal-400/15 text-teal-200 ring-1 ring-teal-300/20' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}><Icon className="h-4 w-4" /><span>{label}</span>{section === key && <ChevronRight className="ml-auto h-4 w-4" />}</button>)}
          </nav>
          <div className="mt-10 hidden rounded-2xl border border-white/10 bg-white/5 p-4 lg:block"><div className="flex items-center gap-2 text-sm font-semibold"><Sparkles className="h-4 w-4 text-teal-300" /> Quick tip</div><p className="mt-2 text-xs leading-5 text-slate-400">Start with the review queue. Every action has a visible status, so nothing gets lost.</p></div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
          <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div><div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-teal-700"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Live workspace</div><h1 className="text-3xl font-bold tracking-tight md:text-4xl">Good morning, manager</h1><p className="mt-2 text-slate-500">See what needs attention and keep the community moving.</p></div>
            <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800"><AlertTriangle className="h-4 w-4" /> Preview data until admin RPCs are connected</div>
          </header>

          {section === 'overview' && <>
            <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ['Members', formatNumber(data.total_users), '+12% this month', Users, 'text-teal-700 bg-teal-50'],
                ['Active today', formatNumber(data.active_users_today), `${formatNumber(data.new_users_this_week)} new this week`, Activity, 'text-blue-700 bg-blue-50'],
                ['Pending review', '18', '6 need your attention', Clock3, 'text-amber-700 bg-amber-50'],
                ['Avg. rating', data.average_rating.toFixed(2), 'Across completed exchanges', CheckCircle2, 'text-emerald-700 bg-emerald-50'],
              ].map(([label, value, hint, Icon, colors]) => <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-sm text-slate-500">{String(label)}</p><p className="mt-2 text-3xl font-bold tracking-tight">{String(value)}</p></div><div className={`rounded-xl p-3 ${String(colors)}`}><Icon className="h-5 w-5" /></div></div><p className="mt-4 text-xs font-medium text-slate-500">{String(hint)}</p></div>)}
            </div>

            <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between"><div><h2 className="text-lg font-semibold">Review queue</h2><p className="mt-1 text-sm text-slate-500">Prioritized work for a faster daily routine.</p></div><div className="flex gap-2"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search queue" className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 md:w-44" /></div><select value={filter} onChange={(e) => setFilter(e.target.value as 'All' | QueueStatus)} className="rounded-lg border border-slate-200 bg-white px-2 text-sm outline-none focus:border-teal-500"><option>All</option><option>Needs review</option><option>Waiting</option><option>Verified</option></select></div></div><div className="divide-y divide-slate-100">{filteredQueue.map((item) => <div key={item.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-start gap-3"><div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.tone === 'amber' ? 'bg-amber-500' : item.tone === 'blue' ? 'bg-blue-500' : 'bg-emerald-500'}`} /><div className="min-w-0"><p className="font-semibold">{item.title}</p><p className="mt-1 text-sm text-slate-600">{item.owner}</p><p className="mt-1 truncate text-xs text-slate-400">{item.detail}</p></div></div><div className="flex items-center gap-3 sm:shrink-0"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === 'Needs review' ? 'bg-amber-50 text-amber-700' : item.status === 'Waiting' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>{item.status}</span><button onClick={() => showNotice(`${item.title} opened for review`)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50">Open</button></div></div>)}{filteredQueue.length === 0 && <div className="p-10 text-center text-sm text-slate-500"><Filter className="mx-auto mb-2 h-5 w-5" />No items match your filters.</div>}</div></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="text-lg font-semibold">Platform health</h2><p className="mt-1 text-sm text-slate-500">Simple signals, no digging required.</p></div><ArrowUpRight className="h-5 w-5 text-emerald-600" /></div><div className="mt-6 flex items-end gap-2" aria-label="Weekly activity chart">{[48, 64, 53, 72, 68, 86, 79].map((height, index) => <div key={index} className="flex-1 rounded-t-md bg-gradient-to-t from-teal-700 to-teal-300" style={{ height: `${height}px` }} />)}</div><div className="mt-2 flex justify-between text-[11px] text-slate-400"><span>Mon</span><span>Sun</span></div><div className="mt-6 flex items-center justify-between rounded-xl bg-emerald-50 p-3"><div className="flex items-center gap-2 text-sm font-semibold text-emerald-800"><CheckCircle2 className="h-4 w-4" /> All systems healthy</div><span className="text-xs text-emerald-700">99.8%</span></div></div>
            </section>

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-lg font-semibold">Recent activity</h2><p className="mt-1 text-sm text-slate-500">A quick audit trail for today.</p></div><button onClick={() => showNotice('Activity export is ready when the admin data source is connected')} className="text-sm font-semibold text-teal-700 hover:text-teal-900">Export log</button></div><div className="grid gap-4 md:grid-cols-4">{activityItems.map(([time, title, detail]) => <div key={time} className="flex gap-3"><span className="text-xs font-semibold text-slate-400">{time}</span><div><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p></div></div>)}</div></section>
          </>}

          {section !== 'overview' && <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"><div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">{section === 'members' ? <Users /> : section === 'content' ? <FileCheck2 /> : <Settings2 />}</div><h2 className="text-2xl font-bold">{section === 'members' ? 'Members' : section === 'content' ? 'Content review' : 'Workspace settings'}</h2><p className="mt-3 max-w-2xl text-slate-500">This section is structured and ready for the connected admin data source. The current preview keeps all actions read-only until the Supabase admin policies and RPCs are enabled.</p><button onClick={() => setSection('overview')} className="mt-6 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700">Back to overview</button></section>}
        </main>
      </div>
      {notice && <div role="status" className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-xl"><CheckCircle2 className="h-4 w-4 text-teal-300" />{notice}<button onClick={() => setNotice('')} aria-label="Dismiss" className="ml-2 text-slate-400 hover:text-white"><XCircle className="h-4 w-4" /></button></div>}
    </div>
  );
}
