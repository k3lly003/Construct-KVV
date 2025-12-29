import React, { useState, useEffect } from "react";
import ReactFlagsSelect from "react-flags-select";
import { useTranslation } from "react-i18next";
import { setUserLocale } from "@/app/libs/locale";

const ToggleFlag = () => {
  const { i18n, ready } = useTranslation();
  const [selected, setSelected] = useState("US");
  const [error, setError] = useState<string | null>(null);

  // Map language codes to country codes
  const languageToCountry: Record<string, string> = {
    'en': 'US',
    'fr': 'FR',
    'rw': 'RW'
  };

  const countryToLanguage: Record<string, string> = {
    'US': 'en',
    'FR': 'fr',
    'RW': 'rw'
  };

  // Initialize selected flag based on current language
  useEffect(() => {
    if (ready && i18n.language) {
      console.log('Current i18n language:', i18n.language);
      const countryCode = languageToCountry[i18n.language] || 'US';
      console.log('Setting selected flag to:', countryCode);
      setSelected(countryCode);
      setError(null);
    }
  }, [i18n.language, ready]);

  const handleFlagSelect = (countryCode: string) => {
    console.log('Flag selected:', countryCode);
    setSelected(countryCode);
    setError(null);
    
    const languageCode = countryToLanguage[countryCode];
    console.log('Language code:', languageCode);
    
    if (languageCode && ready) {
      console.log('Changing language to:', languageCode);
      i18n.changeLanguage(languageCode);
      setUserLocale(languageCode as 'en' | 'fr' | 'rw');
    } else {
      console.error('Language code not found or i18n not ready:', { countryCode, languageCode, ready });
      setError("Failed to switch language.");
    }
  };

  return (
    <div>
      <ReactFlagsSelect
        selected={selected}
        onSelect={handleFlagSelect}
        countries={["US", "FR", "RW"]}
        showSelectedLabel={false}
        showOptionLabel={false}
        customLabels={{
          US: "English",
          FR: "Français",
          RW: "Kinyarwanda"
        }}
      />
      {error && (
        <div className="text-red-500 text-small mt-1">
          {error}
        </div>
      )}
    </div>
  );
};

export default ToggleFlag;