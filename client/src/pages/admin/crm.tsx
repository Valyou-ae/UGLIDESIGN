import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Target, Activity, AlertCircle } from "lucide-react";

interface Contact {
  id: number;
  name: string;
  email: string;
  company: string;
  status: string;
  phone: string;
}

interface Deal {
  id: number;
  title: string;
  value: number;
  stage: string;
  probability: number;
  contactId: number;
}

interface CrmActivity {
  id: number;
  type: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

export default function AdminCRM() {
  const { data: contacts, isLoading: contactsLoading, error: contactsError } = useQuery<Contact[]>({
    queryKey: ["/api/admin/crm/contacts"],
    queryFn: async () => {
      const response = await fetch("/api/admin/crm/contacts", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch contacts");
      return response.json();
    },
  });

  const { data: deals, isLoading: dealsLoading, error: dealsError } = useQuery<Deal[]>({
    queryKey: ["/api/admin/crm/deals"],
    queryFn: async () => {
      const response = await fetch("/api/admin/crm/deals", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch deals");
      return response.json();
    },
  });

  const { data: activities, isLoading: activitiesLoading, error: activitiesError } = useQuery<CrmActivity[]>({
    queryKey: ["/api/admin/crm/activities"],
    queryFn: async () => {
      const response = await fetch("/api/admin/crm/activities", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch activities");
      return response.json();
    },
  });

  const isLoading = contactsLoading || dealsLoading || activitiesLoading;
  const hasError = contactsError || dealsError || activitiesError;

  const totalContacts = contacts?.length || 0;
  const activeDeals = deals?.filter(d => d.stage !== "closed_won" && d.stage !== "closed_lost") || [];
  const totalPipelineValue = activeDeals.reduce((sum, d) => sum + (d.value || 0), 0);
  const pendingActivities = activities?.filter(a => !a.completed) || [];
  const dueTodayCount = pendingActivities.filter(a => {
    const dueDate = new Date(a.dueDate);
    const today = new Date();
    return dueDate.toDateString() === today.toDateString();
  }).length;

  return (
    <AdminLayout title="CRM Dashboard" description="Manage your customer relationships">
      <div className="space-y-6" data-testid="admin-crm">
        {hasError ? (
          <div className="flex items-center justify-center py-8 text-destructive gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>Failed to load CRM data</span>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card data-testid="card-total-contacts">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{totalContacts}</div>
                      <p className="text-xs text-muted-foreground">All contacts in system</p>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card data-testid="card-active-deals">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{activeDeals.length}</div>
                      <p className="text-xs text-muted-foreground">${totalPipelineValue.toLocaleString()} pipeline</p>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card data-testid="card-activities">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Activities</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{pendingActivities.length}</div>
                      <p className="text-xs text-muted-foreground">{dueTodayCount} due today</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Link href="/admin/crm/contacts">
                <Card className="cursor-pointer hover:bg-accent/50 transition-colors" data-testid="link-crm-contacts">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Contacts
                    </CardTitle>
                    <CardDescription>Manage leads, customers, and contact information</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/admin/crm/deals">
                <Card className="cursor-pointer hover:bg-accent/50 transition-colors" data-testid="link-crm-deals">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Deals
                    </CardTitle>
                    <CardDescription>Track sales opportunities and pipeline stages</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
