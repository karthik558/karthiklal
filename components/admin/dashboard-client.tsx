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
  Activity,
  Database,
  FileCode
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

export default function DashboardClient({ models, stats }: DashboardClientProps) {
  const [mounted, setMounted] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<{
    trafficData: any[]
    sourceData: any[]
    statCards: any[]
    isMock: boolean
  } | null>(null)

  useEffect(() => {
    setMounted(true)
    
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
    { title: "TOTAL VIEWS", value: "...", change: "...", icon: Activity },
    { title: "UNIQUE VISITORS", value: "...", change: "...", icon: Users },
    { title: "ENGAGEMENT RATE", value: "...", change: "...", icon: MousePointerClick },
    { title: "AVG. SESSION", value: "...", change: "...", icon: Clock },
  ]

  const statCardsData = analyticsData?.statCards || defaultStatCards
  const chartTrafficData = analyticsData?.trafficData || []

  // Clean monochrome source colors
  const monoPieColors = ["#ffffff", "#a1a1aa", "#71717a", "#3f3f46"]

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
        <div className="bg-card border-2 border-foreground p-3 shadow-2xl font-mono text-xs uppercase space-y-1 z-50 text-foreground">
          <p className="font-bold border-b border-border pb-1">{label}</p>
          {payload.map((item: any, i: number) => (
            <p key={i} className="flex items-center justify-between gap-4 font-mono">
              <span className="text-muted-foreground">{item.name}:</span>
              <span className="font-bold">{item.value}</span>
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-12 font-mono text-xs uppercase">
      
      {/* Page Title Header */}
      <div className="border-b-2 border-border pb-8">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
          SYSTEM METRICS & ANALYTICS // 00
        </div>
        <h1 className="font-display text-4xl font-black uppercase tracking-tight text-foreground sm:text-6xl">
          ADMIN DASHBOARD
        </h1>
        <p className="mt-2 text-muted-foreground font-sans text-sm">
          Real-time traffic metrics, server statistics, and content management controls.
        </p>
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
              className="border-2 border-border bg-card p-6 hover:border-foreground transition-all duration-300 space-y-4"
            >
              <div className="flex justify-between items-center border-b border-border pb-3">
                <div className="flex h-10 w-10 items-center justify-center border border-border bg-background text-foreground">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="border border-border bg-background px-2.5 py-1 text-[10px] font-bold text-foreground">
                  {stat.change}
                </div>
              </div>
              <div>
                <div className="font-display text-3xl font-black text-foreground mb-1">
                  {stat.value}
                </div>
                <p className="text-muted-foreground font-bold tracking-wider text-[11px]">
                  {stat.title}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Analytics Info Notification */}
      {analyticsData?.isMock && (
        <div className="border-2 border-border bg-card p-4 text-center font-mono text-xs text-muted-foreground uppercase">
          [ DEMO MODE ] GOOGLE ANALYTICS INTEGRATION ACTIVE ON SERVER ENVIRONMENT.
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Area Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2 p-6 border-2 border-border bg-card space-y-6"
        >
          <div className="border-b border-border pb-4">
            <h3 className="font-display text-2xl font-black uppercase text-foreground">TRAFFIC OVERVIEW</h3>
            <p className="text-muted-foreground text-xs font-mono">PAGE VIEWS VS UNIQUE VISITORS (PAST 7 DAYS)</p>
          </div>
          
          <div className="h-[280px] w-full">
            {mounted && chartTrafficData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartTrafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontFamily: 'monospace' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontFamily: 'monospace' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="views" stroke="hsl(var(--foreground))" strokeWidth={2} fillOpacity={0.15} fill="hsl(var(--foreground))" />
                  <Area type="monotone" dataKey="visitors" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="3 3" fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">LOADING TRAFFIC DATA...</div>
            )}
          </div>
        </motion.div>

        {/* Donut Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="p-6 border-2 border-border bg-card flex flex-col justify-between space-y-6"
        >
          <div className="border-b border-border pb-4">
            <h3 className="font-display text-2xl font-black uppercase text-foreground">TRAFFIC SOURCES</h3>
            <p className="text-muted-foreground text-xs font-mono">CURRENT VISITOR SOURCES DISTRIBUTION</p>
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
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {(analyticsData?.sourceData || []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={monoPieColors[index % monoPieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border font-mono text-[10px]">
            {(analyticsData?.sourceData || []).map((source: any, i: number) => (
              <div key={source.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 border border-foreground shrink-0" style={{ backgroundColor: monoPieColors[i % monoPieColors.length] }} />
                <span className="text-muted-foreground font-bold truncate">{source.name.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Content Models Grid Header */}
      <div className="space-y-6 pt-4 border-t-2 border-border">
        <div className="border-b border-border pb-4">
          <h2 className="font-display text-3xl font-black uppercase text-foreground">CONTENT DATABASE MODULES</h2>
          <p className="text-muted-foreground text-xs">SELECT A DATA SOURCE TO MODIFY CONTENT RECORDS IN REAL TIME.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => {
            const Icon = getModelIcon(model)
            
            return (
              <Link href={`/admin/${model}`} key={model} className="block group">
                <div className="border-2 border-border bg-card p-6 hover:border-foreground transition-all duration-300 space-y-6 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center border-2 border-border bg-background text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs font-bold text-muted-foreground group-hover:text-foreground">
                        JSON DATA
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-black uppercase text-foreground group-hover:underline underline-offset-4 mb-2">
                      {model.replace("-", " ")}
                    </h3>
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-between font-mono text-xs font-bold">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span>{stats[model]?.entries} RECORDS</span>
                      <span>//</span>
                      <span>{stats[model]?.size} KB</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-foreground transition-transform group-hover:translate-x-1" />
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

