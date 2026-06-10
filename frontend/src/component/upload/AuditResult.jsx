export default function AuditResult({
  result,
}) {
  if (!result) return null;

  return (
    <div className="bg-slate-900 rounded-3xl p-6">
      <h2 className="text-white text-xl mb-4">
        Audit Result
      </h2>

      <div className="mb-4">
        <span
          className={`
          px-4 py-2 rounded-full
          ${
            result.status === "clean"
              ? "bg-green-500/20 text-green-400"
              : result.status === "critical"
              ? "bg-red-500/20 text-red-400"
              : "bg-yellow-500/20 text-yellow-400"
          }
        `}
        >
          {result.status}
        </span>
      </div>

      <p className="text-slate-300">
        {result.remarks}
      </p>
    </div>
  );
}