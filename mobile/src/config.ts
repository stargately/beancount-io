export const config = {
  project: require("../package.json").name,
  sentryDsn: "", // TODO
  analytics: {
    googleTid: "UA-143353833-1",
    mixpanelProjectToken: "", // TODO
  },
  serverUrl: process.env.EXPO_PUBLIC_SERVER_URL || "https://beancount.io/",
};
