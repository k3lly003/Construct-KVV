import DealsPage from "@/app/(components)/deals/DealsPage";
import DefaultPageBanner from "@/app/(components)/DefaultPageBanner";
import { dealsHeaderData } from "@/app/utils/fakes/DealFakes";

const page = () => {
  const { backgroundImage, title } = dealsHeaderData;
  return (
    <>
        <DefaultPageBanner title={title} backgroundImage={backgroundImage} />
        <DealsPage />
    </>
  );
};

export default page;
