import translations from './translations';

export default function useTranslation() {
  const lang = localStorage.getItem('preferredLanguage') || 'en';
  return translations[lang] || translations.en;
}
