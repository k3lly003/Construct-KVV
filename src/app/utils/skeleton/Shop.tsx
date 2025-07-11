import { Skeleton } from '@/components/ui/skeleton';

export const ShopSkeleton =()=>{

return (
    <div className="min-h-screen bg-white">
      {/* Shop Card Skeleton */}
      <div className="max-w-5xl mx-auto px-4 gap-3 flex justify-start">
        <Skeleton className="h-[420px] w-[340px] rounded-2xl" />
        <Skeleton className="h-[420px] w-[340px] rounded-2xl" />
        <Skeleton className="h-[420px] w-[340px] rounded-2xl" />
      </div>
    </div>
  );
}