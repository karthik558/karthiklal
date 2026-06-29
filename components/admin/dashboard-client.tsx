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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/90 backdrop-blur-md border border-border/80 rounded-xl p-3.5 shadow-xl text-xs space-y-1 z-50">
          <p className="font-semibold text-muted-foreground">{label}</p>
          {payload.map((item: any, i: number) => (
            <p key={i} className="font-semibold" style={{ color: item.stroke || item.color }}>
              <span className="capitalize">{item.name}</span>: <span className="text-foreground">{item.value}</span>
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="bg-card/90 backdrop-blur-md border border-border/80 rounded-xl p-3.5 shadow-xl text-xs z-50">
          <p className="font-bold" style={{ color: item.payload.color }}>
            {item.name}: <span className="text-foreground">{item.value}</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-4xl font-display font-bold tracking-tight text-foreground mb-2">Overview Analytics</h1>
        <p className="text-muted-foreground">Monitor your portfolio website's real-time traffic and performance metrics.</p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCardsData.map((stat, i) => {
          const Icon = getIcon(stat.icon)
          const isPositive = stat.change.startsWith('+') || stat.change === 'Active'
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/65 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:bg-card hover:shadow-[0_18px_42px_rgba(var(--primary-rgb),0.08)] group"
            >
              {/* Card Hover Radial Glow & Top Border */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(350px_circle_at_20%_0%,hsl(var(--primary)/0.08),transparent_42%)] opacity-0 transition duration-500 group-hover:opacity-100" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary shadow-inner transition group-hover:bg-primary group-hover:text-primary-foreground duration-300">
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md border ${isPositive ? 'bg-green-500/10 text-green-500 border-green-500/10' : 'bg-red-500/10 text-red-500 border-red-500/10'}`}>
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                  {stat.change}
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-display font-extrabold text-foreground mb-1">{stat.value}</h3>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {analyticsData?.isMock && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-4 rounded-2xl text-sm relative overflow-hidden flex items-center justify-center backdrop-blur-sm">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/55 to-transparent" />
          <span>Viewing demo analytics. To view active production data, connect Google Analytics inside your server configuration.</span>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Area Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative overflow-hidden lg:col-span-2 p-6 rounded-2xl border border-border/70 bg-card/65 shadow-sm backdrop-blur"
        >
          {/* Card Border glow */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          
          <div className="mb-6 relative z-10">
            <h3 className="text-lg font-display font-bold text-foreground">Traffic Overview</h3>
            <p className="text-sm text-muted-foreground">Page views vs Unique visitors over the last 7 days</p>
          </div>
          
          <div className="h-[300px] w-full relative z-10">
            {mounted && chartTrafficData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartTrafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border)/40)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                  <Area type="monotone" dataKey="visitors" stroke="hsl(var(--accent))" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorVisitors)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">Loading chart analytics...</div>
            )}
          </div>
        </motion.div>

        {/* Donut Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="relative overflow-hidden p-6 rounded-2xl border border-border/70 bg-card/65 shadow-sm backdrop-blur flex flex-col justify-between"
        >
          {/* Card Border glow */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          
          <div className="mb-2 relative z-10">
            <h3 className="text-lg font-display font-bold text-foreground">Traffic Sources</h3>
            <p className="text-sm text-muted-foreground">Distribution of current visitor sources</p>
          </div>
          
          <div className="h-[200px] w-full flex-1 flex items-center justify-center relative z-10">
            {mounted && chartSourceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartSourceData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : null}
            
            {mounted && chartSourceData.length > 0 && (
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-3xl font-display font-extrabold text-foreground">
                  {chartSourceData.reduce((acc: number, curr: any) => acc + curr.value, 0) > 999 
                    ? (chartSourceData.reduce((acc: number, curr: any) => acc + curr.value, 0) / 1000).toFixed(1) + 'K' 
                    : chartSourceData.reduce((acc: number, curr: any) => acc + curr.value, 0)}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-0.5">Total</span>
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 relative z-10 pt-2 border-t border-border/40">
            {chartSourceData.map((source: any) => (
              <div key={source.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: source.color }} />
                <span className="text-xs text-muted-foreground font-semibold truncate">{source.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Divider */}
      <div className="pt-4 pb-2">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Content Management Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-1">Content Models</h2>
          <p className="text-muted-foreground">Select a database model to modify your live portfolio content.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => {
            const Icon = getModelIcon(model)
            
            return (
              <Link href={`/admin/${model}`} key={model} className="block group">
                <div className="relative overflow-hidden rounded-2xl border border-border/75 bg-card/65 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:bg-card hover:shadow-[0_18px_42px_rgba(var(--primary-rgb),0.1)] group flex flex-col h-full justify-between">
                  {/* Card Glowing Line and Background Gradient */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(420px_circle_at_20%_0%,hsl(var(--primary)/0.06),transparent_42%)] opacity-0 transition duration-500 group-hover:opacity-100" />

                  <div className="absolute -right-6 -top-6 text-primary/[0.03] group-hover:text-primary/[0.07] transition-all transform group-hover:scale-110 duration-500 pointer-events-none">
                    <Icon className="w-32 h-32" />
                  </div>

                  <div className="relative z-10 mb-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-inner transition group-hover:bg-primary group-hover:text-primary-foreground duration-300 mb-5">
                      <Icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <h3 className="text-xl font-display font-bold capitalize text-foreground group-hover:text-primary transition-colors">
                      {model.replace("-", " ")}
                    </h3>
                  </div>

                  <div className="relative z-10 flex items-end justify-between border-t border-border/40 pt-4 mt-auto">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-secondary/50 px-2 py-0.5 text-xs font-semibold text-foreground/80">
                        <span className="text-primary font-bold">{stats[model]?.entries}</span>
                        <span className="text-muted-foreground text-[10px]">entries</span>
                      </div>
                      <div className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-secondary/50 px-2 py-0.5 text-xs font-semibold text-foreground/80">
                        <span className="text-primary font-bold">{stats[model]?.size}</span>
                        <span className="text-muted-foreground text-[10px]">KB</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-secondary/45 flex items-center justify-center border border-border/70 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 shadow-sm">
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
