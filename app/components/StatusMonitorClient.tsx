"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, Github, MessageCircle } from "lucide-react"
import Link from "next/link"
import { getStatusColor, getStatusText } from '@/lib/status'

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
      title: string
      status: string
      createdAt: string
      htmlDescription: string
    }
  }
}

function getTagColor(tag: string) {
  const colors: Record<string, string> = {
    Cloud: "bg-blue-100 text-blue-800",
    Infrastructure: "bg-purple-100 text-purple-800",
    "AI/ML": "bg-green-100 text-green-800",
    LLM: "bg-emerald-100 text-emerald-800",
    Productivity: "bg-yellow-100 text-yellow-800",
    "Project Management": "bg-orange-100 text-orange-800",
    Documentation: "bg-teal-100 text-teal-800",
    DevOps: "bg-indigo-100 text-indigo-800",
    "Version Control": "bg-violet-100 text-violet-800",
    Database: "bg-pink-100 text-pink-800",
    NoSQL: "bg-rose-100 text-rose-800",
    SQL: "bg-cyan-100 text-cyan-800",
    Cache: "bg-amber-100 text-amber-800",
    Backend: "bg-lime-100 text-lime-800",
    Serverless: "bg-sky-100 text-sky-800",
    Hosting: "bg-lime-100 text-lime-800",
    Monitoring: "bg-red-100 text-red-800",
    Email: "bg-teal-100 text-teal-800",
    CDN: "bg-violet-100 text-violet-800",
    "E-commerce": "bg-emerald-100 text-emerald-800",
    Hosting: "bg-lime-100 text-lime-800",
    Security: "bg-rose-100 text-rose-800",
  }
  return colors[tag as keyof typeof colors] || "bg-gray-100 text-gray-800"
}

export function StatusMonitorClient({ 
  services, 
  statusMap 
}: { 
  services: Service[], 
  statusMap: StatusMap 
}) {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {services.map((service: Service) => {
            const serviceStatus = statusMap[service.slug]?.status || 'unknown' as ServiceStatus
            const lastIncident = statusMap[service.slug]?.last_incident
            return (
              <Card key={service.slug} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">{service.name}</h3>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(serviceStatus)}`}>
                      {getStatusText(serviceStatus)}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className={getTagColor(tag)}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {lastIncident && (
                    <>
                      {/* Debug log */}
                      {console.log('Last Incident Data:', {
                        raw: lastIncident,
                        createdAt: lastIncident.createdAt,
                        parsedDate: new Date(lastIncident.createdAt)
                      })}
                      <p className="text-sm text-muted-foreground mb-4">
                        Last incident: {new Date(lastIncident.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </>
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" asChild className="flex-1">
                      <Link href={`/${service.slug}`} className="flex items-center gap-2">
                        View Details
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={service.statusUrl} className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={service.communityUrl} className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
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