import React, { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useJournal } from "@/services/journalService"
import { SimpleMovie } from "@/Types/Movie"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    PieChart,
    Pie,
    Label,
} from "recharts"

import {
    FilmIcon,
    TrendingUpIcon,
    TrendingDownIcon,
    BarChart3Icon,
    PieChartIcon,
    ClockIcon,
    TrendingUp,
    TrendingDown,
} from "lucide-react"
import { ChartConfig } from "@/components/ui/chart"

interface MovieStats {
    totalWatched: number
    monthlyWatched: { [key: string]: number }
    topGenres: { genre: string; count: number }[]
    genreDistribution: { genre: string; count: number }[]
    topDecade: { decade: string; count: number }
}

const StatsPage: React.FC = () => {
    const { user } = useAuth()
    const { useGetJournalEntries } = useJournal()
    const { data: journalEntries } = useGetJournalEntries()
    const [stats, setStats] = useState<MovieStats | null>(null)

    useEffect(() => {
        if (journalEntries) {
            const movieStats = calculateStats(journalEntries)
            setStats(movieStats)
        }
    }, [journalEntries])

    const calculateStats = (entries: SimpleMovie[]): MovieStats => {
        const totalWatched = entries.length
        const monthlyWatched = calculateMonthlyWatched(entries)
        const topGenres = calculateTopGenres(entries)
        const genreDistribution = calculateGenreDistribution(entries)
        const topDecade = calculateTopDecade(entries)

        return {
            totalWatched,
            monthlyWatched,
            topGenres,
            genreDistribution,
            topDecade,
        }
    }

    const calculateMonthlyWatched = (
        entries: SimpleMovie[]
    ): { [key: string]: number } => {
        const monthlyCount: { [key: string]: number } = {}
        entries.forEach((entry) => {
            const month = new Date(entry.release_date).toLocaleString(
                "default",
                { month: "long" }
            )
            monthlyCount[month] = (monthlyCount[month] || 0) + 1
        })
        return monthlyCount
    }

    const calculateTopGenres = (
        entries: SimpleMovie[]
    ): { genre: string; count: number }[] => {
        const genreCounts: { [key: string]: number } = {}
        entries.forEach((entry) => {
            entry.genre_ids?.forEach((genreId) => {
                genreCounts[genreId] = (genreCounts[genreId] || 0) + 1
            })
        })
        return Object.entries(genreCounts)
            .map(([genre, count]) => ({ genre, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3)
    }

    const calculateGenreDistribution = (
        entries: SimpleMovie[]
    ): { genre: string; count: number }[] => {
        const genreCounts: { [key: string]: number } = {}
        entries.forEach((entry) => {
            entry.genre_ids?.forEach((genreId) => {
                genreCounts[genreId] = (genreCounts[genreId] || 0) + 1
            })
        })
        return Object.entries(genreCounts).map(([genre, count]) => ({
            genre,
            count,
        }))
    }

    const calculateTopDecade = (
        entries: SimpleMovie[]
    ): { decade: string; count: number } => {
        const decadeCounts: { [key: string]: number } = {}
        entries.forEach((entry) => {
            const year = new Date(entry.release_date).getFullYear()
            const decade = `${Math.floor(year / 10) * 10}s`
            decadeCounts[decade] = (decadeCounts[decade] || 0) + 1
        })
        return Object.entries(decadeCounts)
            .map(([decade, count]) => ({ decade, count }))
            .sort((a, b) => b.count - a.count)[0]
    }

    if (!stats) {
        return <div>Loading stats...</div>
    }

    const monthlyWatchedData = Object.entries(stats.monthlyWatched).map(
        ([month, count]) => ({
            month,
            desktop: count,
        })
    )

    const genreDistributionData = stats.genreDistribution.map((genre) => ({
        browser: genre.genre,
        visitors: genre.count,
        fill: `hsl(${Math.random() * 360}, 70%, 50%)`, // Generate random color for each genre
    }))

    const totalGenreCount = genreDistributionData.reduce(
        (acc, curr) => acc + curr.visitors,
        0
    )

    const currentMonth = new Date().toLocaleString("default", { month: "long" })
    const lastMonth = new Date(
        new Date().setMonth(new Date().getMonth() - 1)
    ).toLocaleString("default", { month: "long" })
    const moviesDiff =
        (stats.monthlyWatched[currentMonth] || 0) -
        (stats.monthlyWatched[lastMonth] || 0)

    const chartConfig: ChartConfig = {
        desktop: {
            label: "Movies Watched",
            color: "hsl(var(--chart-1))",
        },
    }

    const pieChartConfig: ChartConfig = stats.genreDistribution.reduce(
        (acc, genre) => {
            acc[genre.genre] = {
                label: genre.genre,
                color: `hsl(${Math.random() * 360}, 70%, 50%)`,
            }
            return acc
        },
        {} as ChartConfig
    )

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Your Movie Stats</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Movies Watched</CardTitle>
                        <CardDescription>All time</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center">
                        <div className="text-4xl font-bold">
                            {stats.totalWatched}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <FilmIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                            Lifetime total
                        </span>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Trend</CardTitle>
                        <CardDescription>
                            Movies watched per month
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig}>
                            <BarChart data={monthlyWatchedData}>
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
                    <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="flex gap-2 font-medium leading-none">
                            {moviesDiff > 0 ? (
                                <>
                                    Trending up by {moviesDiff} this month{" "}
                                    <TrendingUp className="h-4 w-4" />
                                </>
                            ) : (
                                <>
                                    Trending down by {Math.abs(moviesDiff)} this
                                    month <TrendingDown className="h-4 w-4" />
                                </>
                            )}
                        </div>
                        <div className="leading-none text-muted-foreground">
                            Compared to last month
                        </div>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top 3 Genres</CardTitle>
                        <CardDescription>
                            Your most watched genres
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul>
                            {stats.topGenres.map((genre, index) => (
                                <li
                                    key={index}
                                    className="mb-2 flex justify-between"
                                >
                                    <span>{genre.genre}</span>
                                    <span>{genre.count} movies</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground ml-2">
                            Based on your watch history
                        </span>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Genre Distribution</CardTitle>
                        <CardDescription>
                            All genres you've watched
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={pieChartConfig}
                            className="mx-auto aspect-square max-h-[250px]"
                        >
                            <PieChart>
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Pie
                                    data={genreDistributionData}
                                    dataKey="visitors"
                                    nameKey="browser"
                                    innerRadius={60}
                                    strokeWidth={5}
                                >
                                    <Label
                                        content={({ viewBox }) => {
                                            if (
                                                viewBox &&
                                                "cx" in viewBox &&
                                                "cy" in viewBox
                                            ) {
                                                return (
                                                    <text
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        textAnchor="middle"
                                                        dominantBaseline="middle"
                                                    >
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={viewBox.cy}
                                                            className="fill-foreground text-3xl font-bold"
                                                        >
                                                            {totalGenreCount}
                                                        </tspan>
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={
                                                                (viewBox.cy ||
                                                                    0) + 24
                                                            }
                                                            className="fill-muted-foreground"
                                                        >
                                                            Total
                                                        </tspan>
                                                    </text>
                                                )
                                            }
                                        }}
                                    />
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                            Distribution of all watched genres
                        </span>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Favorite Decade</CardTitle>
                        <CardDescription>Your most watched era</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center">
                        <div className="text-4xl font-bold">
                            {stats.topDecade.decade}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                            {stats.topDecade.count} movies watched from this
                            decade
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <ClockIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                            Based on release dates
                        </span>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default StatsPage
