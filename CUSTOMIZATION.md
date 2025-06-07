# Customizing Your Status Dashboard

## Quick Start

1. **Fork the repository**
   \`\`\`bash
   # Click "Fork" on GitHub or use GitHub CLI
   gh repo fork drdroid/statuspage-aggregator
   \`\`\`

2. **Clone your fork**
   \`\`\`bash
   git clone https://github.com/YOUR_USERNAME/statuspage-aggregator
   cd statuspage-aggregator
   \`\`\`

3. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

## Adding Your Services

Edit `app/page.tsx` and modify the `services` array:

\`\`\`typescript
const services = [
  {
    name: "Your Internal API",
    status: "operational", // operational | degraded | outage
    statusUrl: "https://status.yourcompany.com/",
    communityUrl: "https://slack.yourcompany.com/",
    slug: "your-internal-api",
    tags: ["Internal", "API"],
  },
  // ... add more services
]
\`\`\`

## Customizing Individual Pages

1. Add service data to `app/[service]/page.tsx` in the `serviceData` object
2. Include FAQ sections specific to your tools
3. Update status URLs and community links

## Styling & Branding

- Update the header in `app/page.tsx` to use your company name
- Modify colors in `tailwind.config.ts`
- Add your logo by replacing the text in the header

## Deployment Options

### Vercel (Recommended)
\`\`\`bash
npm i -g vercel
vercel --prod
\`\`\`

### Netlify
\`\`\`bash
npm run build
# Upload the `out` folder to Netlify
\`\`\`

### Docker
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## Environment Variables

For real-time status monitoring, add these to your `.env.local`:

\`\`\`bash
# Optional: Add API keys for real-time status checking
STATUSPAGE_API_KEY=your_key_here
DATADOG_API_KEY=your_key_here
\`\`\`

## Contributing Back

Found a popular service missing? Submit a PR to add it to the main repository!

1. Add the service to the main list
2. Create the individual service page
3. Add comprehensive FAQ section
4. Submit a pull request

## Need Help?

- 📖 [Full Documentation](https://github.com/drdroid/statuspage-aggregator/wiki)
- 💬 [GitHub Discussions](https://github.com/drdroid/statuspage-aggregator/discussions)
- 🐛 [Report Issues](https://github.com/drdroid/statuspage-aggregator/issues)
