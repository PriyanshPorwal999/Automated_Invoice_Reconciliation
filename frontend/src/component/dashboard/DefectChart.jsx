import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DefectChart({
  data,
}) {
  return (
    <div className="bg-slate-900 rounded-3xl p-6">
      <h2 className="text-white text-xl mb-4">
        Vendor Defects
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <BarChart data={data}>
          <XAxis dataKey="vendor" />
          <Tooltip />
          <Bar dataKey="count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}