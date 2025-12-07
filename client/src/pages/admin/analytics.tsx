import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Users, Image, Zap, AlertCircle } from "lucide-react";

interface AnalyticsData {
  totalGenerations: number;
  generationsThisWeek: number;
  apiCalls: number;
  apiCallsChange: number;
  newUsersLast7Days: number;
  newUsersChange: number;
  growthRate: number;
}

export default function AdminAnalytics() {
  const { data: analytics, isLoading, error } = useQuery<AnalyticsData>({
    queryKey: ["/api/admin/analytics"],
    queryFn: async () => {
      const response = await fetch("/api/admin/analytics", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
  });

  return (
    <AdminLayout title="Analytics" description="Platform usage and performance metrics">
      <div className="space-y-6" data-testid="admin-analytics">
        {error ? (
          <div className="flex items-center justify-center py-8 text-destructive gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>Failed to load analytics</span>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card data-testid="card-total-generations">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Generations</CardTitle>
                  <Image className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{(analytics?.totalGenerations || 0).toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">+{(analytics?.generationsThisWeek || 0).toLocaleString()} this week</p>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card data-testid="card-api-calls">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">API Calls</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{(analytics?.apiCalls || 0).toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">+{analytics?.apiCallsChange || 0}% from last week</p>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card data-testid="card-new-users">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Users (7d)</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{analytics?.newUsersLast7Days || 0}</div>
                      <p className="text-xs text-muted-foreground">+{analytics?.newUsersChange || 0} from last week</p>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card data-testid="card-growth">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{analytics?.growthRate || 0}%</div>
                      <p className="text-xs text-muted-foreground">Month over month</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card data-testid="card-usage-chart">
                <CardHeader>
                  <CardTitle>Usage Overview</CardTitle>
                  <CardDescription>Platform usage over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
                  Chart visualization placeholder
                </CardContent>
              </Card>
              <Card data-testid="card-revenue-chart">
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                  <CardDescription>Monthly recurring revenue</CardDescription>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
                  Chart visualization placeholder
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
