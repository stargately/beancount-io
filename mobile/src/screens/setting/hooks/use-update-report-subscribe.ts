import { useUpdateReportSubscribeMutation } from "@/generated-graphql/graphql";

export const useUpdateReportSubscribeToRemote = () => {
  const [mutate, { error, data }] = useUpdateReportSubscribeMutation();
  return { error, mutate, data };
};
