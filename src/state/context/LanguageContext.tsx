'use client';
import React, { createContext, Dispatch, SetStateAction } from 'react';

interface LanguageContextProps {
  language: string;
  toggleLanguage: any;
  languageContent: any;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
);

export default LanguageContext;
