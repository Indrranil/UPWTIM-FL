import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/services/api";
import { Report } from "@/types/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CheckCircle, XCircle, AlertTriangle, Search } from "lucide-react";

export const ReportManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  // Query reports
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["admin", "reports"],
    queryFn: adminApi.getAllReports,
  });

  // Update report status mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      status,
      adminNotes,
    }: {
      id: string;
      status: string;
      adminNotes?: string;
    }) => adminApi.updateReport(id, status, adminNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
      toast({
        title: "Report Updated",
        description: "Report has been processed successfully",
      });
      setDialogOpen(false);
      setSelectedReport(null);
      setAdminNotes("");
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "There was an error updating the report",
        variant: "destructive",
      });
      console.error("Error updating report:", error);
    },
  });

  // Filter reports based on search term
  const filteredReports = reports.filter(
    (report) =>
      report.itemId.includes(searchTerm) ||
      report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Function to get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Report Management</h2>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No reports found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item ID</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">
                      {report.itemId}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {report.reason}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(report.status)}>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {report.createdAt &&
                        format(new Date(report.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedReport(report);
                          setAdminNotes(report.adminNotes || "");
                          setDialogOpen(true);
                        }}
                      >
                        Review
                      </Button>
                      {report.status === "pending" && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() =>
                              updateMutation.mutate({
                                id: report.id,
                                status: "approved",
                              })
                            }
                          >
                            <CheckCircle className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              updateMutation.mutate({
                                id: report.id,
                                status: "rejected",
                              })
                            }
                          >
                            <XCircle className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Detail Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Report Details</DialogTitle>
              <DialogDescription>
                Review the report details and take appropriate action.
              </DialogDescription>
            </DialogHeader>
            {selectedReport && (
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">Item ID:</p>
                  <p>{selectedReport.itemId}</p>
                </div>
                <div>
                  <p className="font-semibold">Reporter ID:</p>
                  <p>{selectedReport.reporterId}</p>
                </div>
                <div>
                  <p className="font-semibold">Reason:</p>
                  <p>{selectedReport.reason}</p>
                </div>
                <div>
                  <p className="font-semibold">Description:</p>
                  <p>{selectedReport.description}</p>
                </div>
                <div>
                  <p className="font-semibold">Status:</p>
                  <Badge variant={getStatusVariant(selectedReport.status)}>
                    {selectedReport.status}
                  </Badge>
                </div>
                <div>
                  <p className="font-semibold">Admin Notes:</p>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this report..."
                    rows={3}
                  />
                </div>
              </div>
            )}
            <DialogFooter className="flex justify-between">
              {selectedReport && selectedReport.status === "pending" && (
                <div className="space-x-2">
                  <Button
                    variant="default"
                    onClick={() =>
                      updateMutation.mutate({
                        id: selectedReport.id,
                        status: "approved",
                        adminNotes,
                      })
                    }
                  >
                    <CheckCircle className="h-4 w-4 mr-1" /> Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      updateMutation.mutate({
                        id: selectedReport.id,
                        status: "rejected",
                        adminNotes,
                      })
                    }
                  >
                    <XCircle className="h-4 w-4 mr-1" /> Reject
                  </Button>
                </div>
              )}
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
