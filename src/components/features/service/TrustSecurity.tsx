import { Star, Zap, Shield, Award } from "lucide-react";
import { useTranslations } from "@/app/hooks/useTranslations";

export default function TrustSecurity() {
  const { t } = useTranslations();
  return (
    <>
      {/* Trust & Security Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('serviceTrustSecurity.whyChoose')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('serviceTrustSecurity.whyChooseSubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('serviceTrustSecurity.verifiedProfessionalsTitle')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('serviceTrustSecurity.verifiedProfessionalsDesc')}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('serviceTrustSecurity.qualityGuaranteedTitle')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('serviceTrustSecurity.qualityGuaranteedDesc')}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('serviceTrustSecurity.fastMatchingTitle')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('serviceTrustSecurity.fastMatchingDesc')}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('serviceTrustSecurity.awardWinnersTitle')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('serviceTrustSecurity.awardWinnersDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
