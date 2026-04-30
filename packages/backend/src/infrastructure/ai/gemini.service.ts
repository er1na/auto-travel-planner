import { GoogleGenAI } from '@google/genai';
import { IAIService } from '../../domain/interfaces/ai-service.interface';
import { ItineraryRequest, BudgetLevel } from '../../domain/entities/travel-plan.entity';

const BUDGET_LABELS: Record<BudgetLevel, string> = {
  economy: '節約旅行（低予算）',
  moderate: '普通（中程度の予算）',
  luxury: 'ぜいたく旅行（高予算）',
};

function calcNights(startDate: string, endDate: string): number {
  const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

export class GeminiService implements IAIService {
  async *streamItinerary(request: ItineraryRequest): AsyncGenerator<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? '' });
    const nights = calcNights(request.startDate, request.endDate);
    const days = nights + 1;

    const prompt = `以下の条件で旅のしおりを作成してください。

## 旅行情報
- 目的地: ${request.destination}
- 旅行期間: ${request.startDate} 〜 ${request.endDate}（${nights}泊${days}日）
- 旅行人数: ${request.numberOfPeople}名
- 予算: ${BUDGET_LABELS[request.budget]}
- 希望する交通手段: ${request.transportationModes.join('、')}
- 興味・関心: ${request.interests.join('、')}
${request.additionalNotes ? `- その他のご要望: ${request.additionalNotes}` : ''}

## しおりに含める内容
各日のスケジュールを時系列で詳しく記載してください。

- 各スポットの訪問時間と所要時間
- おすすめの食事場所（朝食・昼食・夕食）
- 移動手段と所要時間
- 各スポットの料金目安
- 旅のヒントや注意事項
- 総費用の目安

マークダウン形式で、実用的で魅力的なしおりを作成してください。`;

    const response = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
      config: {
        systemInstruction:
          'あなたは経験豊富な日本の旅行プランナーです。旅行者の条件に合わせた詳細で実用的な旅のしおりを作成してください。地域の特性を活かし、隠れた名所や地元グルメも積極的に紹介してください。',
      },
    });

    for await (const chunk of response) {
      const text = chunk.text;
      if (text) yield text;
    }
  }
}
