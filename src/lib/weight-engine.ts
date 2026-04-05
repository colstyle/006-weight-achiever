export interface WeightEntry {
  id: string;
  date: string;
  weight: number;      // kg
  bodyFat?: number;    // %
  note?: string;
  isAchieved?: boolean; // Whether this drop was a "辉煌一跃"
}

export async function parseWeightInput(
  text: string,
  apiKey: string,
  endpoint: string,
  model: string
): Promise<Partial<WeightEntry>[]> {
  if (!apiKey) throw new Error("API Key is required");

  // Get current date for context
  const today = new Date().toISOString().split('T')[0];

  const prompt = `
你是一个专业的健身数据解析助手。请从用户输入的文字、笔记或多行记录中，提取**所有**日期、体重和体脂数据。
规则：
1. 如果用户提到“斤”，请除以 2 转换为 kg。
2. 返回 JSON 格式，必须是一个数组对象：[{"weight": number, "bodyFat": number|null, "date": "YYYY-MM-DD", "note": "string"}, ...]
3. 如果其中某行未提及日期，请根据前后文推断，或默认使用：${today}
4. 你必须提取文本中出现的所有记录。

用户输入：
"${text}"
`;

  try {
    const response = await fetch(`${endpoint.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.1,
      }),
    });

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);
    
    // Ensure it's an array (handle some LLMs returning an object with a records key)
    const records = Array.isArray(content) ? content : (content.records || [content]);

    return records.map((r: any) => ({
      weight: r.weight,
      bodyFat: r.bodyFat || undefined,
      date: r.date || today,
      note: r.note || "",
    }));
  } catch (error) {
    console.error("AI Parse Error:", error);
    // Basic regex fallback for common patterns if AI fails
    const weightMatch = text.match(/(\d+\.?\d*)\s*(kg|斤)/i);
    if (weightMatch) {
      let val = parseFloat(weightMatch[1]);
      if (weightMatch[2] === "斤") val /= 2;
      return [{ weight: val, date: today }];
    }
    throw error;
  }
}

/**
 * Psychological Achievement Logic
 * Returns a modified "visual progress" scale factor
 */
export function calculateAchievementFactor(entries: WeightEntry[]): number {
  if (entries.length < 2) return 1.0;
  
  const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const last = sorted[sorted.length - 1];
  const prev = sorted[sorted.length - 2];
  
  const diff = prev.weight - last.weight;
  
  if (diff > 0) {
    // If dropped even a little, return a high factor for UI scaling
    // 0.1kg drop -> 10 achievement points
    return Math.max(1, diff * 10);
  }
  
  return 0;
}
