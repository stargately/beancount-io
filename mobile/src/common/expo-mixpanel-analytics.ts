import { Platform, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Buffer } from "buffer";

const { width, height } = Dimensions.get("window");

const MIXPANEL_API_URL = "https://api.mixpanel.com";
const ASYNC_STORAGE_KEY = "mixpanel:super:props";
const isIosPlatform = Platform.OS === "ios";

type MixpanelEventProperties = Record<
  string,
  string | number | boolean | undefined | null
>;

interface QueuedEvent {
  name: string;
  props?: MixpanelEventProperties;
  sent?: boolean;
}

export class ExpoMixpanelAnalytics {
  ready = false;

  token: string;

  userId?: string | null;

  clientId?: string;

  userAgent?: string | null;

  appName?: string;

  appId?: string;

  appVersion?: string;

  screenSize?: string;

  deviceName?: string;

  platform?: string;

  model?: string;

  osVersion: string | number;

  queue: QueuedEvent[];

  superProps: MixpanelEventProperties = {};

  constructor(token: string) {
    this.ready = false;
    this.queue = [];

    this.token = token;
    this.userId = null;
    this.clientId = Constants.deviceId;
    this.osVersion = Platform.Version;

    Constants.getWebViewUserAgentAsync().then((userAgent) => {
      this.userAgent = userAgent;
      this.appName = Constants.expoConfig?.name;
      this.appId = Constants.expoConfig?.slug;
      this.appVersion = Constants.expoConfig?.version;
      this.screenSize = `${width}x${height}`;
      this.deviceName = Constants.deviceName;
      if (isIosPlatform && Constants.platform && Constants.platform.ios) {
        this.platform = Constants.platform.ios.platform;
        this.model = Constants.platform.ios.model ?? undefined;
      } else {
        this.platform = "android";
      }

      AsyncStorage.getItem(ASYNC_STORAGE_KEY, (_, result) => {
        if (result) {
          try {
            this.superProps = JSON.parse(result) || {};
          } catch {}
        }

        this.ready = true;
        this.identify(this.clientId);
        this._flush();
      });
    });
  }

  register(props: MixpanelEventProperties) {
    this.superProps = props;
    try {
      AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(props));
    } catch {}
  }

  track(name: string, props?: MixpanelEventProperties) {
    this.queue.push({
      name,
      props,
    });
    this._flush();
  }

  identify(userId?: string) {
    this.userId = userId;
  }

  reset() {
    this.identify(this.clientId);
    try {
      AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify({}));
    } catch {}
  }

  people_set(props: Record<string, string>) {
    this._people("set", props);
  }

  people_set_once(props: Record<string, string>) {
    this._people("set_once", props);
  }

  people_unset(props: Record<string, string>) {
    this._people("unset", props);
  }

  people_increment(props: Record<string, string>) {
    this._people("add", props);
  }

  people_append(props: Record<string, string>) {
    this._people("append", props);
  }

  people_union(props: Record<string, string>) {
    this._people("union", props);
  }

  people_delete_user() {
    this._people("delete", "");
  }

  // ===========================================================================================

  _flush() {
    if (this.ready) {
      while (this.queue.length) {
        const event = this.queue.pop();
        if (event) {
          this._pushEvent(event).then(() => {
            event.sent = true;
          });
        }
      }
    }
  }

  _people(operation: string, props: string | Record<string, string>) {
    if (this.userId) {
      const data = {
        $token: this.token,
        $distinct_id: this.userId,
      } as Record<string, string | Record<string, string>>;
      data[`$${operation}`] = props;

      this._pushProfile(data);
    }
  }

  _pushEvent(event: QueuedEvent) {
    const data = {
      event: event.name,
      properties: {
        ...(event.props || {}),
        ...this.superProps,
      },
    };
    if (this.userId) {
      data.properties.distinct_id = this.userId;
    }
    data.properties.token = this.token;
    data.properties.user_agent = this.userAgent;
    data.properties.app_name = this.appName;
    data.properties.app_id = this.appId;
    data.properties.app_version = this.appVersion;
    data.properties.screen_size = this.screenSize;
    data.properties.client_id = this.clientId;
    data.properties.device_name = this.deviceName;
    if (this.platform) {
      data.properties.platform = this.platform;
    }
    if (this.model) {
      data.properties.model = this.model;
    }
    if (this.osVersion) {
      data.properties.os_version = this.osVersion;
    }

    const buffer = Buffer.from(JSON.stringify(data)).toString("base64");

    return fetch(`${MIXPANEL_API_URL}/track/?data=${buffer}`);
  }

  _pushProfile(data: Record<string, string | Record<string, string>>) {
    return fetch(
      `${MIXPANEL_API_URL}/engage/?data=${Buffer.from(
        JSON.stringify(data),
      ).toString("base64")}`,
    );
  }
}
