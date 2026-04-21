export class MockExpoMixpanelAnalytics {
  static instances: MockExpoMixpanelAnalytics[] = [];

  static reset(): void {
    MockExpoMixpanelAnalytics.instances = [];
  }

  token: string;

  identifyCalls: Array<string | undefined> = [];

  trackCalls: Array<{ name: string; props: Record<string, unknown> }> = [];

  constructor(token: string) {
    this.token = token;
    MockExpoMixpanelAnalytics.instances.push(this);
  }

  identify(id?: string): void {
    this.identifyCalls.push(id);
  }

  track(name: string, props: Record<string, unknown>): void {
    this.trackCalls.push({ name, props });
  }
}

export { MockExpoMixpanelAnalytics as ExpoMixpanelAnalytics };
