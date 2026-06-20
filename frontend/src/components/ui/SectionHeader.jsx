export default function SectionHeader({ label, title, action }) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        {label && <p className="font-mono-tabular text-xs uppercase tracking-[0.2em] text-(--ink-dim)">{label}</p>}
        <h2 className="mt-0.5 text-xl text-(--ink)" style={{ fontFamily: "var(--font-display)" }}>{title}</h2>
      </div>
      {action && action}
    </div>
  );
}