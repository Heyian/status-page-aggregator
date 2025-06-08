import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Github, MessageCircle } from "lucide-react"
import Link from "next/link"
import { fetchServiceStatus, getStatusColor, getStatusText } from '@/lib/status'
import { supabase } from '@/lib/supabase'
import { StatusMonitorClient } from './components/StatusMonitorClient'

// Add type definitions at the top of the file
type ServiceStatus = 'operational' | 'degraded' | 'outage' | 'unknown'

interface Service {
  name: string
  status: ServiceStatus
  statusUrl: string
  communityUrl: string
  slug: string
  tags: string[]
}

interface StatusMap {
  [key: string]: {
    status: ServiceStatus
    last_incident?: {
      createdAt: string
    }
  }
}

const services: Service[] = [
  // Cloud Providers
  {
    name: "AWS",
    status: "unknown" as ServiceStatus,
    statusUrl: "https://status.aws.amazon.com/",
    communityUrl: "https://reddit.com/r/aws",
    slug: "aws",
    tags: ["Cloud", "Infrastructure"],
  },
  {
    name: "Google Cloud",
    status: "unknown" as ServiceStatus,
    statusUrl: "https://status.cloud.google.com/",
    communityUrl: "https://reddit.com/r/googlecloud",
    slug: "google-cloud",
    tags: ["Cloud", "Infrastructure"],
  },
  {
    name: "Microsoft Azure",
    status: "unknown" as ServiceStatus,
    statusUrl: "https://status.azure.com/",
    communityUrl: "https://reddit.com/r/azure",
    slug: "azure",
    tags: ["Cloud", "Infrastructure"],
  },
  {
    name: "DigitalOcean",
    status: "unknown" as ServiceStatus,
    statusUrl: "https://status.digitalocean.com/",
    communityUrl: "https://reddit.com/r/digitalocean",
    slug: "digitalocean",
    tags: ["Cloud", "Infrastructure"],
  },
  {
    name: "Linode",
    status: "unknown" as ServiceStatus,
    statusUrl: "https://status.linode.com/",
    communityUrl: "https://reddit.com/r/linode",
    slug: "linode",
    tags: ["Cloud", "Infrastructure"],
  },

  // LLM Providers
  {
    name: "OpenAI",
    status: "unknown" as ServiceStatus,
    statusUrl: "https://status.openai.com/",
    communityUrl: "https://reddit.com/r/openai",
    slug: "openai",
    tags: ["AI/ML", "LLM"],
  },
  {
    name: "Anthropic",
    status: "unknown" as ServiceStatus,
    statusUrl: "https://status.anthropic.com/",
    communityUrl: "https://reddit.com/r/anthropic",
    slug: "anthropic",
    tags: ["AI/ML", "LLM"],
  },
  {
    name: "Google AI",
    status: "unknown" as ServiceStatus,
    statusUrl: "https://status.cloud.google.com/",
    communityUrl: "https://reddit.com/r/googleai",
    slug: "google-ai",
    tags: ["AI/ML", "LLM"],
  },
  {
    name: "Cohere",
    status: "unknown" as ServiceStatus,
    statusUrl: "https://status.cohere.com/",
    communityUrl: "https://reddit.com/r/cohere",
    slug: "cohere",
    tags: ["AI/ML", "LLM"],
  },
  {
    name: "Hugging Face",
    status: "unknown" as ServiceStatus,
    statusUrl: "https://status.huggingface.co/",
    communityUrl: "https://reddit.com/r/huggingface",
    slug: "hugging-face",
    tags: ["AI/ML", "LLM"],
  },
  {
    name: "Replicate",
    status: "unknown" as ServiceStatus,
    statusUrl: "https://status.replicate.com/",
    communityUrl: "https://reddit.com/r/replicate",
    slug: "replicate",
    tags: ["AI/ML", "LLM"],
  },

  // Atlassian
  {
    name: "Jira",
    status: "unknown" as ServiceStatus,
    statusUrl: "https://status.atlassian.com/",
    communityUrl: "https://reddit.com/r/jira",
    slug: "jira",
    tags: ["Productivity", "Project Management"],
  },
  {
    name: "Confluence",
    status: "unknown" as ServiceStatus,
    statusUrl: "https://status.atlassian.com/",
    communityUrl: "https://reddit.com/r/confluence",
    slug: "confluence",
    tags: ["Productivity", "Documentation"],
  },
  {
    name: "Bitbucket",
    status: "unknown" as ServiceStatus,
    statusUrl: "https://status.atlassian.com/",
    communityUrl: "https://reddit.com/r/bitbucket",
    slug: "bitbucket",
    tags: ["DevOps", "Version Control"],
  },
  {
    name: "Trello",
    status: "unknown" as ServiceStatus,
    statusUrl: "https://status.atlassian.com/",
    communityUrl: "https://reddit.com/r/trello",
    slug: "trello",
    tags: ["Productivity", "Project Management"],
  },

  // Databases
  {
    name: "MongoDB",
    status: "unknown" as ServiceStatus,
    statusUrl: "https://status.mongodb.com/",
    communityUrl: "https://reddit.com/r/mongodb",
    slug: "mongodb",
    tags: ["Database", "NoSQL"],
  },
  {
    name: "PostgreSQL",
    status: "operational" as ServiceStatus,
    statusUrl: "https://postgresql.org/support/",
    communityUrl: "https://reddit.com/r/postgresql",
    slug: "postgresql",
    tags: ["Database", "SQL"],
  },
  {
    name: "Redis",
    status: "degraded" as ServiceStatus,
    statusUrl: "https://status.redis.com/",
    communityUrl: "https://reddit.com/r/redis",
    slug: "redis",
    tags: ["Database", "Cache"],
  },
  {
    name: "Supabase",
    status: "unknown" as ServiceStatus,
    statusUrl: "https://status.supabase.com/",
    communityUrl: "https://reddit.com/r/supabase",
    slug: "supabase",
    tags: ["Database", "Backend"],
  },
  {
    name: "PlanetScale",
    status: "operational" as ServiceStatus,
    statusUrl: "https://planetscale.com/status",
    communityUrl: "https://reddit.com/r/planetscale",
    slug: "planetscale",
    tags: ["Database", "SQL"],
  },
  {
    name: "FaunaDB",
    status: "operational" as ServiceStatus,
    statusUrl: "https://status.fauna.com/",
    communityUrl: "https://reddit.com/r/faunadb",
    slug: "faunadb",
    tags: ["Database", "Serverless"],
  },

  // DevOps & Deployment
  {
    name: "Vercel",
    status: "operational" as ServiceStatus,
    statusUrl: "https://vercel.com/status",
    communityUrl: "https://github.com/vercel/vercel/discussions",
    slug: "vercel",
    tags: ["DevOps", "Hosting"],
  },
  {
    name: "Netlify",
    status: "operational" as ServiceStatus,
    statusUrl: "https://status.netlify.com/",
    communityUrl: "https://reddit.com/r/netlify",
    slug: "netlify",
    tags: ["DevOps", "Hosting"],
  },
  {
    name: "GitHub",
    status: "operational" as ServiceStatus,
    statusUrl: "https://githubstatus.com/",
    communityUrl: "https://github.com/community/community/discussions",
    slug: "github",
    tags: ["DevOps", "Version Control"],
  },
  {
    name: "GitLab",
    status: "operational" as ServiceStatus,
    statusUrl: "https://status.gitlab.com/",
    communityUrl: "https://reddit.com/r/gitlab",
    slug: "gitlab",
    tags: ["DevOps", "Version Control"],
  },
  {
    name: "Docker Hub",
    status: "operational" as ServiceStatus,
    statusUrl: "https://status.docker.com/",
    communityUrl: "https://reddit.com/r/docker",
    slug: "docker-hub",
    tags: ["DevOps", "Containers"],
  },
  {
    name: "CircleCI",
    status: "operational" as ServiceStatus,
    statusUrl: "https://status.circleci.com/",
    communityUrl: "https://reddit.com/r/circleci",
    slug: "circleci",
    tags: ["DevOps", "CI/CD"],
  },

  // CDN & Infrastructure
  {
    name: "Cloudflare",
    status: "operational" as ServiceStatus,
    statusUrl: "https://cloudflarestatus.com/",
    communityUrl: "https://reddit.com/r/cloudflare",
    slug: "cloudflare",
    tags: ["CDN", "Security"],
  },
  {
    name: "Fastly",
    status: "operational" as ServiceStatus,
    statusUrl: "https://status.fastly.com/",
    communityUrl: "https://reddit.com/r/fastly",
    slug: "fastly",
    tags: ["CDN", "Edge Computing"],
  },

  // Payment & E-commerce
  {
    name: "Stripe",
    status: "operational" as ServiceStatus,
    statusUrl: "https://status.stripe.com/",
    communityUrl: "https://reddit.com/r/stripe",
    slug: "stripe",
    tags: ["Payments", "E-commerce"],
  },
  {
    name: "PayPal",
    status: "operational" as ServiceStatus,
    statusUrl: "https://status.paypal.com/",
    communityUrl: "https://reddit.com/r/paypal",
    slug: "paypal",
    tags: ["Payments", "E-commerce"],
  },
  {
    name: "Shopify",
    status: "operational" as ServiceStatus,
    statusUrl: "https://status.shopify.com/",
    communityUrl: "https://reddit.com/r/shopify",
    slug: "shopify",
    tags: ["E-commerce", "Platform"],
  },

  // Communication
  {
    name: "Slack",
    status: "operational" as ServiceStatus,
    statusUrl: "https://status.slack.com/",
    communityUrl: "https://reddit.com/r/slack",
    slug: "slack",
    tags: ["Communication", "Productivity"],
  },
  {
    name: "Discord",
    status: "operational" as ServiceStatus,
    statusUrl: "https://discordstatus.com/",
    communityUrl: "https://reddit.com/r/discord",
    slug: "discord",
    tags: ["Communication", "Gaming"],
  },
  {
    name: "Zoom",
    status: "operational" as ServiceStatus,
    statusUrl: "https://status.zoom.us/",
    communityUrl: "https://reddit.com/r/zoom",
    slug: "zoom",
    tags: ["Communication", "Video"],
  },
  {
    name: "Microsoft Teams",
    status: "operational" as ServiceStatus,
    statusUrl: "https://status.office365.com/",
    communityUrl: "https://reddit.com/r/microsoftteams",
    slug: "microsoft-teams",
    tags: ["Communication", "Productivity"],
  },

  // Monitoring & Analytics
  {
    name: "Datadog",
    status: "operational" as ServiceStatus,
    statusUrl: "https://status.datadoghq.com/",
    communityUrl: "https://reddit.com/r/datadog",
    slug: "datadog",
    tags: ["Monitoring", "Analytics"],
  },
  {
    name: "New Relic",
    status: "operational" as ServiceStatus,
    statusUrl: "https://status.newrelic.com/",
    communityUrl: "https://reddit.com/r/newrelic",
    slug: "new-relic",
    tags: ["Monitoring", "APM"],
  },
  {
    name: "Sentry",
    status: "operational" as ServiceStatus,
    statusUrl: "https://status.sentry.io/",
    communityUrl: "https://reddit.com/r/sentry",
    slug: "sentry",
    tags: ["Monitoring", "Error Tracking"],
  },

  // Email Services
  {
    name: "SendGrid",
    status: "operational" as ServiceStatus,
    statusUrl: "https://status.sendgrid.com/",
    communityUrl: "https://reddit.com/r/sendgrid",
    slug: "sendgrid",
    tags: ["Email", "Communication"],
  },
  {
    name: "Mailgun",
    status: "operational" as ServiceStatus,
    statusUrl: "https://status.mailgun.com/",
    communityUrl: "https://reddit.com/r/mailgun",
    slug: "mailgun",
    tags: ["Email", "Communication"],
  },
  {
    name: "Postmark",
    status: "operational" as ServiceStatus,
    statusUrl: "https://status.postmarkapp.com/",
    communityUrl: "https://reddit.com/r/postmark",
    slug: "postmark",
    tags: ["Email", "Communication"],
  },
]

function StatusIndicator({ status }: { status: string }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-500"
      case "degraded":
        return "bg-yellow-500"
      case "outage":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return <div className={`w-4 h-4 rounded-full ${getStatusColor(status)}`} />
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
    Hosting: "bg-lime-100 text-lime-800",
    Security: "bg-rose-100 text-rose-800",
  }
  return colors[tag as keyof typeof colors] || "bg-gray-100 text-gray-800"
}

export default async function StatusMonitor() {
  // Debug: Log environment variables (they will be undefined in the browser due to NEXT_PUBLIC_ prefix)
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 10) + '...')
  console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  // Fetch statuses from Supabase
  const { data: statusRows, error } = await supabase
    .from('service_status')
    .select('*')

  // Debug: Log the query results
  console.log('Supabase Query Results:', {
    hasData: !!statusRows,
    rowCount: statusRows?.length,
    error: error?.message,
    firstRow: statusRows?.[0]
  })

  if (error) {
    console.error('Supabase Error:', error)
  }

  // Map statuses by slug for easy lookup
  const statusMap = (statusRows || []).reduce((acc: Record<string, any>, row: any) => {
    acc[row.service_slug] = {
      status: row.status,
      last_incident: row.last_incident ? {
        createdAt: row.last_incident
      } : undefined
    }
    return acc
  }, {} as Record<string, any>)

  // Debug: Log the final status map with more details
  console.log('Status Map:', {
    serviceCount: Object.keys(statusMap).length,
    services: Object.keys(statusMap),
    sampleService: statusMap[Object.keys(statusMap)[0]]
  })

  return <StatusMonitorClient services={services} statusMap={statusMap} />
}
