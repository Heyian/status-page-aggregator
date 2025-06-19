# Customizing Your Status Dashboard

## Quick Start

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub or use GitHub CLI
   gh repo fork drdroidlab/status-page-aggregator
   ```

2. **Clone your fork**
   \`\`\`bash
   git clone https://github.com/YOUR_USERNAME/status-page-aggregator
   cd status-page-aggregator
   \`\`\`

3. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

## ENV VARIABLES:
Make sure to create a free instance of Supabase and add 
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

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

## Contributing Back

Found a popular service missing? Submit a PR to add it to the main repository!

1. Add the service to the main list
2. Create the individual service page
3. Add comprehensive FAQ section
4. Submit a pull request

## Need Help?

- 🐛 💬 [Raise an issue](https://github.com/DrDroidLab/status-page-aggregator)