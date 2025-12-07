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

interface Contact {
  id: number;
  name: string;
  email: string;
  company: string;
  status: string;
  phone: string;
}

export default function AdminContacts() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: contacts, isLoading, error } = useQuery<Contact[]>({
    queryKey: ["/api/admin/crm/contacts"],
    queryFn: async () => {
      const response = await fetch("/api/admin/crm/contacts", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch contacts");
      return response.json();
    },
  });

  const filteredContacts = contacts?.filter(contact =>
    contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Contacts" description="Manage your CRM contacts">
      <div className="space-y-6" data-testid="admin-contacts">
        <div className="flex items-center justify-end">
          <Button data-testid="button-add-contact">
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Contacts</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-contacts"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="flex items-center justify-center py-8 text-destructive gap-2">
                <AlertCircle className="h-5 w-5" />
                <span>Failed to load contacts</span>
              </div>
            ) : isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No contacts found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredContacts?.map((contact) => (
                      <TableRow key={contact.id} data-testid={`row-contact-${contact.id}`}>
                        <TableCell className="font-medium">{contact.name || "—"}</TableCell>
                        <TableCell>{contact.email || "—"}</TableCell>
                        <TableCell>{contact.company || "—"}</TableCell>
                        <TableCell>{contact.phone || "—"}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              contact.status === "customer" ? "default" : 
                              contact.status === "prospect" ? "secondary" : "outline"
                            }
                          >
                            {contact.status || "lead"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" data-testid={`button-contact-actions-${contact.id}`}>
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
