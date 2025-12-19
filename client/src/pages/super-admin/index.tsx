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
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

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

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card/50 backdrop-blur">
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
                  <LineChart data={userGrowth || []}>
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
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                      name="New Users"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

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
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
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
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="flex items-center gap-8">
                  <ResponsiveContainer width="50%" height={300}>
                    <PieChart>
                      <Pie
                        data={roleStats || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="count"
                        nameKey="role"
                        label={({ role }) => role}
                      >
                        {(roleStats || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={ROLE_COLORS[entry.role] || '#6b7280'} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-3">
                    {(roleStats || []).map((stat) => (
                      <div key={stat.role} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-3 w-3 rounded-full" 
                            style={{ backgroundColor: ROLE_COLORS[stat.role] || '#6b7280' }}
                          />
                          <span className="text-sm font-medium capitalize">{stat.role.replace('_', ' ')}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{stat.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

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
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {(topCreators || []).slice(0, 10).map((creator, index) => (
                    <div 
                      key={creator.userId}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      data-testid={`row-creator-${index}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold",
                          index === 0 ? "bg-amber-500 text-white" :
                          index === 1 ? "bg-gray-400 text-white" :
                          index === 2 ? "bg-amber-700 text-white" :
                          "bg-muted-foreground/20 text-muted-foreground"
                        )}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {creator.displayName || creator.username || 'Anonymous'}
                          </p>
                          {creator.username && creator.displayName && (
                            <p className="text-xs text-muted-foreground">@{creator.username}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{creator.imageCount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">images</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
