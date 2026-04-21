import { config } from "@/config";
import { ExpoMixpanelAnalytics } from "@/common/expo-mixpanel-analytics";

class MyAnalytics {
  mixpanel?: ExpoMixpanelAnalytics;

  constructor() {
    if (config.analytics.mixpanelProjectToken) {
      this.mixpanel = new ExpoMixpanelAnalytics(
        config.analytics.mixpanelProjectToken,
      );
    }
  }

  identify(id: string): void {
    if (this.mixpanel) {
      this.mixpanel.identify(id);
    }
  }

  async track(
    name: string,
    props: Record<string, string | number | boolean>,
  ): Promise<void> {
    if (__DEV__) {
      return;
    }

    if (this.mixpanel) {
      this.mixpanel.track(name, props);
    }
  }

  peopleDeleteUser(): void {
    if (this.mixpanel) {
      this.mixpanel.people_delete_user();
    }
  }
}

const analytics = new MyAnalytics();

export { analytics };
