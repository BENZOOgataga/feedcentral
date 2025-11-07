'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n-navigation';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTransition, useState, useEffect, useRef } from 'react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Fix positioning when dropdown opens
  useEffect(() => {
    if (open && triggerRef.current && contentRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const content = contentRef.current;
      
      // Force position to be relative to viewport, not document
      content.style.position = 'fixed';
      content.style.top = `${rect.bottom + 8}px`;
      content.style.left = `${rect.right - 200}px`; // Align to right (200px is approx dropdown width)
    }
  }, [open]);

  const currentLanguage = languages.find((lang) => lang.code === locale);

  const switchLanguage = (newLocale: string) => {
    startTransition(() => {
      // The router from i18n-navigation automatically handles locale prefixes
      router.replace(pathname, { locale: newLocale });
    });
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button ref={triggerRef} variant="ghost" size="icon" className="h-9 w-9">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        ref={contentRef}
        align="end" 
        side="bottom"
        sideOffset={8}
        className="z-100"
        avoidCollisions={true}
        collisionPadding={20}
        updatePositionStrategy="always"
        onCloseAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => {
          // Only close if clicking outside, not on scroll
          if (e.target instanceof HTMLElement && !e.target.closest('[data-radix-dropdown-menu-content]')) {
            return;
          }
          e.preventDefault();
        }}
        onInteractOutside={(e) => {
          // Prevent closing on scroll events
          if (e.type === 'scroll') {
            e.preventDefault();
          }
        }}
        sticky="always"
            hideWhenDetached={false}
          >
            {languages.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onClick={() => switchLanguage(language.code)}
                className={`cursor-pointer ${
                  locale === language.code ? 'bg-accent' : ''
                }`}
              >
                <span className="mr-2 text-lg">{language.flag}</span>
                <span>{language.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
    </DropdownMenu>
  );
}