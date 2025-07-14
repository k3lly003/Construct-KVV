# Multilingual Implementation Guide

This document outlines the multilingual (English and French) implementation for the Construct KVV project using react-i18next.

## Overview

The application now supports two languages:
- **English (en)** - Default language
- **French (fr)** - Secondary language

## Architecture

### Core Files

1. **Configuration**
   - `src/app/i18n/config.ts` - Language configuration and types
   - `src/app/i18n/i18n.ts` - Main i18n setup with react-i18next
   - `src/app/libs/locale.ts` - Locale detection and management utilities

2. **Translation Files**
   - `src/app/messages/en.json` - English translations
   - `src/app/messages/fr.json` - French translations

3. **Components**
   - `src/components/ui/language-switcher.tsx` - Language switcher component
   - `src/app/providers/i18n-provider.tsx` - i18n provider wrapper

4. **Provider Integration**
   - `src/app/providers.tsx` - Main providers including i18n
   - `src/app/layout.tsx` - Root layout with i18n initialization

## Usage

### Basic Translation

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.title')}</h1>
      <p>{t('common.description')}</p>
    </div>
  );
}
```

### Language Switching

```tsx
import { useTranslation } from 'react-i18next';
import { setUserLocale } from '@/app/libs/locale';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const changeLanguage = (locale: 'en' | 'fr') => {
    i18n.changeLanguage(locale);
    setUserLocale(locale);
  };
  
  return (
    <button onClick={() => changeLanguage('fr')}>
      Switch to French
    </button>
  );
}
```

### Custom Hook

```tsx
import { useTranslations } from '@/app/hooks/useTranslations';

function MyComponent() {
  const { t, changeLanguage, currentLanguage } = useTranslations();
  
  return (
    <div>
      <p>Current language: {currentLanguage}</p>
      <button onClick={() => changeLanguage('fr')}>
        {t('common.french')}
      </button>
    </div>
  );
}
```

## Translation Structure

The translation files are organized hierarchically:

```json
{
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "success": "Success"
  },
  "navigation": {
    "home": "Home",
    "products": "Products",
    "services": "Services"
  },
  "auth": {
    "signin": {
      "title": "Sign In",
      "email": "Email",
      "password": "Password"
    }
  }
}
```

## Key Features

### 1. Automatic Language Detection
- Detects user's browser language
- Falls back to English if browser language is not supported
- Remembers user's language preference in localStorage

### 2. Language Switcher
- Dropdown menu in the navigation bar
- Shows current language
- Highlights active language
- Persists language choice

### 3. Comprehensive Translations
- Navigation items
- Common UI elements
- Authentication forms
- Home page content
- Footer content
- Cart and product pages

### 4. Type Safety
- TypeScript support for locale types
- Compile-time checking of translation keys

## Adding New Translations

### 1. Add to English File
```json
// src/app/messages/en.json
{
  "newSection": {
    "title": "New Section Title",
    "description": "New section description"
  }
}
```

### 2. Add to French File
```json
// src/app/messages/fr.json
{
  "newSection": {
    "title": "Titre de la nouvelle section",
    "description": "Description de la nouvelle section"
  }
}
```

### 3. Use in Component
```tsx
const { t } = useTranslation();

return (
  <div>
    <h1>{t('newSection.title')}</h1>
    <p>{t('newSection.description')}</p>
  </div>
);
```

## Testing

Visit `/test-i18n` to see a comprehensive test page that demonstrates:
- Current language display
- Translation examples from all sections
- Language switching functionality
- i18n configuration status

## Best Practices

1. **Consistent Naming**: Use descriptive, hierarchical keys
2. **Reuse Common Terms**: Use the `common` section for frequently used terms
3. **Context Matters**: Include context in translation keys when needed
4. **Test Both Languages**: Always test with both English and French
5. **Fallback Handling**: Ensure fallback text is provided for missing translations

## Troubleshooting

### Common Issues

1. **Translation not showing**: Check if the key exists in both language files
2. **Language not switching**: Verify the language switcher is properly connected
3. **Hydration errors**: Ensure i18n is initialized before rendering

### Debug Mode

Enable debug mode in `src/app/i18n/i18n.ts`:
```tsx
i18n.init({
  debug: true, // Add this line
  // ... other options
});
```

## Future Enhancements

1. **Dynamic Loading**: Load translations on-demand for better performance
2. **Pluralization**: Add support for plural forms
3. **Date/Number Formatting**: Add locale-specific formatting
4. **RTL Support**: Add support for right-to-left languages
5. **Translation Management**: Integrate with translation management tools

## Dependencies

- `react-i18next`: ^15.5.1
- `i18next`: Included with react-i18next

## Files Modified

- `src/app/i18n/config.ts` - Updated to support only English and French
- `src/app/i18n/request.ts` - Updated for react-i18next compatibility
- `src/app/i18n/i18n.ts` - Created main i18n configuration
- `src/app/libs/locale.ts` - Created locale utilities
- `src/app/messages/en.json` - Added comprehensive English translations
- `src/app/messages/fr.json` - Added comprehensive French translations
- `src/components/ui/language-switcher.tsx` - Created language switcher component
- `src/app/providers/i18n-provider.tsx` - Created i18n provider
- `src/app/providers.tsx` - Integrated i18n provider
- `src/app/layout.tsx` - Added i18n initialization
- `src/app/hooks/useTranslations.ts` - Created custom translation hook
- `src/components/common/Navbar/Navigator.tsx` - Added translations and language switcher
- `src/components/features/home/Banner.tsx` - Added translations
- `src/components/common/footer/Footer.tsx` - Added translations
- `src/components/features/cart/emptyCart.tsx` - Added translations
- `src/app/(auth)/signin/page.tsx` - Added translations
- `src/app/test-i18n/page.tsx` - Created test page 