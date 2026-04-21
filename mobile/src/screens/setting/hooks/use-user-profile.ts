import { useUserProfileQuery } from "@/generated-graphql/graphql";

export const useUserProfile = (userId: string) => {
  const { data, error, loading } = useUserProfileQuery({
    variables: { userId },
  });
  return {
    email: data?.userProfile?.email,
    emailReportStatus: data?.userProfile?.emailReportStatus,
    error,
    loading,
  };
};
