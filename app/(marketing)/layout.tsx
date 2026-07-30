import { MarketingNav } from "@/components/marketing/MarketingNav";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="itep min-h-screen flex flex-col" style={{ background: "var(--chalk)" }}>
      <MarketingNav />
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
