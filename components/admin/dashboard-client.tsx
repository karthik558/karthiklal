"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  ArrowRight, 
  TrendingUp, 
  Users, 
  MousePointerClick, 
  Clock,
  Activity
} from "lucide-react"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { getModelIcon } from "@/lib/admin-utils"

// We fetch analytics dynamically now

interface DashboardClientProps {
  models: string[]
  stats: Record<string, { size: number; entries: number | string }>
}

export default function DashboardClient({ models, stats }: DashboardClientProps) {
  const [mounted, setMounted] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<{
    trafficData: any[]
    sourceData: any[]
    statCards: any[]
    isMock: boolean
  } | null>(null)

  // Prevent hydration errors with Recharts by only rendering charts after mount
  useEffect(() => {
    setMounted(true)
    
    // Fetch analytics data
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/admin/analytics')
        const data = await res.json()
        setAnalyticsData(data)
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      }
    }
    
    fetchAnalytics()
  }, [])

  const defaultStatCards = [
    { title: "Total Views", value: "...", change: "...", icon: Activity },
    { title: "Unique Visitors", value: "...", change: "...", icon: Users },
    { title: "Engagement Rate", value: "...", change: "...", icon: MousePointerClick },
    { title: "Avg. Session", value: "...", change: "...", icon: Clock },
  ]

  const statCardsData = analyticsData?.statCards || defaultStatCards
  const chartTrafficData = analyticsData?.trafficData || []
  const chartSourceData = analyticsData?.sourceData || []

  // Helper to map string icon names to Lucide icons
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity': return Activity
      case 'Users': return Users
      case 'MousePointerClick': return MousePointerClick
      case 'Clock': return Clock
      default: return Activity
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Overview Analytics</h1>
        <p className="text-muted-foreground">Monitor your website's traffic and performance metrics.</p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCardsData.map((stat, i) => {
          const Icon = getIcon(stat.icon)
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm relative overflow-hidden group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${stat.change.startsWith('+') || stat.change === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {stat.change.startsWith('+') || stat.change === 'Active' ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                  {stat.change}
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {analyticsData?.isMock && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-4 rounded-xl text-sm mb-6 flex items-center justify-center">
          Viewing mock data. To see real data, configure Google Analytics Data API credentials in your environment variables.
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Area Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm"
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground">Traffic Overview</h3>
            <p className="text-sm text-muted-foreground">Page views vs Unique visitors over 7 days</p>
          </div>
          
          <div className="h-[300px] w-full">
            {mounted && chartTrafficData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartTrafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--foreground))" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="hsl(var(--foreground))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                  <Area type="monotone" dataKey="visitors" stroke="hsl(var(--foreground))" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorVisitors)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">Loading chart...</div>
            )}
          </div>
        </motion.div>

        {/* Donut Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm flex flex-col"
        >
          <div className="mb-2">
            <h3 className="text-lg font-bold text-foreground">Traffic Sources</h3>
            <p className="text-sm text-muted-foreground">Where your users are coming from</p>
          </div>
          
          <div className="h-[220px] w-full flex-1 flex items-center justify-center relative">
            {mounted && chartSourceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartSourceData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : null}
            
            {mounted && chartSourceData.length > 0 && (
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-3xl font-bold text-foreground">
                  {chartSourceData.reduce((acc: number, curr: any) => acc + curr.value, 0) > 999 
                    ? (chartSourceData.reduce((acc: number, curr: any) => acc + curr.value, 0) / 1000).toFixed(1) + 'K' 
                    : chartSourceData.reduce((acc: number, curr: any) => acc + curr.value, 0)}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Total</span>
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {chartSourceData.map((source: any) => (
              <div key={source.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                <span className="text-sm text-muted-foreground font-medium">{source.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Divider */}
      <div className="pt-8 pb-4">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Content Management Section */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-display font-bold text-foreground mb-1">Content Management</h2>
          <p className="text-muted-foreground">Select a database model to modify your live portfolio content.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => {
            const Icon = getModelIcon(model)
            
            return (
              <Link href={`/admin/${model}`} key={model} className="block group">
                <div className="p-6 rounded-2xl border border-border bg-card hover:bg-card/80 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between">
                  
                  <div className="absolute -right-6 -top-6 text-primary/5 group-hover:text-primary/10 transition-colors transform group-hover:scale-110 duration-500">
                    <Icon className="w-32 h-32" />
                  </div>

                  <div className="relative z-10 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <Icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <h3 className="text-xl font-semibold capitalize text-foreground group-hover:text-primary transition-colors">
                      {model.replace("-", " ")}
                    </h3>
                  </div>

                  <div className="relative z-10 flex items-end justify-between border-t border-border/50 pt-5 mt-auto">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{stats[model]?.entries}</span> Items
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{stats[model]?.size}</span> KB
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-border group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all shadow-sm">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
