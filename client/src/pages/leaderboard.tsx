import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { Trophy, Medal, Award, Crown, Flame, TrendingUp, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type Period = 'weekly' | 'monthly' | 'all-time';

interface LeaderboardEntry {
  userId: string;
  username: string | null;
  displayName: string | null;
  profileImageUrl: string | null;
  imageCount: number;
  rank: number;
}

async function fetchLeaderboard(period: Period): Promise<{ leaderboard: LeaderboardEntry[]; period: Period }> {
  const response = await fetch(`/api/leaderboard?period=${period}&limit=50`);
  if (!response.ok) throw new Error("Failed to fetch leaderboard");
  return response.json();
}

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Crown className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />;
    default:
      return <span className="text-muted-foreground font-mono text-sm">#{rank}</span>;
  }
}

function getRankBadgeClass(rank: number) {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30";
    case 2:
      return "bg-gradient-to-r from-gray-300/20 to-gray-400/20 border-gray-400/30";
    case 3:
      return "bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30";
    default:
      return "bg-card border-border";
  }
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  );
}

export default function Leaderboard() {
  const [period, setPeriod] = useState<Period>('all-time');

  const { data, isLoading, error } = useQuery({
    queryKey: ['leaderboard', period],
    queryFn: () => fetchLeaderboard(period),
    staleTime: 1000 * 60 * 5,
  });

  const leaderboard = data?.leaderboard || [];
  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto pb-24 md:pb-8">
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <div className="flex flex-col gap-2 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#B94E30] to-[#E3B436]">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
                <p className="text-muted-foreground">Top creators ranked by number of generations</p>
              </div>
            </div>
          </div>

          <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)} className="mb-8">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="weekly" className="gap-2" data-testid="tab-weekly">
                <Flame className="h-4 w-4" />
                This Week
              </TabsTrigger>
              <TabsTrigger value="monthly" className="gap-2" data-testid="tab-monthly">
                <TrendingUp className="h-4 w-4" />
                This Month
              </TabsTrigger>
              <TabsTrigger value="all-time" className="gap-2" data-testid="tab-all-time">
                <Users className="h-4 w-4" />
                All Time
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <LeaderboardSkeleton />
          ) : error ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Failed to load leaderboard. Please try again.</p>
              </CardContent>
            </Card>
          ) : leaderboard.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No creators yet</h3>
                <p className="text-muted-foreground">Be the first to generate images and claim the top spot!</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {topThree.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[1, 0, 2].map((index) => {
                    const entry = topThree[index];
                    if (!entry) return <div key={index} />;
                    
                    const isFirst = entry.rank === 1;
                    return (
                      <Card 
                        key={entry.userId} 
                        className={cn(
                          "text-center transition-all hover:scale-105",
                          getRankBadgeClass(entry.rank),
                          isFirst && "row-span-2 -mt-4"
                        )}
                        data-testid={`card-rank-${entry.rank}`}
                      >
                        <CardContent className={cn("pt-6", isFirst && "pt-8")}>
                          <div className="relative inline-block mb-3">
                            <Avatar className={cn("mx-auto", isFirst ? "h-20 w-20" : "h-14 w-14")}>
                              <AvatarImage src={entry.profileImageUrl || undefined} />
                              <AvatarFallback className="text-lg">
                                {(entry.displayName || entry.username || "U").slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-background border-2 border-border">
                              {getRankIcon(entry.rank)}
                            </div>
                          </div>
                          <h3 className={cn("font-semibold truncate", isFirst ? "text-lg" : "text-sm")}>
                            {entry.displayName || entry.username || "Anonymous"}
                          </h3>
                          <p className={cn("text-muted-foreground", isFirst ? "text-base" : "text-xs")}>
                            {entry.imageCount} {entry.imageCount === 1 ? "creation" : "creations"}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              <div className="space-y-2">
                {rest.map((entry) => (
                  <div
                    key={entry.userId}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border transition-colors hover:bg-accent/50",
                      getRankBadgeClass(entry.rank)
                    )}
                    data-testid={`row-rank-${entry.rank}`}
                  >
                    <div className="w-8 flex justify-center">
                      {getRankIcon(entry.rank)}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={entry.profileImageUrl || undefined} />
                      <AvatarFallback>
                        {(entry.displayName || entry.username || "U").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {entry.displayName || entry.username || "Anonymous"}
                      </p>
                      {entry.username && entry.displayName && (
                        <p className="text-sm text-muted-foreground truncate">@{entry.username}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{entry.imageCount}</p>
                      <p className="text-xs text-muted-foreground">creations</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
