export function getDefaultLanguage() {
  const primaryLanguage = navigator.language || 'en-US';

  return primaryLanguage.split('-')[0];
}
