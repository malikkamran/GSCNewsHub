import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { SiteStatistics } from "@shared/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";

export default function SiteStatisticsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedStat, setSelectedStat] = useState<SiteStatistics | null>(null);
  const [formData, setFormData] = useState({
    value: "",
    changePercentage: ""
  });

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["/api/site-statistics"],
  });

  const handleEdit = (stat: SiteStatistics) => {
    setSelectedStat(stat);
    setFormData({
      value: stat.value,
      changePercentage: stat.changePercentage?.toString() || ""
    });
    setIsEditOpen(true);
  };

  const handleSave = async () => {
    if (!selectedStat) return;
    try {
      await apiRequest("PUT", `/api/site-statistics/${selectedStat.key}`, {
        value: formData.value,
        changePercentage: formData.changePercentage ? parseInt(formData.changePercentage) : null
      });
      queryClient.invalidateQueries({ queryKey: ["/api/site-statistics"] });
      setIsEditOpen(false);
      toast({
        title: "Success",
        description: "Statistic updated successfully",
      });
    } catch (error) {
      console.error("Failed to update statistic:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update statistic",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Site Statistics Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Partner Dashboard Statistics</CardTitle>
          <CardDescription>
            Manage the statistics displayed on the partner dashboard overview.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">Error loading statistics</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Change %</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.map((stat: SiteStatistics) => (
                  <TableRow key={stat.id}>
                    <TableCell className="font-medium">{stat.label}</TableCell>
                    <TableCell>{stat.value}</TableCell>
                    <TableCell>
                      {stat.changePercentage ? (
                        <span className={stat.changePercentage > 0 ? "text-green-600" : "text-red-600"}>
                          {stat.changePercentage > 0 ? "+" : ""}{stat.changePercentage}%
                        </span>
                      ) : "-"}
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">{stat.key}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(stat)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Statistic</DialogTitle>
            <DialogDescription>
              Update the value for {selectedStat?.label}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Value</Label>
              <Input 
                value={formData.value} 
                onChange={e => setFormData({...formData, value: e.target.value})} 
              />
            </div>
            <div className="grid gap-2">
              <Label>Change Percentage (Optional)</Label>
              <Input 
                type="number"
                value={formData.changePercentage} 
                onChange={e => setFormData({...formData, changePercentage: e.target.value})} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
