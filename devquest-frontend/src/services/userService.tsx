// src/services/userService.ts
import pool from '../db/connect';
import crypto from 'crypto';

export interface User {
  id: string;
  keycloak_id: string;
  username: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

export const userService = {
  async createUser(keycloakId: string, username: string, email: string): Promise<User> {
    const query = `
      INSERT INTO users (keycloak_id, username, email)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const result = await pool.query(query, [keycloakId, username, email]);
    return result.rows[0];
  },

  async getUserByKeycloakId(keycloakId: string): Promise<User | null> {
    const query = `
      SELECT * FROM users
      WHERE keycloak_id = $1
    `;
    
    const result = await pool.query(query, [keycloakId]);
    return result.rows[0] || null;
  },

  async enable2FA(userId: string, secret: string): Promise<void> {
    const backupCodes = Array.from({ length: 10 }, () => 
      crypto.randomBytes(4).toString('hex')
    );

    const hashedBackupCodes = backupCodes.map(code => 
      crypto.createHash('sha256').update(code).digest('hex')
    );

    const query = `
      INSERT INTO two_factor_auth (user_id, secret, is_enabled, backup_codes)
      VALUES ($1, $2, true, $3)
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        secret = EXCLUDED.secret,
        is_enabled = true,
        backup_codes = EXCLUDED.backup_codes
    `;

    await pool.query(query, [userId, secret, hashedBackupCodes]);
  }
};