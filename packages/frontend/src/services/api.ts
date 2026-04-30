import { ItineraryRequest } from '../types';

type ChunkCallback = (text: string) => void;
type DoneCallback = () => void;
type ErrorCallback = (message: string) => void;

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? '';

export async function generateItinerary(
  request: ItineraryRequest,
  onChunk: ChunkCallback,
  onDone: DoneCallback,
  onError: ErrorCallback,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/itinerary/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok || !response.body) {
    throw new Error('サーバーへの接続に失敗しました');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        try {
          const data = JSON.parse(line.slice(6)) as {
            type: string;
            content?: string;
            message?: string;
          };
          if (data.type === 'text' && data.content) {
            onChunk(data.content);
          } else if (data.type === 'done') {
            onDone();
          } else if (data.type === 'error') {
            onError(data.message ?? 'エラーが発生しました');
          }
        } catch {
          // incomplete JSON - skip
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
