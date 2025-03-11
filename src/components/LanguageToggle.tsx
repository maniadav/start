import React from "react";
import Image from "next/image";
import { useLanguageProvider } from "state/provider/LanguageProvider";
import { BASE_URL } from "@constants/config.constant";

const LanguageToggle = () => {
  const { language, toggleLanguage, languageContent } = useLanguageProvider();
  const isEnglish = language === "en";

  return (
    <div
      className={`flex gap-2 bg-gray-800 text-gray-200 items-center justify-center cursor-pointer py-1 w-20 rounded-full transition-all duration-300 ease-in-out ${
        isEnglish ? "flex-row" : "flex-row-reverse"
      }`}
      onClick={toggleLanguage}
    >
      <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center transition-transform duration-300 ease-in-out">
        <Image
          src={
            isEnglish
              ? `${BASE_URL}/image/britain.png`
              : `${BASE_URL}/image/india.png`
          }
          alt={language}
          className="w-full h-full object-cover rounded-full"
          width={36}
          height={36}
        />
      </div>
      <span className="text-xs font-bold uppercase transition-all duration-300 ease-in-out">
        {languageContent.language}
      </span>
    </div>
  );
};

export default LanguageToggle;
