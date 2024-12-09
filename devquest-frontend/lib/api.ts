// lib/api.ts

import { UserStats } from '../src/types';

export const API_BASE_URL = 'http://localhost:8000/api/v1';

export async function fetchUserStats(userId: string): Promise<UserStats> {
  const response = await fetch(`${API_BASE_URL}/stats/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user stats');
  }
  return response.json();
}