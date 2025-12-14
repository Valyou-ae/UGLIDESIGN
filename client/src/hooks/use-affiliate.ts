import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { affiliateApi } from "@/lib/api";

export function useAffiliate() {
  const queryClient = useQueryClient();

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["affiliate", "stats"],
    queryFn: affiliateApi.getStats,
  });

  const { data: withdrawals, isLoading: isLoadingWithdrawals } = useQuery({
    queryKey: ["affiliate", "withdrawals"],
    queryFn: affiliateApi.getWithdrawals,
  });

  const withdrawMutation = useMutation({
    mutationFn: affiliateApi.withdraw,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliate"] });
    },
  });

  return {
    totalEarnings: stats?.totalEarnings || 0,
    pendingPayout: stats?.pendingPayout || 0,
    activeReferrals: stats?.activeReferrals || 0,
    commissions: stats?.commissions || [],
    referredUsers: stats?.referredUsers || [],
    withdrawals: withdrawals?.withdrawals || [],
    isLoadingStats,
    isLoadingWithdrawals,
    withdraw: withdrawMutation.mutateAsync,
    isWithdrawing: withdrawMutation.isPending,
  };
}
