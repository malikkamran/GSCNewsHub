import React from "react";
import { Helmet } from "react-helmet";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight, Check, BarChart3, Users, Globe, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function AdvertisePage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Inquiry sent",
      description: "Thank you for your interest. Our advertising team will contact you soon.",
    });
    // Clear form
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  return (
    <div className="bg-gray-50">
      <Helmet>
        <title>Advertise With Us | GSC Supply Chain News</title>
        <meta
          name="description"
          content="Advertise on GSC Supply Chain News and reach decision-makers in the global supply chain industry."
        />
      </Helmet>

      <div className="container mx-auto py-6 px-4 md:px-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Advertise</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm mb-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Advertise With GSC Supply Chain News</h1>
              <p className="text-lg text-gray-600 mb-4">
                Connect with key decision-makers in the global supply chain industry
              </p>
              <div className="border-t border-gray-200 w-24 mx-auto my-6"></div>
              <p className="text-gray-600">
                GSC Supply Chain News reaches industry professionals responsible for logistics, 
                procurement, warehousing, and transportation decisions across the globe.
              </p>
            </div>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#BB1919] mb-6">Our Audience</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="text-center">
                    <Users className="h-12 w-12 mx-auto text-[#BB1919] mb-2" />
                    <CardTitle>Decision Makers</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p>85% of our readers are director-level or above, with purchasing power and decision-making authority.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="text-center">
                    <Globe className="h-12 w-12 mx-auto text-[#BB1919] mb-2" />
                    <CardTitle>Global Reach</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p>Our audience spans 120+ countries with strong representation in North America, Europe, and Asia Pacific.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto text-[#BB1919] mb-2" />
                    <CardTitle>Industry Engagement</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p>Average time on site: 4.2 minutes. Newsletter open rate: 32% (industry average: 21%).</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#BB1919] mb-6">Advertising Options</h2>
              
              <Tabs defaultValue="digital">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="digital">Digital Display</TabsTrigger>
                  <TabsTrigger value="content">Content Partnerships</TabsTrigger>
                  <TabsTrigger value="email">Email & Newsletters</TabsTrigger>
                </TabsList>
                
                <TabsContent value="digital" className="bg-gray-50 p-6 rounded-md">
                  <h3 className="text-xl font-semibold mb-4">Digital Display Advertising</h3>
                  <p className="mb-4">Showcase your brand across our website with high-visibility placements.</p>
                  
                  <div className="space-y-4 mt-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Homepage Banner</h4>
                        <p className="text-sm text-gray-600">Premium placement on our most visited page.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Category Sponsorship</h4>
                        <p className="text-sm text-gray-600">Own the advertising on a specific category page.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Article Page Display</h4>
                        <p className="text-sm text-gray-600">Contextual advertising alongside relevant content.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Mobile Optimized</h4>
                        <p className="text-sm text-gray-600">Responsive formats for all devices.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="content" className="bg-gray-50 p-6 rounded-md">
                  <h3 className="text-xl font-semibold mb-4">Content Partnerships</h3>
                  <p className="mb-4">Position your organization as a thought leader with our content solutions.</p>
                  
                  <div className="space-y-4 mt-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Sponsored Articles</h4>
                        <p className="text-sm text-gray-600">Branded content written by our editorial team.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Featured Partner Content</h4>
                        <p className="text-sm text-gray-600">Highlight your expertise with prominently placed articles.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Webinar Sponsorship</h4>
                        <p className="text-sm text-gray-600">Co-branded educational events with lead generation.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Industry Reports</h4>
                        <p className="text-sm text-gray-600">Exclusive sponsorship of in-depth research.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="email" className="bg-gray-50 p-6 rounded-md">
                  <h3 className="text-xl font-semibold mb-4">Email & Newsletter Advertising</h3>
                  <p className="mb-4">Reach our subscribers directly in their inbox.</p>
                  
                  <div className="space-y-4 mt-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Daily Newsletter Sponsorship</h4>
                        <p className="text-sm text-gray-600">Premium placement in our daily industry update.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Weekly Roundup</h4>
                        <p className="text-sm text-gray-600">Featured placement in our most-read weekly digest.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Dedicated Email Blast</h4>
                        <p className="text-sm text-gray-600">Exclusive email featuring only your content and offer.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Subscriber Segmentation</h4>
                        <p className="text-sm text-gray-600">Target by job function, industry, or geography.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#BB1919] mb-6">Request Media Kit</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Get Our Complete Advertising Information</CardTitle>
                  <CardDescription>
                    Fill out the form below to receive our detailed media kit with rates, specifications, and case studies.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" required placeholder="Your full name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Business Email</Label>
                        <Input id="email" type="email" required placeholder="Your business email" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company">Company Name</Label>
                        <Input id="company" required placeholder="Your company name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="position">Job Title</Label>
                        <Input id="position" required placeholder="Your position" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="interests">Areas of Interest</Label>
                      <Textarea
                        id="interests"
                        placeholder="Tell us which advertising options interest you most"
                        rows={3}
                      />
                    </div>
                    
                    <Button type="submit" className="bg-[#BB1919] hover:bg-[#A00000]">
                      Request Media Kit
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t flex flex-col sm:flex-row items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>For direct inquiries: </span>
                  <a href="mailto:info@GSCnews.co" className="text-[#BB1919] hover:underline ml-1">
                    info@GSCnews.co
                  </a>
                </CardFooter>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#BB1919] mb-6">Why Advertise With Us</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-3">Targeted Reach</h3>
                  <p className="text-gray-600 mb-6">
                    Connect with supply chain professionals actively seeking information relevant to their roles. 
                    Our content attracts decision-makers looking for solutions to optimize their operations.
                  </p>
                  
                  <h3 className="text-lg font-medium mb-3">Brand Association</h3>
                  <p className="text-gray-600">
                    Align your brand with trusted, high-quality content. GSC Supply Chain News is recognized 
                    for in-depth analysis and reporting on key industry developments.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Engagement Metrics</h3>
                  <p className="text-gray-600 mb-6">
                    Our readers spend significant time engaging with our content. Detailed analytics and 
                    campaign reporting help you measure and optimize your ROI.
                  </p>
                  
                  <h3 className="text-lg font-medium mb-3">Customized Solutions</h3>
                  <p className="text-gray-600">
                    We work with you to develop tailored advertising packages that meet your specific 
                    marketing objectives and budget requirements.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}