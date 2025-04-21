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
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Sarah Reynolds",
      title: "Editor-in-Chief",
      bio: "Former logistics executive with over 15 years of experience in global supply chain management across multiple industries. Specialized in supply chain resilience and risk mitigation strategies.",
      image: "https://randomuser.me/api/portraits/women/45.jpg"
    },
    {
      name: "Michael Chen",
      title: "Senior Editor, Technology",
      bio: "Supply chain technology specialist with background in implementing digital transformation solutions for Fortune 500 companies. Expert in blockchain, IoT, and AI applications in logistics.",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Priya Sharma",
      title: "Senior Editor, Procurement",
      bio: "Procurement and sourcing specialist with experience in sustainable supply chain practices. Previously led strategic sourcing for a multinational manufacturing company.",
      image: "https://randomuser.me/api/portraits/women/33.jpg"
    },
    {
      name: "James Wilson",
      title: "Senior Editor, Logistics",
      bio: "Former operations manager for a global shipping company with extensive knowledge of international logistics, customs regulations, and transportation management.",
      image: "https://randomuser.me/api/portraits/men/52.jpg"
    }
  ];

  return (
    <div className="bg-gray-50">
      <Helmet>
        <title>About Us | GSC Supply Chain News</title>
        <meta
          name="description"
          content="About GSC Supply Chain News - Your trusted source for comprehensive coverage of global supply chain developments."
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

        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">About GSC Supply Chain News</h1>
          
          <div className="prose max-w-none prose-headings:text-[#BB1919] prose-headings:font-bold prose-p:text-gray-700">
            <p className="text-lg">
              GSC Supply Chain News is the premier source for comprehensive coverage of global supply chain developments, logistics innovations, and business insights that matter to supply chain professionals.
            </p>
            
            <h2>Our Mission</h2>
            <p>
              At GSC Supply Chain News, our mission is to provide accurate, timely, and insightful coverage of the complex global supply chain ecosystem. We strive to be the most trusted information source for supply chain professionals, delivering news and analysis that helps our readers navigate challenges, identify opportunities, and stay ahead in a rapidly evolving industry.
            </p>
            
            <h2>Our Approach</h2>
            <p>
              We believe that quality journalism requires depth, context, and real-world expertise. Our team combines rigorous reporting with industry knowledge to deliver stories that go beyond headlines, exploring the underlying trends, technologies, and strategies shaping global commerce and logistics.
            </p>
            <p>
              Our coverage spans the entire supply chain spectrum, from sourcing and procurement to manufacturing, transportation, warehousing, and last-mile delivery. We focus on issues that matter most to our readers, including:
            </p>
            <ul>
              <li>Supply chain resilience and risk management</li>
              <li>Digital transformation and technology implementation</li>
              <li>Sustainability and ESG considerations in supply chains</li>
              <li>Global trade policies and regulations</li>
              <li>Logistics innovation and best practices</li>
              <li>Talent development and workforce challenges</li>
              <li>Industry trends and market analysis</li>
            </ul>
            
            <h2>Our Values</h2>
            <p>
              Our work is guided by a commitment to:
            </p>
            <ul>
              <li><strong>Accuracy:</strong> We verify information through multiple sources and strive for factual precision in all our reporting.</li>
              <li><strong>Independence:</strong> Our editorial decisions are made independently, free from undue influence by commercial interests.</li>
              <li><strong>Fairness:</strong> We present diverse perspectives and give voice to all stakeholders in the supply chain ecosystem.</li>
              <li><strong>Relevance:</strong> We focus on stories and analysis that provide practical value to supply chain professionals.</li>
              <li><strong>Innovation:</strong> We continuously evolve our coverage and delivery methods to best serve our audience.</li>
            </ul>
          </div>
        </div>

        {/* Our Team Section */}
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-[#BB1919] mb-6">Our Editorial Team</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-lg">{member.name}</h3>
                      <p className="text-[#BB1919] font-medium mb-2">{member.title}</p>
                      <p className="text-gray-700 text-sm">{member.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 prose max-w-none prose-p:text-gray-700">
            <h2 className="text-2xl font-bold text-[#BB1919] mb-4">Contact Us</h2>
            <p>
              We welcome your feedback, story ideas, and inquiries. Please contact us at:
            </p>
            <p>
              <strong>General Inquiries:</strong> info@gscnews.co<br />
              <strong>Editorial Team:</strong> editorial@gscsupplychainnews.com<br />
              <strong>Press Releases:</strong> press@gscsupplychainnews.com<br />
              <strong>Advertising:</strong> advertising@gscsupplychainnews.com
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}