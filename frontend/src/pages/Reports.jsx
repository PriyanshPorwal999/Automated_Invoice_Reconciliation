import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { Download } from "lucide-react";
import SectionHeader from "../components/ui/SectionHeader";
import { getMockChartData, getMockMetrics } from "../services/api";

export default function Reports() {
  const chart = getMockChartData();
  const m = getMockMetrics();

  const lineData = chart.monthly.map(d => ({
    ...d,
    matchRate: Math.round((d.matched / (d.matched + d.variance + d.pending)) * 100)
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeader label="Analytics" title="Reports & Insights" />
        <button className="flex items-center gap-2 rounded-full border border-(--rule) px-4 py-1.5 font-mono-tabular text-xs text-(--ink-dim) hover:border-(--stamp-amber) hover:text-(--stamp-amber) transition-colors">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>

      <div className="rounded-lg border border-(--rule) bg-(--paper-raised) p-5">
        <SectionHeader label="Trend" title="Match Rate Over Time" />
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--rule)" />
            <XAxis dataKey="month" tick={{ fill: "var(--ink-dim)", fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
            <YAxis domain={[70,100]} unit="%" tick={{ fill: "var(--ink-dim)", fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "var(--paper-raised)", border: "1px solid var(--rule)", borderRadius: 6, fontSize: 12, fontFamily: "var(--font-mono)" }} />
            <Line type="monotone" dataKey="matchRate" stroke="var(--stamp-green)" strokeWidth={2} dot={{ fill: "var(--stamp-green)" }} name="Match Rate %" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border border-(--rule) bg-(--paper-raised) p-5">
        <SectionHeader label="Volume" title="Invoice Processing Volume" />
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chart.monthly} barSize={16}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--rule)" />
            <XAxis dataKey="month" tick={{ fill: "var(--ink-dim)", fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "var(--ink-dim)", fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "var(--paper-raised)", border: "1px solid var(--rule)", borderRadius: 6, fontSize: 12, fontFamily: "var(--font-mono)" }} />
            <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-mono)" }} />
            <Bar dataKey="matched" fill="var(--stamp-green)" radius={[2,2,0,0]} name="Matched" stackId="a" />
            <Bar dataKey="variance" fill="var(--stamp-amber)" name="Variance" stackId="a" />
            <Bar dataKey="pending" fill="var(--rule)" radius={[2,2,0,0]} name="Pending" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Processed", value: m.totalInvoices.toLocaleString() },
          { label: "Avg Match Rate", value: `${m.matchRate}%` },
          { label: "Savings Identified", value: `₹${(m.savedThisMonth/1000).toFixed(0)}K` },
        ].map(s => (
          <div key={s.label} className="rounded-lg border border-(--rule) bg-(--paper-raised) p-5 text-center">
            <p className="font-mono-tabular text-xs uppercase tracking-[0.15em] text-(--ink-dim)">{s.label}</p>
            <p className="mt-2 text-2xl text-(--stamp-amber)" style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}