import React, { useState, useEffect } from "react";
import ReactFlagsSelect from "react-flags-select";
import { useTranslation } from "react-i18next";
import { setUserLocale } from "@/app/libs/locale";

const ToggleFlag = () => {
  const { i18n, ready } = useTranslation();
  const [selected, setSelected] = useState("US");

  // Map language codes to country codes
  const languageToCountry: Record<string, string> = {
    'en': 'US',
    'fr': 'FR'
  };

  const countryToLanguage: Record<string, string> = {
    'US': 'en',
    'FR': 'fr'
  };

  // Initialize selected flag based on current language
  useEffect(() => {
    if (ready && i18n.language) {
      const countryCode = languageToCountry[i18n.language] || 'US';
      setSelected(countryCode);
    }
  }, [i18n.language, ready]);

  const handleFlagSelect = (countryCode: string) => {
    setSelected(countryCode);
    const languageCode = countryToLanguage[countryCode];
    
    if (languageCode && ready) {
      i18n.changeLanguage(languageCode);
      setUserLocale(languageCode as 'en' | 'fr');
    }
  };

  return (
    <ReactFlagsSelect
      selected={selected}
      onSelect={handleFlagSelect}
      countries={["US", "FR"]}
      showSelectedLabel={false}
      showOptionLabel={false}
      customLabels={{
        US: "English",
        FR: "Français"
      }}
    />
  );
};

export default ToggleFlag;