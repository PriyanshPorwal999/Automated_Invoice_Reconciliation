export default function OCRPreview({
  text,
}) {
  return (
    <div className="bg-slate-900 rounded-3xl p-6">
      <h2 className="text-xl text-white mb-4">
        OCR Output
      </h2>

      <textarea
        value={text}
        readOnly
        className="
          w-full
          h-80
          bg-slate-950
          border
          border-slate-700
          rounded-xl
          p-4
          text-slate-300
        "
      />
    </div>
  );
}