"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Download } from "lucide-react"
import { format, subDays } from "date-fns"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30")
  const [materialData, setMaterialData] = useState<any[]>([])
  const [toolData, setToolData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // In a real app, you would fetch this data from your API
        // For now, we'll generate mock data

        // Generate material cost data
        const materials = ["Lumber", "Concrete", "Steel", "Drywall", "Paint"]
        const materialCostData = []

        const days = Number.parseInt(timeRange)
        const startDate = subDays(new Date(), days)

        for (let i = 0; i < days; i++) {
          const date = subDays(new Date(), days - i)
          const dataPoint: any = {
            date: format(date, "MMM dd"),
            fullDate: date.toISOString(),
          }

          materials.forEach((material) => {
            // Generate a somewhat realistic cost trend with some randomness
            const baseCost =
              material === "Lumber"
                ? 5.99
                : material === "Concrete"
                  ? 12.99
                  : material === "Steel"
                    ? 25.5
                    : material === "Drywall"
                      ? 15.75
                      : 10.25

            // Add some trend and randomness
            const trend = Math.sin(i / 10) * 0.5 // Cyclical component
            const random = (Math.random() - 0.5) * 0.3 // Random component
            const growthFactor = 1 + (i / days) * 0.1 // Growth component

            dataPoint[material] = +(baseCost * growthFactor + trend + random).toFixed(2)
          })

          materialCostData.push(dataPoint)
        }

        setMaterialData(materialCostData)

        // Generate tool usage data
        const toolUsageData = [
          { name: "Hammer", assigned: 15, available: 8 },
          { name: "Drill", assigned: 20, available: 5 },
          { name: "Saw", assigned: 8, available: 12 },
          { name: "Sander", assigned: 5, available: 10 },
          { name: "Nail Gun", assigned: 12, available: 3 },
        ]

        setToolData(toolUsageData)
      } catch (error) {
        console.error("Error fetching analytics data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [timeRange])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  const exportData = (type: string) => {
    let dataToExport
    let filename

    if (type === "materials") {
      dataToExport = materialData
      filename = `material-costs-${timeRange}-days.json`
    } else {
      dataToExport = toolData
      filename = "tool-usage.json"
    }

    const jsonString = JSON.stringify(dataToExport, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="180">Last 6 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <p>Loading analytics data...</p>
        </div>
      ) : (
        <Tabs defaultValue="materials" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="materials">Material Costs</TabsTrigger>
            <TabsTrigger value="tools">Tool Usage</TabsTrigger>
          </TabsList>

          <TabsContent value="materials" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Material Cost Trends</h2>
              <Button variant="outline" size="sm" onClick={() => exportData("materials")}>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Material Cost Comparison</CardTitle>
                <CardDescription>Track and compare material costs over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ChartContainer
                    config={{
                      Lumber: {
                        label: "Lumber",
                        color: "hsl(var(--chart-1))",
                      },
                      Concrete: {
                        label: "Concrete",
                        color: "hsl(var(--chart-2))",
                      },
                      Steel: {
                        label: "Steel",
                        color: "hsl(var(--chart-3))",
                      },
                      Drywall: {
                        label: "Drywall",
                        color: "hsl(var(--chart-4))",
                      },
                      Paint: {
                        label: "Paint",
                        color: "hsl(var(--chart-5))",
                      },
                    }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={materialData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="Lumber" stroke="var(--color-Lumber)" />
                        <Line type="monotone" dataKey="Concrete" stroke="var(--color-Concrete)" />
                        <Line type="monotone" dataKey="Steel" stroke="var(--color-Steel)" />
                        <Line type="monotone" dataKey="Drywall" stroke="var(--color-Drywall)" />
                        <Line type="monotone" dataKey="Paint" stroke="var(--color-Paint)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Lumber Cost Forecast</CardTitle>
                  <CardDescription>Predicted cost trends for lumber</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={materialData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="Lumber" stroke="#8884d8" fill="#8884d8" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Steel Cost Forecast</CardTitle>
                  <CardDescription>Predicted cost trends for steel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={materialData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="Steel" stroke="#82ca9d" fill="#82ca9d" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Cost Volatility Analysis</CardTitle>
                <CardDescription>Analyze price fluctuations and volatility</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={materialData.slice(-10)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Lumber" fill="#8884d8" />
                      <Bar dataKey="Concrete" fill="#82ca9d" />
                      <Bar dataKey="Steel" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Tool Usage Analytics</h2>
              <Button variant="outline" size="sm" onClick={() => exportData("tools")}>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Tool Allocation</CardTitle>
                  <CardDescription>Current allocation of tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={toolData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="assigned" fill="#8884d8" name="Assigned" />
                        <Bar dataKey="available" fill="#82ca9d" name="Available" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tool Usage Distribution</CardTitle>
                  <CardDescription>Distribution of tool assignments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={toolData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="assigned"
                        >
                          {toolData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tool Utilization Rate</CardTitle>
                <CardDescription>Percentage of tools currently in use</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={toolData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip
                        formatter={(value, name, props) => {
                          const total = props.payload.assigned + props.payload.available
                          return [`${((props.payload.assigned / total) * 100).toFixed(1)}%`, "Utilization Rate"]
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="assigned"
                        fill="#8884d8"
                        name="Utilization Rate"
                        // Calculate percentage
                        formatter={(value, name, props) => {
                          const total = props.assigned + props.available
                          return (props.assigned / total) * 100
                        }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

