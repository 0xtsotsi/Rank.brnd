import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://ce970e832683f2a35589782817b9edce@o45092647706236416516.ingest.sentry.io/451082553164800",
  environment: process.env.NODE_ENV === "production" ? "production" : "development",
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay({
      sessionSampleRate: 0.1,
    }),
    new Sentry.BrowserProfilingIntegration(),
  ],
  beforeSend(event, hint) {
    if (process.env.NODE_ENV === "development") {
      if (event.level !== "error") {
        return null;
      }
    }
    event.release = process.env.NEXT_PUBLIC_APP_VERSION || "0.1.0";
    event.tags = event.tags || [];
    event.tags.push(`env:${process.env.NODE_ENV}`);
    return event;
  },
});

export { Sentry };
export {
  startServerSpan,
  startServerTransaction,
} from './sentry-helpers';
