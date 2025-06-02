import DealsPage from "../../(components)/deals/DealsPage";
import DefaultPageBanner from "../../(components)/DefaultPageBanner";
import { dealsHeaderData } from "../../utils/fakes/DealFakes";

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
