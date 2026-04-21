import { Scope, TranslateOptions } from "i18n-js";

export type TFuncType = (scope: Scope, options?: TranslateOptions) => string;

export type SetStateFuncType = (locale: string) => void;

export interface ScreenProps {
  t: TFuncType;
  locale: string;
  setLocale: SetStateFuncType;
}
