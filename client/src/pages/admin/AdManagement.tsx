import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AdminLayout from "@/components/admin/AdminLayout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Info, Trash2, Edit3, Layers, ExternalLink, BarChart } from "lucide-react";

// Types for ad placements and advertisements
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

// Zod schemas for form validation
const placementSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slot: z.string().min(3, "Slot must be at least 3 characters"),
  description: z.string().nullable().optional(),
  width: z.coerce.number().min(50, "Width must be at least 50px"),
  height: z.coerce.number().min(50, "Height must be at least 50px"),
  page: z.string().min(1, "Page is required"),
  section: z.string().min(1, "Section is required"),
  active: z.boolean().default(true),
});

const advertisementSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().nullable().optional(),
  placementId: z.coerce.number().min(1, "Placement is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  linkUrl: z.string().url("Must be a valid URL"),
  altText: z.string().nullable().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().nullable().optional(),
  active: z.boolean().default(true),
  priority: z.coerce.number().min(1).max(10).default(5),
  sponsorName: z.string().nullable().optional(),
  sponsorLogo: z.string().url("Must be a valid URL").nullable().optional(),
});

export default function AdManagement() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("placements");
  const [isCreatingPlacement, setIsCreatingPlacement] = useState(false);
  const [isEditingPlacement, setIsEditingPlacement] = useState<AdPlacement | null>(null);
  const [isCreatingAdvertisement, setIsCreatingAdvertisement] = useState(false);
  const [isEditingAdvertisement, setIsEditingAdvertisement] = useState<Advertisement | null>(null);
  const [isConfirmingDeletePlacement, setIsConfirmingDeletePlacement] = useState<number | null>(null);
  const [isConfirmingDeleteAdvertisement, setIsConfirmingDeleteAdvertisement] = useState<number | null>(null);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  // Form handlers
  const placementForm = useForm<z.infer<typeof placementSchema>>({
    resolver: zodResolver(placementSchema),
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
      placementId: 1, // Default to first placement instead of 0
      imageUrl: "",
      linkUrl: "",
      altText: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      active: true,
      priority: 5,
      sponsorName: "",
      sponsorLogo: "",
    },
  });

  // Fetch placements
  const {
    data: adPlacements,
    isLoading: isLoadingPlacements,
    error: placementsError,
  } = useQuery({
    queryKey: ['/api/ad-placements'],
    select: (data) => data.placements,
  });

  // Fetch advertisements
  const {
    data: advertisements,
    isLoading: isLoadingAdvertisements,
    error: advertisementsError,
  } = useQuery({
    queryKey: ['/api/advertisements'],
    select: (data) => data.advertisements,
  });

  // Mutations for placements
  const createPlacementMutation = useMutation({
    mutationFn: async (data: z.infer<typeof placementSchema>) => {
      const response = await apiRequest("POST", "/api/ad-placements", data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create placement");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ad-placements'] });
      setIsCreatingPlacement(false);
      placementForm.reset();
      toast({
        title: "Success",
        description: "Ad placement created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updatePlacementMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: z.infer<typeof placementSchema> }) => {
      const response = await apiRequest("PUT", `/api/ad-placements/${id}`, data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update placement");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ad-placements'] });
      setIsEditingPlacement(null);
      placementForm.reset();
      toast({
        title: "Success",
        description: "Ad placement updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deletePlacementMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/ad-placements/${id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete placement");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ad-placements'] });
      setIsConfirmingDeletePlacement(null);
      toast({
        title: "Success",
        description: "Ad placement deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutations for advertisements
  const createAdvertisementMutation = useMutation({
    mutationFn: async (data: z.infer<typeof advertisementSchema>) => {
      const response = await apiRequest("POST", "/api/advertisements", data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create advertisement");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/advertisements'] });
      setIsCreatingAdvertisement(false);
      advertisementForm.reset();
      toast({
        title: "Success",
        description: "Advertisement created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateAdvertisementMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: z.infer<typeof advertisementSchema> }) => {
      const response = await apiRequest("PUT", `/api/advertisements/${id}`, data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update advertisement");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/advertisements'] });
      setIsEditingAdvertisement(null);
      advertisementForm.reset();
      toast({
        title: "Success",
        description: "Advertisement updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteAdvertisementMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/advertisements/${id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete advertisement");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/advertisements'] });
      setIsConfirmingDeleteAdvertisement(null);
      toast({
        title: "Success",
        description: "Advertisement deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form handlers
  const onSubmitPlacement = (data: z.infer<typeof placementSchema>) => {
    if (isEditingPlacement) {
      updatePlacementMutation.mutate({ id: isEditingPlacement.id, data });
    } else {
      createPlacementMutation.mutate(data);
    }
  };

  const onSubmitAdvertisement = (data: z.infer<typeof advertisementSchema>) => {
    if (isEditingAdvertisement) {
      updateAdvertisementMutation.mutate({ id: isEditingAdvertisement.id, data });
    } else {
      createAdvertisementMutation.mutate(data);
    }
  };

  const handleEditPlacement = (placement: AdPlacement) => {
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
    setIsEditingPlacement(placement);
  };

  const handleEditAdvertisement = (ad: Advertisement) => {
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
    setIsEditingAdvertisement(ad);
  };

  // Reset forms when modal is closed
  useEffect(() => {
    if (!isCreatingPlacement && !isEditingPlacement) {
      placementForm.reset();
    }
    if (!isCreatingAdvertisement && !isEditingAdvertisement) {
      advertisementForm.reset();
    }
  }, [isCreatingPlacement, isEditingPlacement, isCreatingAdvertisement, isEditingAdvertisement]);

  // Get unique pages and sections for filtering
  const availablePages = adPlacements 
    ? [...new Set(adPlacements.map((p: AdPlacement) => p.page))] 
    : [];
  
  const availableSections = selectedPage && adPlacements 
    ? [...new Set(adPlacements.filter((p: AdPlacement) => p.page === selectedPage).map(p => p.section))]
    : [];

  // Filter placements based on selected page and section
  const filteredPlacements = adPlacements
    ? adPlacements.filter((p: AdPlacement) => {
        let matches = true;
        if (selectedPage) matches = matches && p.page === selectedPage;
        if (selectedSection) matches = matches && p.section === selectedSection;
        return matches;
      })
    : [];

  return (
    <AdminLayout>
      <Helmet>
        <title>Ad Management - GSC News Admin</title>
      </Helmet>

      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Ad Management</h1>
          
          <div className="flex space-x-2">
            {activeTab === "placements" ? (
              <Button 
                onClick={() => setIsCreatingPlacement(true)}
                disabled={isLoadingPlacements}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> New Placement
              </Button>
            ) : (
              <Button 
                onClick={() => setIsCreatingAdvertisement(true)}
                disabled={isLoadingAdvertisements || !adPlacements || adPlacements.length === 0}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> New Advertisement
              </Button>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="placements" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="placements">Ad Placements</TabsTrigger>
            <TabsTrigger value="advertisements">Advertisements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="placements">
            <Card>
              <CardHeader>
                <CardTitle>Ad Placements</CardTitle>
                <CardDescription>
                  Define locations on the website where advertisements can be displayed.
                </CardDescription>
                
                {/* Filters for placements */}
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="w-full sm:w-auto">
                    <Select value={selectedPage || "all_pages"} onValueChange={(value) => {
                      setSelectedPage(value === "all_pages" ? null : value);
                      setSelectedSection(null); // Reset section when page changes
                    }}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="All Pages" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_pages">All Pages</SelectItem>
                        {availablePages.map((page: string) => (
                          <SelectItem key={page} value={page}>{page}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedPage && (
                    <div className="w-full sm:w-auto">
                      <Select value={selectedSection || "all_sections"} onValueChange={(value) => setSelectedSection(value === "all_sections" ? null : value)}>
                        <SelectTrigger className="w-full sm:w-40">
                          <SelectValue placeholder="All Sections" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all_sections">All Sections</SelectItem>
                          {availableSections.map((section: string) => (
                            <SelectItem key={section} value={section}>{section}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                {isLoadingPlacements ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : placementsError ? (
                  <div className="text-center text-red-500">
                    Failed to load ad placements
                  </div>
                ) : filteredPlacements.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {selectedPage || selectedSection ? 
                      "No ad placements match the selected filters" : 
                      "No ad placements found. Create your first one!"}
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Page</TableHead>
                          <TableHead>Section</TableHead>
                          <TableHead>Slot ID</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPlacements.map((placement: AdPlacement) => (
                          <TableRow key={placement.id}>
                            <TableCell className="font-medium">{placement.name}</TableCell>
                            <TableCell>{placement.page}</TableCell>
                            <TableCell>{placement.section}</TableCell>
                            <TableCell><code className="bg-muted p-1 rounded text-xs">{placement.slot}</code></TableCell>
                            <TableCell>{placement.width}×{placement.height}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded text-xs ${placement.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {placement.active ? 'Active' : 'Inactive'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditPlacement(placement)}
                                >
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete the ad placement "{placement.name}".
                                        Any advertisements associated with this placement will no longer be displayed.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deletePlacementMutation.mutate(placement.id)}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advertisements">
            <Card>
              <CardHeader>
                <CardTitle>Advertisements</CardTitle>
                <CardDescription>
                  Manage ads that will be displayed in designated placements.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {isLoadingAdvertisements ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : advertisementsError ? (
                  <div className="text-center text-red-500">
                    Failed to load advertisements
                  </div>
                ) : !advertisements || advertisements.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No advertisements found. Create your first one!
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Placement</TableHead>
                          <TableHead>Date Range</TableHead>
                          <TableHead>Metrics</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {advertisements.map((ad: Advertisement) => {
                          const placement = adPlacements?.find((p: AdPlacement) => p.id === ad.placementId);
                          return (
                            <TableRow key={ad.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 rounded overflow-hidden mr-3 flex-shrink-0">
                                    <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                                  </div>
                                  <span className="line-clamp-2">{ad.title}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {placement ? (
                                  <div>
                                    <span className="block">{placement.name}</span>
                                    <span className="text-xs text-muted-foreground">{placement.page}/{placement.section}</span>
                                  </div>
                                ) : (
                                  <span className="text-red-500">Unknown placement</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div>From: {new Date(ad.startDate).toLocaleDateString()}</div>
                                  {ad.endDate && (
                                    <div>To: {new Date(ad.endDate).toLocaleDateString()}</div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col text-xs">
                                  <span className="flex items-center"><BarChart className="h-3 w-3 mr-1" /> Views: {ad.views}</span>
                                  <span className="flex items-center"><ExternalLink className="h-3 w-3 mr-1" /> Clicks: {ad.clicks}</span>
                                </div>
                              </TableCell>
                              <TableCell>{ad.priority}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded text-xs ${ad.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                  {ad.active ? 'Active' : 'Inactive'}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditAdvertisement(ad)}
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This will permanently delete the advertisement "{ad.title}".
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => deleteAdvertisementMutation.mutate(ad.id)}
                                          className="bg-red-500 hover:bg-red-600"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Placement Form Dialog */}
      <Dialog open={isCreatingPlacement || isEditingPlacement !== null} onOpenChange={(open) => {
        if (!open) {
          setIsCreatingPlacement(false);
          setIsEditingPlacement(null);
        }
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditingPlacement ? "Edit Ad Placement" : "Create Ad Placement"}</DialogTitle>
            <DialogDescription>
              Define where advertisements can appear on the website.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...placementForm}>
            <form onSubmit={placementForm.handleSubmit(onSubmitPlacement)} className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={placementForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Sidebar Top" {...field} />
                      </FormControl>
                      <FormDescription>A descriptive name for the placement.</FormDescription>
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
                        <Input placeholder="sidebar-top" {...field} />
                      </FormControl>
                      <FormDescription>Unique identifier used in code.</FormDescription>
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
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Details about the placement location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <SelectItem value="footer">Footer</SelectItem>
                          <SelectItem value="sidebar">Sidebar</SelectItem>
                          <SelectItem value="content">Content</SelectItem>
                          <SelectItem value="bottom">Bottom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={placementForm.control}
                  name="width"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Width (px)</FormLabel>
                      <FormControl>
                        <Input type="number" min="50" {...field} />
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
                        <Input type="number" min="50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={placementForm.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Placement Status</FormLabel>
                      <FormDescription>
                        Whether this placement is active and can display ads.
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
                  onClick={() => {
                    setIsCreatingPlacement(false);
                    setIsEditingPlacement(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={placementForm.formState.isSubmitting}
                >
                  {placementForm.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEditingPlacement ? "Update Placement" : "Create Placement"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Advertisement Form Dialog */}
      <Dialog
        open={isCreatingAdvertisement || isEditingAdvertisement !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreatingAdvertisement(false);
            setIsEditingAdvertisement(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditingAdvertisement ? "Edit Advertisement" : "Create Advertisement"}</DialogTitle>
            <DialogDescription>
              Create or edit an advertisement for display on the website.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...advertisementForm}>
            <form onSubmit={advertisementForm.handleSubmit(onSubmitAdvertisement)} className="space-y-6 py-4">
              <FormField
                control={advertisementForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Advertisement Title" {...field} />
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
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Brief description of the advertisement" {...field} />
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
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select placement" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {adPlacements && adPlacements.length > 0 ? (
                          adPlacements.map((placement: AdPlacement) => (
                            <SelectItem key={placement.id} value={placement.id.toString()}>
                              {placement.name} ({placement.page}/{placement.section})
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="1">No placements found</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={advertisementForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/ad.jpg" {...field} />
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
                        <Input placeholder="https://example.com/landing-page" {...field} />
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
                    <FormLabel>Alt Text (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Alternative text for the image" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={advertisementForm.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority (1-10)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Lower values have higher priority.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={advertisementForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm h-full">
                      <div className="space-y-0.5">
                        <FormLabel>Ad Status</FormLabel>
                        <FormDescription>
                          Whether this ad is active.
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
              </div>
              
              <h3 className="text-lg font-medium">Sponsor Information (Optional)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={advertisementForm.control}
                  name="sponsorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sponsor Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Sponsor Company" {...field} />
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
                      <FormLabel>Sponsor Logo URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/logo.png" {...field} />
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
                  onClick={() => {
                    setIsCreatingAdvertisement(false);
                    setIsEditingAdvertisement(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={advertisementForm.formState.isSubmitting}
                >
                  {advertisementForm.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEditingAdvertisement ? "Update Advertisement" : "Create Advertisement"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}