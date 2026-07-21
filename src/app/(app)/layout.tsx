import { Nav } from "@/components/Nav";

// This app is a live inventory tool, not static content — every page here reads
// current DB state and must render per-request, never be prerendered at build time.
export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-zinc-50">
      <Nav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
