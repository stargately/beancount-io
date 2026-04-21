import * as Sentry from "sentry-expo";
import { config } from "@/config";

if (config.sentryDsn) {
  Sentry.init({
    dsn: config.sentryDsn,
    enableInExpoDevelopment: true,
    debug: __DEV__,
  });
}
