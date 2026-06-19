import { useState } from "react";

import Sidebar from "../component/layout/sidebar.jsx";
import UploadCard from "../component/upload/UploadCard.jsx";
import AgentProgress from "../component/upload/AgentProgress.jsx";
import AuditResult from "../component/upload/AuditResult.jsx";

export default function UploadAudit() {
  const [result, setResult] =
  useState(null);

  console.log(
    "Current Result:",
    result
  );


  // const [result, setResult] =
  //   useState(null);

  return (
    <div className="flex bg-slate-950 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-white text-4xl font-bold">
          Upload & Audit
        </h1>

        <div className="grid grid-cols-2 gap-6 mt-8">
          <UploadCard
            onReconciliationComplete={
              setResult
            }
          />

          <AgentProgress
            result={result}
          />
        </div>

        {result && (
          <div className="mt-6">
            <AuditResult
              result={result}
            />
          </div>
        )}


      </main>
    </div>
  );
}




// import Sidebar from "../component/layout/sidebar.jsx";
// import UploadCard from "../component/upload/uploadCard.jsx";
// import AgentProgress from "../component/upload/AgentProgress.jsx";

// export default function UploadAudit() {
//   return (
//     <div className="flex bg-slate-950 min-h-screen">
//       <Sidebar />

//       <main className="flex-1 p-8">
//         <h1 className="text-white text-4xl font-bold">
//           Upload & Audit
//         </h1>

//         <div className="grid grid-cols-2 gap-6 mt-8">
//           <UploadCard />

//           <AgentProgress />
//         </div>
//       </main>
//     </div>
//   );
// }