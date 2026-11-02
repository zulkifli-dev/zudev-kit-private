import { Button } from "@zulkifli-dev/ui/components/button";
import { Input } from "@zulkifli-dev/ui/components/input";
import { Textarea } from "@zulkifli-dev/ui/components/textarea";
import { type FormEvent, useId, useState } from "react";
import type { ContactFormValues } from "./types.js";

export interface ContactFormProps {
  onSubmit: (values: ContactFormValues) => void | Promise<void>;
  submitLabel?: string;
  sendingLabel?: string;
  nameLabel?: string;
  emailLabel?: string;
  messageLabel?: string;
  sentMessage?: string;
  errorMessage?: string;
}

export function ContactForm({
  onSubmit,
  submitLabel = "Send message",
  sendingLabel = "Sending…",
  nameLabel = "Name",
  emailLabel = "Email",
  messageLabel = "Message",
  sentMessage = "Your message has been sent.",
  errorMessage = "We couldn't send your message. Please try again.",
}: ContactFormProps) {
  const id = useId();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");

    try {
      await onSubmit({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        message: String(formData.get("message") ?? ""),
      });
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <label htmlFor={`${id}-name`} className="text-sm font-medium">
          {nameLabel}
        </label>
        <Input id={`${id}-name`} name="name" autoComplete="name" required />
      </div>
      <div className="grid gap-2">
        <label htmlFor={`${id}-email`} className="text-sm font-medium">
          {emailLabel}
        </label>
        <Input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor={`${id}-message`} className="text-sm font-medium">
          {messageLabel}
        </label>
        <Textarea id={`${id}-message`} name="message" required />
      </div>
      <Button type="submit" disabled={status === "sending"}>
        {status === "sending" ? sendingLabel : submitLabel}
      </Button>
      <p aria-live="polite" className="text-sm text-muted-foreground">
        {status === "sent" ? sentMessage : null}
        {status === "error" ? errorMessage : null}
      </p>
    </form>
  );
}
