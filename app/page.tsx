"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Github, MessageCircle } from "lucide-react"
import Link from "next/link"

const services = [
  // Cloud Providers
  {
    name: "AWS",
    status: "operational",
    statusUrl: "https://status.aws.amazon.com/",
    communityUrl: "https://reddit.com/r/aws",
    slug: "aws",
    tags: ["Cloud", "Infrastructure"],
  },
  {
    name: "Google Cloud",
    status: "operational",
    statusUrl: "https://status.cloud.google.com/",
    communityUrl: "https://reddit.com/r/googlecloud",
    slug: "google-cloud",
    tags: ["Cloud", "Infrastructure"],
  },
  {
    name: "Microsoft Azure",
    status: "operational",
    statusUrl: "https://status.azure.com/",
    communityUrl: "https://reddit.com/r/azure",
    slug: "azure",
    tags: ["Cloud", "Infrastructure"],
  },
  {
    name: "DigitalOcean",
    status: "operational",
    statusUrl: "https://status.digitalocean.com/",
    communityUrl: "https://reddit.com/r/digitalocean",
    slug: "digitalocean",
    tags: ["Cloud", "Infrastructure"],
  },
  {
    name: "Linode",
    status: "operational",
    statusUrl: "https://status.linode.com/",
    communityUrl: "https://reddit.com/r/linode",
    slug: "linode",
    tags: ["Cloud", "Infrastructure"],
  },

  // LLM Providers
  {
    name: "OpenAI",
    status: "operational",
    statusUrl: "https://status.openai.com/",
    communityUrl: "https://reddit.com/r/openai",
    slug: "openai",
    tags: ["AI/ML", "LLM"],
  },
  {
    name: "Anthropic",
    status: "operational",
    statusUrl: "https://status.anthropic.com/",
    communityUrl: "https://reddit.com/r/anthropic",
    slug: "anthropic",
    tags: ["AI/ML", "LLM"],
  },
  {
    name: "Google AI",
    status: "operational",
    statusUrl: "https://status.cloud.google.com/",
    communityUrl: "https://reddit.com/r/googleai",
    slug: "google-ai",
    tags: ["AI/ML", "LLM"],
  },
  {
    name: "Cohere",
    status: "operational",
    statusUrl: "https://status.cohere.com/",
    communityUrl: "https://reddit.com/r/cohere",
    slug: "cohere",
    tags: ["AI/ML", "LLM"],
  },
  {
    name: "Hugging Face",
    status: "operational",
    statusUrl: "https://status.huggingface.co/",
    communityUrl: "https://reddit.com/r/huggingface",
    slug: "hugging-face",
    tags: ["AI/ML", "LLM"],
  },
  {
    name: "Replicate",
    status: "operational",
    statusUrl: "https://status.replicate.com/",
    communityUrl: "https://reddit.com/r/replicate",
    slug: "replicate",
    tags: ["AI/ML", "LLM"],
  },

  // Atlassian
  {
    name: "Jira",
    status: "operational",
    statusUrl: "https://status.atlassian.com/",
    communityUrl: "https://reddit.com/r/jira",
    slug: "jira",
    tags: ["Productivity", "Project Management"],
  },
  {
    name: "Confluence",
    status: "operational",
    statusUrl: "https://status.atlassian.com/",
    communityUrl: "https://reddit.com/r/confluence",
    slug: "confluence",
    tags: ["Productivity", "Documentation"],
  },
  {
    name: "Bitbucket",
    status: "operational",
    statusUrl: "https://status.atlassian.com/",
    communityUrl: "https://reddit.com/r/bitbucket",
    slug: "bitbucket",
    tags: ["DevOps", "Version Control"],
  },
  {
    name: "Trello",
    status: "operational",
    statusUrl: "https://status.atlassian.com/",
    communityUrl: "https://reddit.com/r/trello",
    slug: "trello",
    tags: ["Productivity", "Project Management"],
  },

  // Databases
  {
    name: "MongoDB",
    status: "operational",
    statusUrl: "https://status.mongodb.com/",
    communityUrl: "https://reddit.com/r/mongodb",
    slug: "mongodb",
    tags: ["Database", "NoSQL"],
  },
  {
    name: "PostgreSQL",
    status: "operational",
    statusUrl: "https://postgresql.org/support/",
    communityUrl: "https://reddit.com/r/postgresql",
    slug: "postgresql",
    tags: ["Database", "SQL"],
  },
  {
    name: "Redis",
    status: "degraded",
    statusUrl: "https://status.redis.com/",
    communityUrl: "https://reddit.com/r/redis",
    slug: "redis",
    tags: ["Database", "Cache"],
  },
  {
    name: "Supabase",
    status: "operational",
    statusUrl: "https://status.supabase.com/",
    communityUrl: "https://reddit.com/r/supabase",
    slug: "supabase",
    tags: ["Database", "Backend"],
  },
  {
    name: "PlanetScale",
    status: "operational",
    statusUrl: "https://planetscale.com/status",
    communityUrl: "https://reddit.com/r/planetscale",
    slug: "planetscale",
    tags: ["Database", "SQL"],
  },
  {
    name: "FaunaDB",
    status: "operational",
    statusUrl: "https://status.fauna.com/",
    communityUrl: "https://reddit.com/r/faunadb",
    slug: "faunadb",
    tags: ["Database", "Serverless"],
  },

  // DevOps & Deployment
  {
    name: "Vercel",
    status: "operational",
    statusUrl: "https://vercel.com/status",
    communityUrl: "https://github.com/vercel/vercel/discussions",
    slug: "vercel",
    tags: ["DevOps", "Hosting"],
  },
  {
    name: "Netlify",
    status: "operational",
    statusUrl: "https://status.netlify.com/",
    communityUrl: "https://reddit.com/r/netlify",
    slug: "netlify",
    tags: ["DevOps", "Hosting"],
  },
  {
    name: "GitHub",
    status: "operational",
    statusUrl: "https://githubstatus.com/",
    communityUrl: "https://github.com/community/community/discussions",
    slug: "github",
    tags: ["DevOps", "Version Control"],
  },
  {
    name: "GitLab",
    status: "operational",
    statusUrl: "https://status.gitlab.com/",
    communityUrl: "https://reddit.com/r/gitlab",
    slug: "gitlab",
    tags: ["DevOps", "Version Control"],
  },
  {
    name: "Docker Hub",
    status: "operational",
    statusUrl: "https://status.docker.com/",
    communityUrl: "https://reddit.com/r/docker",
    slug: "docker-hub",
    tags: ["DevOps", "Containers"],
  },
  {
    name: "CircleCI",
    status: "operational",
    statusUrl: "https://status.circleci.com/",
    communityUrl: "https://reddit.com/r/circleci",
    slug: "circleci",
    tags: ["DevOps", "CI/CD"],
  },

  // CDN & Infrastructure
  {
    name: "Cloudflare",
    status: "operational",
    statusUrl: "https://cloudflarestatus.com/",
    communityUrl: "https://reddit.com/r/cloudflare",
    slug: "cloudflare",
    tags: ["CDN", "Security"],
  },
  {
    name: "Fastly",
    status: "operational",
    statusUrl: "https://status.fastly.com/",
    communityUrl: "https://reddit.com/r/fastly",
    slug: "fastly",
    tags: ["CDN", "Edge Computing"],
  },

  // Payment & E-commerce
  {
    name: "Stripe",
    status: "operational",
    statusUrl: "https://status.stripe.com/",
    communityUrl: "https://reddit.com/r/stripe",
    slug: "stripe",
    tags: ["Payments", "E-commerce"],
  },
  {
    name: "PayPal",
    status: "operational",
    statusUrl: "https://status.paypal.com/",
    communityUrl: "https://reddit.com/r/paypal",
    slug: "paypal",
    tags: ["Payments", "E-commerce"],
  },
  {
    name: "Shopify",
    status: "operational",
    statusUrl: "https://status.shopify.com/",
    communityUrl: "https://reddit.com/r/shopify",
    slug: "shopify",
    tags: ["E-commerce", "Platform"],
  },

  // Communication
  {
    name: "Slack",
    status: "operational",
    statusUrl: "https://status.slack.com/",
    communityUrl: "https://reddit.com/r/slack",
    slug: "slack",
    tags: ["Communication", "Productivity"],
  },
  {
    name: "Discord",
    status: "operational",
    statusUrl: "https://discordstatus.com/",
    communityUrl: "https://reddit.com/r/discord",
    slug: "discord",
    tags: ["Communication", "Gaming"],
  },
  {
    name: "Zoom",
    status: "operational",
    statusUrl: "https://status.zoom.us/",
    communityUrl: "https://reddit.com/r/zoom",
    slug: "zoom",
    tags: ["Communication", "Video"],
  },
  {
    name: "Microsoft Teams",
    status: "operational",
    statusUrl: "https://status.office365.com/",
    communityUrl: "https://reddit.com/r/microsoftteams",
    slug: "microsoft-teams",
    tags: ["Communication", "Productivity"],
  },

  // Monitoring & Analytics
  {
    name: "Datadog",
    status: "operational",
    statusUrl: "https://status.datadoghq.com/",
    communityUrl: "https://reddit.com/r/datadog",
    slug: "datadog",
    tags: ["Monitoring", "Analytics"],
  },
  {
    name: "New Relic",
    status: "operational",
    statusUrl: "https://status.newrelic.com/",
    communityUrl: "https://reddit.com/r/newrelic",
    slug: "new-relic",
    tags: ["Monitoring", "APM"],
  },
  {
    name: "Sentry",
    status: "operational",
    statusUrl: "https://status.sentry.io/",
    communityUrl: "https://reddit.com/r/sentry",
    slug: "sentry",
    tags: ["Monitoring", "Error Tracking"],
  },

  // Email Services
  {
    name: "SendGrid",
    status: "operational",
    statusUrl: "https://status.sendgrid.com/",
    communityUrl: "https://reddit.com/r/sendgrid",
    slug: "sendgrid",
    tags: ["Email", "Communication"],
  },
  {
    name: "Mailgun",
    status: "operational",
    statusUrl: "https://status.mailgun.com/",
    communityUrl: "https://reddit.com/r/mailgun",
    slug: "mailgun",
    tags: ["Email", "Communication"],
  },
  {
    name: "Postmark",
    status: "operational",
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

export default function StatusMonitor() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-primary">DrDroid</h1>
              <Badge variant="outline" className="text-xs">
                Open Source
              </Badge>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="https://github.com/drdroid/statuspage-aggregator" className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                Star on GitHub
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">Is It Down?</h2>
          <p className="text-xl text-muted-foreground mb-2">
            Real-time status monitoring for popular cloud, AI, and infrastructure services
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Built for engineers, by engineers. Check service status and join community discussions.
          </p>
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
            <span>💡</span>
            <span>Don't see your tools? Fork this project and add them!</span>
            <Link href="#customize" className="underline hover:no-underline font-medium">
              Learn how
            </Link>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {services.map((service) => (
            <Card
              key={service.name}
              className="hover:shadow-md transition-shadow cursor-pointer h-full"
              onClick={() => (window.location.href = `/${service.slug}`)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>{service.name}</span>
                  <StatusIndicator status={service.status} />
                </CardTitle>
                <div className="flex flex-wrap gap-1 mt-2">
                  {service.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className={`text-xs ${getTagColor(tag)}`}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(service.communityUrl, "_blank")
                    }}
                  >
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Community
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(service.statusUrl, "_blank")
                    }}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Fork & Customize Section */}
        <div className="mb-12" id="customize">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-3">Want to customize for your tools?</h3>
                <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
                  Fork this project and create your own status dashboard with the services your team actually uses. Add
                  your internal tools, remove what you don't need, and deploy it for your organization.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <Button size="lg" asChild>
                    <Link
                      href="https://github.com/drdroid/statuspage-aggregator/fork"
                      className="flex items-center gap-2"
                    >
                      <Github className="w-4 h-4" />
                      Fork on GitHub
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link
                      href="https://github.com/drdroid/statuspage-aggregator#customization"
                      className="flex items-center gap-2"
                    >
                      📖 Customization Guide
                    </Link>
                  </Button>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>✨ Add your internal services • 🎨 Customize the design • 🚀 Deploy anywhere</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Legend */}
        <div className="flex justify-center">
          <Card className="w-fit">
            <CardContent className="pt-6">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Operational</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span>Degraded</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span>Outage</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">Made with ❤️ by the DrDroid team • Open source and community driven</p>
            <p className="mb-4">
              Want to add a service or report an issue?{" "}
              <Link href="https://github.com/drdroid/statuspage-aggregator" className="underline hover:no-underline">
                Contribute on GitHub
              </Link>
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <Link href="https://github.com/drdroid/statuspage-aggregator/fork" className="hover:underline">
                🍴 Fork & Customize
              </Link>
              <Link href="https://github.com/drdroid/statuspage-aggregator/issues" className="hover:underline">
                🐛 Report Issues
              </Link>
              <Link href="https://github.com/drdroid/statuspage-aggregator/discussions" className="hover:underline">
                💬 Discussions
              </Link>
              <Link href="https://drdroid.io" className="hover:underline">
                🏠 DrDroid.io
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
