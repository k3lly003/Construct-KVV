import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, CheckCircle, Building, MapPin } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "@/app/hooks/useTranslations";

export default function ServiceBanner() {
    const { t } = useTranslations();
    const [zipCode, setZipCode] = useState('');
    const handleSearch = () => {
        console.log('Searching for services in:', zipCode);
      };
    const [showLocationForm, setShowLocationForm] = useState(false);
  return (
    <>
      {/* Hero Section */}
      <section
        className="relative h-[600px] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            'linear-gradient(rgba(165, 149, 7, 0.8), rgba(255, 255, 255, 0.6)), url("https://as1.ftcdn.net/jpg/15/47/58/70/1000_F_1547587091_Ah103M2wWJbR5oqer0B7o2YZOcvsTgUf.jpg")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/70 via-amber-300/60 to-white" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-title md:text-6xl font-bold text-white mb-6 leading-tight">
            {t('serviceBanner.heroTitle')}
          </h1>

          <p className="text-mid md:text-mid text-amber-100 mb-12 max-w-2xl mx-auto">
            {t('serviceBanner.heroSubtitle')}
          </p>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 max-w-lg mx-auto shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder={t('serviceBanner.locationPlaceholder')}
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="pl-10 h-12 text-mid border-2 border-gray-200 focus:border-amber-500"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="h-12 px-8 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-mid shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Search className="mr-2 h-5 w-5" />
                {t('serviceBanner.findServices')}
              </Button>
            </div>

            <div className="mt-4 text-center">
              <a
                onClick={() => setShowLocationForm(true)}
                className="text-amber-600 hover:text-amber-700 font-medium cursor-pointer"
                style={{ display: 'inline-block' }}
              >
                {t('serviceBanner.customRequest')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-title font-bold text-center mb-12 text-gray-900">
            {t('serviceBanner.howItWorksTitle')}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors duration-200">
                <Search className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-mid font-semibold mb-3 text-gray-900">
                {t('serviceBanner.step1Title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('serviceBanner.step1Desc')}
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors duration-200">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-mid font-semibold mb-3 text-gray-900">
                {t('serviceBanner.step2Title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('serviceBanner.step2Desc')}
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors duration-200">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-mid font-semibold mb-3 text-gray-900">
                {t('serviceBanner.step3Title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('serviceBanner.step3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
