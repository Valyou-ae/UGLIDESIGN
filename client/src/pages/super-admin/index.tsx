import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  ImageIcon, 
  Activity,
  DollarSign,
  TrendingUp,
  Crown,
  Shield,
  CreditCard,
  UserCheck,
  Percent,
  BarChart3,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

interface OverviewData {
  totalUsers: number;
  totalGenerations: number;
  activeUsersLast30Days: number;
  totalCommissions: number;
}

interface GrowthData {
  date: string;
  count: number;
}

interface CreatorData {
  userId: string;
  username: string | null;
  displayName: string | null;
  imageCount: number;
}

interface RoleData {
  role: string;
  count: number;
}

interface FeatureUsage {
  type: string;
  count: number;
}

interface SubscriptionStats {
  activeSubscriptions: number;
  totalSubscribers: number;
}

interface AffiliateData {
  userId: string;
  username: string | null;
  referralCount: number;
  totalEarnings: number;
}

interface RevenueData {
  date: string;
  amount: number;
}

interface RetentionData {
  weeklyRetention: number;
  monthlyRetention: number;
}

async function fetchOverview(): Promise<OverviewData> {
  const response = await fetch("/api/super-admin/overview", { credentials: "include" });
  if (!response.ok) throw new Error("Failed to fetch overview");
  return response.json();
}

async function fetchUserGrowth(days: number = 30): Promise<GrowthData[]> {
  const response = await fetch(`/api/super-admin/users/growth?days=${days}`, { credentials: "include" });
  if (!response.ok) throw new Error("Failed to fetch user growth");
  const data = await response.json();
  return data.growth;
}

async function fetchGenerationStats(days: number = 30): Promise<GrowthData[]> {
  const response = await fetch(`/api/super-admin/generations/stats?days=${days}`, { credentials: "include" });
  if (!response.ok) throw new Error("Failed to fetch generation stats");
  const data = await response.json();
  return data.stats;
}

async function fetchTopCreators(limit: number = 10): Promise<CreatorData[]> {
  const response = await fetch(`/api/super-admin/top-creators?limit=${limit}`, { credentials: "include" });
  if (!response.ok) throw new Error("Failed to fetch top creators");
  const data = await response.json();
  return data.creators;
}

async function fetchUsersByRole(): Promise<RoleData[]> {
  const response = await fetch("/api/super-admin/users/by-role", { credentials: "include" });
  if (!response.ok) throw new Error("Failed to fetch users by role");
  const data = await response.json();
  return data.roleStats;
}

async function fetchFeatureUsage(): Promise<FeatureUsage[]> {
  const response = await fetch("/api/super-admin/feature-usage", { credentials: "include" });
  if (!response.ok) throw new Error("Failed to fetch feature usage");
  const data = await response.json();
  return data.usage;
}

async function fetchSubscriptions(): Promise<SubscriptionStats> {
  const response = await fetch("/api/super-admin/subscriptions", { credentials: "include" });
  if (!response.ok) throw new Error("Failed to fetch subscriptions");
  return response.json();
}

async function fetchAffiliates(limit: number = 10): Promise<AffiliateData[]> {
  const response = await fetch(`/api/super-admin/affiliates?limit=${limit}`, { credentials: "include" });
  if (!response.ok) throw new Error("Failed to fetch affiliates");
  const data = await response.json();
  return data.affiliates;
}

async function fetchRevenue(days: number = 30): Promise<RevenueData[]> {
  const response = await fetch(`/api/super-admin/revenue?days=${days}`, { credentials: "include" });
  if (!response.ok) throw new Error("Failed to fetch revenue");
  const data = await response.json();
  return data.revenue;
}

async function fetchDailyActiveUsers(days: number = 30): Promise<GrowthData[]> {
  const response = await fetch(`/api/super-admin/daily-active-users?days=${days}`, { credentials: "include" });
  if (!response.ok) throw new Error("Failed to fetch DAU");
  const data = await response.json();
  return data.dau;
}

async function fetchRetention(): Promise<RetentionData> {
  const response = await fetch("/api/super-admin/retention", { credentials: "include" });
  if (!response.ok) throw new Error("Failed to fetch retention");
  return response.json();
}

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  colorClass: string;
  isLoading?: boolean;
  testId?: string;
}

function StatCard({ title, value, description, icon: Icon, colorClass, isLoading, testId }: StatCardProps) {
  if (isLoading) {
    return (
      <Card data-testid={testId}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-1" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden group hover:shadow-md transition-shadow" data-testid={testId}>
      <div className={cn("absolute inset-0 opacity-5", colorClass.replace("text-", "bg-"))} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", colorClass.replace("text-", "bg-") + "/10")}>
          <Icon className={cn("h-4 w-4", colorClass)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

const ROLE_COLORS: Record<string, string> = {
  user: "#22c55e",
  admin: "#3b82f6",
  moderator: "#f59e0b",
  super_admin: "#ef4444",
};

const FEATURE_COLORS: Record<string, string> = {
  image: "#3b82f6",
  mockup: "#22c55e",
  background_removal: "#f59e0b",
  bg_removed: "#f59e0b",
};

export default function SuperAdminDashboard() {
  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ["super-admin-overview"],
    queryFn: fetchOverview,
  });

  const { data: userGrowth, isLoading: userGrowthLoading } = useQuery({
    queryKey: ["super-admin-user-growth"],
    queryFn: () => fetchUserGrowth(30),
  });

  const { data: generationStats, isLoading: generationStatsLoading } = useQuery({
    queryKey: ["super-admin-generation-stats"],
    queryFn: () => fetchGenerationStats(30),
  });

  const { data: topCreators, isLoading: topCreatorsLoading } = useQuery({
    queryKey: ["super-admin-top-creators"],
    queryFn: () => fetchTopCreators(10),
  });

  const { data: roleStats, isLoading: roleStatsLoading } = useQuery({
    queryKey: ["super-admin-role-stats"],
    queryFn: fetchUsersByRole,
  });

  const { data: featureUsage, isLoading: featureUsageLoading } = useQuery({
    queryKey: ["super-admin-feature-usage"],
    queryFn: fetchFeatureUsage,
  });

  const { data: subscriptions, isLoading: subscriptionsLoading } = useQuery({
    queryKey: ["super-admin-subscriptions"],
    queryFn: fetchSubscriptions,
  });

  const { data: affiliates, isLoading: affiliatesLoading } = useQuery({
    queryKey: ["super-admin-affiliates"],
    queryFn: () => fetchAffiliates(10),
  });

  const { data: revenue, isLoading: revenueLoading } = useQuery({
    queryKey: ["super-admin-revenue"],
    queryFn: () => fetchRevenue(30),
  });

  const { data: dau, isLoading: dauLoading } = useQuery({
    queryKey: ["super-admin-dau"],
    queryFn: () => fetchDailyActiveUsers(30),
  });

  const { data: retention, isLoading: retentionLoading } = useQuery({
    queryKey: ["super-admin-retention"],
    queryFn: fetchRetention,
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-super-admin-title">Super Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Complete platform analytics and metrics</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={overview?.totalUsers?.toLocaleString() ?? 0}
            description="Registered platform users"
            icon={Users}
            colorClass="text-blue-500"
            isLoading={overviewLoading}
            testId="stat-total-users"
          />
          <StatCard
            title="Total Generations"
            value={overview?.totalGenerations?.toLocaleString() ?? 0}
            description="Images generated all-time"
            icon={ImageIcon}
            colorClass="text-green-500"
            isLoading={overviewLoading}
            testId="stat-total-generations"
          />
          <StatCard
            title="Active Users (30d)"
            value={overview?.activeUsersLast30Days?.toLocaleString() ?? 0}
            description="Users with activity this month"
            icon={Activity}
            colorClass="text-purple-500"
            isLoading={overviewLoading}
            testId="stat-active-users"
          />
          <StatCard
            title="Total Commissions"
            value={`$${(overview?.totalCommissions ?? 0).toFixed(2)}`}
            description="Affiliate commissions earned"
            icon={DollarSign}
            colorClass="text-amber-500"
            isLoading={overviewLoading}
            testId="stat-total-commissions"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Active Subscriptions"
            value={subscriptions?.activeSubscriptions?.toLocaleString() ?? 0}
            description="Current paying subscribers"
            icon={CreditCard}
            colorClass="text-emerald-500"
            isLoading={subscriptionsLoading}
            testId="stat-active-subscriptions"
          />
          <StatCard
            title="Total Subscribers"
            value={subscriptions?.totalSubscribers?.toLocaleString() ?? 0}
            description="All Stripe customers"
            icon={UserCheck}
            colorClass="text-cyan-500"
            isLoading={subscriptionsLoading}
            testId="stat-total-subscribers"
          />
          <StatCard
            title="Weekly Retention"
            value={`${retention?.weeklyRetention ?? 0}%`}
            description="Active users in last 7 days"
            icon={Percent}
            colorClass="text-rose-500"
            isLoading={retentionLoading}
            testId="stat-weekly-retention"
          />
          <StatCard
            title="Monthly Retention"
            value={`${retention?.monthlyRetention ?? 0}%`}
            description="Active users in last 30 days"
            icon={BarChart3}
            colorClass="text-indigo-500"
            isLoading={retentionLoading}
            testId="stat-monthly-retention"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card data-testid="chart-user-growth">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                User Growth (Last 30 Days)
              </CardTitle>
              <CardDescription>New user registrations per day</CardDescription>
            </CardHeader>
            <CardContent>
              {userGrowthLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={userGrowth || []}>
                    <defs>
                      <linearGradient id="userGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="date" 
                      fontSize={12}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      contentStyle={{ borderRadius: '8px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      fill="url(#userGrowthGradient)"
                      name="New Users"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card data-testid="chart-dau">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-500" />
                Daily Active Users (Last 30 Days)
              </CardTitle>
              <CardDescription>Unique users with activity per day</CardDescription>
            </CardHeader>
            <CardContent>
              {dauLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dau || []}>
                    <defs>
                      <linearGradient id="dauGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="date" 
                      fontSize={12}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      contentStyle={{ borderRadius: '8px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#a855f7" 
                      strokeWidth={2}
                      fill="url(#dauGradient)"
                      name="Active Users"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card data-testid="chart-generation-stats">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-green-500" />
                Generation Activity (Last 30 Days)
              </CardTitle>
              <CardDescription>Image generations per day</CardDescription>
            </CardHeader>
            <CardContent>
              {generationStatsLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={generationStats || []}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="date" 
                      fontSize={12}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      contentStyle={{ borderRadius: '8px' }}
                    />
                    <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} name="Generations" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card data-testid="chart-revenue">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-amber-500" />
                Commission Revenue (Last 30 Days)
              </CardTitle>
              <CardDescription>Affiliate commissions by day</CardDescription>
            </CardHeader>
            <CardContent>
              {revenueLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenue || []}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="date" 
                      fontSize={12}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis fontSize={12} tickFormatter={(value) => `$${value}`} />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                      contentStyle={{ borderRadius: '8px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      fill="url(#revenueGradient)"
                      name="Revenue"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card data-testid="chart-feature-usage">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                Feature Usage
              </CardTitle>
              <CardDescription>Breakdown by generation type</CardDescription>
            </CardHeader>
            <CardContent>
              {featureUsageLoading ? (
                <Skeleton className="h-[250px] w-full" />
              ) : (
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="60%" height={250}>
                    <PieChart>
                      <Pie
                        data={featureUsage || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="count"
                        nameKey="type"
                      >
                        {(featureUsage || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={FEATURE_COLORS[entry.type] || '#6b7280'} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-2">
                    {(featureUsage || []).map((item) => (
                      <div key={item.type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-3 w-3 rounded-full" 
                            style={{ backgroundColor: FEATURE_COLORS[item.type] || '#6b7280' }}
                          />
                          <span className="text-sm capitalize">{item.type.replace('_', ' ')}</span>
                        </div>
                        <span className="text-sm font-medium">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card data-testid="chart-user-roles">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" />
                Users by Role
              </CardTitle>
              <CardDescription>Distribution of user roles</CardDescription>
            </CardHeader>
            <CardContent>
              {roleStatsLoading ? (
                <Skeleton className="h-[250px] w-full" />
              ) : (
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="60%" height={250}>
                    <PieChart>
                      <Pie
                        data={roleStats || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="count"
                        nameKey="role"
                      >
                        {(roleStats || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={ROLE_COLORS[entry.role] || '#6b7280'} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-2">
                    {(roleStats || []).map((stat) => (
                      <div key={stat.role} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-3 w-3 rounded-full" 
                            style={{ backgroundColor: ROLE_COLORS[stat.role] || '#6b7280' }}
                          />
                          <span className="text-sm capitalize">{stat.role.replace('_', ' ')}</span>
                        </div>
                        <span className="text-sm font-medium">{stat.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card data-testid="table-top-affiliates">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                Top Affiliates
              </CardTitle>
              <CardDescription>Affiliates with highest earnings</CardDescription>
            </CardHeader>
            <CardContent>
              {affiliatesLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (affiliates || []).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No affiliates yet</p>
              ) : (
                <div className="space-y-2">
                  {(affiliates || []).slice(0, 5).map((affiliate, index) => (
                    <div 
                      key={affiliate.userId}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                      data-testid={`row-affiliate-${index}`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-xs font-bold text-emerald-500">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium truncate max-w-[100px]">
                          {affiliate.username || 'Anonymous'}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">${affiliate.totalEarnings.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">{affiliate.referralCount} refs</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card data-testid="table-top-creators">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              Top Creators
            </CardTitle>
            <CardDescription>Users with most generations</CardDescription>
          </CardHeader>
          <CardContent>
            {topCreatorsLoading ? (
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-5">
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-5">
                {(topCreators || []).slice(0, 10).map((creator, index) => (
                  <div 
                    key={creator.userId}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    data-testid={`row-creator-${index}`}
                  >
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                      index === 0 ? "bg-amber-500 text-white" :
                      index === 1 ? "bg-gray-400 text-white" :
                      index === 2 ? "bg-amber-700 text-white" :
                      "bg-muted-foreground/20 text-muted-foreground"
                    )}>
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">
                        {creator.displayName || creator.username || 'Anonymous'}
                      </p>
                      <p className="text-xs text-muted-foreground">{creator.imageCount.toLocaleString()} images</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
