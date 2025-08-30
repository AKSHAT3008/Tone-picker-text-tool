import axios from 'axios';
import { ApiError, TonePosition } from '../types';

const BACKEND_API_URL = process.env.NODE_ENV === 'production' 
  ? '/api/transform-text'
  : 'http://localhost:3001/api/transform-text';

// Simple in-memory cache
const cache = new Map<string, string>();

export class MistralApiService {
  private static getToneDescription(tone: TonePosition): string {
    const { x, y } = tone;
    
    // Handle all 9 positions in the 3x3 grid
    // Row 1 (y = -1)
    if (x === -1 && y === -1) return 'professional and direct';
    if (x === 0 && y === -1) return 'professional and formal';
    if (x === 1 && y === -1) return 'formal and structured';
    
    // Row 2 (y = 0)
    if (x === -1 && y === 0) return 'balanced mix of professional and friendly tones';
    if (x === 0 && y === 0) return 'neutral and balanced';
    if (x === 1 && y === 0) return 'balanced mix of formal and casual styles';
    
    // Row 3 (y = 1)
    if (x === -1 && y === 1) return 'friendly and approachable';
    if (x === 0 && y === 1) return 'balanced mix of friendly and casual tones';
    if (x === 1 && y === 1) return 'casual and relaxed';
    
    // Fallback for any other positions (shouldn't happen)
    return 'neutral and balanced';
  }

  private static generateCacheKey(text: string, tone: TonePosition): string {
    return `${text.substring(0, 100)}_${tone.x}_${tone.y}`;
  }

  static async transformText(text: string, tone: TonePosition): Promise<string> {
    if (!text.trim()) {
      throw new Error('Text cannot be empty');
    }

    const cacheKey = this.generateCacheKey(text, tone);
    
    // Check cache first
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!;
    }

    try {
      console.log('Making API request to:', BACKEND_API_URL);
      const response = await axios.post(
        BACKEND_API_URL,
        { text, tone },
        { 
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('API response:', response.data);
      const transformedText = (response.data as { transformedText: string }).transformedText;
      
      if (!transformedText) {
        throw new Error('No transformed text received from API');
      }
      
      // Cache the result
      cache.set(cacheKey, transformedText);
      
      return transformedText;
    } catch (error: any) {
      console.error('Backend API Error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response) {
        const apiError: ApiError = {
          message: error.response.data?.error || `API error: ${error.response.status}`,
          status: error.response.status
        };
        throw apiError;
      } else if (error.request) {
        throw new Error('Network error: Unable to connect to server');
      } else {
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  }

  static clearCache(): void {
    cache.clear();
  }
}
