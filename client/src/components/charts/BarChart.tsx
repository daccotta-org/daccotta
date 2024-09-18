"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "../ui/chart"

export const description = "A bar chart"

const chartData = [
    { month: "January", movies: 186 },
    { month: "February", movies: 305 },
    { month: "March", movies: 237 },
    { month: "April", movies: 73 },
    { month: "May", movies: 209 },
    { month: "June", movies: 214 },
]

const chartConfig = {
    movies: {
        label: "movies",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export function BarChart1() {
    return (
        <Card className="mt-2 bg-gradient-to-tr from-gray-900 to-gray-700 border-0">
            <CardHeader>
                <CardDescription className="text-gray-300">
                    January - June 2024
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
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
                            dataKey="movies"
                            fill="var(--color-movies)"
                            radius={8}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none text-gray-300">
                    You watched 5.2% more movies this month{" "}
                    <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total visitors for the last 6 months
                </div>
            </CardFooter>
        </Card>
    )
}
