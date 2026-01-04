import { Review } from "@/app/utils/fakes/HomeFakes";
import { CardContent } from "@/components/ui/card";
import Image from 'next/image';

interface Props {
  review: Review;
}

const CarouselCard: React.FC<Props> = ({ review }) => {
  return (
    <div className="w-full md:w-96 flex flex-col items-center text-center p-5 py-10 shadow-amber-300 ">
      {review.image && (
        <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4">
          <Image src={review.image} alt={review.name} layout="fill" objectFit="cover" />
        </div>
      )}
      <div className="mb-2">
        <p className="font-bold text-mid text-amber-500">{review.name}</p>
        {review.affiliation && <p className="text-md text-muted-foreground">{review.affiliation}</p>}
      </div>
      <CardContent className="p-0">
        <blockquote className="text-md italic text-gray-700 dark:text-gray-300">
          {review.quote}
        </blockquote>
      </CardContent>
    </div>
  );
};

export default CarouselCard;