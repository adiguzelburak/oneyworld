"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { PromptFormState } from "@/lib/types/prompt-form";

export async function createPrompt(
  _prev: PromptFormState,
  formData: FormData
): Promise<PromptFormState> {
  const titleRaw = formData.get("title");
  const contentRaw = formData.get("content");

  const title =
    typeof titleRaw === "string" ? titleRaw.trim() || null : null;
  const content = typeof contentRaw === "string" ? contentRaw.trim() : "";

  if (!content) {
    return { error: "Prompt metni boş olamaz." };
  }

  if (content.length > 32_000) {
    return { error: "Prompt çok uzun (en fazla 32.000 karakter)." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("ai_prompts").insert({
    title,
    content,
  });

  if (error) {
    return {
      error:
        error.message ||
        "Kayıt başarısız. Supabase tablosu ve RLS politikalarını kontrol edin.",
    };
  }

  revalidatePath("/");
  return { success: true };
}
