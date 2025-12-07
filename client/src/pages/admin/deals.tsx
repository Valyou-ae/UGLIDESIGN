import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, MoreHorizontal, Plus, AlertCircle } from "lucide-react";

interface Deal {
  id: number;
  title: string;
  value: number;
  stage: string;
  probability: number;
  contactId: number;
  contactName?: string;
}

interface Contact {
  id: number;
  name: string;
}

export default function AdminDeals() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: deals, isLoading: dealsLoading, error: dealsError } = useQuery<Deal[]>({
    queryKey: ["/api/admin/crm/deals"],
    queryFn: async () => {
      const response = await fetch("/api/admin/crm/deals", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch deals");
      return response.json();
    },
  });

  const { data: contacts } = useQuery<Contact[]>({
    queryKey: ["/api/admin/crm/contacts"],
    queryFn: async () => {
      const response = await fetch("/api/admin/crm/contacts", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch contacts");
      return response.json();
    },
  });

  const contactMap = new Map(contacts?.map(c => [c.id, c.name]) || []);

  const dealsWithContacts = deals?.map(deal => ({
    ...deal,
    contactName: contactMap.get(deal.contactId) || "Unknown"
  }));

  const filteredDeals = dealsWithContacts?.filter(deal =>
    deal.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.contactName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "lead": return "outline";
      case "proposal": return "secondary";
      case "negotiation": return "default";
      case "closed_won": return "default";
      case "closed_lost": return "destructive";
      default: return "outline";
    }
  };

  return (
    <AdminLayout title="Deals" description="Track your sales pipeline">
      <div className="space-y-6" data-testid="admin-deals">
        <div className="flex items-center justify-end">
          <Button data-testid="button-add-deal">
            <Plus className="h-4 w-4 mr-2" />
            Add Deal
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Deals</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-deals"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {dealsError ? (
              <div className="flex items-center justify-center py-8 text-destructive gap-2">
                <AlertCircle className="h-5 w-5" />
                <span>Failed to load deals</span>
              </div>
            ) : dealsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Probability</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeals?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No deals found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDeals?.map((deal) => (
                      <TableRow key={deal.id} data-testid={`row-deal-${deal.id}`}>
                        <TableCell className="font-medium">{deal.title || "—"}</TableCell>
                        <TableCell>{deal.contactName}</TableCell>
                        <TableCell>${(deal.value || 0).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={getStageColor(deal.stage) as any}>
                            {(deal.stage || "lead").replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>{deal.probability || 0}%</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" data-testid={`button-deal-actions-${deal.id}`}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
