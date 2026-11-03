import { Suspense } from "react";
import { LetterView } from "@/components/features/LetterView";

function Fallback() {
  return <div className="px-4 py-24 text-center text-gold">Finding the envelope…</div>;
}

export default function LetterPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <LetterView />
    </Suspense>
  );
}
