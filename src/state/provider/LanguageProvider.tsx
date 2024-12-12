'use client';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { englishContent, hindiContent } from '@constants/language.constant';
import { LOCALSTORAGE } from '@constants/storage.constant';
import {
  getLocalStorageValue,
  setLocalStorageValue,
} from '@utils/localStorage';
import LanguageContext from 'state/context/LanguageContext';

const getContentByLanguage = (language: string) =>
  language === 'en' ? englishContent : hindiContent;

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<string>('en');
  const [languageContent, setLanguageContent] = useState<any>(
    getContentByLanguage('en')
  );

  useEffect(() => {
    const savedLanguage =
      getLocalStorageValue(LOCALSTORAGE.SELECTED_LANGUAGE) || 'en';
    setLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    setLanguageContent(getContentByLanguage(language));
  }, [language]);

  const toggleLanguage = ({}) => {
    const newLanguage = language === 'en' ? 'hi' : 'en';
    setLanguage(newLanguage);
    setLocalStorageValue(LOCALSTORAGE.SELECTED_LANGUAGE, newLanguage);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        toggleLanguage,
        languageContent,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageProvider = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageProvider must be used within LanguageProvider');
  }
  return context;
};
