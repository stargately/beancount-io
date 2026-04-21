import { useEffect } from "react";
import { analytics } from "@/common/analytics";

/**
 * A hook that tracks page view analytics when a component mounts.
 * This replaces the common boilerplate pattern:
 *
 * ```typescript
 * useEffect(() => {
 *   async function init() {
 *     await analytics.track("page_view_xxx", {});
 *   }
 *   init();
 * }, []);
 * ```
 *
 * @param pageName - The name of the page to track (will be prefixed with "page_view_")
 * @param props - Optional additional properties to include in the analytics event
 */
export const usePageView = (
  pageName: string,
  props: Record<string, string | number | boolean> = {},
): void => {
  useEffect(() => {
    analytics.track(`page_view_${pageName}`, props);
  }, []);
};
