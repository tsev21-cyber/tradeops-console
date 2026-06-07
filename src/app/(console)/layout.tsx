import { Shell } from "@/components/Shell";
import { TradesProvider } from "@/modules/store";

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TradesProvider>
      <Shell>{children}</Shell>
    </TradesProvider>
  );
}
