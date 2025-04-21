import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Edit, Plus, Eye, ExternalLink } from "lucide-react";

// Type definitions - we should import these from the shared schema
type AdPlacement = {
  id: number;
  name: string;
  slot: string;
  description: string | null;
  width: number;
  height: number;
  page: string;
  section: string;
  active: boolean;
};

type Advertisement = {
  id: number;
  title: string;
  description: string | null;
  placementId: number;
  imageUrl: string;
  linkUrl: string;
  altText: string | null;
  startDate: string;
  endDate: string | null;
  active: boolean;
  priority: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  clicks: number;
  views: number;
  sponsorName: string | null;
  sponsorLogo: string | null;
};

// Validation schemas
const adPlacementSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slot: z.string().min(1, "Slot ID is required"),
  description: z.string().nullable().optional(),
  width: z.coerce.number().min(1, "Width must be a positive number"),
  height: z.coerce.number().min(1, "Height must be a positive number"),
  page: z.string().min(1, "Page is required"),
  section: z.string().min(1, "Section is required"),
  active: z.boolean().default(true),
});

const advertisementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  placementId: z.coerce.number().min(1, "Placement is required"),
  imageUrl: z.string().min(1, "Image URL is required").url("Must be a valid URL"),
  linkUrl: z.string().min(1, "Link URL is required").url("Must be a valid URL"),
  altText: z.string().nullable().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().nullable().optional(),
  active: z.boolean().default(true),
  priority: z.coerce.number().min(1, "Priority must be a positive number"),
  sponsorName: z.string().nullable().optional(),
  sponsorLogo: z.string().nullable().optional(),
});

export default function AdManagement() {
  const [activeTab, setActiveTab] = useState("placements");
  const [isAddPlacementOpen, setIsAddPlacementOpen] = useState(false);
  const [isAddAdvertisementOpen, setIsAddAdvertisementOpen] = useState(false);
  const [editingPlacement, setEditingPlacement] = useState<AdPlacement | null>(null);
  const [editingAdvertisement, setEditingAdvertisement] = useState<Advertisement | null>(null);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const { toast } = useToast();

  const placementForm = useForm<z.infer<typeof adPlacementSchema>>({
    resolver: zodResolver(adPlacementSchema),
    defaultValues: {
      name: "",
      slot: "",
      description: "",
      width: 300,
      height: 250,
      page: "home",
      section: "sidebar",
      active: true,
    },
  });

  const advertisementForm = useForm<z.infer<typeof advertisementSchema>>({
    resolver: zodResolver(advertisementSchema),
    defaultValues: {
      title: "",
      description: "",
      placementId: 0,
      imageUrl: "",
      linkUrl: "",
      altText: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      active: true,
      priority: 1,
      sponsorName: "",
      sponsorLogo: "",
    },
  });

  // Fetch ad placements
  const {
    data: adPlacements,
    isLoading: isLoadingPlacements,
    error: placementsError,
  } = useQuery({
    queryKey: ["/api/ad-placements"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/ad-placements");
      const data = await response.json();
      return data.placements;
    },
  });

  // Fetch advertisements
  const {
    data: advertisements,
    isLoading: isLoadingAds,
    error: adsError,
  } = useQuery({
    queryKey: ["/api/advertisements"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/advertisements");
      const data = await response.json();
      return data.advertisements;
    },
  });

  // Add ad placement mutation
  const addPlacementMutation = useMutation({
    mutationFn: async (placement: z.infer<typeof adPlacementSchema>) => {
      const response = await apiRequest("POST", "/api/ad-placements", placement);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ad-placements"] });
      setIsAddPlacementOpen(false);
      placementForm.reset();
      toast({
        title: "Ad placement created",
        description: "The ad placement has been successfully created.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create ad placement",
        description: error.message || "An error occurred while creating the ad placement.",
        variant: "destructive",
      });
    },
  });

  // Update ad placement mutation
  const updatePlacementMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: z.infer<typeof adPlacementSchema> }) => {
      const response = await apiRequest("PUT", `/api/ad-placements/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ad-placements"] });
      setEditingPlacement(null);
      placementForm.reset();
      toast({
        title: "Ad placement updated",
        description: "The ad placement has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update ad placement",
        description: error.message || "An error occurred while updating the ad placement.",
        variant: "destructive",
      });
    },
  });

  // Delete ad placement mutation
  const deletePlacementMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/ad-placements/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ad-placements"] });
      toast({
        title: "Ad placement deleted",
        description: "The ad placement has been successfully deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete ad placement",
        description: error.message || "An error occurred while deleting the ad placement.",
        variant: "destructive",
      });
    },
  });

  // Add advertisement mutation
  const addAdvertisementMutation = useMutation({
    mutationFn: async (ad: z.infer<typeof advertisementSchema>) => {
      const response = await apiRequest("POST", "/api/advertisements", ad);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/advertisements"] });
      setIsAddAdvertisementOpen(false);
      advertisementForm.reset();
      toast({
        title: "Advertisement created",
        description: "The advertisement has been successfully created.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create advertisement",
        description: error.message || "An error occurred while creating the advertisement.",
        variant: "destructive",
      });
    },
  });

  // Update advertisement mutation
  const updateAdvertisementMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: z.infer<typeof advertisementSchema> }) => {
      const response = await apiRequest("PUT", `/api/advertisements/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/advertisements"] });
      setEditingAdvertisement(null);
      advertisementForm.reset();
      toast({
        title: "Advertisement updated",
        description: "The advertisement has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update advertisement",
        description: error.message || "An error occurred while updating the advertisement.",
        variant: "destructive",
      });
    },
  });

  // Delete advertisement mutation
  const deleteAdvertisementMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/advertisements/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/advertisements"] });
      toast({
        title: "Advertisement deleted",
        description: "The advertisement has been successfully deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete advertisement",
        description: error.message || "An error occurred while deleting the advertisement.",
        variant: "destructive",
      });
    },
  });

  // Handle form submissions
  const onSubmitPlacement = (values: z.infer<typeof adPlacementSchema>) => {
    if (editingPlacement) {
      updatePlacementMutation.mutate({ id: editingPlacement.id, data: values });
    } else {
      addPlacementMutation.mutate(values);
    }
  };

  const onSubmitAdvertisement = (values: z.infer<typeof advertisementSchema>) => {
    if (editingAdvertisement) {
      updateAdvertisementMutation.mutate({ id: editingAdvertisement.id, data: values });
    } else {
      addAdvertisementMutation.mutate(values);
    }
  };

  // Set form values when editing
  const handleEditPlacement = (placement: AdPlacement) => {
    setEditingPlacement(placement);
    placementForm.reset({
      name: placement.name,
      slot: placement.slot,
      description: placement.description || "",
      width: placement.width,
      height: placement.height,
      page: placement.page,
      section: placement.section,
      active: placement.active,
    });
    setIsAddPlacementOpen(true);
  };

  const handleEditAdvertisement = (ad: Advertisement) => {
    setEditingAdvertisement(ad);
    advertisementForm.reset({
      title: ad.title,
      description: ad.description || "",
      placementId: ad.placementId,
      imageUrl: ad.imageUrl,
      linkUrl: ad.linkUrl,
      altText: ad.altText || "",
      startDate: new Date(ad.startDate).toISOString().split("T")[0],
      endDate: ad.endDate ? new Date(ad.endDate).toISOString().split("T")[0] : "",
      active: ad.active,
      priority: ad.priority,
      sponsorName: ad.sponsorName || "",
      sponsorLogo: ad.sponsorLogo || "",
    });
    setIsAddAdvertisementOpen(true);
  };

  // Get unique pages for filtering
  const uniquePages = adPlacements 
    ? [...new Set(adPlacements.map((p: AdPlacement) => p.page))] 
    : [];

  // Filter placements by page if selected
  const filteredPlacements = selectedPage
    ? adPlacements?.filter((p: AdPlacement) => p.page === selectedPage)
    : adPlacements;

  // Check for loading/error states
  if (isLoadingPlacements || isLoadingAds) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (placementsError || adsError) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-bold text-destructive">Error loading data</h2>
        <p>Please try again later or contact support.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Advertisement Management</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="placements">Ad Placements</TabsTrigger>
          <TabsTrigger value="advertisements">Advertisements</TabsTrigger>
        </TabsList>

        {/* Ad Placements Tab */}
        <TabsContent value="placements">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Ad Placements</CardTitle>
                  <CardDescription>
                    Configure where advertisements appear throughout the site.
                  </CardDescription>
                </div>
                <Button onClick={() => {
                  setEditingPlacement(null);
                  placementForm.reset();
                  setIsAddPlacementOpen(true);
                }}>
                  <Plus className="mr-2 h-4 w-4" /> Add Placement
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-4">
                <Label htmlFor="page-filter">Filter by page:</Label>
                <Select
                  value={selectedPage || ""}
                  onValueChange={(value) => setSelectedPage(value || null)}
                >
                  <SelectTrigger id="page-filter" className="w-[200px]">
                    <SelectValue placeholder="All pages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All pages</SelectItem>
                    {uniquePages.map((page: string) => (
                      <SelectItem key={page} value={page}>
                        {page.charAt(0).toUpperCase() + page.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Slot</TableHead>
                      <TableHead>Page</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlacements?.length > 0 ? (
                      filteredPlacements.map((placement: AdPlacement) => (
                        <TableRow key={placement.id}>
                          <TableCell className="font-medium">{placement.name}</TableCell>
                          <TableCell>{placement.slot}</TableCell>
                          <TableCell>{placement.page}</TableCell>
                          <TableCell>{placement.section}</TableCell>
                          <TableCell>{placement.width}×{placement.height}</TableCell>
                          <TableCell>
                            <Badge variant={placement.active ? "default" : "outline"}>
                              {placement.active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditPlacement(placement)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  if (window.confirm("Are you sure you want to delete this ad placement?")) {
                                    deletePlacementMutation.mutate(placement.id);
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No ad placements found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Ad Placement Form Dialog */}
          <Dialog open={isAddPlacementOpen} onOpenChange={setIsAddPlacementOpen}>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>
                  {editingPlacement ? "Edit Ad Placement" : "Add New Ad Placement"}
                </DialogTitle>
                <DialogDescription>
                  Configure where advertisements can appear on the site.
                </DialogDescription>
              </DialogHeader>

              <Form {...placementForm}>
                <form onSubmit={placementForm.handleSubmit(onSubmitPlacement)} className="space-y-4">
                  <FormField
                    control={placementForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Homepage Sidebar Top" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={placementForm.control}
                    name="slot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slot ID</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., home-sidebar-top" {...field} />
                        </FormControl>
                        <FormDescription>
                          Unique identifier for this ad slot in the template code.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={placementForm.control}
                      name="width"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Width (px)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={placementForm.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (px)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={placementForm.control}
                      name="page"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Page</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select page" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="home">Home</SelectItem>
                              <SelectItem value="article">Article</SelectItem>
                              <SelectItem value="category">Category</SelectItem>
                              <SelectItem value="search">Search</SelectItem>
                              <SelectItem value="about">About</SelectItem>
                              <SelectItem value="contact">Contact</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={placementForm.control}
                      name="section"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select section" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="header">Header</SelectItem>
                              <SelectItem value="sidebar">Sidebar</SelectItem>
                              <SelectItem value="content">In-Content</SelectItem>
                              <SelectItem value="bottom">Bottom</SelectItem>
                              <SelectItem value="footer">Footer</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={placementForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description of this ad placement"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={placementForm.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Active</FormLabel>
                          <FormDescription>
                            Whether this ad placement is currently active
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddPlacementOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={placementForm.formState.isSubmitting}>
                      {placementForm.formState.isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {editingPlacement ? "Update" : "Create"} Placement
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Advertisements Tab */}
        <TabsContent value="advertisements">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Advertisements</CardTitle>
                  <CardDescription>
                    Manage advertisements and assign them to placements.
                  </CardDescription>
                </div>
                <Button onClick={() => {
                  setEditingAdvertisement(null);
                  advertisementForm.reset();
                  setIsAddAdvertisementOpen(true);
                }}>
                  <Plus className="mr-2 h-4 w-4" /> Add Advertisement
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Placement</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Stats</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {advertisements?.length > 0 ? (
                      advertisements.map((ad: Advertisement) => {
                        const placement = adPlacements?.find((p: AdPlacement) => p.id === ad.placementId);
                        return (
                          <TableRow key={ad.id}>
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                <span>{ad.title}</span>
                                <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {ad.linkUrl}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {placement ? (
                                <div className="flex flex-col">
                                  <span>{placement.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {placement.page} / {placement.section}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground italic">Unknown</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={ad.active ? "default" : "outline"}>
                                {ad.active ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>{ad.priority}</TableCell>
                            <TableCell>{new Date(ad.startDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                              {ad.endDate ? new Date(ad.endDate).toLocaleDateString() : "No end date"}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col text-sm">
                                <span>{ad.views || 0} views</span>
                                <span>{ad.clicks || 0} clicks</span>
                                <span className="text-xs text-muted-foreground">
                                  CTR: {ad.views ? ((ad.clicks / ad.views) * 100).toFixed(2) : 0}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(ad.imageUrl, "_blank")}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditAdvertisement(ad)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    if (window.confirm("Are you sure you want to delete this advertisement?")) {
                                      deleteAdvertisementMutation.mutate(ad.id);
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          No advertisements found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Advertisement Form Dialog */}
          <Dialog open={isAddAdvertisementOpen} onOpenChange={setIsAddAdvertisementOpen}>
            <DialogContent className="sm:max-w-[650px]">
              <DialogHeader>
                <DialogTitle>
                  {editingAdvertisement ? "Edit Advertisement" : "Add New Advertisement"}
                </DialogTitle>
                <DialogDescription>
                  Create or modify an advertisement and assign it to a placement.
                </DialogDescription>
              </DialogHeader>

              <Form {...advertisementForm}>
                <form onSubmit={advertisementForm.handleSubmit(onSubmitAdvertisement)} className="space-y-4">
                  <FormField
                    control={advertisementForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Ad title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={advertisementForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description of this ad"
                            className="resize-none"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={advertisementForm.control}
                    name="placementId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Placement</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value ? field.value.toString() : undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select placement" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {adPlacements?.map((placement: AdPlacement) => (
                              <SelectItem key={placement.id} value={placement.id.toString()}>
                                {placement.name} ({placement.page}/{placement.section})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={advertisementForm.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={advertisementForm.control}
                      name="linkUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={advertisementForm.control}
                    name="altText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alt Text</FormLabel>
                        <FormControl>
                          <Input placeholder="Alternative text for accessibility" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={advertisementForm.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={advertisementForm.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date (Optional)</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={advertisementForm.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} min={1} />
                          </FormControl>
                          <FormDescription>
                            Lower numbers have higher priority
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={advertisementForm.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 mt-7">
                          <div className="space-y-0.5">
                            <FormLabel>Active</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={advertisementForm.control}
                      name="sponsorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sponsor Name (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Sponsor name" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={advertisementForm.control}
                      name="sponsorLogo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sponsor Logo URL (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddAdvertisementOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={advertisementForm.formState.isSubmitting}>
                      {advertisementForm.formState.isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {editingAdvertisement ? "Update" : "Create"} Advertisement
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
}