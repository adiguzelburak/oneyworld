"use client";

import {
  Button,
  Description,
  FieldError,
  Label,
  Spinner,
  Surface,
  TextArea,
  TextField,
} from "@heroui/react";
import { useActionState, useEffect, useRef } from "react";

import { createPrompt } from "@/app/actions/prompts";
import type { PromptFormState } from "@/lib/types/prompt-form";

const initialPromptFormState: PromptFormState = {};

export function PromptForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState<
    PromptFormState,
    FormData
  >(createPrompt, initialPromptFormState);

  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state.success]);

  return (
    <Surface className="w-full max-w-2xl rounded-3xl p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-foreground text-lg font-semibold">
          Yeni prompt kaydet
        </h2>
        <p className="text-muted mt-1 text-sm">
          Metni girin; kayıt Supabase veritabanına yazılır.
        </p>
      </div>

      <form
        ref={formRef}
        action={formAction}
        className="flex flex-col gap-5"
      >
        <TextField fullWidth name="title" variant="secondary">
          <Label>Başlık (isteğe bağlı)</Label>
          <TextArea
            className="min-h-12 w-full resize-y"
            placeholder="Örn. Ürün açıklaması taslağı"
            rows={2}
          />
          <Description>Kısa bir etiket; boş bırakılabilir.</Description>
        </TextField>

        <TextField
          fullWidth
          isRequired
          isInvalid={Boolean(state.error)}
          name="content"
          variant="secondary"
        >
          <Label>Prompt</Label>
          <TextArea
            className="min-h-36 w-full resize-y"
            placeholder="AI için tam prompt metnini buraya yazın…"
            rows={8}
          />
          {state.error ? (
            <FieldError>{state.error}</FieldError>
          ) : (
            <Description>En fazla 32.000 karakter.</Description>
          )}
        </TextField>

        <Button
          className="self-start"
          isPending={isPending}
          type="button"
          onPress={() => {
            const el = formRef.current;
            if (!el) return;
            formAction(new FormData(el));
          }}
        >
          {({ isPending: pending }) => (
            <>
              {pending ? (
                <Spinner className="size-4" color="current" size="sm" />
              ) : null}
              {pending ? "Kaydediliyor…" : "Kaydet"}
            </>
          )}
        </Button>
      </form>
    </Surface>
  );
}
