import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ExternalLink, MessageCircle, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from 'next'
import { fetchServiceStatus, getStatusColor, getStatusText, type ServiceStatusData } from '@/lib/status'

const serviceData = {
  aws: {
    name: "Amazon Web Services (AWS)",
    slug: "aws",
    status: "operational",
    statusUrl: "https://status.aws.amazon.com/",
    communityUrl: "https://reddit.com/r/aws",
    tags: ["Cloud", "Infrastructure"],
    description:
      "Amazon Web Services is a comprehensive cloud computing platform offering over 200 services including compute, storage, database, networking, and more.",
    lastIncident: "2024-01-15",
    uptime: "99.95%",
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
    status: "operational",
    statusUrl: "https://status.cloud.google.com/",
    communityUrl: "https://reddit.com/r/googlecloud",
    tags: ["Cloud", "Infrastructure"],
    description:
      "Google Cloud Platform provides cloud computing services including compute, storage, big data, machine learning and application development.",
    lastIncident: "2024-01-10",
    uptime: "99.97%",
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
    status: "operational",
    statusUrl: "https://status.azure.com/",
    communityUrl: "https://reddit.com/r/azure",
    tags: ["Cloud", "Infrastructure"],
    description:
      "Microsoft Azure is a cloud computing platform offering services for building, testing, deploying, and managing applications through Microsoft-managed data centers.",
    lastIncident: "2024-01-12",
    uptime: "99.96%",
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
    status: "operational",
    statusUrl: "https://status.openai.com/",
    communityUrl: "https://reddit.com/r/openai",
    tags: ["AI/ML", "LLM"],
    description:
      "OpenAI provides cutting-edge AI models including GPT-4, DALL-E, and Whisper through their API platform for developers and businesses.",
    lastIncident: "2024-01-08",
    uptime: "99.9%",
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
    status: "operational",
    statusUrl: "https://status.anthropic.com/",
    communityUrl: "https://reddit.com/r/anthropic",
    tags: ["AI/ML", "LLM"],
    description:
      "Anthropic develops Claude, a helpful, harmless, and honest AI assistant, offering API access for developers and businesses.",
    lastIncident: "2024-01-05",
    uptime: "99.8%",
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
    status: "operational",
    statusUrl: "https://status.atlassian.com/",
    communityUrl: "https://reddit.com/r/jira",
    tags: ["Productivity", "Project Management"],
    description:
      "Jira is a project management and issue tracking tool used by agile teams to plan, track, and manage software development projects.",
    lastIncident: "2024-01-12",
    uptime: "99.9%",
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
    status: "operational",
    statusUrl: "https://status.stripe.com/",
    communityUrl: "https://reddit.com/r/stripe",
    tags: ["Payments", "E-commerce"],
    description:
      "Stripe is a payment processing platform that enables businesses to accept payments online and in mobile apps.",
    lastIncident: "2024-01-10",
    uptime: "99.99%",
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
}

type PageProps = {
  params: { service: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

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
  }
  return colors[tag as keyof typeof colors] || "bg-gray-100 text-gray-800"
}

const getRssUrl = (service: any) => {
  switch (service.slug) {
    case 'supabase':
      return 'https://status.supabase.com/history.rss'
    case 'anthropic':
      return 'https://status.anthropic.com/history.rss'
    case 'cohere':
      return 'https://status.cohere.com/feed.rss'
    case 'openai':
      return 'https://status.openai.com/feed.rss'
    default:
      return null
  }
}

export default async function ServiceStatusPage({
  params,
}: PageProps) {
  // Use Promise.resolve to properly handle dynamic params
  const { service: serviceSlug } = await Promise.resolve(params)
  const service = serviceData[serviceSlug as keyof typeof serviceData]
  
  if (!service) {
    notFound()
  }

  // Fetch real-time status if RSS feed is available
  const rssUrl = getRssUrl(service)
  const statusData = rssUrl ? await fetchServiceStatus(rssUrl) : {
    status: 'unknown' as const,
    incidents: []
  }
  
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
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${getStatusColor(statusData.status)}`}>
            <span className="text-sm font-medium">{getStatusText(statusData.status)}</span>
          </div>
          {statusData.lastIncident && (
            <p className="text-muted-foreground">
              Last incident: {new Date(statusData.lastIncident.createdAt).toLocaleDateString()}
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
                      <span className="text-muted-foreground">Last Incident</span>
                      <span>{statusData.lastIncident.title}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Incident Status</span>
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
                      dangerouslySetInnerHTML={{ __html: incident.htmlDescription }}
                    />
                    {incident.components.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Affected Components:</h4>
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
            <Link href={service.communityUrl} className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Community Discussion
            </Link>
          </Button>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {service.faq.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Related Services */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">Check Other Services</h3>
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
  )
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // Use Promise.resolve to properly handle dynamic params
  const { service: serviceSlug } = await Promise.resolve(params)
  const service = serviceData[serviceSlug as keyof typeof serviceData]
  
  if (!service) {
    return {
      title: 'Service Not Found',
      description: 'The requested service status page could not be found.'
    }
  }

  return {
    title: `${service.name} Status | Is ${service.name} Down?`,
    description: `Check the current status of ${service.name}. ${service.description || `Monitor ${service.name}'s service status, uptime, and recent incidents.`}`,
    openGraph: {
      title: `${service.name} Status | Is ${service.name} Down?`,
      description: `Check the current status of ${service.name}. ${service.description || `Monitor ${service.name}'s service status, uptime, and recent incidents.`}`,
      url: `https://status-page-aggregator.vercel.app/${service.slug}`,
    },
    twitter: {
      title: `${service.name} Status | Is ${service.name} Down?`,
      description: `Check the current status of ${service.name}. ${service.description || `Monitor ${service.name}'s service status, uptime, and recent incidents.`}`,
    },
  }
}
