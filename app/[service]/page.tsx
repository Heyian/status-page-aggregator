export const revalidate = 0;
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ExternalLink,
  MessageCircle,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  fetchServiceStatus,
  getStatusColor,
  getStatusText,
  type ServiceStatusData,
} from "@/lib/status";

const serviceData = {
  aws: {
    name: "Amazon Web Services (AWS)",
    slug: "aws",
    statusUrl: "https://status.aws.amazon.com/",
    communityUrl: "https://reddit.com/r/aws",
    tags: ["Cloud", "Infrastructure"],
    description:
      "Amazon Web Services is a comprehensive cloud computing platform offering over 200 services including compute, storage, database, networking, and more.",
    faq: [
      {
        question: "Is AWS down right now?",
        answer:
          "Check the current AWS status above. AWS typically maintains 99.95% uptime across their services. If you're experiencing issues, check the official AWS Status page for real-time updates.",
      },
      {
        question: "How do I check AWS service status?",
        answer:
          "Visit status.aws.amazon.com for official status updates, or use this page for a quick overview. AWS also provides RSS feeds and can send notifications via SNS.",
      },
      {
        question: "What should I do if AWS is down?",
        answer:
          "First, check if it's a regional issue by testing different AWS regions. Check the AWS Status page for official updates and estimated resolution times. Consider implementing multi-region architecture for critical applications.",
      },
      {
        question: "How often does AWS go down?",
        answer:
          "AWS maintains high availability with 99.95%+ uptime. Major outages are rare, but regional issues can occur. AWS provides SLA credits for downtime that exceeds their commitments.",
      },
      {
        question: "Where can I get AWS outage notifications?",
        answer:
          "Subscribe to AWS Status page notifications, follow @AWSSupport on Twitter, or set up CloudWatch alarms for your specific services.",
      },
    ],
  },
  "google-cloud": {
    name: "Google Cloud Platform (GCP)",
    slug: "google-cloud",
    statusUrl: "https://status.google.com/",
    communityUrl: "https://reddit.com/r/GoogleCloud",
    tags: ["Cloud", "Infrastructure"],
    description:
      "Google Cloud Platform provides cloud computing services including compute, storage, big data, machine learning and application development.",
    faq: [
      {
        question: "Is Google Cloud down?",
        answer:
          "Check the current status indicator above. Google Cloud maintains excellent uptime across their global infrastructure. For detailed service status, visit status.cloud.google.com.",
      },
      {
        question: "How to check GCP service health?",
        answer:
          "Use the Google Cloud Status page at status.cloud.google.com or the Cloud Console. You can also subscribe to status notifications via email or RSS.",
      },
      {
        question: "What to do during a GCP outage?",
        answer:
          "Check if the issue is region-specific and consider switching to another region. Monitor the official status page for updates and implement multi-region deployments for critical workloads.",
      },
      {
        question: "How reliable is Google Cloud?",
        answer:
          "Google Cloud offers industry-leading uptime with 99.95%+ SLA for most services. They provide detailed SLA documentation and credits for any downtime.",
      },
      {
        question: "Where to report GCP issues?",
        answer:
          "Use Google Cloud Support, the Cloud Console, or community forums. For status updates, follow @googlecloud on Twitter or subscribe to status notifications.",
      },
    ],
  },
  azure: {
    name: "Microsoft Azure",
    slug: "azure",
    statusUrl: "https://status.azure.com/",
    communityUrl: "https://reddit.com/r/AZURE",
    tags: ["Cloud", "Infrastructure"],
    description:
      "Microsoft Azure is a cloud computing platform offering services for building, testing, deploying, and managing applications through Microsoft-managed data centers.",
    faq: [
      {
        question: "Is Microsoft Azure down?",
        answer:
          "Check the status indicator above for current Azure health. Azure maintains high availability across global regions. Visit status.azure.com for detailed service status.",
      },
      {
        question: "How to monitor Azure service status?",
        answer:
          "Use the Azure Status page, Azure Portal Service Health, or Azure mobile app. You can set up alerts and notifications for services you use.",
      },
      {
        question: "What to do if Azure is experiencing issues?",
        answer:
          "Check Service Health in Azure Portal for personalized impact assessment. Consider using multiple regions and availability zones for critical applications.",
      },
      {
        question: "How often does Azure have outages?",
        answer:
          "Azure maintains 99.95%+ uptime with comprehensive SLAs. Major global outages are rare, with most issues being regional or service-specific.",
      },
      {
        question: "How to get Azure outage alerts?",
        answer:
          "Configure Service Health alerts in Azure Portal, follow @AzureSupport on Twitter, or integrate with Stripe's webhook system for real-time updates.",
      },
    ],
  },
  openai: {
    name: "OpenAI",
    slug: "openai",
    statusUrl: "https://status.openai.com/",
    communityUrl: "https://community.openai.com/",
    tags: ["AI/ML", "LLM"],
    description:
      "OpenAI provides cutting-edge AI models including GPT-4, DALL-E, and Whisper through their API platform for developers and businesses.",
    faq: [
      {
        question: "Is OpenAI API down?",
        answer:
          "Check the current status above. OpenAI's API typically maintains high availability. For real-time updates, visit status.openai.com or check their Twitter @OpenAI.",
      },
      {
        question: "Why is ChatGPT not working?",
        answer:
          "ChatGPT issues can be due to high demand, maintenance, or technical problems. Check the OpenAI status page for current service health and any ongoing incidents.",
      },
      {
        question: "How to check OpenAI API limits?",
        answer:
          "Monitor your usage in the OpenAI dashboard. Rate limits vary by model and subscription tier. Implement proper error handling for rate limit responses (HTTP 429).",
      },
      {
        question: "What to do during OpenAI outages?",
        answer:
          "Implement fallback mechanisms, cache responses when possible, and consider using multiple AI providers for critical applications. Monitor the status page for updates.",
      },
      {
        question: "How reliable is OpenAI's service?",
        answer:
          "OpenAI maintains 99.9%+ uptime for their API services. They provide status updates and incident reports for transparency during any service disruptions.",
      },
    ],
  },
  anthropic: {
    name: "Anthropic (Claude)",
    slug: "anthropic",
    statusUrl: "https://status.anthropic.com/",
    communityUrl: "https://reddit.com/r/Anthropic",
    tags: ["AI/ML", "LLM"],
    description:
      "Anthropic develops Claude, a helpful, harmless, and honest AI assistant, offering API access for developers and businesses.",
    faq: [
      {
        question: "Is Claude API down?",
        answer:
          "Check the current status indicator above. Anthropic maintains high service availability. Visit status.anthropic.com for detailed service health information.",
      },
      {
        question: "How does Claude compare to other LLMs?",
        answer:
          "Claude is designed to be helpful, harmless, and honest. It excels at reasoning, analysis, and following instructions while maintaining safety guidelines.",
      },
      {
        question: "What are Claude's rate limits?",
        answer:
          "Rate limits depend on your subscription tier. Monitor usage in your Anthropic console and implement proper retry logic for rate-limited requests.",
      },
      {
        question: "How to handle Claude API errors?",
        answer:
          "Implement exponential backoff for retries, handle rate limits gracefully, and monitor the status page during any service disruptions.",
      },
      {
        question: "Is Claude suitable for production use?",
        answer:
          "Yes, Claude offers enterprise-grade reliability with comprehensive API documentation, SDKs, and support for production deployments.",
      },
    ],
  },
  jira: {
    name: "Atlassian Jira",
    slug: "jira",
    statusUrl: "https://status.atlassian.com/",
    communityUrl: "https://community.atlassian.com/forums/Jira/ct-p/jira",
    tags: ["Productivity", "Project Management"],
    description:
      "Jira is a project management and issue tracking tool used by agile teams to plan, track, and manage software development projects.",
    faq: [
      {
        question: "Is Jira down right now?",
        answer:
          "Check the status indicator above. Jira Cloud maintains high availability across global instances. Visit status.atlassian.com for detailed service status.",
      },
      {
        question: "Why is Jira running slow?",
        answer:
          "Slow performance can be due to large datasets, complex queries, or network issues. Check the Atlassian status page and consider optimizing your Jira configuration.",
      },
      {
        question: "How to check Jira service health?",
        answer:
          "Monitor status.atlassian.com, check your Jira admin console, and subscribe to status notifications for your specific Jira instance.",
      },
      {
        question: "What to do during Jira outages?",
        answer:
          "Document issues offline, communicate with your team about the outage, and check the Atlassian status page for estimated resolution times.",
      },
      {
        question: "How reliable is Jira Cloud?",
        answer:
          "Jira Cloud maintains 99.9%+ uptime with enterprise-grade infrastructure, automatic backups, and disaster recovery capabilities.",
      },
    ],
  },
  stripe: {
    name: "Stripe",
    slug: "stripe",
    statusUrl: "https://status.stripe.com/",
    communityUrl: "https://reddit.com/r/stripe",
    tags: ["Payments", "E-commerce"],
    description:
      "Stripe is a payment processing platform that enables businesses to accept payments online and in mobile apps.",
    faq: [
      {
        question: "Is Stripe down?",
        answer:
          "Check the current status above. Stripe maintains exceptional uptime for payment processing. Visit status.stripe.com for real-time service health.",
      },
      {
        question: "Why are payments failing?",
        answer:
          "Payment failures can be due to various reasons including card issues, network problems, or service disruptions. Check Stripe's status page and your dashboard for details.",
      },
      {
        question: "How to handle Stripe outages?",
        answer:
          "Implement retry logic, queue failed payments, and provide clear error messages to users. Monitor the status page for incident updates.",
      },
      {
        question: "What is Stripe's uptime guarantee?",
        answer:
          "Stripe maintains 99.99%+ uptime with comprehensive SLAs and provides credits for any downtime that affects your payment processing.",
      },
      {
        question: "How to get Stripe status notifications?",
        answer:
          "Subscribe to status updates at status.stripe.com, follow @StripeDev on Twitter, or integrate with Stripe's webhook system for real-time updates.",
      },
    ],
  },
  cloudflare: {
    name: "Cloudflare",
    slug: "cloudflare",
    statusUrl: "https://www.cloudflarestatus.com/",
    communityUrl: "https://reddit.com/r/CloudFlare",
    tags: ["CDN", "Security", "DNS", "Infrastructure"],
    description:
      "Cloudflare provides global CDN, DDoS protection, DNS services, and web security solutions to millions of websites and applications worldwide.",
    faq: [
      {
        question: "Is Cloudflare down?",
        answer:
          "Check the current status above. Cloudflare operates a global network with built-in redundancy. For real-time updates, visit cloudflarestatus.com or follow @cloudflare on Twitter.",
      },
      {
        question: "Why is my website slow despite using Cloudflare?",
        answer:
          "Slow performance can be due to origin server issues, cache misses, or network congestion. Check your origin server performance, cache settings, and Cloudflare analytics for optimization opportunities.",
      },
      {
        question: "How to troubleshoot Cloudflare DNS issues?",
        answer:
          "Use DNS lookup tools to verify records, check TTL settings, and ensure proper configuration. Cloudflare's DNS propagation can take up to 24 hours for new changes to fully propagate globally.",
      },
      {
        question: "What to do during Cloudflare outages?",
        answer:
          "Enable 'Always Online' mode, consider DNS failover to backup providers, and implement proper error handling. Monitor the status page and consider using multiple CDN providers for critical applications.",
      },
      {
        question: "How reliable is Cloudflare's network?",
        answer:
          "Cloudflare maintains 99.99%+ uptime across their global network of 300+ data centers. They provide detailed incident reports and real-time status updates for complete transparency.",
      },
    ],
  },
  slack: {
    name: "Slack",
    slug: "slack",
    statusUrl: "https://status.slack.com/",
    communityUrl:
      "https://trailhead.salesforce.com/trailblazer-community/neighborhoods/slack",
    tags: ["Communication", "Productivity"],
    description:
      "Slack is a business communication platform offering organized team conversations in channels, direct messaging, and file sharing for modern workplaces.",
    faq: [
      {
        question: "Is Slack down right now?",
        answer:
          "Check the current status above. Slack maintains high availability across their global infrastructure. Visit status.slack.com for real-time service health updates.",
      },
      {
        question: "Why can't I send messages on Slack?",
        answer:
          "Message delivery issues can be due to network connectivity, Slack service disruptions, or workspace settings. Check the status page and your internet connection first.",
      },
      {
        question: "How to troubleshoot Slack connectivity issues?",
        answer:
          "Try refreshing the app, clearing cache, checking firewall settings, or switching networks. Ensure your Slack app is updated to the latest version.",
      },
      {
        question: "What to do during Slack outages?",
        answer:
          "Use alternative communication channels like email or phone. Monitor the official status page for updates and estimated resolution times.",
      },
      {
        question: "How reliable is Slack's uptime?",
        answer:
          "Slack maintains 99.99% uptime SLA for paid plans with redundant infrastructure across multiple data centers and regions worldwide.",
      },
    ],
  },
  render: {
    name: "Render",
    slug: "render",
    statusUrl: "https://status.render.com/",
    communityUrl: "https://community.render.com/",
    tags: ["Cloud", "Hosting", "DevOps"],
    description:
      "Render is a cloud platform for hosting static sites, web services, databases, and more with automatic deployments from Git.",
    faq: [
      {
        question: "Is Render down?",
        answer:
          "Check the current status above. Render provides reliable cloud hosting with automatic scaling. Visit status.render.com for detailed service health information.",
      },
      {
        question: "Why is my Render service not deploying?",
        answer:
          "Deployment issues can be due to build failures, resource limits, or service disruptions. Check your build logs and the Render status page for any ongoing issues.",
      },
      {
        question: "How to troubleshoot Render connectivity?",
        answer:
          "Verify your service URL, check DNS settings, and ensure your service is running. Review deployment logs and resource usage in your Render dashboard.",
      },
      {
        question: "What to do during Render outages?",
        answer:
          "Monitor the status page for updates, consider backup hosting options, and implement health checks for automatic failover if needed.",
      },
      {
        question: "How reliable is Render's infrastructure?",
        answer:
          "Render provides enterprise-grade reliability with automatic scaling, health checks, and distributed infrastructure for high availability.",
      },
    ],
  },
  vercel: {
    name: "Vercel",
    slug: "vercel",
    statusUrl: "https://status.vercel.com/",
    communityUrl: "https://community.vercel.com/",
    tags: ["Cloud", "Hosting", "Frontend"],
    description:
      "Vercel is a cloud platform for static sites and serverless functions, offering instant global deployments with automatic scaling.",
    faq: [
      {
        question: "Is Vercel down?",
        answer:
          "Check the current status above. Vercel operates a global edge network with high availability. Visit vercel-status.com for real-time service updates.",
      },
      {
        question: "Why is my Vercel deployment failing?",
        answer:
          "Deployment failures can be due to build errors, function timeouts, or service limits. Check your build logs and function logs in the Vercel dashboard.",
      },
      {
        question: "How to troubleshoot Vercel performance issues?",
        answer:
          "Review your bundle size, optimize images, check function execution times, and verify edge caching settings. Use Vercel Analytics for insights.",
      },
      {
        question: "What to do during Vercel outages?",
        answer:
          "Monitor the status page, consider backup deployment strategies, and implement proper error handling for your applications.",
      },
      {
        question: "How reliable is Vercel's edge network?",
        answer:
          "Vercel provides 99.99% uptime with a global edge network spanning 40+ regions, automatic failover, and instant cache invalidation.",
      },
    ],
  },
  clerk: {
    name: "Clerk",
    slug: "clerk",
    statusUrl: "https://status.clerk.dev/",
    communityUrl: "https://dev.to/clerk",
    tags: ["Authentication", "Security"],
    description:
      "Clerk provides complete user management and authentication solutions with built-in security features for modern web applications.",
    faq: [
      {
        question: "Is Clerk authentication down?",
        answer:
          "Check the current status above. Clerk maintains high availability for authentication services. Visit status.clerk.com for real-time service health.",
      },
      {
        question: "Why can't users sign in with Clerk?",
        answer:
          "Sign-in issues can be due to service disruptions, incorrect configuration, or network problems. Check the status page and your Clerk dashboard settings.",
      },
      {
        question: "How to troubleshoot Clerk integration issues?",
        answer:
          "Verify API keys, check CORS settings, review webhook configurations, and ensure your domain is properly configured in the Clerk dashboard.",
      },
      {
        question: "What to do during Clerk outages?",
        answer:
          "Implement graceful degradation, cache user sessions when possible, and provide clear error messages. Monitor the status page for updates.",
      },
      {
        question: "How secure and reliable is Clerk?",
        answer:
          "Clerk provides enterprise-grade security with 99.99% uptime, SOC 2 compliance, and redundant infrastructure across multiple regions.",
      },
    ],
  },
  xai: {
    name: "xAI",
    slug: "xai",
    statusUrl: "https://status.x.ai/",
    communityUrl: "https://reddit.com/r/xAI",
    tags: ["AI/ML", "LLM"],
    description:
      "xAI develops Grok, an AI assistant with real-time knowledge and advanced reasoning capabilities, offering API access for developers.",
    faq: [
      {
        question: "Is xAI API down?",
        answer:
          "Check the current status above. xAI maintains reliable service for their Grok AI model. Visit status.x.ai for detailed service health information.",
      },
      {
        question: "Why is Grok not responding?",
        answer:
          "API issues can be due to rate limits, service disruptions, or incorrect request formatting. Check your API usage and the xAI status page.",
      },
      {
        question: "How to handle xAI rate limits?",
        answer:
          "Implement exponential backoff, monitor your usage limits, and consider request batching. Check your xAI dashboard for current rate limit information.",
      },
      {
        question: "What to do during xAI outages?",
        answer:
          "Implement fallback mechanisms, cache responses when possible, and monitor the status page for estimated resolution times.",
      },
      {
        question: "How reliable is xAI's service?",
        answer:
          "xAI provides enterprise-grade reliability with comprehensive monitoring, automatic scaling, and transparent status reporting for all services.",
      },
    ],
  },
  elevenlabs: {
    name: "ElevenLabs",
    slug: "elevenlabs",
    statusUrl: "https://status.elevenlabs.io/",
    communityUrl: "https://reddit.com/r/ElevenLabs",
    tags: ["AI/ML", "Voice", "Audio"],
    description:
      "ElevenLabs provides AI-powered voice synthesis and cloning technology, offering realistic text-to-speech and voice generation APIs.",
    faq: [
      {
        question: "Is ElevenLabs API down?",
        answer:
          "Check the current status above. ElevenLabs maintains high availability for voice generation services. Visit status.elevenlabs.io for real-time updates.",
      },
      {
        question: "Why is voice generation failing?",
        answer:
          "Generation issues can be due to service limits, API errors, or invalid input. Check your API usage, input text format, and the ElevenLabs status page.",
      },
      {
        question: "How to troubleshoot ElevenLabs voice quality?",
        answer:
          "Verify input text formatting, check voice model settings, adjust stability and clarity parameters, and ensure proper audio format specifications.",
      },
      {
        question: "What to do during ElevenLabs outages?",
        answer:
          "Implement retry logic with exponential backoff, cache generated audio when possible, and consider backup voice generation services.",
      },
      {
        question: "How reliable is ElevenLabs' voice API?",
        answer:
          "ElevenLabs provides enterprise-grade reliability with global infrastructure, automatic scaling, and comprehensive API monitoring for consistent service delivery.",
      },
    ],
  },
  pinecone: {
    name: "Pinecone",
    slug: "pinecone",
    statusUrl: "https://status.pinecone.io/",
    communityUrl: "https://reddit.com/r/MachineLearning",
    tags: ["Database", "AI/ML", "Vector Search"],
    description:
      "Pinecone is a fully managed vector database for machine learning applications, providing fast similarity search and recommendations at scale.",
    faq: [
      {
        question: "Is Pinecone down?",
        answer:
          "Check the current status above. Pinecone maintains high availability for vector database operations. Visit status.pinecone.io for service health details.",
      },
      {
        question: "Why are my Pinecone queries slow?",
        answer:
          "Slow queries can be due to index size, query complexity, or service load. Check your index configuration, query parameters, and the Pinecone status page.",
      },
      {
        question: "How to troubleshoot Pinecone indexing issues?",
        answer:
          "Verify your vector dimensions, check API limits, ensure proper authentication, and review your index configuration in the Pinecone console.",
      },
      {
        question: "What to do during Pinecone outages?",
        answer:
          "Implement local caching for critical queries, use read replicas if available, and monitor the status page for estimated resolution times.",
      },
      {
        question: "How reliable is Pinecone's vector database?",
        answer:
          "Pinecone provides enterprise-grade reliability with 99.99% uptime, automatic scaling, multi-region support, and comprehensive monitoring.",
      },
    ],
  },
  "mongodb-atlas": {
    name: "MongoDB Atlas",
    slug: "mongodb-atlas",
    statusUrl: "https://status.mongodb.com/",
    communityUrl: "https://reddit.com/r/mongodb",
    tags: ["Database", "Cloud", "NoSQL"],
    description:
      "MongoDB Atlas is a fully managed cloud database service for modern applications, offering automated scaling, backup, and security features.",
    faq: [
      {
        question: "Is MongoDB Atlas down?",
        answer:
          "Check the current status above. MongoDB Atlas maintains high availability across global regions. Visit status.mongodb.com for detailed service health.",
      },
      {
        question: "Why can't I connect to my Atlas cluster?",
        answer:
          "Connection issues can be due to network settings, authentication problems, or service disruptions. Check your connection string, IP whitelist, and Atlas status.",
      },
      {
        question: "How to troubleshoot Atlas performance issues?",
        answer:
          "Review your queries, check index usage, monitor cluster metrics in Atlas, and ensure proper connection pooling in your application.",
      },
      {
        question: "What to do during Atlas outages?",
        answer:
          "Use replica sets for automatic failover, implement connection retry logic, and consider multi-region deployments for critical applications.",
      },
      {
        question: "How reliable is MongoDB Atlas?",
        answer:
          "MongoDB Atlas provides 99.95%+ uptime with automated backups, point-in-time recovery, and global cluster deployments for maximum availability.",
      },
    ],
  },
};

type PageProps = {
  params: { service: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

function getTagColor(tag: string) {
  const colors = {
    Cloud: "bg-blue-100 text-blue-800",
    Infrastructure: "bg-gray-100 text-gray-800",
    "AI/ML": "bg-purple-100 text-purple-800",
    LLM: "bg-indigo-100 text-indigo-800",
    Database: "bg-green-100 text-green-800",
    DevOps: "bg-orange-100 text-orange-800",
    Payments: "bg-yellow-100 text-yellow-800",
    Communication: "bg-pink-100 text-pink-800",
    Productivity: "bg-cyan-100 text-cyan-800",
    Monitoring: "bg-red-100 text-red-800",
    Email: "bg-teal-100 text-teal-800",
    CDN: "bg-violet-100 text-violet-800",
    "E-commerce": "bg-emerald-100 text-emerald-800",
    "Project Management": "bg-indigo-100 text-indigo-800",
  };
  return colors[tag as keyof typeof colors] || "bg-gray-100 text-gray-800";
}

const getRssUrl = (service: any) => {
  switch (service.slug) {
    case "supabase":
      return "https://status.supabase.com/history.rss";
    case "anthropic":
      return "https://status.anthropic.com/history.rss";
    case "cohere":
      return "https://status.cohere.com/feed.rss";
    case "openai":
      return "https://status.openai.com/feed.rss";
    case "azure":
      return "https://rssfeed.azure.status.microsoft/en-us/status/feed/";
    case "slack":
      return "https://slack-status.com/feed/rss";
    case "render":
      return "https://status.render.com/history.rss";
    case "vercel":
      return "https://www.vercel-status.com/history.rss";
    case "clerk":
      return "https://status.clerk.com/feed.rss";
    case "xai":
      return "https://status.x.ai/feed.xml";
    case "elevenlabs":
      return "https://status.elevenlabs.io/feed.rss";
    case "pinecone":
      return "https://status.pinecone.io/history.rss";
    case "mongodb-atlas":
      return "https://status.mongodb.com/history.rss";
    default:
      return null;
  }
};

const getStatusAPIUrl = (service: any) => {
  switch (service.slug) {
    case "cloudflare":
      return {
        status: "https://www.cloudflarestatus.com/api/v2/summary.json",
        incidents: "https://www.cloudflarestatus.com/api/v2/incidents.json",
      };
    default:
      return null;
  }
};

export default async function ServiceStatusPage({ params }: PageProps) {
  // Use Promise.resolve to properly handle dynamic params
  const { service: serviceSlug } = await Promise.resolve(params);
  const service = serviceData[serviceSlug as keyof typeof serviceData];

  if (!service) {
    notFound();
  }

  // Fetch real-time status if RSS feed is available
  const rssUrl = getRssUrl(service);
  const statusData = rssUrl
    ? await fetchServiceStatus(rssUrl)
    : {
        status: "unknown" as const,
        incidents: [],
      };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                prefetch={true}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-primary">DrDroid</h1>
            </div>
            <Badge variant="outline" className="text-xs">
              Status Checker
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Status Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">{service.name} Status</h1>
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${getStatusColor(
              statusData.status
            )}`}
          >
            <span className="text-sm font-medium">
              {getStatusText(statusData.status)}
            </span>
          </div>
          {statusData.lastIncident && (
            <p className="text-muted-foreground">
              Last incident:{" "}
              {new Date(statusData.lastIncident.createdAt).toLocaleDateString()}
            </p>
          )}
          {!rssUrl && (
            <p className="text-muted-foreground mt-2">
              Real-time status updates are not available for this service.
            </p>
          )}
        </div>

        {/* Status Details */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Overall Status</span>
                  <span className={getStatusColor(statusData.status)}>
                    {getStatusText(statusData.status)}
                  </span>
                </div>
                {statusData.lastIncident && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Last Incident
                      </span>
                      <span>{statusData.lastIncident.title}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Incident Status
                      </span>
                      <span>{statusData.lastIncident.status}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Incidents */}
        {statusData.incidents.length > 0 && (
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-2xl font-bold mb-4">Recent Incidents</h2>
            <div className="space-y-4">
              {statusData.incidents.slice(0, 5).map((incident, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{incident.title}</CardTitle>
                    <CardDescription>
                      {new Date(incident.createdAt).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none mb-4"
                      dangerouslySetInnerHTML={{
                        __html: incident.htmlDescription,
                      }}
                    />
                    {incident.components.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">
                          Affected Components:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {incident.components.map((component, i) => (
                            <Badge key={i} variant="secondary">
                              {component}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-12">
          <Button size="lg" asChild>
            <Link href={service.statusUrl} className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Official Status Page
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link
              href={service.communityUrl}
              className="flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Community Discussion
            </Link>
          </Button>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {service.faq.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Related Services */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">
            Check Other Services
          </h3>
          <div className="flex justify-center gap-4 flex-wrap">
            {Object.entries(serviceData)
              .filter(([key]) => key !== serviceSlug)
              .slice(0, 4)
              .map(([key, data]) => (
                <Button key={key} variant="outline" asChild>
                  <Link href={`/${key}`}>{data.name}</Link>
                </Button>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // Use Promise.resolve to properly handle dynamic params
  const { service: serviceSlug } = await Promise.resolve(params);
  const service = serviceData[serviceSlug as keyof typeof serviceData];

  if (!service) {
    return {
      title: "Service Not Found",
      description: "The requested service status page could not be found.",
    };
  }

  return {
    title: `${service.name} Status | Is ${service.name} Down?`,
    description: `Check the current status of ${service.name}. ${
      service.description ||
      `Monitor ${service.name}'s service status, uptime, and recent incidents.`
    }`,
    openGraph: {
      title: `${service.name} Status | Is ${service.name} Down?`,
      description: `Check the current status of ${service.name}. ${
        service.description ||
        `Monitor ${service.name}'s service status, uptime, and recent incidents.`
      }`,
      url: `https://status-page-aggregator.vercel.app/${service.slug}`,
    },
    twitter: {
      title: `${service.name} Status | Is ${service.name} Down?`,
      description: `Check the current status of ${service.name}. ${
        service.description ||
        `Monitor ${service.name}'s service status, uptime, and recent incidents.`
      }`,
    },
  };
}

export const dynamic = "force-dynamic";
