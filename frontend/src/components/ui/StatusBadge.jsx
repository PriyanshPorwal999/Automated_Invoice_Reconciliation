const styles = {
  matched:   "bg-(--stamp-green)/15 text-(--stamp-green) border border-(--stamp-green)/30",
  variance:  "bg-(--stamp-amber)/15 text-(--stamp-amber) border border-(--stamp-amber)/30",
  pending:   "bg-(--ink-dim)/15 text-(--ink-dim) border border-(--ink-dim)/30",
  high:      "bg-(--stamp-red)/15 text-(--stamp-red) border border-(--stamp-red)/30",
  medium:    "bg-(--stamp-amber)/15 text-(--stamp-amber) border border-(--stamp-amber)/30",
  low:       "bg-(--stamp-green)/15 text-(--stamp-green) border border-(--stamp-green)/30",
  excellent: "bg-(--stamp-green)/15 text-(--stamp-green) border border-(--stamp-green)/30",
  good:      "bg-(--stamp-amber)/15 text-(--stamp-amber) border border-(--stamp-amber)/30",
  review:    "bg-(--stamp-red)/15 text-(--stamp-red) border border-(--stamp-red)/30",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-mono-tabular text-[10px] uppercase tracking-widest ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
}