import { useState } from "react";

import {
  uploadDocument,
  reconcileDocuments,
} from "../../services/auditServices";

export default function UploadCard({
  onReconciliationComplete,
}) {
  const [invoiceFile, setInvoiceFile] =
    useState(null);

  const [poFile, setPoFile] =
    useState(null);

  const [grnFile, setGrnFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const handleReconciliation =
    async () => {
      try {
        if (
          !invoiceFile ||
          !poFile ||
          !grnFile
        ) {
          alert(
            "Please upload all three documents."
          );
          return;
        }

        setLoading(true);

        // =====================
        // Upload Invoice
        // =====================

        const invoiceFormData =
          new FormData();

        invoiceFormData.append(
          "files",
          invoiceFile
        );

        invoiceFormData.append(
          "document_type",
          "invoice"
        );

        const invoiceResponse =
          await uploadDocument(
            invoiceFormData
          );

        // =====================
        // Upload PO
        // =====================

        const poFormData =
          new FormData();

        poFormData.append(
          "files",
          poFile
        );

        poFormData.append(
          "document_type",
          "po"
        );

        const poResponse =
          await uploadDocument(
            poFormData
          );

        // =====================
        // Upload GRN
        // =====================

        const grnFormData =
          new FormData();

        grnFormData.append(
          "files",
          grnFile
        );

        grnFormData.append(
          "document_type",
          "grn"
        );

        const grnResponse =
          await uploadDocument(
            grnFormData
          );

        // =====================
        // Extract Paths
        // =====================

        const invoicePath =
          invoiceResponse
            .uploaded_files[0]
            .file_path;

        const poPath =
          poResponse
            .uploaded_files[0]
            .file_path;

        const grnPath =
          grnResponse
            .uploaded_files[0]
            .file_path;

        // =====================
        // Run Reconciliation
        // =====================

        const result =
          await reconcileDocuments({
            invoice_pdf_path:
              invoicePath,

            po_pdf_path:
              poPath,

            grn_pdf_path:
              grnPath,
          });

        console.log(
          "Reconciliation Result:",
          result
        );

        if (
          onReconciliationComplete
        ) {
          onReconciliationComplete(
            result
          );
        }

        alert(
          "Reconciliation Completed Successfully"
        );
      } catch (error) {
        console.error(error);

        alert(
          "Error during reconciliation"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div
      className="
      bg-slate-900
      rounded-3xl
      p-8
      space-y-6
      "
    >
      <h2
        className="
        text-white
        text-2xl
        font-bold
        "
      >
        Upload Documents
      </h2>

      {/* Invoice */}
      <div>
        <label
          className="
          text-white
          block
          mb-2
          "
        >
          Invoice PDF
        </label>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) =>
            setInvoiceFile(
              e.target.files[0]
            )
          }
          className="text-white"
        />
      </div>

      {/* PO */}
      <div>
        <label
          className="
          text-white
          block
          mb-2
          "
        >
          Purchase Order PDF
        </label>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) =>
            setPoFile(
              e.target.files[0]
            )
          }
          className="text-white"
        />
      </div>

      {/* GRN */}
      <div>
        <label
          className="
          text-white
          block
          mb-2
          "
        >
          Goods Receipt PDF
        </label>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) =>
            setGrnFile(
              e.target.files[0]
            )
          }
          className="text-white"
        />
      </div>

      <button
        onClick={
          handleReconciliation
        }
        disabled={loading}
        className="
        bg-violet-600
        hover:bg-violet-700
        text-white
        px-6
        py-3
        rounded-xl
        w-full
        "
      >
        {loading
          ? "Processing..."
          : "Run Reconciliation"}
      </button>
    </div>
  );
}




// import { useDropzone } from "react-dropzone";

// export default function UploadCard() {
//   const [invoiceFile, setInvoiceFile] =
//     useState(null);

//   const [poFile, setPoFile] =
//     useState(null);

//   const [grnFile, setGrnFile] =
//     useState(null);

//   // const { getRootProps, getInputProps } =
//   //   useDropzone();

//   return (
//     <div
//       {...getRootProps()}
//       className="
//       border-2
//       border-dashed
//       border-violet-500
//       rounded-3xl
//       p-16
//       text-center
//       bg-slate-900
//       "
//     >
//       <input {...getInputProps()} />

//       <h3 className="text-white text-xl">
//         Upload Invoice
//       </h3>

//       <p className="text-slate-400 mt-3">
//         Drag & Drop PDF/Image
//       </p>
//     </div>
//   );
// }