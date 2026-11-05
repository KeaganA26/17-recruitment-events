"use client";

import Script from "next/script";
import { forwardRef, useImperativeHandle, useRef } from "react";

type TurnstileWidgetId = string;

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => TurnstileWidgetId;
  reset: (widgetId: TurnstileWidgetId) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export type TurnstileHandle = {
  reset: () => void;
};

type TurnstileFieldProps = {
  action: string;
  onToken: (token: string) => void;
};

export const TurnstileField = forwardRef<TurnstileHandle, TurnstileFieldProps>(function TurnstileField(
  { action, onToken },
  ref,
) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<TurnstileWidgetId | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  useImperativeHandle(ref, () => ({
    reset() {
      if (widgetId.current !== null && window.turnstile) {
        window.turnstile.reset(widgetId.current);
      }
      onToken("");
    },
  }));

  function renderTurnstile() {
    if (!container.current || widgetId.current !== null || !window.turnstile || !siteKey) return;
    widgetId.current = window.turnstile.render(container.current, {
      sitekey: siteKey,
      action,
      callback: onToken,
      "expired-callback": () => onToken(""),
      "error-callback": () => onToken(""),
    });
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={renderTurnstile}
      />
      <div ref={container} />
    </>
  );
});
