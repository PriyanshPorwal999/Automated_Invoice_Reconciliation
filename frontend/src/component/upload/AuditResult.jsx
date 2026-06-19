export default function AuditResult({
  result,
}) {
  if (!result) return null;

  const status =
    result.match_result?.status;

  const variances =
    result.match_result?.variances || [];

  return (
    <div
      className="
      bg-slate-900
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
        Audit Result
      </h2>

      {/* Status Badge */}

      <div className="mb-4">
        <span
          className={`
          px-4
          py-2
          rounded-full
          ${
            status === "matched"
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }
        `}
        >
          {status}
        </span>
      </div>

      {/* Summary */}

      <div className="mb-6">
        <h3
          className="
          text-white
          font-semibold
          mb-2
          "
        >
          Summary
        </h3>

        <p className="text-slate-300">
          {result.summary}
        </p>
      </div>

      {/* Variances */}

      <div className="mb-6">
        <h3
          className="
          text-white
          font-semibold
          mb-2
          "
        >
          Variances
        </h3>

        {variances.length === 0 ? (
          <p className="text-green-400">
            No variances found
          </p>
        ) : (
          <ul
            className="
            list-disc
            ml-6
            text-red-400
            "
          >
            {variances.map(
              (
                variance,
                index
              ) => (
                <li key={index}>
                  {JSON.stringify(
                    variance
                  )}
                </li>
              )
            )}
          </ul>
        )}
      </div>

      {/* Document Totals */}

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800 p-4 rounded-xl">
          <h4 className="text-white">
            Invoice
          </h4>

          <p className="text-slate-300">
            ₹
            {
              result.invoice_json
                ?.total_amount
            }
          </p>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl">
          <h4 className="text-white">
            Purchase Order
          </h4>

          <p className="text-slate-300">
            ₹
            {
              result.po_json
                ?.total_amount
            }
          </p>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl">
          <h4 className="text-white">
            GRN
          </h4>

          <p className="text-slate-300">
            {
              result.grn_json
                ?.line_items
                ?.length
            }
            {" "}Items
          </p>
        </div>
      </div>
    </div>
  );
}




// export default function AuditResult({
//   result,
// }) {
//   if (!result) return null;

//   return (
//     <div className="bg-slate-900 rounded-3xl p-6">
//       <h2 className="text-white text-xl mb-4">
//         Audit Result
//       </h2>

//       <div className="mb-4">
//         <span
//           className={`
//           px-4 py-2 rounded-full
//           ${
//             result.status === "clean"
//               ? "bg-green-500/20 text-green-400"
//               : result.status === "critical"
//               ? "bg-red-500/20 text-red-400"
//               : "bg-yellow-500/20 text-yellow-400"
//           }
//         `}
//         >
//           {result.status}
//         </span>
//       </div>

//       <p className="text-slate-300">
//         {result.remarks}
//       </p>
//     </div>
//   );
// }