import {
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "../ui/chart"
import { Card, CardContent, CardDescription } from "../ui/card"
import { TrendingUp } from "lucide-react"

// Define the types for the monthly watched data
interface MonthlyWatchedData {
    month: string
    desktop: number
}

// Define the stats structure
interface MovieStats {
    monthlyWatched: Record<string, number>
    genreDistribution: Array<{ genre: string; count: number }>
}

// Define the chart config

interface DynamicBarChartProps {
    data: MonthlyWatchedData[]
}
const chartConfig: ChartConfig = {
    desktop: {
        label: "Movies Watched",
        color: "hsl(var(--chart-1))",
    },
}

// Dynamic Bar Chart component
const DynamicBarChart: React.FC<DynamicBarChartProps> = ({ data }) => {
    return (
        // <ResponsiveContainer width="100%" height={300}>
        //     <BarChart data={data}>
        //         <CartesianGrid strokeDasharray="3 3" />
        //         <XAxis dataKey="month" stroke="#888888" />
        //         <Tooltip content={<CustomTooltip />} />
        //         <Bar dataKey="desktop" fill={chartConfig.desktop.color} />
        //     </BarChart>
        // </ResponsiveContainer>
        <Card className="mt-2 pt-2 bg-gradient-to-tr from-gray-900 to-gray-700 border-0">
            <CardDescription className="text-gray-300 text-center">
                current month
            </CardDescription>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                            dataKey="desktop"
                            fill="var(--color-desktop)"
                            radius={8}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

// Custom Tooltip Component (typed properly)
interface TooltipProps {
    active?: boolean
    payload?: { value: number }[]
    label?: string
}

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-800 text-white p-2 rounded">
                <p className="label">{label}</p>
                <p>{`Movies Watched: ${payload[0].value}`}</p>
            </div>
        )
    }
    return null
}

export default DynamicBarChart
