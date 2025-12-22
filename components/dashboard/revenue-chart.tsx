"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const data = [
    {
        name: "Jul",
        total: 24000,
    },
    {
        name: "Aug",
        total: 18000,
    },
    {
        name: "Sep",
        total: 32000,
    },
    {
        name: "Okt",
        total: 28000,
    },
    {
        name: "Nov",
        total: 41150,
    },
    {
        name: "Dec",
        total: 12500, // Current incomplete
    },
]

export function RevenueChart() {
    return (
        <Card className="rounded-xl border-slate-200 shadow-sm bg-white col-span-1 md:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-bold text-slate-900">Omzet</CardTitle>
                <span className="text-sm text-slate-500">Laatste 6 maanden</span>
            </CardHeader>
            <CardContent className="pl-0">
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            fontFamily="var(--font-inter)"
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `€${value / 1000}k`}
                            fontFamily="var(--font-inter)"
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                            itemStyle={{ color: '#64748b', fontFamily: 'var(--font-jetbrains-mono)' }}
                            formatter={(value: any) => [`€ ${Number(value).toLocaleString()}`, 'Omzet']}
                        />
                        <Bar
                            dataKey="total"
                            fill="#0f172a" // Slate-900
                            radius={[4, 4, 0, 0]}
                            className=""
                        // Simulating specific styling by index if possible, but for now fixed color
                        // Can customize Shape to highlight last bar
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
