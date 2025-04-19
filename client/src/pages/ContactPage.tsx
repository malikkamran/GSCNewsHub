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
import { ChevronRight, Mail, Phone, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent",
      description: "Thank you for your message. We'll get back to you as soon as possible.",
    });
    // Clear form
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  return (
    <div className="bg-gray-50">
      <Helmet>
        <title>Contact Us | GSC Supply Chain News</title>
        <meta
          name="description"
          content="Contact GSC Supply Chain News - Get in touch with our team for inquiries, feedback, or collaboration opportunities."
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
              <BreadcrumbPage>Contact Us</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h1>
          <p className="text-gray-600 mb-6">
            We value your feedback and inquiries. Please use the form below to get in touch with our team, 
            or reach out directly using the contact details provided.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold text-[#BB1919] mb-4">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" required placeholder="Your full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" required placeholder="Your email address" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" required placeholder="What is your message about?" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    required
                    placeholder="Please provide details about your inquiry"
                    rows={5}
                  />
                </div>
                
                <Button type="submit" className="bg-[#BB1919] hover:bg-[#A00000]">
                  Send Message
                </Button>
              </form>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-[#BB1919] mb-4">Contact Information</h2>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4 flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-[#BB1919] mt-0.5" />
                    <div>
                      <h3 className="font-medium">Email Us</h3>
                      <p className="text-sm text-gray-600">General Inquiries:</p>
                      <p className="text-sm">info@GSCnews.co</p>
                      <p className="text-sm text-gray-600 mt-1">Editorial Team:</p>
                      <p className="text-sm">info@GSCnews.co</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-[#BB1919] mt-0.5" />
                    <div>
                      <h3 className="font-medium">Call Us</h3>
                      <p className="text-sm text-gray-600">Main Office:</p>
                      <p className="text-sm">+1 (555) 123-4567</p>
                      <p className="text-sm text-gray-600 mt-1">Customer Support:</p>
                      <p className="text-sm">+1 (555) 987-6543</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-[#BB1919] mt-0.5" />
                    <div>
                      <h3 className="font-medium">Business Hours</h3>
                      <p className="text-sm">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                      <p className="text-sm">Saturday: 10:00 AM - 2:00 PM EST</p>
                      <p className="text-sm">Sunday: Closed</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}