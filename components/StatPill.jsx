export default function StatPill({ label, value, icon }) {
  return (
    <div className="bg-white rounded-2xl p-3 flex-1 border border-border">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-xs">{icon}</span>
        <span className="text-[10px] tracking-wide text-inkSoft font-semibold uppercase">{label}</span>
      </div>
      <div className="font-display font-semibold text-lg text-ink">{value}</div>
    </div>
  );
}
