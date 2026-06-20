import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { FileCheck, AlertTriangle, Clock, TrendingUp, DollarSign, Zap } from "lucide-react";
import MetricCard from "../components/ui/MetricCard";
import StatusBadge from "../components/ui/StatusBadge";
import SectionHeader from "../components/ui/SectionHeader";
import { getMockMetrics, getMockInvoices, getMockChartData, getMockDiscrepancies } from "../services/api";

const fmt = n => n >= 1000000 ? `₹${(n/1000000).toFixed(1)}M` : `₹${(n/1000).toFixed(0)}K`;
const PIE_COLORS = ["#5fae6e", "#e0a93a", "#a8a296", "#d9684f"];

export default function Dashboard() {
  const m = getMockMetrics();
  const invoices = getMockInvoices();
  const chart = getMockChartData();
  const discrepancies = getMockDiscrepancies();

  return (
    <div className="space-y-8">
      <section>
        <SectionHeader label="Overview" title="Key Performance Indicators" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Match Rate" value={`${m.matchRate}%`} trend="+2.1% this month" trendUp icon={TrendingUp} accent="text-(--stamp-green)" />
          <MetricCard label="Total Invoices" value={m.totalInvoices.toLocaleString()} sub="this quarter" icon={FileCheck} />
          <MetricCard label="Variances" value={m.variances} trend="-4 from last week" trendUp icon={AlertTriangle} accent="text-(--stamp-amber)" />
          <MetricCard label="Pending Review" value={m.pending} sub="requires action" icon={Clock} />
          <MetricCard label="Total Invoice Value" value={fmt(m.totalValue)} sub="this quarter" icon={DollarSign} />
          <MetricCard label="Avg Processing Time" value={m.avgProcessingTime} trend="-0.3 min improved" trendUp icon={Zap} />
          <MetricCard label="Savings Identified" value={fmt(m.savedThisMonth)} sub="this month" icon={TrendingUp} accent="text-(--stamp-green)" />
          <MetricCard label="Matched Invoices" value={m.matched.toLocaleString()} sub={`of ${m.totalInvoices} total`} icon={FileCheck} accent="text-(--stamp-green)" />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg border border-(--rule) bg-(--paper-raised) p-5">
          <SectionHeader label="Trend" title="Monthly Reconciliation" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chart.monthly} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--rule)" />
              <XAxis dataKey="month" tick={{ fill: "var(--ink-dim)", fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--ink-dim)", fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--paper-raised)", border: "1px solid var(--rule)", borderRadius: 6, fontSize: 12, fontFamily: "var(--font-mono)" }} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-mono)" }} />
              <Bar dataKey="matched" fill="var(--stamp-green)" radius={[2,2,0,0]} name="Matched" />
              <Bar dataKey="variance" fill="var(--stamp-amber)" radius={[2,2,0,0]} name="Variance" />
              <Bar dataKey="pending" fill="var(--rule)" radius={[2,2,0,0]} name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-(--rule) bg-(--paper-raised) p-5">
          <SectionHeader label="Analysis" title="Variance Types" />
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={chart.variance} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35}>
                {chart.variance.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--paper-raised)", border: "1px solid var(--rule)", borderRadius: 6, fontSize: 11, fontFamily: "var(--font-mono)" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {chart.variance.map((v, i) => (
              <div key={v.name} className="flex items-center justify-between font-mono-tabular text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-(--ink-dim)">{v.name}</span>
                </div>
                <span className="text-(--ink)">{v.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <SectionHeader label="Activity" title="Recent Invoices" />
        <div className="overflow-hidden rounded-lg border border-(--rule)">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-(--rule) bg-(--paper-raised)">
                {["Invoice", "Vendor", "Amount", "PO Ref", "Date", "Status"].map(h => (
                  <th key={h} className="px-4 py-3 font-mono-tabular text-xs uppercase tracking-[0.12em] text-(--ink-dim)">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} className="border-b border-(--rule) last:border-0 hover:bg-(--paper-raised)/50 transition-colors">
                  <td className="px-4 py-3 font-mono-tabular text-xs text-(--stamp-amber)">{inv.id}</td>
                  <td className="px-4 py-3 text-xs text-(--ink)">{inv.vendor}</td>
                  <td className="px-4 py-3 font-mono-tabular text-xs text-(--ink)">₹{inv.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono-tabular text-xs text-(--ink-dim)">{inv.po}</td>
                  <td className="px-4 py-3 font-mono-tabular text-xs text-(--ink-dim)">{inv.date}</td>
                  <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <SectionHeader label="Flagged" title="Recent Discrepancies" />
        <div className="grid gap-3 sm:grid-cols-2">
          {discrepancies.map(d => (
            <div key={d.id} className="rounded-lg border border-(--rule) bg-(--paper-raised) p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono-tabular text-[10px] uppercase tracking-[0.15em] text-(--ink-dim)">{d.invoice} · {d.field}</p>
                  <div className="mt-2 flex items-center gap-4 font-mono-tabular text-xs">
                    <span><span className="text-(--ink-dim)">Invoice: </span><span className="text-(--ink)">{d.invoiceVal}</span></span>
                    <span><span className="text-(--ink-dim)">PO: </span><span className="text-(--ink)">{d.poVal}</span></span>
                    <span className="text-(--stamp-amber)">{d.diff}</span>
                  </div>
                </div>
                <StatusBadge status={d.severity} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}