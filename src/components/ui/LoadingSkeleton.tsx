export function SkeletonLine({ className = '' }: { className?: string }) {
  return <div className={`skeleton rounded ${className}`} />;
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-card p-4 ${className}`}>
      <SkeletonLine className="h-3 w-24 mb-3" />
      <SkeletonLine className="h-8 w-32 mb-2" />
      <SkeletonLine className="h-2 w-20" />
    </div>
  );
}

export function SkeletonRow({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-border">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={`skel-col-${i}`} className="px-4 py-3">
          <SkeletonLine className={`h-3 ${i === 0 ? 'w-20' : i === 1 ? 'w-32' : 'w-16'}`} />
        </td>
      ))}
    </tr>
  );
}