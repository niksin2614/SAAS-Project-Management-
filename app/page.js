import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  Layout,
  Calendar,
  BarChart,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is SYNCD?",
    answer:
      "SYNCD is a powerful project management tool designed to help teams organize, track, and manage their work efficiently. It combines intuitive design with robust features to streamline your workflow and boost productivity.",
  },
  {
    question: "How does SYNCD compare to other project management tools?",
    answer:
      "SYNCD offers a unique combination of intuitive design, powerful features, and flexibility. Unlike other tools, we focus on providing a seamless experience for both agile and traditional project management methodologies, making it versatile for various team structures and project types.",
  },
  {
    question: "Is SYNCD suitable for small teams?",
    answer:
      "Absolutely! SYNCD is designed to be scalable and flexible. It works great for small teams and can easily grow with your organization as it expands. Our user-friendly interface ensures that teams of any size can quickly adapt and start benefiting from SYNCD's features.",
  },
  {
    question: "What key features does SYNCD offer?",
    answer:
      "SYNCD provides a range of powerful features including intuitive Kanban boards for visualizing workflow, robust sprint planning tools for agile teams, comprehensive reporting for data-driven decisions, customizable workflows, time tracking, and team collaboration tools. These features work seamlessly together to enhance your project management experience.",
  },
  {
    question: "Can SYNCD handle multiple projects simultaneously?",
    answer:
      "Yes, SYNCD is built to manage multiple projects concurrently. You can easily switch between projects, and get a bird's-eye view of all your ongoing work. This makes SYNCD ideal for organizations juggling multiple projects or clients.",
  },
  {
    question: "Is there a learning curve for new users?",
    answer:
      "While SYNCD is packed with features, we've designed it with user-friendliness in mind. New users can quickly get up to speed thanks to our intuitive interface, helpful onboarding process, and comprehensive documentation.",
  },
];

const features = [
  {
    title: "Intuitive Kanban Boards",
    description:
      "Visualize your workflow and optimize team productivity with our easy-to-use Kanban boards.",
    icon: Layout,
  },
  {
    title: "Powerful Sprint Planning",
    description:
      "Plan and manage sprints effectively, ensuring your team stays focused on delivering value.",
    icon: Calendar,
  },
  {
    title: "Comprehensive Reporting",
    description:
      "Gain insights into your team's performance with detailed, customizable reports and analytics.",
    icon: BarChart,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto py-12 sm:py-16 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white pb-3 max-w-3xl mx-auto leading-tight">
          Streamline Your Workflow with{" "}
          <span className="gradient-title inline-block">SYNCD</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-300 mb-8 max-w-xl mx-auto">
          Empower your team with our intuitive project management solution.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/onboarding">
            <Button size="sm" className="h-9 px-4 text-xs sm:text-sm rounded-lg font-semibold">
              Get Started <ChevronRight size={15} className="ml-1" />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="sm" variant="outline" className="h-9 px-4 text-xs sm:text-sm rounded-lg">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-900/60 py-12 sm:py-16 px-4 border-y border-slate-800/80">
        <div className="container mx-auto max-w-5xl">
          <h3 className="text-xl sm:text-2xl font-bold mb-8 text-center text-white">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800/80 border-slate-700/60 rounded-xl shadow-lg">
                <CardContent className="p-5">
                  <feature.icon className="h-7 w-7 mb-3 text-blue-400" />
                  <h4 className="text-base font-semibold mb-1.5 text-white">
                    {feature.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-900/40 py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h3 className="text-xl sm:text-2xl font-bold mb-8 text-center text-white">
            Frequently Asked Questions
          </h3>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-slate-800">
                <AccordionTrigger className="text-xs sm:text-sm font-semibold text-slate-200 hover:text-white py-3">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 text-center px-4">
        <div className="container mx-auto max-w-2xl">
          <h3 className="text-xl sm:text-2xl font-bold mb-2.5 text-white">
            Ready to Transform Your Workflow?
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 mb-6 max-w-lg mx-auto">
            Join thousands of teams already using SYNCD to streamline their
            projects and boost productivity.
          </p>
          <Link href="/onboarding">
            <Button size="sm" className="h-9 px-5 text-xs sm:text-sm rounded-lg font-semibold bg-blue-600 hover:bg-blue-500 shadow-md">
              Start For Free <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
