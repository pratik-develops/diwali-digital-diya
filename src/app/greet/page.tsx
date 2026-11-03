import { Suspense } from "react";
import { GreetingView } from "@/components/features/GreetingView";

function Fallback() {
  return <div className="px-4 py-24 text-center text-gold">Lighting the greeting…</div>;
}

export default function GreetPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <GreetingView />
    </Suspense>
  );
}
