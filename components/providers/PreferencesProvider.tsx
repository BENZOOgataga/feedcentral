'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';

interface UserPreferences {
  customColor?: string;
  customWallpaper?: string;
  useCustomization?: boolean;
  selectedSources?: string[];
}

interface PreferencesContextType {
  preferences: UserPreferences | null;
  reloadPreferences: () => Promise<void>;
}

const PreferencesContext = createContext<PreferencesContextType>({
  preferences: null,
  reloadPreferences: async () => {},
});

export function usePreferences() {
  return useContext(PreferencesContext);
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (user && !loaded) {
      loadPreferences();
    } else if (!user) {
      // Clear customizations when user logs out
      clearCustomizations();
      setPreferences(null);
      setLoaded(false);
    }
  }, [user]);

  useEffect(() => {
    // Apply customizations whenever preferences change
    console.log('Preferences changed:', preferences);
    if (preferences?.useCustomization) {
      console.log('Applying customizations...');
      applyCustomizations(preferences);
    } else {
      console.log('Clearing customizations...');
      clearCustomizations();
    }
  }, [preferences]);

  async function loadPreferences() {
    try {
      const response = await fetch('/api/user/preferences');
      const data = await response.json();

      console.log('Loaded preferences from API:', data);

      if (data.success && data.data) {
        setPreferences(data.data);
      }
      setLoaded(true);
    } catch (err) {
      console.error('Error loading preferences:', err);
      setLoaded(true);
    }
  }

  async function reloadPreferences() {
    setLoaded(false);
    await loadPreferences();
  }

  function hexToHSL(hex: string): string {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Convert hex to RGB
    let r = 0, g = 0, b = 0;
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    }
    
    // Convert RGB to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    
    return `${h} ${s}% ${l}%`;
  }

  function applyCustomizations(prefs: UserPreferences) {
    const root = document.documentElement;

    // Apply custom color (convert to HSL format for Tailwind)
    if (prefs.customColor) {
      let hslColor = prefs.customColor;
      
      // If it's a hex color, convert to HSL
      if (prefs.customColor.startsWith('#')) {
        hslColor = hexToHSL(prefs.customColor);
      } 
      // If it's rgb/rgba, try to parse and convert
      else if (prefs.customColor.startsWith('rgb')) {
        const match = prefs.customColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
          const hex = '#' + [match[1], match[2], match[3]]
            .map(x => parseInt(x).toString(16).padStart(2, '0'))
            .join('');
          hslColor = hexToHSL(hex);
        }
      }
      // If already in HSL format, use as-is
      else if (!prefs.customColor.includes('hsl')) {
        // Try to parse as hex without #
        hslColor = hexToHSL(prefs.customColor);
      }
      
      console.log('Applying custom color:', prefs.customColor, '→', hslColor);
      root.style.setProperty('--primary', hslColor);
    }

    // Apply custom wallpaper
    if (prefs.customWallpaper) {
      console.log('Applying wallpaper:', prefs.customWallpaper);
      root.style.backgroundImage = `url(${prefs.customWallpaper})`;
      root.style.backgroundSize = 'cover';
      root.style.backgroundPosition = 'center';
      root.style.backgroundAttachment = 'fixed';
    }
  }

  function clearCustomizations() {
    const root = document.documentElement;
    root.style.removeProperty('--primary');
    root.style.backgroundImage = '';
    root.style.backgroundSize = '';
    root.style.backgroundPosition = '';
    root.style.backgroundAttachment = '';
  }

  return (
    <PreferencesContext.Provider value={{ preferences, reloadPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
}
