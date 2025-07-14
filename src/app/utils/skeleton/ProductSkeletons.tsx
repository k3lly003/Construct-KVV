import { Skeleton } from "@/components/ui/skeleton"

export const ProductViewSkeleton = () => {
    return(
        <div className="w-full flex flex-col items-center py-10">
      {/* Product top section */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
        {/* Left: Main image and thumbnails */}
        <div className="flex flex-col items-center gap-4 w-full md:w-1/2">
          <Skeleton className="w-[350px] h-[350px] mb-2" />
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-md" />
            ))}
          </div>
        </div>
        {/* Right: Info */}
        <div className="flex-1 flex flex-col gap-4 w-full md:w-1/2">
          <Skeleton className="w-2/3 h-8" /> {/* Title */}
          <div className="flex gap-4 items-center">
            <Skeleton className="w-24 h-6" /> {/* Old price */}
            <Skeleton className="w-24 h-8" /> {/* New price */}
          </div>
          <div className="flex gap-2 items-center">
            <Skeleton className="w-16 h-10" /> {/* - button */}
            <Skeleton className="w-10 h-10" /> {/* quantity */}
            <Skeleton className="w-16 h-10" /> {/* + button */}
            <Skeleton className="w-40 h-10" /> {/* Add to cart */}
            <Skeleton className="w-10 h-10" /> {/* Heart */}
            <Skeleton className="w-10 h-10" /> {/* Share */}
          </div>
          <div className="flex gap-2 mt-2">
            <Skeleton className="w-32 h-8" /> {/* Description tab */}
            <Skeleton className="w-32 h-8" /> {/* Details tab */}
          </div>
          <Skeleton className="w-full h-20 mt-4" /> {/* Description/details content */}
        </div>
      </div>
      {/* Related products */}
      <div className="w-full max-w-5xl mt-12">
        <Skeleton className="w-48 h-8 mb-4" /> {/* Related products title */}
        <div className="flex gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <Skeleton className="w-48 h-48 mb-2" />
              <Skeleton className="w-32 h-6 mb-1" />
              <Skeleton className="w-24 h-4 mb-1" />
              <Skeleton className="w-24 h-6 mb-2" />
              <Skeleton className="w-32 h-10" />
            </div>
          ))}
        </div>
      </div>
      {/* Customer Reviews */}
      <div className="w-full max-w-5xl mt-12">
        <Skeleton className="w-48 h-8 mb-4" /> {/* Customer Reviews title */}
        <Skeleton className="w-full h-20" />
      </div>
    </div>
    )
}
