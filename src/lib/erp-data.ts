// Aurora ERP — mock data layer
// Centralized business data powering all modules.

export type Trend = "up" | "down" | "flat"

export interface Kpi {
  id: string
  label: string
  value: string
  raw: number
  delta: string
  trend: Trend
  spark: number[]
  unit?: string
  accent: "emerald" | "amber" | "rose" | "violet" | "teal"
}

export const kpis: Kpi[] = [
  {
    id: "revenue",
    label: "Total Revenue",
    value: "$4.82M",
    raw: 4820000,
    delta: "+12.4%",
    trend: "up",
    spark: [32, 38, 35, 44, 48, 52, 58, 61, 67, 72],
    accent: "emerald",
  },
  {
    id: "orders",
    label: "Active Orders",
    value: "1,284",
    raw: 1284,
    delta: "+8.1%",
    trend: "up",
    spark: [12, 15, 14, 18, 22, 20, 26, 28, 31, 34],
    accent: "teal",
  },
  {
    id: "customers",
    label: "New Customers",
    value: "9,317",
    raw: 9317,
    delta: "+23.6%",
    trend: "up",
    spark: [40, 42, 48, 52, 55, 61, 68, 74, 82, 91],
    accent: "violet",
  },
  {
    id: "churn",
    label: "Churn Rate",
    value: "2.1%",
    raw: 2.1,
    delta: "-0.6%",
    trend: "down",
    spark: [4.2, 3.9, 3.6, 3.4, 3.1, 2.9, 2.7, 2.5, 2.3, 2.1],
    accent: "amber",
  },
]

export const revenueSeries = [
  { month: "Jan", revenue: 285, target: 300, profit: 72 },
  { month: "Feb", revenue: 312, target: 310, profit: 81 },
  { month: "Mar", revenue: 298, target: 320, profit: 76 },
  { month: "Apr", revenue: 351, target: 330, profit: 94 },
  { month: "May", revenue: 389, target: 350, profit: 108 },
  { month: "Jun", revenue: 412, target: 370, profit: 121 },
  { month: "Jul", revenue: 401, target: 390, profit: 116 },
  { month: "Aug", revenue: 445, target: 410, profit: 134 },
  { month: "Sep", revenue: 478, target: 430, profit: 149 },
  { month: "Oct", revenue: 502, target: 450, profit: 162 },
  { month: "Nov", revenue: 538, target: 470, profit: 178 },
  { month: "Dec", revenue: 591, target: 490, profit: 201 },
]

export const departmentSpend = [
  { name: "Engineering", value: 1.24, color: "var(--chart-1)" },
  { name: "Sales & Marketing", value: 0.88, color: "var(--chart-3)" },
  { name: "Operations", value: 0.62, color: "var(--chart-2)" },
  { name: "R&D", value: 0.54, color: "var(--chart-4)" },
  { name: "Administration", value: 0.31, color: "var(--chart-5)" },
]

export const trafficSources = [
  { source: "Organic", value: 38, color: "var(--chart-1)" },
  { source: "Referral", value: 24, color: "var(--chart-2)" },
  { source: "Paid", value: 19, color: "var(--chart-3)" },
  { source: "Social", value: 12, color: "var(--chart-4)" },
  { source: "Direct", value: 7, color: "var(--chart-5)" },
]

export interface Activity {
  id: string
  type: "deal" | "order" | "payment" | "alert" | "hire" | "shipment"
  title: string
  detail: string
  time: string
  amount?: string
}

export const activities: Activity[] = [
  {
    id: "a1",
    type: "deal",
    title: "Deal closed — Northwind Logistics",
    detail: "Enterprise plan · 3-year contract",
    time: "2m ago",
    amount: "$284,000",
  },
  {
    id: "a2",
    type: "payment",
    title: "Invoice paid — Globex Corp",
    detail: "INV-2024-08812 · wire transfer",
    time: "14m ago",
    amount: "$48,200",
  },
  {
    id: "a3",
    type: "shipment",
    title: "Shipment dispatched — Warehouse B",
    detail: "PO-7741 · 320 units to Singapore",
    time: "38m ago",
  },
  {
    id: "a4",
    type: "alert",
    title: "Low stock threshold — SKU-4471",
    detail: "Quantum Sensor Module below 12 units",
    time: "1h ago",
  },
  {
    id: "a5",
    type: "hire",
    title: "New hire onboarded — Priya Nair",
    detail: "Senior Platform Engineer · Engineering",
    time: "2h ago",
  },
  {
    id: "a6",
    type: "order",
    title: "Bulk order received — Acme Industries",
    detail: "1,200 units · scheduled delivery",
    time: "3h ago",
    amount: "$96,400",
  },
]

export interface Insight {
  id: string
  category: string
  title: string
  body: string
  impact: "high" | "medium" | "low"
  accent: "emerald" | "amber" | "violet"
}

export const insights: Insight[] = [
  {
    id: "i1",
    category: "Revenue Forecast",
    title: "Q4 projected to exceed target by 18%",
    body: "Current trajectory suggests $6.9M against a $5.8M target, driven by enterprise renewals in APAC.",
    impact: "high",
    accent: "emerald",
  },
  {
    id: "i2",
    category: "Inventory Risk",
    title: "3 SKUs at risk of stockout within 7 days",
    body: "Quantum Sensor Module, Relay Coil 12V, and Actuator X9 trending below reorder point. Auto-PO drafted.",
    impact: "high",
    accent: "amber",
  },
  {
    id: "i3",
    category: "Cash Flow",
    title: "Receivables aging improved by 4.2 days",
    body: "Average collection cycle down to 31.6 days. Recommend early-payment incentive extension to top 20 accounts.",
    impact: "medium",
    accent: "violet",
  },
]

export interface Product {
  id: string
  name: string
  sku: string
  category: string
  stock: number
  reorder: number
  price: number
  status: "in-stock" | "low" | "out"
  warehouse: string
}

export const products: Product[] = [
  { id: "p1", name: "Quantum Sensor Module", sku: "SKU-4471", category: "Sensors", stock: 8, reorder: 25, price: 1240, status: "low", warehouse: "B" },
  { id: "p2", name: "Precision Actuator X9", sku: "SKU-2208", category: "Actuators", stock: 412, reorder: 80, price: 480, status: "in-stock", warehouse: "A" },
  { id: "p3", name: "Relay Coil 12V", sku: "SKU-1180", category: "Electronics", stock: 14, reorder: 60, price: 38, status: "low", warehouse: "C" },
  { id: "p4", name: "Carbon Chassis V2", sku: "SKU-9921", category: "Structural", stock: 0, reorder: 20, price: 890, status: "out", warehouse: "A" },
  { id: "p5", name: "Optic Lens Array", sku: "SKU-3340", category: "Optics", stock: 268, reorder: 50, price: 320, status: "in-stock", warehouse: "B" },
  { id: "p6", name: "Thermal Paste Pro", sku: "SKU-5567", category: "Consumables", stock: 1840, reorder: 200, price: 14, status: "in-stock", warehouse: "C" },
  { id: "p7", name: "Servo Motor 5kW", sku: "SKU-7712", category: "Motors", stock: 96, reorder: 40, price: 1450, status: "in-stock", warehouse: "A" },
  { id: "p8", name: "Hydraulic Pump H7", sku: "SKU-2290", category: "Hydraulics", stock: 22, reorder: 30, price: 2680, status: "low", warehouse: "B" },
]

export interface Order {
  id: string
  customer: string
  channel: string
  items: number
  total: number
  status: "fulfilled" | "processing" | "shipped" | "pending"
  date: string
}

export const orders: Order[] = [
  { id: "ORD-88412", customer: "Northwind Logistics", channel: "Direct", items: 320, total: 284000, status: "processing", date: "2024-12-14" },
  { id: "ORD-88411", customer: "Globex Corp", channel: "Partner", items: 84, total: 48200, status: "shipped", date: "2024-12-14" },
  { id: "ORD-88410", customer: "Acme Industries", channel: "Online", items: 1200, total: 96400, status: "processing", date: "2024-12-13" },
  { id: "ORD-88409", customer: "Initech", channel: "Direct", items: 56, total: 31200, status: "fulfilled", date: "2024-12-13" },
  { id: "ORD-88408", customer: "Umbrella Pharma", channel: "Partner", items: 410, total: 168000, status: "shipped", date: "2024-12-12" },
  { id: "ORD-88407", customer: "Stark Industries", channel: "Direct", items: 24, total: 42800, status: "fulfilled", date: "2024-12-12" },
  { id: "ORD-88406", customer: "Wayne Enterprises", channel: "Online", items: 188, total: 72400, status: "pending", date: "2024-12-11" },
]

export interface Employee {
  id: string
  name: string
  role: string
  department: string
  status: "active" | "leave" | "remote"
  performance: number
  avatar?: string
}

export const employees: Employee[] = [
  { id: "e1", name: "Priya Nair", role: "Senior Platform Engineer", department: "Engineering", status: "active", performance: 94 },
  { id: "e2", name: "Marcus Chen", role: "Head of Sales", department: "Sales", status: "active", performance: 88 },
  { id: "e3", name: "Sofia Reyes", role: "Finance Controller", department: "Finance", status: "remote", performance: 91 },
  { id: "e4", name: "David Okonkwo", role: "Warehouse Manager", department: "Operations", status: "active", performance: 85 },
  { id: "e5", name: "Yuki Tanaka", role: "Product Designer", department: "Design", status: "leave", performance: 90 },
  { id: "e6", name: "Elena Volkov", role: "Data Scientist", department: "Engineering", status: "remote", performance: 96 },
]

export interface Project {
  id: string
  name: string
  client: string
  progress: number
  stage: "planning" | "in-progress" | "review" | "done"
  due: string
  budget: number
  spent: number
  team: number
}

export const projects: Project[] = [
  { id: "pr1", name: "Atlas Platform Migration", client: "Internal", progress: 72, stage: "in-progress", due: "Feb 28", budget: 480000, spent: 312000, team: 8 },
  { id: "pr2", name: "Q1 Brand Refresh", client: "Marketing", progress: 45, stage: "in-progress", due: "Jan 20", budget: 120000, spent: 54000, team: 4 },
  { id: "pr3", name: "APAC Distribution Net", client: "Northwind", progress: 88, stage: "review", due: "Jan 12", budget: 640000, spent: 588000, team: 6 },
  { id: "pr4", name: "Compliance Audit 2024", client: "Internal", progress: 100, stage: "done", due: "Dec 10", budget: 90000, spent: 87400, team: 3 },
  { id: "pr5", name: "Mobile Field App", client: "Acme", progress: 30, stage: "planning", due: "Mar 15", budget: 220000, spent: 48000, team: 5 },
]

export interface Lead {
  id: string
  company: string
  contact: string
  value: number
  stage: "prospect" | "qualified" | "proposal" | "negotiation" | "won"
  owner: string
  probability: number
  lastTouch: string
}

export const leads: Lead[] = [
  { id: "l1", company: "Cyberdyne Systems", contact: "Alan Pierce", value: 420000, stage: "negotiation", owner: "Marcus Chen", probability: 75, lastTouch: "1d ago" },
  { id: "l2", company: "Tyrell Corp", contact: "Eldon Tyrell", value: 680000, stage: "proposal", owner: "Sofia Reyes", probability: 55, lastTouch: "2d ago" },
  { id: "l3", company: "Massive Dynamic", contact: "Nina Sharp", value: 310000, stage: "qualified", owner: "Marcus Chen", probability: 40, lastTouch: "4d ago" },
  { id: "l4", company: "Hooli", contact: "Gavin Belson", value: 540000, stage: "negotiation", owner: "Priya Nair", probability: 68, lastTouch: "6h ago" },
  { id: "l5", company: "Pied Piper", contact: "Richard Hendricks", value: 88000, stage: "prospect", owner: "Sofia Reyes", probability: 20, lastTouch: "1w ago" },
  { id: "l6", company: "Vandelay Industries", contact: "Art Vandelay", value: 156000, stage: "proposal", owner: "Marcus Chen", probability: 48, lastTouch: "3d ago" },
]

export const regions = [
  { name: "North America", revenue: 1.92, share: 40, growth: "+9.2%" },
  { name: "Europe", revenue: 1.34, share: 28, growth: "+14.1%" },
  { name: "Asia Pacific", revenue: 1.08, share: 22, growth: "+31.5%" },
  { name: "Latin America", revenue: 0.31, share: 6, growth: "+6.8%" },
  { name: "Middle East & Africa", revenue: 0.17, share: 4, growth: "+22.4%" },
]

export interface Notification {
  id: string
  title: string
  description: string
  time: string
  unread: boolean
  type: "info" | "success" | "warning"
}

export const notifications: Notification[] = [
  { id: "n1", title: "Approval needed", description: "Purchase order PO-7742 awaiting your sign-off ($48,200)", time: "5m ago", unread: true, type: "warning" },
  { id: "n2", title: "Deal won", description: "Northwind Logistics contract finalized", time: "2m ago", unread: true, type: "success" },
  { id: "n3", title: "Weekly report ready", description: "Your operations summary for Week 50 is available", time: "1h ago", unread: true, type: "info" },
  { id: "n4", title: "Inventory alert", description: "SKU-4471 dropped below reorder threshold", time: "1h ago", unread: false, type: "warning" },
]

export const cashflow = [
  { month: "Jul", inflow: 380, outflow: 210 },
  { month: "Aug", inflow: 420, outflow: 245 },
  { month: "Sep", inflow: 465, outflow: 268 },
  { month: "Oct", inflow: 490, outflow: 282 },
  { month: "Nov", inflow: 525, outflow: 301 },
  { month: "Dec", inflow: 578, outflow: 324 },
]

export const radarData = [
  { metric: "Efficiency", value: 88, fullMark: 100 },
  { metric: "Quality", value: 94, fullMark: 100 },
  { metric: "Delivery", value: 82, fullMark: 100 },
  { metric: "Innovation", value: 91, fullMark: 100 },
  { metric: "Satisfaction", value: 86, fullMark: 100 },
  { metric: "Growth", value: 79, fullMark: 100 },
]
