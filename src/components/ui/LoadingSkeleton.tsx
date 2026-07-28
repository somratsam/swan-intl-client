'use client';

export function CardSkeleton() {
  return (
    <div className="overflow-hidden" style={{ background: 'var(--color-card-bg)' }}>
      <div className="skeleton w-full h-60" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-4 w-3/4 rounded-sm" />
        <div className="skeleton h-3 w-1/2 rounded-sm" />
        <div className="skeleton h-3 w-5/6 rounded-sm" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return <div className="w-full h-screen skeleton" />;
}

export function DetailSkeleton() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-dark-bg)' }}>
      <div className="skeleton w-full h-[55vh]" />
      <div className="max-w-4xl mx-auto px-6 py-14 space-y-5">
        <div className="skeleton h-10 w-2/3 rounded-sm" />
        <div className="skeleton h-4 w-full rounded-sm" />
        <div className="skeleton h-4 w-5/6 rounded-sm" />
        <div className="skeleton h-4 w-4/6 rounded-sm" />
      </div>
    </div>
  );
}
