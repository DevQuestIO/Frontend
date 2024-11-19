// src/services/authService.ts
import pool from '../db/connect';
import { authenticator } from 'otplib';
import crypto from 'crypto';

// Add type definitions
type TwoFactorAuth = {
  secret: string;
  backup_codes: string[];
};

type QueryResult = {
  rows: TwoFactorAuth[];
};

export const authService = {
  async verify2FAToken(userId: string, token: string): Promise<boolean> {
    const query = `
      SELECT secret FROM two_factor_auth
      WHERE user_id = $1 AND is_enabled = true
    `;
    
    const result = await pool.query(query, [userId]) as QueryResult;
    if (!result.rows[0]) return false;

    return authenticator.verify({
      token,
      secret: result.rows[0].secret
    });
  },

  async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    const hashedCode = crypto.createHash('sha256').update(code).digest('hex');
    
    const query = `
      SELECT backup_codes FROM two_factor_auth
      WHERE user_id = $1
    `;
    
    const result = await pool.query(query, [userId]) as QueryResult;
    if (!result.rows[0]) return false;

    const backupCodes = result.rows[0].backup_codes;
    const isValid = backupCodes.includes(hashedCode);

    if (isValid) {
      // Remove used backup code with explicit type
      const updatedCodes = backupCodes.filter((code: string) => code !== hashedCode);
      await pool.query(
        'UPDATE two_factor_auth SET backup_codes = $1 WHERE user_id = $2',
        [updatedCodes, userId]
      );
    }

    return isValid;
  }
};