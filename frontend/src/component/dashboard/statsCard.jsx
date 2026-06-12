export default function StatsCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="bg-slate-800 rounded-3xl p-6">
      <div className="flex justify-between">
        <div>
          <p className="text-slate-400">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-white">
            {value}
          </h2>
        </div>

        {icon}
      </div>
    </div>
  );
}