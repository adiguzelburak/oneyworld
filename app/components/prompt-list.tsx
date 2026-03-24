import { Card } from "@heroui/react";

import type { AiPromptRow } from "@/lib/types/ai-prompt";

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "medium",
  timeStyle: "short",
});

type PromptListProps = {
  prompts: AiPromptRow[];
  fetchError?: string;
};

export function PromptList({ prompts, fetchError }: PromptListProps) {
  if (fetchError) {
    return (
      <div className="border-danger/30 bg-danger/5 text-danger rounded-2xl border px-4 py-3 text-sm">
        {fetchError}
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <p className="text-muted text-center text-sm">
        Henüz kayıtlı prompt yok. Yukarıdan ilk kaydınızı ekleyin.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {prompts.map((p) => (
        <li key={p.id}>
          <Card className="w-full" variant="default">
            <Card.Header>
              <Card.Title>
                {p.title?.trim() ? p.title : "Başlıksız prompt"}
              </Card.Title>
              <Card.Description>
                {dateFormatter.format(new Date(p.created_at))}
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <pre className="text-foreground max-h-64 overflow-auto whitespace-pre-wrap break-words font-sans text-sm leading-relaxed">
                {p.content}
              </pre>
            </Card.Content>
          </Card>
        </li>
      ))}
    </ul>
  );
}
