import DecorDiamonds from "./DecorDiamonds";

export default function PatternDivider() {
  return (
    <div className="flex items-center gap-4 py-4">
      <div className="flex-1 h-[1px] bg-border" />
      <DecorDiamonds />
      <div className="flex-1 h-[1px] bg-border" />
    </div>
  );
}
