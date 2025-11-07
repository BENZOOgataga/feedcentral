'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter, usePathname } from '@/i18n-navigation';
import { Moon, Sun, AlertTriangle, User, Mail, Edit2, Check, X, Lock, Globe, Key, Sparkles, Crown, Shield, ShieldCheck, Download } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/lib/hooks/useToast';

export default function SettingsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const { user, isLoading: authLoading, refreshUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme, theme, systemTheme } = useTheme();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [redeemingLicense, setRedeemingLicense] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [enablingTwoFactor, setEnablingTwoFactor] = useState(false);
  const [twoFactorQR, setTwoFactorQR] = useState('');
  const [twoFactorSecret, setTwoFactorSecret] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [verifyingTwoFactor, setVerifyingTwoFactor] = useState(false);
  const [disablingTwoFactor, setDisablingTwoFactor] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'fr', name: 'Français', nativeName: 'Français' },
  ];

  const FlagIcon = ({ countryCode }: { countryCode: string }) => {
    if (countryCode === 'en') {
      // US Flag
      return (
        <svg className="w-10 h-7" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="24" rx="2" fill="#B22234"/>
          <path d="M0 2.77H32M0 5.54H32M0 8.31H32M0 11.08H32M0 13.85H32M0 16.62H32M0 19.39H32" stroke="white" strokeWidth="1.85"/>
          <rect width="12.8" height="13.09" rx="1" fill="#3C3B6E"/>
          <g fill="white">
            <circle cx="2.4" cy="2.4" r="0.8"/>
            <circle cx="5.6" cy="2.4" r="0.8"/>
            <circle cx="8.8" cy="2.4" r="0.8"/>
            <circle cx="4" cy="4" r="0.8"/>
            <circle cx="7.2" cy="4" r="0.8"/>
            <circle cx="10.4" cy="4" r="0.8"/>
            <circle cx="2.4" cy="5.6" r="0.8"/>
            <circle cx="5.6" cy="5.6" r="0.8"/>
            <circle cx="8.8" cy="5.6" r="0.8"/>
            <circle cx="4" cy="7.2" r="0.8"/>
            <circle cx="7.2" cy="7.2" r="0.8"/>
            <circle cx="10.4" cy="7.2" r="0.8"/>
            <circle cx="2.4" cy="8.8" r="0.8"/>
            <circle cx="5.6" cy="8.8" r="0.8"/>
            <circle cx="8.8" cy="8.8" r="0.8"/>
            <circle cx="4" cy="10.4" r="0.8"/>
            <circle cx="7.2" cy="10.4" r="0.8"/>
            <circle cx="10.4" cy="10.4" r="0.8"/>
          </g>
        </svg>
      );
    } else if (countryCode === 'fr') {
      // French Flag
      return (
        <svg className="w-10 h-7" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="roundedMask">
            <rect width="32" height="24" rx="2" fill="white"/>
          </mask>
          <g mask="url(#roundedMask)">
            <rect width="10.67" height="24" fill="#002395"/>
            <rect x="10.67" width="10.67" height="24" fill="white"/>
            <rect x="21.33" width="10.67" height="24" fill="#ED2939"/>
          </g>
        </svg>
      );
    }
    return null;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      setNewName(user.name);
      setNewEmail(user.email);
      // Fetch 2FA status
      fetch('/api/auth/me')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setTwoFactorEnabled(data.data.twoFactorEnabled || false);
          }
        })
        .catch(console.error);
    }
  }, [user, authLoading]);

  if (authLoading || !mounted) {
    return (
      <div className="w-full min-h-screen bg-background">
        <div className="w-full max-w-5xl mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="bg-linear-to-r from-primary/20 to-primary/5 rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-neutral-800 rounded-full animate-pulse" />
              <div className="flex-1">
                <div className="h-8 w-48 bg-neutral-800 rounded animate-pulse mb-3" />
                <div className="h-4 w-64 bg-neutral-800 rounded animate-pulse" />
              </div>
            </div>
          </div>
          {/* Content Skeleton */}
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-48 bg-neutral-800 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSaveName = async () => {
    if (!newName.trim() || newName === user.name) {
      setEditingName(false);
      return;
    }

    setSavingName(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to update name');
        setSavingName(false);
        return;
      }

      // Refresh user context to get updated data
      await refreshUser();
      setEditingName(false);
    } catch (error) {
      console.error('Error updating name:', error);
      alert('Failed to update name. Please try again.');
    } finally {
      setSavingName(false);
    }
  };

  const handleCancelEdit = () => {
    setNewName(user.name);
    setEditingName(false);
  };

  const handleSaveEmail = async () => {
    if (!newEmail.trim() || newEmail === user.email) {
      setEditingEmail(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    setSavingEmail(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to update email');
        setSavingEmail(false);
        return;
      }

      // Refresh user context to get updated data
      await refreshUser();
      setEditingEmail(false);
    } catch (error) {
      console.error('Error updating email:', error);
      alert('Failed to update email. Please try again.');
    } finally {
      setSavingEmail(false);
    }
  };

  const handleCancelEmailEdit = () => {
    setNewEmail(user.email);
    setEditingEmail(false);
  };

  const handlePasswordChangeClick = () => {
    toast({
      title: t('common.loading'),
      description: "Password change feature is coming in a later update.",
      variant: "destructive",
    });
  };

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const handleRedeemLicense = async () => {
    if (!licenseKey.trim()) {
      toast({
        title: t('common.error'),
        description: "Please enter a license key",
        variant: "destructive",
      });
      return;
    }

    setRedeemingLicense(true);
    try {
      const response = await fetch('/api/user/licenses/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: licenseKey.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: t('common.error'),
          description: data.error || 'Failed to redeem license key',
          variant: "destructive",
        });
        return;
      }

      toast({
        title: t('common.success'),
        description: data.message || 'License key activated successfully!',
      });

      // Clear input and refresh user data
      setLicenseKey('');
      await refreshUser();
      
    } catch (error) {
      console.error('Error redeeming license:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to redeem license key. Please try again.',
        variant: "destructive",
      });
    } finally {
      setRedeemingLicense(false);
    }
  };

  const formatLicenseKeyInput = (value: string) => {
    // Remove all non-alphanumeric characters
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Add dashes every 4 characters
    const parts = [];
    for (let i = 0; i < cleaned.length; i += 4) {
      parts.push(cleaned.slice(i, i + 4));
    }
    
    return parts.join('-').slice(0, 24); // FEED-XXXX-XXXX-XXXX-XXXX = 24 chars with dashes
  };

  const handleLicenseKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatLicenseKeyInput(e.target.value);
    setLicenseKey(formatted);
  };

  const getPremiumBadge = () => {
    if (!user?.premiumTier || user.premiumTier === 'free') {
      return null;
    }

    const tierColors = {
      premium: 'from-blue-500 to-cyan-500',
      pro: 'from-purple-500 to-pink-500',
    };

    const tierIcons = {
      premium: Sparkles,
      pro: Crown,
    };

    const Icon = tierIcons[user.premiumTier as keyof typeof tierIcons] || Sparkles;
    const gradient = tierColors[user.premiumTier as keyof typeof tierColors] || tierColors.premium;

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${gradient} text-white text-sm font-semibold shadow-lg`}>
        <Icon className="w-4 h-4" />
        {user.premiumTier.charAt(0).toUpperCase() + user.premiumTier.slice(1)}
      </div>
    );
  };

  const formatExpiryDate = (date: Date | null) => {
    if (!date) return null;
    const expiryDate = new Date(date);
    const now = new Date();
    const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return 'Expired';
    if (daysLeft === 0) return 'Expires today';
    if (daysLeft === 1) return 'Expires tomorrow';
    return `Expires in ${daysLeft} days`;
  };

  // 2FA Handlers
  const handleEnableTwoFactor = async () => {
    setEnablingTwoFactor(true);
    try {
      const response = await fetch('/api/user/2fa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: t('common.error'),
          description: data.error || 'Failed to enable 2FA',
          variant: 'destructive',
        });
        return;
      }

      setTwoFactorQR(data.data.qrCode);
      setTwoFactorSecret(data.data.secret);
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to enable 2FA. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setEnablingTwoFactor(false);
    }
  };

  const handleVerifyTwoFactor = async () => {
    if (!twoFactorCode || twoFactorCode.length !== 6) {
      toast({
        title: t('common.error'),
        description: 'Please enter a 6-digit code',
        variant: 'destructive',
      });
      return;
    }

    setVerifyingTwoFactor(true);
    try {
      const response = await fetch('/api/user/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: twoFactorCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: t('common.error'),
          description: data.error || 'Invalid verification code',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: t('common.success'),
        description: 'Two-factor authentication enabled successfully!',
      });

      setTwoFactorEnabled(true);
      setTwoFactorQR('');
      setTwoFactorSecret('');
      setTwoFactorCode('');
      await refreshUser();
    } catch (error) {
      console.error('Error verifying 2FA:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to verify code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setVerifyingTwoFactor(false);
    }
  };

  const handleDisableTwoFactor = async () => {
    if (!disablePassword) {
      toast({
        title: t('common.error'),
        description: 'Please enter your password',
        variant: 'destructive',
      });
      return;
    }

    setDisablingTwoFactor(true);
    try {
      const response = await fetch('/api/user/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: disablePassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: t('common.error'),
          description: data.error || 'Failed to disable 2FA',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: t('common.success'),
        description: 'Two-factor authentication disabled successfully',
      });

      setTwoFactorEnabled(false);
      setDisablePassword('');
      await refreshUser();
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to disable 2FA. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDisablingTwoFactor(false);
    }
  };

  // Generate initials from name

  return (
    <div>
      <div className="w-full min-h-screen bg-background">
        <div className="w-full max-w-5xl mx-auto px-4 py-8">
        
        {/* Profile Header */}
        <div className="bg-linear-to-r from-primary/20 to-primary/5 rounded-2xl p-8 mb-8 border border-primary/10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-lg">
                {getInitials(editingName ? newName : user.name)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-500 border-4 border-background" 
                title={t('settings.profile.activeStatus')} 
              />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {user.name}
              </h1>
              <p className="text-muted-foreground mb-4 flex items-center gap-2 justify-center sm:justify-start">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          
          {/* Appearance Section */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="bg-muted/30 px-6 py-4 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                {t('settings.appearance.title')}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {t('settings.appearance.description')}
              </p>
            </div>

            <div className="p-6">
              <label className="text-sm font-medium text-foreground mb-3 block">
                {t('settings.appearance.theme')}
              </label>
              
              {/* Theme Selector */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Light Theme Card */}
                <button
                  onClick={() => setTheme('light')}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    !isDark
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      !isDark ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Sun className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-foreground">{t('theme.light')}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{t('theme.lightDescription')}</div>
                    </div>
                  </div>
                  {!isDark && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>

                {/* Dark Theme Card */}
                <button
                  onClick={() => setTheme('dark')}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    isDark
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      isDark ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Moon className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-foreground">{t('theme.dark')}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{t('theme.darkDescription')}</div>
                    </div>
                  </div>
                  {isDark && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Language Section */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="bg-muted/30 px-6 py-4 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {t('settings.language.title')}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {t('settings.language.description')}
              </p>
            </div>

            <div className="p-6">
              <label className="text-sm font-medium text-foreground mb-3 block">
                {t('settings.language.selectLanguage')}
              </label>
              
              {/* Language Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      locale === language.code
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-border bg-card hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                        <FlagIcon countryCode={language.code} />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-semibold text-foreground">{language.nativeName}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{language.name}</div>
                      </div>
                    </div>
                    {locale === language.code && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Account Information Section */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="bg-muted/30 px-6 py-4 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <User className="w-5 h-5" />
                {t('settings.profile.title')}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {t('settings.subtitle')}
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Editable Name Field */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {t('settings.profile.name')}
                  </label>
                  {editingName ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="flex-1"
                        placeholder={t('settings.profile.namePlaceholder')}
                        disabled={savingName}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveName();
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={handleSaveName}
                        disabled={savingName || !newName.trim()}
                        className="gap-1"
                      >
                        <Check className="w-4 h-4" />
                        {t('common.save')}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={savingName}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                      <span className="text-base font-medium text-foreground">
                        {user.name}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingName(true)}
                        className="gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        {t('common.edit')}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Editable Email Field */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {t('settings.profile.email')}
                  </label>
                  {editingEmail ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="flex-1"
                        placeholder={t('settings.profile.emailPlaceholder')}
                        disabled={savingEmail}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEmail();
                          if (e.key === 'Escape') handleCancelEmailEdit();
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={handleSaveEmail}
                        disabled={savingEmail || !newEmail.trim()}
                        className="gap-1"
                      >
                        <Check className="w-4 h-4" />
                        {t('common.save')}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEmailEdit}
                        disabled={savingEmail}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                      <span className="text-base font-medium text-foreground">
                        {user.email}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingEmail(true)}
                        className="gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        {t('common.edit')}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Password Change Section */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {t('settings.password.title')}
                  </label>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                    <span className="text-base font-medium text-foreground">
                      ••••••••
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handlePasswordChangeClick}
                      className="gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      {t('settings.password.change')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium License Section */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="bg-muted/30 px-6 py-4 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Key className="w-5 h-5" />
                {t('settings.license.title')}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {t('settings.license.description')}
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Current Premium Status */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {t('settings.license.currentStatus')}
                  </label>
                  <div className="p-4 rounded-lg border border-border bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {user?.premiumTier && user.premiumTier !== 'free' ? (
                          <>
                            {getPremiumBadge()}
                            <div className="text-sm text-muted-foreground">
                              {user.premiumExpiresAt && formatExpiryDate(user.premiumExpiresAt)}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-foreground text-sm font-semibold">
                              {t('settings.license.freeTier')}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {t('settings.license.upgradePrompt')}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* License Key Redemption */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {t('settings.license.redeemKey')}
                  </label>
                  <div className="space-y-3">
                    <Input
                      type="text"
                      value={licenseKey}
                      onChange={handleLicenseKeyChange}
                      placeholder="FEED-XXXX-XXXX-XXXX-XXXX"
                      className="font-mono text-sm"
                      disabled={redeemingLicense}
                      maxLength={24}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRedeemLicense();
                      }}
                    />
                    <Button
                      onClick={handleRedeemLicense}
                      disabled={redeemingLicense || !licenseKey.trim() || licenseKey.length < 24}
                      className="w-full gap-2"
                    >
                      {redeemingLicense ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {t('settings.license.redeeming')}
                        </>
                      ) : (
                        <>
                          <Key className="w-4 h-4" />
                          {t('settings.license.redeemButton')}
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      {t('settings.license.redeemHint')}
                    </p>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <AlertTriangle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    <p className="font-medium mb-1">{t('settings.license.securityTitle')}</p>
                    <p className="text-xs opacity-90">
                      {t('settings.license.securityMessage')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Two-Factor Authentication Section */}
            <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-500" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-foreground">
                    {t('settings.twoFactor.title')}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.twoFactor.description')}
                  </p>
                </div>
                {user?.role === 'ADMIN' && (
                  <div className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                    <span className="text-xs font-medium text-yellow-600 dark:text-yellow-500">
                      {t('settings.twoFactor.recommended')}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {/* 2FA Status */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {t('settings.twoFactor.status')}
                  </label>
                  <div className="p-4 rounded-lg border border-border bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {twoFactorEnabled ? (
                          <>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-500">
                              <ShieldCheck className="w-4 h-4" />
                              <span className="text-sm font-semibold">{t('settings.twoFactor.enabled')}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
                              <Shield className="w-4 h-4" />
                              <span className="text-sm font-semibold">{t('settings.twoFactor.disabled')}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enable 2FA */}
                {!twoFactorEnabled && !twoFactorQR && (
                  <div className="space-y-3">
                    <Button
                      onClick={handleEnableTwoFactor}
                      disabled={enablingTwoFactor}
                      className="w-full gap-2"
                    >
                      {enablingTwoFactor ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {t('settings.twoFactor.enabling')}
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          {t('settings.twoFactor.enableButton')}
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* QR Code Setup */}
                {twoFactorQR && (
                  <div className="space-y-4 p-4 rounded-lg border border-border bg-muted/30">
                    <div className="text-center space-y-3">
                      <p className="text-sm font-medium">{t('settings.twoFactor.scanQR')}</p>
                      <div className="flex justify-center">
                        <img src={twoFactorQR} alt="2FA QR Code" className="w-48 h-48 bg-white p-2 rounded-lg" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">{t('settings.twoFactor.manualEntry')}</p>
                        <div className="font-mono text-xs bg-background p-2 rounded border border-border break-all">
                          {twoFactorSecret}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('settings.twoFactor.enterCode')}</label>
                      <Input
                        type="text"
                        value={twoFactorCode}
                        onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        className="font-mono text-center text-lg tracking-widest"
                        maxLength={6}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleVerifyTwoFactor();
                        }}
                      />
                      <Button
                        onClick={handleVerifyTwoFactor}
                        disabled={verifyingTwoFactor || twoFactorCode.length !== 6}
                        className="w-full gap-2"
                      >
                        {verifyingTwoFactor ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {t('settings.twoFactor.verifying')}
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            {t('settings.twoFactor.verifyButton')}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Disable 2FA */}
                {twoFactorEnabled && (
                  <div className="space-y-3 p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                    <p className="text-sm font-medium text-red-600 dark:text-red-500">
                      {t('settings.twoFactor.disableWarning')}
                    </p>
                    <Input
                      type="password"
                      value={disablePassword}
                      onChange={(e) => setDisablePassword(e.target.value)}
                      placeholder={t('settings.twoFactor.enterPassword')}
                      className="bg-background"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleDisableTwoFactor();
                      }}
                    />
                    <Button
                      onClick={handleDisableTwoFactor}
                      disabled={disablingTwoFactor || !disablePassword}
                      variant="destructive"
                      className="w-full gap-2"
                    >
                      {disablingTwoFactor ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {t('settings.twoFactor.disabling')}
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4" />
                          {t('settings.twoFactor.disableButton')}
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
      </div>
    </div>
  );
}
