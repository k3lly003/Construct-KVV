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
      const countryCode = languageToCountry[i18n.language] || 'US';
      setSelected(countryCode);
      setError(null);
    }
  }, [i18n.language, ready]);

  const handleFlagSelect = (countryCode: string) => {
    setSelected(countryCode);
    setError(null);
    
    const languageCode = countryToLanguage[countryCode];
    
    if (languageCode && ready) {
      i18n.changeLanguage(languageCode);
      setUserLocale(languageCode as 'en' | 'fr' | 'rw');
    } else {
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