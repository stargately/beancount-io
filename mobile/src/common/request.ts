import { config } from "@/config";
import Constants from "expo-constants";

export const headers: { [key: string]: string } = {
  "x-app-id": config.project,
  "x-app-version": Constants.nativeAppVersion,
};

export const getEndpoint = (path: string) => `${config.serverUrl}${path}`;
