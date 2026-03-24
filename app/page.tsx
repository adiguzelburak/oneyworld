import { PromptForm } from "@/app/components/prompt-form";
import { PromptList } from "@/app/components/prompt-list";
import { loadPromptsForHome } from "@/lib/load-prompts";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { prompts, fetchError } = await loadPromptsForHome();

  return (
    <div className="bg-background text-foreground flex min-h-full flex-1 flex-col">
      <header className="border-border/60 border-b px-4 py-6 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              AI Prompt Kayıt
            </h1>
            <p className="text-muted mt-1 text-sm">
              Promptlarınızı kaydedin ve geçmiş kayıtlarınızı görüntüleyin.
            </p>
          </div>
          <a
            className="text-muted hover:text-foreground text-sm underline underline-offset-4"
            href="/api/docs"
            rel="noreferrer"
            target="_blank"
          >
            FastAPI dokümantasyonu (Swagger)
          </a>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-4 py-10 sm:px-8">
        <PromptForm />
        <section className="flex flex-col gap-4">
          <h2 className="text-foreground text-base font-semibold">
            Kayıtlı promptlar
          </h2>
          <p className="text-muted text-xs">
            Liste verisi önce Python uç noktasından (
            <code className="text-foreground/90">GET /api/prompts</code>
            ) okunur; API yoksa Supabase doğrudan kullanılır.
          </p>
          <PromptList fetchError={fetchError} prompts={prompts} />
        </section>
      </main>
    </div>
  );
}
