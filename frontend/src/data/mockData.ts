export const landingData = {
  nav: {
    logo: "Insurly",
    links: [
      { label: "Home", href: "#hero" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Coverage Plans", href: "#pricing" },
      { label: "Why Us", href: "#triggers" },
    ],
    cta: "Get Started",
  },
  hero: {
    badge: "Live in Bhubaneswar · Zomato & Swiggy Partners",
    title: "Protect your income. Every single week.",
    subtitle: "When heavy rain, heat waves, or disruptions stop your deliveries — we automatically send cash to your UPI. No forms. No waiting.",
    primaryCta: "Get Protected Now",
    secondaryCta: "View Coverage",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBy3TH_Nigx3RX7hPF_8-kb__xXqW7kQn4FRYGXC-B-nYZNopIPNNvk_wU19WeG0uY12Oa1WmuFn-IqbD7nbd2iT1wwm54PBFd-HegSZMVk5UYa2C5s8TiiigFNAAb4B3X_uWrUC-0IwnEHyAlbGjCQ1NAxr1VVEGTNeyq927eNMl40cdV1BnjeCHnmNrHJPjmpusZQaVZf1Vb5GokFvdifdNtvrPznf6oo179N57jZBJYf5kql1LZsfhnBhKnGeDBeMyz9Igma4qc",
    payoutLabel: "Payment Released",
    payoutAmount: "₹850 sent to your UPI due to Monsoon Alert in Bhubaneswar.",
  },
  partners: ["OpenWeatherMap", "Google Gemini AI", "Brain.js", "OpenAQ", "Guidewire DEVTrails"],
  features: {
    title: "Built for the street, powered by data.",
    subtitle: "Skip the paperwork. Our parametric system monitors real-time environmental triggers and issues payouts automatically.",
    steps: [
      { id: 1, title: "Register", description: "Connect your delivery ID and UPI handle in 30 seconds. No complex background checks." },
      { id: 2, title: "Pick coverage", description: "Choose your daily protection limit. Plans start as low as ₹49 per week." },
      { id: 3, title: "We monitor", description: "Our AI tracks weather, AQI, and local disruptions through Google Gemini & OpenAQ." },
      { id: 4, title: "Cash arrives", description: "Trigger reached? Funds are sent instantly. Focus on resting while we handle the loss." },
    ],
  },
  triggers: {
    title: "Five triggers. One policy.",
    subtitle: "We don't ask for hospital bills. We pay based on verifiable data from our trusted partners.",
    items: [
      { icon: "rainy", label: "Heavy Rain", value: "Above 15mm/hr", color: "blue" },
      { icon: "thermostat", label: "Heat Waves", value: "Above 42°C", color: "orange" },
      { icon: "cyclone", label: "Cyclone", value: "Wind > 60km/h", color: "slate" },
      { icon: "air", label: "Pollution", value: "AQI above 400", color: "teal" },
      { icon: "lock", label: "Lockdown", value: "Govt Restricted", color: "red" },
    ],
  },
  pricing: {
    title: "Honest pricing. Paid weekly.",
    plans: [
      {
        name: "Starter",
        price: "₹29",
        period: "/week",
        features: ["Rain & Heat protection", "₹500 daily payout cap"],
        buttonLabel: "Select Basic",
        featured: false,
      },
      {
        name: "Professional",
        price: "₹59",
        period: "/week",
        features: ["All trigger protection", "₹750 daily payout cap", "Instant UPI transfers"],
        buttonLabel: "Select Standard",
        featured: true,
      },
      {
        name: "Elite Fleet",
        price: "₹99",
        period: "/week",
        features: ["All triggers + Custom zones", "₹1,500 daily payout cap", "24/7 Dedicated Concierge"],
        buttonLabel: "Select Premium",
        featured: false,
      },
    ],
  },
  footer: {
    logo: "Insurly",
    description: "Smart parametric insurance for the modern gig economy.",
    tagline: "Built for Guidewire DEVTrails 2024",
    sections: [
      {
        title: "Solutions",
        links: ["Delivery Fleet", "Private Pilots", "API Access"],
      },
      {
        title: "Company",
        links: ["About Us", "Claims Hub", "Partners"],
      },
      {
        title: "Legal",
        links: ["Privacy Policy", "Terms of Service", "Cookie Settings"],
      },
    ],
  },
};

export const workerDashboardData = {
  user: {
    name: "Raju",
    platform: "Swiggy Platform",
    zone: "Patia Zone",
  },
  alert: {
    type: "error",
    message: "Alert: Heavy Rain detected in Patia. Your claim for today is being processed automatically.",
  },
  activePolicy: {
    name: "Standard Disruption Plan",
    status: "Active",
    premium: "₹59",
    maxPayout: "₹1,100",
    period: "15/03/2026 – 21/03/2026",
    triggers: [
      { icon: "rainy", label: "Rain" },
      { icon: "thunderstorm", label: "Storm" },
      { icon: "sunny", label: "Heatwave" },
      { icon: "block", label: "Strike" },
      { icon: "traffic", label: "Congest" },
    ],
  },
  stats: [
    { label: "Earnings Protected", value: "₹4,200", trend: "+12% vs last month", color: "indigo", icon: "security" },
    { label: "Claims Processed", value: "12", subtext: "All-time automated approvals", color: "purple", icon: "verified" },
    { label: "Total Paid Out", value: "₹3,150", subtext: "Transferred to linked UPI", color: "blue", icon: "payments" },
  ],
  recentClaims: [
    { date: "Today, 10:45 AM", trigger: "Heavy Rain", icon: "rainy", amount: "₹150", status: "Processing" },
    { date: "18/03/2026", trigger: "Thunderstorm", icon: "thunderstorm", amount: "₹150", status: "Paid" },
    { date: "15/03/2026", trigger: "Moderate Rain", icon: "rainy", amount: "₹150", status: "Paid" },
  ],
};

export const adminDashboardData = {
  stats: [
    { label: "Active Policies", value: "1,420", trend: "+12%", trendIcon: "trending_up" },
    { label: "Claims This Week", value: "84", trend: "Stable" },
    { label: "Payouts This Week", value: "₹ 12,600", trend: "+5%", trendIcon: "trending_up", isError: true },
    { label: "Fraud Flags", value: "3", icon: "warning", isCritical: true },
  ],
  disruptions: [
    { title: "Rainfall Triggered in Patia", value: "54.2mm", time: "14 mins ago", icon: "rainy", color: "blue" },
    { title: "Cyclone Warning: Phase 1", value: "85km/h", time: "2 hours ago", icon: "air", color: "amber" },
    { title: "System Alert: High Fraud Risk", value: "Old Town Cluster", time: "4 hours ago", icon: "priority_high", color: "red" },
  ],
  claimsQueue: [
    { name: "Sunita Mohanty", zone: "Patia", trigger: "RAIN_50", amount: "₹ 450.00", fraudScore: 20 },
    { name: "Rakesh Dash", zone: "Old Town", trigger: "RAIN_50", amount: "₹ 1,200.00", fraudScore: 85 },
    { name: "Prianka Roy", zone: "Nayapalli", trigger: "WIND_85", amount: "₹ 850.00", fraudScore: 40 },
  ],
};
