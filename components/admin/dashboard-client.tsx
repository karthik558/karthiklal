"use client"

import React, { useEffect, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  ArrowUpRight, 
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

interface DashboardClientProps {
  models: string[]
  stats: Record<string, { size: number; entries: number | string }>
}

type AnalyticsIcon = "Activity" | "Users" | "MousePointerClick" | "Clock"

interface TrafficDatum {
  name: string
  views: number
  visitors: number
}

interface SourceDatum {
  name: string
  value: number
  color?: string
}

interface StatCard {
  title: string
  value: string
  change: string
  icon: AnalyticsIcon
}

interface AnalyticsData {
  trafficData: TrafficDatum[]
  sourceData: SourceDatum[]
  statCards: StatCard[]
  isMock: boolean
}

interface TooltipEntry {
  name?: React.ReactNode
  value?: React.ReactNode
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipEntry[]
  label?: React.ReactNode
}

const subscribeToClient = () => () => undefined
const pieColors = ["hsl(var(--primary))", "hsl(var(--foreground))", "hsl(var(--muted-foreground))", "hsl(var(--border))"]

const getIcon = (iconName: AnalyticsIcon) => {
  switch (iconName) {
    case "Users": return Users
    case "MousePointerClick": return MousePointerClick
    case "Clock": return Clock
    default: return Activity
  }
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-card/95 border border-border/80 p-3 shadow-xl font-mono text-xs uppercase space-y-1 z-50 text-foreground backdrop-blur-md">
      <p className="font-bold border-b border-border/70 pb-1 text-primary">{label}</p>
      {payload.map((item, index) => (
        <p key={`${String(item.name)}-${index}`} className="flex items-center justify-between gap-4 font-mono text-[11px]">
          <span className="text-muted-foreground">{item.name}:</span>
          <span className="font-bold">{item.value}</span>
        </p>
      ))}
    </div>
  )
}

export default function DashboardClient({ models, stats }: DashboardClientProps) {
  const mounted = useSyncExternalStore(subscribeToClient, () => true, () => false)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/admin/analytics')
        const data: AnalyticsData = await res.json()
        setAnalyticsData(data)
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      }
    }
    
    fetchAnalytics()
  }, [])

  const defaultStatCards = [
    { title: "TOTAL VIEWS", value: "24,850", change: "+14.2%", icon: "Activity" },
    { title: "UNIQUE VISITORS", value: "9,420", change: "+8.7%", icon: "Users" },
    { title: "ENGAGEMENT RATE", value: "68.4%", change: "+3.1%", icon: "MousePointerClick" },
    { title: "AVG. SESSION", value: "3m 42s", change: "+12s", icon: "Clock" },
  ] satisfies StatCard[]

  const statCardsData = analyticsData?.statCards || defaultStatCards
  const chartTrafficData = analyticsData?.trafficData || []

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-12 font-sans">
      
      {/* Page Title Header */}
      <div className="border-b border-border/80 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="studio-label text-[10px] text-primary font-mono tracking-widest mb-1.5 flex items-center gap-2">
            <span>OPERATIONAL METRICS</span>
            <span className="opacity-40">/</span>
            <span>SYSTEM DASHBOARD</span>
          </div>
          <h1 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground uppercase">
            Studio <span className="studio-serif font-normal italic text-primary">intelligence.</span>
          </h1>
          <p className="mt-2 text-muted-foreground font-sans text-sm max-w-2xl">
            Real-time portfolio traffic metrics, verified JSON content storage, and drag-and-drop catalog administration.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground bg-card/60 border border-border/80 px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>ALL REPOSITORIES SYNCED</span>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCardsData.map((stat, i) => {
          const Icon = getIcon(stat.icon)
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="border border-border/80 bg-card/70 backdrop-blur-sm p-6 hover:border-primary/60 transition-all duration-300 space-y-4 shadow-xs"
            >
              <div className="flex justify-between items-center border-b border-border/70 pb-3">
                <div className="flex h-9 w-9 items-center justify-center bg-primary/10 border border-primary/20 text-primary">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="border border-border/80 bg-background/80 px-2 py-0.5 text-[10px] font-mono font-bold text-foreground">
                  {stat.change}
                </div>
              </div>
              <div>
                <div className="font-display text-3xl font-bold tracking-tight text-foreground mb-1">
                  {stat.value}
                </div>
                <p className="studio-label text-[10px] text-muted-foreground">
                  {stat.title}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Analytics Notice */}
      {analyticsData?.isMock && (
        <div className="border border-border/70 bg-card/50 p-3.5 text-center font-mono text-[11px] text-muted-foreground uppercase flex items-center justify-center gap-2">
          <span className="text-primary font-bold">INFO:</span>
          <span>Local demo telemetry active. Cloudflare & Google Analytics metrics hook up automatically in production.</span>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Area Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2 p-6 border border-border/80 bg-card/70 backdrop-blur-sm space-y-6 shadow-xs"
        >
          <div className="border-b border-border/70 pb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl font-bold uppercase text-foreground">TRAFFIC OVERVIEW</h3>
              <p className="studio-label text-[10px] text-muted-foreground mt-0.5">PAGE VIEWS VS UNIQUE VISITORS (7-DAY ACTIVITY)</p>
            </div>
            <span className="studio-label text-[9px] text-primary border border-primary/30 px-2 py-0.5 bg-primary/5">
              LIVE HOOK
            </span>
          </div>
          
          <div className="h-[280px] w-full">
            {mounted && chartTrafficData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartTrafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="primaryArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.6} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontFamily: 'monospace' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontFamily: 'monospace' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#primaryArea)" />
                  <Area type="monotone" dataKey="visitors" stroke="hsl(var(--foreground))" strokeWidth={1.5} strokeDasharray="3 3" fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center font-mono text-xs text-muted-foreground">
                LOADING TRAFFIC METRICS...
              </div>
            )}
          </div>
        </motion.div>

        {/* Donut Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="p-6 border border-border/80 bg-card/70 backdrop-blur-sm flex flex-col justify-between space-y-6 shadow-xs"
        >
          <div className="border-b border-border/70 pb-4">
            <h3 className="font-display text-xl font-bold uppercase text-foreground">TRAFFIC SOURCES</h3>
            <p className="studio-label text-[10px] text-muted-foreground mt-0.5">VISITOR CHANNEL DISTRIBUTION</p>
          </div>
          
          <div className="h-[200px] w-full flex items-center justify-center relative">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData?.sourceData || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {(analyticsData?.sourceData || []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border/70 font-mono text-[10px]">
            {(analyticsData?.sourceData || []).map((source, i) => (
              <div key={source.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 shrink-0" style={{ backgroundColor: pieColors[i % pieColors.length] }} />
                <span className="text-muted-foreground font-bold truncate">{source.name.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Content Database Modules Grid Header */}
      <div className="space-y-6 pt-4 border-t border-border/80">
        <div className="border-b border-border/70 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="studio-label text-[10px] text-primary font-mono tracking-widest mb-1">
              DATA ARCHIVE CATALOG
            </div>
            <h2 className="editorial-heading text-2xl sm:text-3xl font-bold uppercase text-foreground">
              Content Database Modules
            </h2>
            <p className="text-muted-foreground text-xs mt-1">
              Select any collection to view, edit, or drag & drop to reorder records.
            </p>
          </div>
          <span className="studio-label text-[10px] text-muted-foreground font-mono">
            {models.length} COLLECTIONS ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => {
            const Icon = getModelIcon(model)
            
            return (
              <Link href={`/admin/${model}`} key={model} className="block group">
                <div className="border border-border/80 bg-card/70 backdrop-blur-sm p-6 hover:border-primary/60 hover:shadow-md transition-all duration-300 space-y-6 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between border-b border-border/70 pb-4 mb-4">
                      <div className="flex h-9 w-9 items-center justify-center bg-primary/10 border border-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase group-hover:text-primary transition-colors">
                        JSON SOURCE
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold uppercase text-foreground group-hover:text-primary transition-colors mb-1.5">
                      {model.replace("-", " ")}
                    </h3>
                  </div>

                  <div className="pt-4 border-t border-border/70 flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
                      <span className="font-bold text-foreground">{stats[model]?.entries}</span>
                      <span>records</span>
                      <span className="opacity-40">/</span>
                      <span>{stats[model]?.size} KB</span>
                    </div>
                    <span className="studio-text-link text-[10px] text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      EXPLORE <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
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
