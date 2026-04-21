import { onError } from "@apollo/client/link/error";
import { sessionVar } from "@/common/vars";
import { router } from "expo-router";

export const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions && err.extensions.code === "UNAUTHENTICATED") {
        sessionVar(null);
        router.replace("/auth/welcome");
      }
    }
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});
