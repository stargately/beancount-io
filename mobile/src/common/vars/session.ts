import { createPersistentVar } from "@/common/apollo/persistent-var";

export type Session = {
  userId: string;
  authToken: string;
};

export const [sessionVar, loadSession] = createPersistentVar<Session | null>(
  "session",
  null,
);
