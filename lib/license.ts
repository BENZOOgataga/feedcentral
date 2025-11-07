/**
 * License Key Management System
 * 
 * This module provides secure generation and validation of premium license keys
 * with instance-binding to prevent cross-instance abuse.
 * 
 * Security Features:
 * - Instance-specific signing (each instance has unique LICENSE_SIGNING_SECRET)
 * - HMAC-SHA256 signatures prevent tampering
 * - Keys generated on one instance cannot be used on another (including forks)
 * - Database tracking of all issued and redeemed keys
 */

import crypto from 'crypto';
import { getLicenseSigningSecret } from '@/lib/env';

// License tier configurations
export const LICENSE_TIERS = {
  premium: {
    name: 'Premium',
    maxCustomSources: 50,
    features: ['Custom RSS sources (50)', 'Priority support', 'Ad-free experience'],
  },
  pro: {
    name: 'Pro',
    maxCustomSources: -1, // Unlimited
    features: ['Unlimited custom RSS sources', 'Priority support', 'Ad-free experience', 'Early access to features'],
  },
} as const;

export type LicenseTier = keyof typeof LICENSE_TIERS;

/**
 * Generate an instance ID from the signing secret
 * This uniquely identifies this FeedCentral instance
 */
export function getInstanceId(): string {
  const secret = getLicenseSigningSecret();
  // Use first 16 chars of SHA256 hash as instance ID
  return crypto.createHash('sha256').update(secret).digest('hex').substring(0, 16);
}

/**
 * Generate a random license key in format: FEED-XXXX-XXXX-XXXX-XXXX
 */
function generateKeyCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous chars (0,O,1,I)
  const segments = 4;
  const segmentLength = 4;
  
  const parts: string[] = [];
  for (let i = 0; i < segments; i++) {
    let segment = '';
    for (let j = 0; j < segmentLength; j++) {
      segment += chars[Math.floor(Math.random() * chars.length)];
    }
    parts.push(segment);
  }
  
  return `FEED-${parts.join('-')}`;
}

/**
 * Generate HMAC signature for a license key
 * This binds the key to this specific instance
 */
function signLicenseKey(key: string, instanceId: string, tier: string, duration: number): string {
  const secret = getLicenseSigningSecret();
  const data = `${key}:${instanceId}:${tier}:${duration}`;
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

/**
 * Verify a license key signature
 */
export function verifyLicenseSignature(
  key: string,
  instanceId: string,
  tier: string,
  duration: number,
  signature: string
): boolean {
  const expectedSignature = signLicenseKey(key, instanceId, tier, duration);
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

/**
 * Generate a new license key
 */
export interface GenerateLicenseOptions {
  tier: LicenseTier;
  duration: number; // Duration in days
  issuedBy: string; // Admin user ID
  notes?: string;
}

export interface LicenseKeyData {
  key: string;
  tier: string;
  duration: number;
  instanceId: string;
  signature: string;
  issuedBy: string;
  notes?: string;
}

export function generateLicenseKey(options: GenerateLicenseOptions): LicenseKeyData {
  const { tier, duration, issuedBy, notes } = options;
  
  // Validate inputs
  if (!LICENSE_TIERS[tier]) {
    throw new Error(`Invalid license tier: ${tier}`);
  }
  
  if (duration <= 0) {
    throw new Error('License duration must be positive');
  }
  
  // Generate key components
  const key = generateKeyCode();
  const instanceId = getInstanceId();
  const signature = signLicenseKey(key, instanceId, tier, duration);
  
  return {
    key,
    tier,
    duration,
    instanceId,
    signature,
    issuedBy,
    notes,
  };
}

/**
 * Validate a license key structure (format check only)
 */
export function isValidKeyFormat(key: string): boolean {
  const pattern = /^FEED-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/;
  return pattern.test(key);
}

/**
 * Format license key for display (with proper spacing)
 */
export function formatLicenseKey(key: string): string {
  return key.toUpperCase().replace(/\s/g, '');
}

/**
 * Calculate expiration date from redemption
 */
export function calculateExpirationDate(redemptionDate: Date, durationDays: number): Date {
  const expiration = new Date(redemptionDate);
  expiration.setDate(expiration.getDate() + durationDays);
  return expiration;
}

/**
 * Check if a license is expired
 */
export function isLicenseExpired(expiresAt: Date | null): boolean {
  if (!expiresAt) return false;
  return new Date() > expiresAt;
}

/**
 * Get max custom sources for a tier
 */
export function getMaxCustomSources(tier: string): number {
  if (tier === 'pro') return -1; // Unlimited
  if (tier === 'premium') return 50;
  return 10; // Free tier
}
