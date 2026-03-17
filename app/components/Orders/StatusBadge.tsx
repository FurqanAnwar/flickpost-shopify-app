const STATUS_STYLES: Record<string, { bg: string; color: string; dot: string }> = {
  fulfilled:   { bg: "#EAF3DE", color: "#3B6D11", dot: "#639922" },
  unfulfilled: { bg: "#FAEEDA", color: "#854F0B", dot: "#BA7517" },
  partial:     { bg: "#E6F1FB", color: "#185FA5", dot: "#378ADD" },
};

function getStatusKey(status: string) {
  const s = (status || "unfulfilled").toLowerCase();
  if (s.includes("partial")) return "partial";
  if (s === "fulfilled") return "fulfilled";
  return "unfulfilled";
}

export const StatusBadge = ({ status }: { status: string }) => {
  const key = getStatusKey(status);
  const { bg, color, dot } = STATUS_STYLES[key];
  const label = key.charAt(0).toUpperCase() + key.slice(1);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, background: bg, color, fontSize: 12, fontWeight: 500 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: dot, display: "inline-block" }} />
      {label}
    </span>
  );
};