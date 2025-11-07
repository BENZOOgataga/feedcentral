/**
 * Two-Factor Authentication Utilities
 * Handles TOTP generation, verification, and QR code creation
 */

import * as OTPAuth from 'otpauth';
import QRCode from 'qrcode';

/**
 * Generate a new TOTP secret for a user
 */
export function generateTOTPSecret(email: string, issuer: string = 'FeedCentral'): {
  secret: string;
  uri: string;
} {
  const totp = new OTPAuth.TOTP({
    issuer,
    label: email,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
  });

  return {
    secret: totp.secret.base32,
    uri: totp.toString(),
  };
}

/**
 * Verify a TOTP code against a secret
 * Allows for time drift of +/- 1 period (30 seconds)
 */
export function verifyTOTPCode(secret: string, code: string): boolean {
  try {
    const totp = new OTPAuth.TOTP({
      secret: OTPAuth.Secret.fromBase32(secret),
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
    });

    // Check current time and +/- 1 period for clock drift
    const delta = totp.validate({
      token: code,
      window: 1, // Allow 1 period before and after
    });

    // delta is null if invalid, or the time step difference if valid
    return delta !== null;
  } catch (error) {
    console.error('TOTP verification error:', error);
    return false;
  }
}

/**
 * Generate a QR code data URL for a TOTP URI
 */
export async function generateQRCode(uri: string): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(uri, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return dataUrl;
  } catch (error) {
    console.error('QR code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generate backup codes for account recovery
 * Returns 10 random 8-character codes
 */
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  for (let i = 0; i < count; i++) {
    let code = '';
    for (let j = 0; j < 8; j++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Format as XXXX-XXXX
    codes.push(code.slice(0, 4) + '-' + code.slice(4));
  }
  
  return codes;
}
