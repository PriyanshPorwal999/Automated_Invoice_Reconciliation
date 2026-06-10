/* eslint-disable no-undef */
export default function AgentProgress() {
  return (
    <div className="bg-slate-800 rounded-3xl p-6">
      // eslint-disable-next-line no-undef
      {agents.map((agent) => (
        <div
          key={agent}
          className="
          flex
          justify-between
          py-3
          border-b
          border-slate-700
          "
        >
          <span>{agent}</span>

          <span className="text-green-400">
            Completed
          </span>
        </div>
      ))}
    </div>
  );
}