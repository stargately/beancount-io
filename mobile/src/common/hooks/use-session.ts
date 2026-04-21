import { useReactiveVar } from "@apollo/client";
import { sessionVar } from "@/common/vars";

export const useSession = () => {
  const session = useReactiveVar(sessionVar);
  if (!session) {
    throw new Error("Session not found");
  }
  return session;
};
