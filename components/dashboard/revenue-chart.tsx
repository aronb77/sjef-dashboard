"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RevenueChartProps {
    data?: { name: string; total: number }[]
}

export function RevenueChart({ data }: RevenueChartProps) {
    // Fallback/Mock data if empty (or could be empty state)
    const chartData = data && data.length > 0 ? data : [
        { name: "Jan", total: 0 },
        { name: "Feb", total: 0 },
        { name: "Mrt", total: 0 },
        { name: "Apr", total: 0 },
        { name: "Mei", total: 0 },
        { name: "Jun", total: 0 },
    ]

    const totalRevenue = chartData.reduce((acc, curr) => acc + curr.total, 0)

    return (
        <Card className="rounded-xl border-slate-200 shadow-sm bg-white col-span-1 md:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-bold text-slate-900">Omzet</CardTitle>
                <span className="text-sm text-slate-500">Laatste 6 maanden</span>
            </CardHeader>
            <CardContent className="pl-0">
                <div className="px-6 mb-4">
                    <div className="text-2xl font-bold font-mono text-slate-900">
                        € {totalRevenue.toLocaleString('nl-NL')}
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData}>
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
                            width={45}
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
                            fill="#F97316" // Orange-500
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
