# Production Vendor Status Aggregator

<div align="center">
  <a href="https://www.drdroid.io">
    <img src="public/logos/drdroid-logo.svg" alt="DrDroid" width="200" />
  </a>
</div>

A comprehensive status monitoring dashboard for production engineers managing multiple vendor integrations. Stop checking 5+ different status pages when things break - get a unified view of all your critical vendor dependencies in one place.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/siddarth-jains-projects/v0-dr-droid-status-page)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org)

## 🎯 Built for Production Engineers

**The Problem**: Your production system depends on 10+ external vendors. When something breaks, you waste precious time checking multiple status pages to identify if it's a vendor issue.

**The Solution**: One dashboard to monitor all your critical vendor dependencies. Quickly identify external service issues during incidents and share a single URL with your team.

## 🚀 Features

- **Unified Status View**: Monitor 50+ production-critical services in one dashboard
- **Real-time Monitoring**: Automatically fetches status from RSS/Atom feeds and APIs
- **Incident Detection**: Quickly identify which vendors are experiencing issues
- **Team Sharing**: Share a single URL with your team during incidents
- **Mobile Responsive**: Check status on-the-go during critical incidents
- **Individual Service Pages**: Deep-dive into specific vendor incident history

## 📊 Vendor Categories Covered

### **AI & ML Infrastructure**
- **LLM Providers**: OpenAI, Anthropic, Google Cloud AI, AWS Bedrock, xAI, Mistral AI
- **LLM Inference Layers**: Together AI, Fireworks AI, Replicate, Anyscale, Modal, RunPod
- **Voice AI APIs**: ElevenLabs, AssemblyAI, Deepgram, OpenAI TTS, AWS Polly
- **Vector Databases**: Pinecone, Weaviate, Qdrant, Chroma, Milvus

### **Cloud Infrastructure**
- **Hyperscalers**: AWS, Google Cloud, Microsoft Azure
- **Next-gen Cloud**: Vercel, Render, Railway, Fly.io
- **CDN & Edge**: Cloudflare, Fastly, AWS CloudFront, Vercel Edge
- **Serverless Platforms**: Vercel Functions, Netlify Functions, AWS Lambda

### **Databases & Data**
- **SQL Databases**: PlanetScale, Neon, Supabase, CockroachDB Cloud
- **NoSQL Databases**: MongoDB Atlas, Redis, Upstash
- **Data Warehouses**: Snowflake, Google BigQuery, Amazon Redshift, Databricks
- **Time Series**: InfluxDB Cloud, Timescale Cloud, VictoriaMetrics
- **Analytics**: Grafana Cloud, Mixpanel, Amplitude

### **Communication APIs**
- **SMS/Voice**: Twilio, Vonage/Nexmo, Plivo, Sinch, MessageBird, Telnyx
- **Email**: SendGrid, Mailgun, Postmark, Amazon SES, SparkPost, Mailjet
- **Push Notifications**: Firebase FCM, OneSignal, Pusher Beams, AWS SNS
- **Video/Calls**: Twilio Video, Agora, Daily.co, Zoom APIs

### **FinTech & Payments**
- **Payment Gateways**: Stripe, PayPal, Square, Adyen, Checkout.com, Razorpay
- **Billing & Subscriptions**: Stripe Billing, Chargebee, Recurly, Zuora, Paddle
- **Invoicing**: QuickBooks API, Xero API, FreshBooks, Zoho Invoice, Bill.com

### **Developer Tools & APIs**
- **Authentication**: Auth0, Firebase Auth, AWS Cognito, Okta
- **Search**: Algolia, Elasticsearch Service, AWS OpenSearch
- **File Storage**: AWS S3, Google Cloud Storage, Cloudinary
- **Monitoring**: Datadog, New Relic, Sentry, LogRocket

## 🌐 Live Demo

Visit the live dashboard: **[Production Vendor Status Aggregator](https://vercel.com/siddarth-jains-projects/v0-dr-droid-status-page)**

## 🛠️ Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/status-page-aggregator.git
cd status-page-aggregator

# Install dependencies
npm install
# or
pnpm install

# Run the development server
npm run dev
# or
pnpm dev

# Open http://localhost:3000 in your browser
```

## 📋 Contributing a New Vendor

Missing a critical vendor your team depends on? Here's how to add it:

### Step 1: Gather Required Information

Before adding a vendor, collect:

- **Service Name**: Official name (e.g., "Twilio", "Stripe Checkout")
- **Status Page URL**: Link to their official status page
- **Community URL**: Support forum, Discord, or Reddit community
- **Category**: Choose from existing categories:
  - `LLM Provider`, `LLM Inference Layer Companies`
  - `Voice AI API`, `Vector Database`
  - `CDN & Hosting`, `Serverless`, `Database Provider`
  - `SMS Communication API`, `Email Communication API`
  - `Push Communication API`, `Voice/Calls Communication API`
  - `Checkouts & Payment Gateway FinTech API`
  - `Billing & Subscriptions FinTech API`, `Invoicing FinTech API`
  - `Data Warehouse Provider`, `Monitoring & Analytics`

### Step 2: Add the Service

1. Open `app/page.tsx`
2. Find the `services` array (starts around line 37)
3. Add your service in the appropriate category section:

```typescript
{
  name: "Your Service Name",
  status: "operational", // Default status
  statusUrl: "https://status.yourservice.com/",
  communityUrl: "https://community.yourservice.com/",
  slug: "your-service-slug", // URL-friendly identifier
  tags: ["Appropriate Category"],
},
```

### Step 3: Test & Submit

1. **Test locally**: `npm run dev` and verify the service appears
2. **Fork the repository** on GitHub
3. **Create a feature branch**: `git checkout -b add-vendor-servicename`
4. **Commit changes**: `git commit -m "Add [Service Name] vendor"`
5. **Submit PR** with clear description of why this vendor is critical

### Guidelines for Contributions

- **Production-Critical Only**: Focus on services that production teams depend on
- **Verify Status Page**: Ensure they have an active, public status page
- **No Duplicates**: Check existing services first
- **Consistent Naming**: Follow existing patterns
- **Test Thoroughly**: Ensure your addition works correctly

## 🏗️ Project Structure

```
status-page-aggregator/
├── app/
│   ├── [service]/          # Individual service pages
│   ├── components/         # React components
│   ├── page.tsx            # Main dashboard (add services here)
│   └── layout.tsx          # App layout
├── lib/
│   ├── status.ts           # Status fetching logic
│   └── utils.ts            # Utility functions
└── components/ui/          # UI components
```

## 🔧 Customization

For detailed customization instructions, see [CUSTOMIZATION.md](./CUSTOMIZATION.md).

## 🤝 Contributing

We welcome contributions that help production engineers:

- **New Vendors**: Add missing production-critical services
- **Bug Fixes**: Improve reliability and accuracy
- **Feature Requests**: Suggest workflow improvements
- **Documentation**: Help other engineers adopt the tool

## 📄 License

This project is open source and available under the [MIT License](./LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Developed with [v0's latest AI model](https://v0.dev/) for rapid prototyping and development
- Enhanced development experience powered by [Cursor](https://cursor.sh/)
- Deployed and hosted on [Vercel](https://vercel.com/)
- Database and real-time features powered by [Supabase](https://supabase.com/)
- Status monitoring powered by RSS/Atom feeds and APIs

## 📞 Support

- 🐛 [Report Issues](https://github.com/your-username/status-page-aggregator/issues)
- 💬 [GitHub Discussions](https://github.com/your-username/status-page-aggregator/discussions)
- 📖 [Documentation](https://github.com/your-username/status-page-aggregator/wiki)

---

**Made with ❤️ by DrDroid team**