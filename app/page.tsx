import { PromptForm } from "@/app/components/prompt-form";
import { PromptList } from "@/app/components/prompt-list";
import { createClient } from "@/lib/supabase/server";
import type { AiPromptRow } from "@/lib/types/ai-prompt";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ai_prompts")
    .select("id, title, content, created_at")
    .order("created_at", { ascending: false });

  let prompts: AiPromptRow[] = (data as AiPromptRow[] | null) ?? [];
  let fetchError: string | undefined;

  if (error) {
    prompts = [];
    fetchError =
      "Promptlar yüklenemedi. `.env.local` içinde Supabase değişkenlerini ve `ai_prompts` tablosunu kontrol edin.";
  }

  return (
    <div className="bg-background text-foreground flex min-h-full flex-1 flex-col">
      <header className="border-border/60 border-b px-4 py-6 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            AI Prompt Kayıt
          </h1>
          <p className="text-muted mt-1 text-sm">
            Promptlarınızı kaydedin ve geçmiş kayıtlarınızı görüntüleyin.
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-4 py-10 sm:px-8">
        <PromptForm />
        <section className="flex flex-col gap-4">
          <h2 className="text-foreground text-base font-semibold">
            Kayıtlı promptlar
          </h2>
          <PromptList fetchError={fetchError} prompts={prompts} />
        </section>
      </main>
    </div>
  );
}
