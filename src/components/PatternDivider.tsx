export default function PatternDivider() {
  return (
    <div className="flex items-center gap-4 py-4">
      <div className="flex-1 h-[1px] bg-border" />
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 bg-accent/40 rotate-45" />
        <div className="w-1.5 h-1.5 bg-accent/60 rotate-45" />
        <div className="w-1.5 h-1.5 bg-accent/40 rotate-45" />
      </div>
      <div className="flex-1 h-[1px] bg-border" />
    </div>
  );
}
