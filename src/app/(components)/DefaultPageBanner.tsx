"use client";

interface DefaultPageBannerProps {
  backgroundImage: string;
  title: string;
}

import { useTranslations } from "@/app/hooks/useTranslations";
import { dashboardFakes } from "@/app/utils/fakes/DashboardFakes";

const DefaultPageBanner = ({
  backgroundImage,
  title,
}: DefaultPageBannerProps) => {
  const { t } = useTranslations();

  const jssStyles = {
    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    transition: "background-image 0.3s ease-in-out",
    willChange: "background-image",
  };

  return (
    <div
      className="flex flex-col items-center justify-center mx-auto w-full px-12 md:px-12 pt-36 pb-16 md:pb-32 overflow-hidden"
      style={jssStyles}
    >
      <div
        className={`flex flex-col gap-6 items-center justify-center text-white w-full max-w-screen-xl`}
      >
        <h1 className="text-3xl md:text-5xl font-extrabold w-full md:w-2/3 text-center">
          {title || t(dashboardFakes.defaultBanner.defaultTitle)}
        </h1>
      </div>
    </div>
  );
};

export default DefaultPageBanner;
