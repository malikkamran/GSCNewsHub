import React from "react";
import { Helmet } from "react-helmet";
import { Globe, ShieldCheck, Newspaper, Users, Award, Send } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

// Team member data
const teamMembers = [
  {
    name: "Sarah Thompson",
    title: "Editor-in-Chief",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    bio: "Sarah has 15+ years of experience covering global supply chains and international trade. Prior to GSC News, she was a senior editor at Economic Times and Bloomberg Supply Chain.",
  },
  {
    name: "David Chen",
    title: "Senior Logistics Correspondent",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    bio: "David specializes in transportation logistics and infrastructure development. He has reported from over 30 countries and holds an MBA in Supply Chain Management.",
  },
  {
    name: "Michael Rodriguez",
    title: "Technology & Innovation Editor",
    image: "https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    bio: "Michael covers emerging technologies in logistics, from blockchain to autonomous vehicles. He previously worked as a tech consultant for major logistics companies.",
  },
  {
    name: "Priya Sharma",
    title: "Procurement & Sourcing Analyst",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    bio: "Priya brings deep expertise in global sourcing strategies and supplier management. She holds a Ph.D. in Economics and has authored two books on procurement excellence.",
  },
];

// Core values
const coreValues = [
  {
    icon: <ShieldCheck className="h-8 w-8 text-[#BB1919]" />,
    title: "Editorial Integrity",
    description: "We maintain strict separation between our editorial content and business operations, ensuring unbiased reporting.",
  },
  {
    icon: <Globe className="h-8 w-8 text-[#BB1919]" />,
    title: "Global Perspective",
    description: "Our coverage spans the entire global supply chain ecosystem, providing insights relevant to all regions and markets.",
  },
  {
    icon: <Newspaper className="h-8 w-8 text-[#BB1919]" />,
    title: "Actionable Insights",
    description: "We focus on delivering practical, data-driven information that supply chain professionals can apply to their operations.",
  },
];

export default function AboutPage() {
  return (
    <MainLayout>
      <Helmet>
        <title>About Us | GSC Supply Chain News</title>
        <meta
          name="description"
          content="About GSC Supply Chain News - Your trusted source for comprehensive coverage of global supply chain developments, logistics innovations, and business insights."
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
              <BreadcrumbPage>About Us</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About GSC Supply Chain News</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your trusted source for comprehensive coverage of global supply chain developments, logistics innovations, and business insights.
            </p>
          </div>

          {/* Our Story */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-[#BB1919] mb-6">Our Story</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="prose prose-p:text-gray-700">
                <p>
                  Founded in 2018, GSC Supply Chain News emerged from a recognition that modern supply chains needed dedicated, specialized coverage that transcended traditional business reporting. Our founder, a veteran logistics journalist, saw how critical supply chains had become to the global economy, yet found that dedicated, in-depth coverage was lacking.
                </p>
                <p>
                  What began as a weekly newsletter has grown into a comprehensive news platform serving over 500,000 supply chain professionals across the globe. We've expanded our coverage to encompass all facets of the supply chain ecosystem, from procurement and manufacturing to transportation, warehousing, and last-mile delivery.
                </p>
              </div>
              <div className="prose prose-p:text-gray-700">
                <p>
                  Throughout our growth, we've maintained our core mission: to provide timely, accurate, and actionable information to the professionals who keep global commerce flowing. We've assembled a team of experienced journalists and analysts with deep industry knowledge, complemented by a network of contributors who are leaders in their respective fields.
                </p>
                <p>
                  Today, GSC Supply Chain News stands as an essential resource for supply chain decision-makers, providing not just news, but analysis, insights, and tools that help professionals navigate an increasingly complex and critical business function.
                </p>
              </div>
            </div>
          </div>

          {/* Our Values */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-[#BB1919] mb-6">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {coreValues.map((value, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <div className="mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-700">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Our Team */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-[#BB1919] mb-6">Our Editorial Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="mb-4 overflow-hidden rounded-full w-32 h-32 mx-auto">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-[#BB1919] mb-3">{member.title}</p>
                  <p className="text-sm text-gray-700">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Awards and Recognition */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-[#BB1919] mb-6">Awards and Recognition</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Award className="h-10 w-10 text-[#BB1919]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Supply Chain Journalism Excellence Award (2024)</h3>
                  <p className="text-gray-700">Recognized for outstanding coverage of global supply chain disruptions and recovery strategies.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Award className="h-10 w-10 text-[#BB1919]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Logistics Media Innovation Award (2023)</h3>
                  <p className="text-gray-700">Honored for our interactive data visualizations and multimedia reporting on transportation trends.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Award className="h-10 w-10 text-[#BB1919]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Business Reporting Merit Award (2022)</h3>
                  <p className="text-gray-700">Awarded for our investigative series on sustainability practices in global supply chains.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Users className="h-10 w-10 text-[#BB1919]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">500,000+ Monthly Readers</h3>
                  <p className="text-gray-700">Trusted by supply chain professionals across 120+ countries for reliable industry insights.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-[#BB1919] mb-6">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Editorial Inquiries</h3>
                <p className="text-gray-700 mb-3">For news tips, corrections, or press releases:</p>
                <p className="text-gray-900">editorial@gscsupplychainnews.com</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Business Development</h3>
                <p className="text-gray-700 mb-3">For partnership opportunities and advertising:</p>
                <p className="text-gray-900">business@gscsupplychainnews.com</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Headquarters</h3>
                <p className="text-gray-700 mb-3">
                  1234 Supply Chain Drive<br />
                  Logistics Center, NY 10001<br />
                  United States
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-12" />

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Community</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter to receive the latest supply chain insights directly in your inbox.
            </p>
            <Link href="/subscribe">
              <Button className="bg-[#BB1919] hover:bg-[#A10000]">
                <Send className="h-4 w-4 mr-2" />
                Subscribe to Newsletter
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}