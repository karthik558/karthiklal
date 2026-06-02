import { NextResponse } from 'next/server'
import { BetaAnalyticsDataClient } from '@google-analytics/data'

// Mock Data fallback
const MOCK_TRAFFIC_DATA = [
  { name: "Mon", views: 4000, visitors: 2400 },
  { name: "Tue", views: 3000, visitors: 1398 },
  { name: "Wed", views: 2000, visitors: 9800 },
  { name: "Thu", views: 2780, visitors: 3908 },
  { name: "Fri", views: 1890, visitors: 4800 },
  { name: "Sat", views: 2390, visitors: 3800 },
  { name: "Sun", views: 3490, visitors: 4300 },
]

const MOCK_SOURCE_DATA = [
  { name: "Direct", value: 400, color: "hsl(var(--primary))" },
  { name: "Social", value: 300, color: "hsl(var(--primary) / 0.6)" },
  { name: "Referral", value: 300, color: "hsl(var(--primary) / 0.3)" },
  { name: "Organic", value: 200, color: "hsl(var(--primary) / 0.15)" },
]

const MOCK_STATS = [
  { title: "Total Views", value: "24.8K", change: "+12.5%", icon: "Activity" },
  { title: "Unique Visitors", value: "18.2K", change: "+8.2%", icon: "Users" },
  { title: "Engagement Rate", value: "64%", change: "+5.4%", icon: "MousePointerClick" },
  { title: "Avg. Session", value: "2m 45s", change: "-1.2%", icon: "Clock" },
]

export async function GET() {
  const propertyId = process.env.GA_PROPERTY_ID
  const clientEmail = process.env.GA_CLIENT_EMAIL
  const privateKey = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n')

  // If no credentials, return mock data
  if (!propertyId || !clientEmail || !privateKey) {
    return NextResponse.json({
      trafficData: MOCK_TRAFFIC_DATA,
      sourceData: MOCK_SOURCE_DATA,
      statCards: MOCK_STATS,
      isMock: true,
      error: "Google Analytics credentials not configured in environment variables."
    })
  }

  try {
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    })

    // Fetch last 7 days of page views and active users
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'dayOfWeekName' }],
      metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
    })

    // Map Google Analytics data to our chart format
    const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const fetchedTrafficData = dayOrder.map(day => ({ name: day, views: 0, visitors: 0 }))

    response.rows?.forEach(row => {
      const dayName = row.dimensionValues?.[0].value?.substring(0, 3) || ""
      const views = parseInt(row.metricValues?.[0].value || "0", 10)
      const visitors = parseInt(row.metricValues?.[1].value || "0", 10)

      const index = fetchedTrafficData.findIndex(d => d.name === dayName)
      if (index !== -1) {
        fetchedTrafficData[index].views = views
        fetchedTrafficData[index].visitors = visitors
      }
    })

    // Optional: Fetch Source / Medium data
    const [sourceResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'activeUsers' }],
    })

    const colors = [
      "hsl(var(--primary))",
      "hsl(var(--primary) / 0.6)",
      "hsl(var(--primary) / 0.3)",
      "hsl(var(--primary) / 0.15)",
    ]

    const fetchedSourceData = sourceResponse.rows?.slice(0, 4).map((row, index) => ({
      name: row.dimensionValues?.[0].value || "Unknown",
      value: parseInt(row.metricValues?.[0].value || "0", 10),
      color: colors[index] || colors[0]
    })) || MOCK_SOURCE_DATA

    // Aggregate totals for the stat cards
    const totalViews = fetchedTrafficData.reduce((acc, curr) => acc + curr.views, 0)
    const totalVisitors = fetchedTrafficData.reduce((acc, curr) => acc + curr.visitors, 0)

    const formatNumber = (num: number) => num > 999 ? (num / 1000).toFixed(1) + 'K' : num.toString()

    const fetchedStats = [
      { title: "Weekly Views", value: formatNumber(totalViews), change: "Active", icon: "Activity" },
      { title: "Weekly Visitors", value: formatNumber(totalVisitors), change: "Active", icon: "Users" },
      { title: "Engagement Rate", value: MOCK_STATS[2].value, change: MOCK_STATS[2].change, icon: "MousePointerClick" },
      { title: "Avg. Session", value: MOCK_STATS[3].value, change: MOCK_STATS[3].change, icon: "Clock" },
    ]

    return NextResponse.json({
      trafficData: fetchedTrafficData,
      sourceData: fetchedSourceData,
      statCards: fetchedStats,
      isMock: false
    })
  } catch (error) {
    console.error("Error fetching GA data:", error)
    return NextResponse.json({
      trafficData: MOCK_TRAFFIC_DATA,
      sourceData: MOCK_SOURCE_DATA,
      statCards: MOCK_STATS,
      isMock: true,
      error: "Failed to fetch from Google Analytics Data API."
    })
  }
}
