export default function AgentProgress({
  result,
}) {
  const agents = [
    "Extraction Agent",
    "Matching Agent",
    "Arbitration Agent",
  ];

  return (
    <div
      className="
      bg-slate-800
      rounded-3xl
      p-6
      "
    >
      <h2
        className="
        text-white
        text-2xl
        font-bold
        mb-6
        "
      >
        Agent Progress
      </h2>

      {agents.map((agent) => (
        <div
          key={agent}
          className="
          flex
          justify-between
          py-3
          border-b
          border-slate-700
          text-white
          "
        >
          <span>{agent}</span>

          <span
            className={
              result
                ? "text-green-400"
                : "text-yellow-400"
            }
          >
            {result
              ? "Completed"
              : "Waiting"}
          </span>
        </div>
      ))}

      {result && (
        <div
          className="
          mt-6
          p-4
          rounded-xl
          bg-slate-900
          "
        >
          <h3
            className="
            text-white
            font-bold
            mb-2
            "
          >
            Reconciliation Result
          </h3>

          <p className="text-green-400">
            Status:
            {" "}
            {
              result.match_result
                ?.status
            }
          </p>

          <p className="text-slate-300 mt-2">
            {result.summary}
          </p>
        </div>
      )}
    </div>
  );
}



// /* eslint-disable no-undef */
// export default function AgentProgress() {
//   return (
//     <div className="bg-slate-800 rounded-3xl p-6">
//       // eslint-disable-next-line no-undef
//       {agents.map((agent) => (
//         <div
//           key={agent}
//           className="
//           flex
//           justify-between
//           py-3
//           border-b
//           border-slate-700
//           "
//         >
//           <span>{agent}</span>

//           <span className="text-green-400">
//             Completed
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// }