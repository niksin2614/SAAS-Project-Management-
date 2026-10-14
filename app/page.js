"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  LayoutGrid,
  Calendar,
  Zap,
  KeyRound,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ParticleWave from "@/components/particle-wave";
import AppPreview from "@/components/landing/app-preview";

const capabilities = [
  {
    index: "01",
    title: "Visual Kanban Boards",
    description:
      "Move tasks easily across To Do, In Progress, In Review, and Done with smooth drag-and-drop columns.",
    icon: LayoutGrid,
    badge: "Drag & Drop",
  },
  {
    index: "02",
    title: "Sprint Planning",
    description:
      "Set sprint goals, choose 1 to 4 week durations or custom dates with calendar pickers, and track days remaining.",
    icon: Calendar,
    badge: "Sprints",
  },
  {
    index: "03",
    title: "Fast Task Management",
    description:
      "Create tasks in seconds with detailed descriptions, priority levels (Urgent, High, Medium, Low), and assignee tags.",
    icon: Zap,
    badge: "Easy Tasks",
  },
  {
    index: "04",
    title: "6-Digit Invite Codes",
    description:
      "Invite teammates to your workspace using simple 6-digit codes so they can join right away without hassle.",
    icon: KeyRound,
    badge: "Fast Invite",
  },
  {
    index: "05",
    title: "Multiple Workspaces",
    description:
      "Organize different teams and projects separately. Switch between your organizations with a single click.",
    icon: ShieldCheck,
    badge: "Workspaces",
  },
  {
    index: "06",
    title: "Built-In Team Chat",
    description:
      "Discuss tasks, solve blockers, and share quick updates in your dedicated workspace chat room.",
    icon: MessageSquare,
    badge: "Team Chat",
  },
];

const workflows = [
  {
    step: "01",
    title: "Create or Join a Workspace",
    description:
      "Set up a new organization workspace for your team or enter an invite code to join an existing one in seconds.",
  },
  {
    step: "02",
    title: "Plan Your Sprint",
    description:
      "Choose your sprint duration, pick your start and end dates, and add tasks to your backlog.",
  },
  {
    step: "03",
    title: "Track Work Daily",
    description:
      "Drag and drop tasks across columns as you make progress. Assign priorities and update statuses anytime.",
  },
  {
    step: "04",
    title: "Collaborate with Your Team",
    description:
      "Use built-in team chat to share updates and keep everyone aligned on project goals without leaving the app.",
  },
];

const faqs = [
  {
    question: "What is SYNCD?",
    answer:
      "SYNCD is an easy-to-use project management tool designed for agile teams. It helps you plan sprints, organize tasks on visual Kanban boards, collaborate in real-time chat, and manage multiple workspaces in one clean interface.",
  },
  {
    question: "How do the 6-digit invite codes work?",
    answer:
      "Workspace admins can generate a unique 6-digit code (like SYNCD-8K9P2X) from their workspace. Teammates simply enter this code to join the workspace immediately without complicated email invitations.",
  },
  {
    question: "Can I belong to more than one organization?",
    answer:
      "Yes. You can be part of multiple workspaces at the same time. The organization switcher dropdown lets you easily see all your organizations and switch between them with one click.",
  },
  {
    question: "How does the Kanban board work?",
    answer:
      "The board organizes your work into four clear stages: To Do, In Progress, In Review, and Done. You can simply drag and drop task cards between columns as work progresses.",
  },
  {
    question: "Is my organization's data kept private?",
    answer:
      "Yes. All projects, tasks, sprints, and chat messages are securely separated by organization. Only members who belong to your workspace can see your team's work.",
  },
  {
    question: "How do sprint timelines work in SYNCD?",
    answer:
      "You can create sprints with presets like 1 week, 2 weeks, 3 weeks, or 4 weeks, or pick custom dates using the calendar. SYNCD automatically tracks days remaining so your team stays on schedule.",
  },
];

export default function Home() {
  useEffect(() => {
    // Enable reveal animations only when JavaScript is running
    document.documentElement.classList.add("js-ready");

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    const elements = document.querySelectorAll("[data-reveal]");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -40px 0px",
        threshold: 0.08,
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-neutral-100 selection:bg-neutral-800">
      {/* Ambient Particle Wave in Hero Background */}
      <div className="absolute top-0 left-0 right-0 h-[680px] sm:h-[760px] pointer-events-none z-0 overflow-hidden opacity-60">
        <ParticleWave speed={0.75} opacity={0.65} interactive={true} />
        {/* Soft gradient masks to fade wave smoothly into black */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black" />
        <div className="absolute inset-0 bg-radial-vignette" />
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 container mx-auto pt-20 pb-20 sm:pt-28 sm:pb-32 px-4 text-center">
        {/* Top Badge */}
        <div
          data-reveal
          data-reveal-delay="50"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.12] text-neutral-300 text-xs font-mono tracking-widest uppercase mb-7 shadow-sm backdrop-blur-md"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>SYNCD • PROJECT MANAGEMENT MADE SIMPLE</span>
        </div>

        {/* Main Heading */}
        <h1
          data-reveal
          data-reveal-delay="150"
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white pb-5 max-w-4xl mx-auto leading-[1.08]"
        >
          Manage Projects.
          <br />
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400 inline-block">
            Work Better Together.
          </span>
        </h1>

        {/* Description */}
        <p
          data-reveal
          data-reveal-delay="250"
          className="text-sm sm:text-base lg:text-lg text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed font-normal"
        >
          Plan sprints, manage tasks, track progress, and collaborate with your team — all in one place.
        </p>

        {/* Buttons */}
        <div
          data-reveal
          data-reveal-delay="350"
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto"
        >
          <Link href="/onboarding" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto h-11 px-6 text-xs sm:text-sm font-semibold rounded-lg bg-white text-black hover:bg-neutral-200 shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-2"
            >
              <span>Get Started Free</span>
              <ChevronRight size={16} />
            </Button>
          </Link>
          <Link href="#preview" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-11 px-6 text-xs sm:text-sm font-medium rounded-lg border-white/[0.14] bg-neutral-900/60 hover:bg-neutral-800 text-neutral-200 hover:text-white backdrop-blur-md transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore SYNCD</span>
            </Button>
          </Link>
        </div>

        {/* Small Text & Genuine Attributes */}
        <div data-reveal data-reveal-delay="450">
          <p className="text-[11px] font-mono text-neutral-400 mt-4 tracking-wider uppercase">
            Simple setup • Easy collaboration • Built for teams
          </p>

          <div className="mt-14 pt-8 border-t border-white/[0.08] max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white">Kanban</div>
              <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest mt-0.5">
                Drag & Drop Tasks
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white">Sprints</div>
              <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest mt-0.5">
                Custom Timelines
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white">6-Digit</div>
              <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest mt-0.5">
                Team Invite Codes
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white">Workspaces</div>
              <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest mt-0.5">
                Separate Team Hubs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 01: APPLICATION PREVIEW */}
      <section id="preview" className="relative z-10 py-16 sm:py-24 px-4 bg-black">
        <div className="container mx-auto max-w-6xl">
          <div data-reveal className="text-center mb-10">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-neutral-400 block mb-2">
              01 / PLATFORM
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              See SYNCD in Action
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
              Explore how teams use SYNCD to manage sprint boards, track progress, chat together, and onboard new members.
            </p>
          </div>

          <div data-reveal data-reveal-delay="150">
            <AppPreview />
          </div>
        </div>
      </section>

      {/* SECTION 02: FEATURES */}
      <section
        id="features"
        className="relative z-10 py-20 sm:py-28 px-4 border-t border-white/[0.08] bg-[#050507]"
      >
        <div className="container mx-auto max-w-6xl">
          <div
            data-reveal
            className="mb-14 sm:mb-18 flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
            <div>
              <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-neutral-400 block mb-2">
                02 / FEATURES
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Everything You Need to Run
                <br />
                <span className="text-neutral-400 font-normal">Successful Agile Sprints</span>
              </h2>
            </div>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-md leading-relaxed font-normal">
              Practical tools designed to help teams stay organized, move quickly, and deliver work on time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((item, index) => (
              <div
                key={item.index}
                data-reveal
                data-reveal-delay={`${100 * ((index % 3) + 1)}`}
                className="p-6 sm:p-7 rounded-2xl bg-[#08080b] border border-white/[0.08] hover:border-white/[0.22] transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.6)] flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-black border border-white/[0.14] flex items-center justify-center text-white group-hover:border-white/30 transition-colors shadow-sm">
                      <item.icon className="w-5 h-5 text-neutral-200" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-neutral-400">
                      {item.badge}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-neutral-400 mb-1">
                    {item.index}
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight mb-2.5">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-neutral-400 group-hover:text-white transition-colors">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 03: HOW IT WORKS */}
      <section
        id="how-it-works"
        className="relative z-10 py-20 sm:py-28 px-4 border-t border-white/[0.08] bg-black"
      >
        <div className="container mx-auto max-w-6xl">
          <div data-reveal className="text-center mb-14 sm:mb-18">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-neutral-400 block mb-2">
              03 / HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              A Simple Workflow for Any Team
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
              From setting up your team to completing sprints in four straightforward steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {workflows.map((flow, index) => (
              <div
                key={flow.step}
                data-reveal
                data-reveal-delay={`${100 * (index + 1)}`}
                className="p-6 rounded-2xl bg-[#07070a] border border-white/[0.08] flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl font-mono font-bold text-white/30 mb-4">
                    {flow.step}
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight mb-2">
                    {flow.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                    {flow.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ready to Use</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 04: FAQ */}
      <section
        id="faq"
        className="relative z-10 py-20 sm:py-28 px-4 border-t border-white/[0.08] bg-[#050507]"
      >
        <div className="container mx-auto max-w-3xl">
          <div data-reveal className="text-center mb-12 sm:mb-16">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-neutral-400 block mb-2">
              04 / QUESTIONS & ANSWERS
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1.5">
              Clear answers about getting started, managing sprints, and team collaboration.
            </p>
          </div>

          <div data-reveal data-reveal-delay="100">
            <Accordion type="single" collapsible className="w-full space-y-3.5">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-white/[0.08] rounded-xl px-4 sm:px-5 bg-[#08080b] shadow-sm transition-all"
                >
                  <AccordionTrigger className="text-xs sm:text-sm font-semibold text-neutral-200 hover:text-white py-4 text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-neutral-400 leading-relaxed pb-4 pt-1 font-normal">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* SECTION 05: CLOSING CTA */}
      <section className="relative z-10 py-24 sm:py-32 px-4 border-t border-white/[0.08] bg-black text-center overflow-hidden">
        {/* Soft Radial Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-white/[0.03] rounded-full blur-[100px] pointer-events-none" />

        <div data-reveal className="relative z-10 container mx-auto max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.1] text-neutral-300 text-[11px] font-mono tracking-widest uppercase mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-neutral-300" />
            <span>Start Collaborating</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Manage Projects with SYNCD Today.
          </h2>

          <p className="text-xs sm:text-sm text-neutral-400 mb-8 max-w-md mx-auto leading-relaxed font-normal">
            Create a workspace for your team or join an existing organization in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link href="/onboarding" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-11 px-7 text-xs sm:text-sm font-semibold rounded-lg bg-white text-black hover:bg-neutral-200 shadow-[0_0_25px_rgba(255,255,255,0.25)] transition-all flex items-center justify-center gap-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/onboarding?tab=join" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-11 px-6 text-xs sm:text-sm font-medium rounded-lg border-white/[0.14] bg-neutral-900/60 hover:bg-neutral-800 text-neutral-200 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Join with Code</span>
              </Button>
            </Link>
          </div>

          <p className="text-[11px] font-mono text-neutral-500 mt-5">
            Free to use • No credit card required • Instant setup
          </p>
        </div>
      </section>
    </div>
  );
}
