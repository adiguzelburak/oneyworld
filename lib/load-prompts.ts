import { createClient } from "@/lib/supabase/server";
import type { AiPromptRow } from "@/lib/types/ai-prompt";

/**
 * Önce FastAPI `/api/prompts` (Python) dener; build zamanı veya API kapalıysa Supabase’e düşer.
 */
export async function loadPromptsForHome(): Promise<{
  prompts: AiPromptRow[];
  fetchError?: string;
}> {
  const baseUrl =
    process.env.VERCEL_URL != null
      ? `https://${process.env.VERCEL_URL}`
      : `http://127.0.0.1:${process.env.PORT ?? 3000}`;

  try {
    const res = await fetch(`${baseUrl}/api/prompts`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = (await res.json()) as AiPromptRow[];
    return { prompts: data };
  } catch {
    // next build sırasında localhost API yok; yerel `pnpm dev` + `py:dev` eksik vb.
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ai_prompts")
    .select("id, title, content, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return {
      prompts: [],
      fetchError:
        "Promptlar yüklenemedi. `.env.local` içindeki Supabase değişkenlerini ve `ai_prompts` tablosunu kontrol edin.",
    };
  }

  return { prompts: (data as AiPromptRow[] | null) ?? [] };
}
