import { useDropzone } from "react-dropzone";

export default function UploadCard() {
  const { getRootProps, getInputProps } =
    useDropzone();

  return (
    <div
      {...getRootProps()}
      className="
      border-2
      border-dashed
      border-violet-500
      rounded-3xl
      p-16
      text-center
      bg-slate-900
      "
    >
      <input {...getInputProps()} />

      <h3 className="text-white text-xl">
        Upload Invoice
      </h3>

      <p className="text-slate-400 mt-3">
        Drag & Drop PDF/Image
      </p>
    </div>
  );
}