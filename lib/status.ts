import { XMLParser } from 'fast-xml-parser'

export type ServiceStatus = 'operational' | 'degraded' | 'outage' | 'unknown'

export interface StatusIncident {
  title: string
  description: string
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved'
  createdAt: string
  updatedAt: string
  components: string[]
  htmlDescription: string
}

export interface ServiceStatusData {
  status: ServiceStatus
  lastIncident?: StatusIncident
  incidents: StatusIncident[]
}

export function getStatusColor(status: ServiceStatus): string {
  switch (status) {
    case 'operational':
      return 'bg-green-100 text-green-800'
    case 'degraded':
      return 'bg-orange-100 text-orange-800'
    case 'outage':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function getStatusText(status: ServiceStatus): string {
  switch (status) {
    case 'operational':
      return 'Operational'
    case 'degraded':
      return 'Degraded Performance'
    case 'outage':
      return 'Major Outage'
    default:
      return 'Unknown'
  }
}

export async function fetchServiceStatus(rssUrl: string): Promise<ServiceStatusData> {
  try {
    const response = await fetch(rssUrl, { next: { revalidate: 300 } }) // Cache for 5 minutes
    const xmlText = await response.text()
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      cdataTagName: '__cdata',
      textNodeName: '__text',
      parseTagValue: true,
      parseAttributeValue: true,
      trimValues: true,
      cdataPositionChar: '\\c',
    })
    
    const result = parser.parse(xmlText)
    const items = result.rss.channel.item || []
    
    // Process incidents
    const incidents: StatusIncident[] = items.map((item: any) => {
      // Handle CDATA content
      const description = item.description?.__cdata || item.description || ''
      const title = item.title?.__cdata || item.title || ''
      
      return {
        title: title,
        description: stripHtml(description), // Plain text version
        htmlDescription: description, // Keep HTML version
        status: determineIncidentStatus(description),
        createdAt: item.pubDate,
        updatedAt: item.pubDate,
        components: extractComponents(description)
      }
    })

    // Determine overall status
    const status = determineOverallStatus(incidents)
    
    return {
      status,
      lastIncident: incidents[0],
      incidents
    }
  } catch (error) {
    console.error('Error fetching service status:', error)
    return {
      status: 'unknown',
      incidents: []
    }
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/\n\s*\n/g, '\n') // Remove multiple newlines
    .trim()
}

function determineIncidentStatus(description: string): StatusIncident['status'] {
  const lowerDesc = description.toLowerCase()
  if (lowerDesc.includes('resolved')) return 'resolved'
  if (lowerDesc.includes('monitoring')) return 'monitoring'
  if (lowerDesc.includes('identified')) return 'identified'
  return 'investigating'
}

function determineOverallStatus(incidents: StatusIncident[]): ServiceStatus {
  if (incidents.length === 0) return 'operational'
  
  const activeIncidents = incidents.filter(incident => 
    incident.status !== 'resolved'
  )
  
  if (activeIncidents.length === 0) return 'operational'
  
  const hasOutage = activeIncidents.some(incident => 
    incident.description.toLowerCase().includes('outage') ||
    incident.description.toLowerCase().includes('down')
  )
  
  if (hasOutage) return 'outage'
  return 'degraded'
}

function extractComponents(description: string): string[] {
  // Look for components in both HTML and plain text formats
  const componentsMatch = description.match(/(?:Affected components|Components affected)[^<]*<ul[^>]*>([\s\S]*?)<\/ul>/i)
  if (!componentsMatch) return []
  
  const componentsText = componentsMatch[1]
  return componentsText
    .split(/<\/?li>/)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('<') && !line.endsWith('>'))
    .map(line => line.replace(/\(Operational\)/i, '').trim())
    .filter(Boolean)
} 