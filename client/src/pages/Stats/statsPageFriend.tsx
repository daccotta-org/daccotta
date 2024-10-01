import React, { useEffect, useState } from "react"
import { useJournal } from "@/services/journalService"
import { useParams } from "react-router-dom"
import {
    IconChartBar,
    IconMovie,
    IconList,
    IconUser,
} from "@tabler/icons-react"
import { calculateStats, MovieStats } from "@/lib/stats"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Label, Pie, PieChart } from "recharts"
import DynamicBarChart from "@/components/charts/DynamicChart"

const StatsPageFriends: React.FC = () => {
    const userName = useParams<{ userName: string }>().userName
    const { useGetFriendJournalEntries } = useJournal()
    const {
        data: journalEntries,
        isLoading,
        error,
    } = useGetFriendJournalEntries(userName!)
    const [stats, setStats] = useState<MovieStats>({
        totalWatched: 0,
        monthlyWatched: [],
        topGenres: [],
        genreDistribution: [],
        topDecade: { decade: "unknown", count: 0 },
    })

    useEffect(() => {
        if (journalEntries) {
            const movieStats = calculateStats(journalEntries)
            setStats(movieStats)
        }
    }, [journalEntries])

    if (isLoading) {
        ;<div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="border-4 border-white border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
        </div>
    }

    if (error || !stats) {
        return <div>Error loading stats. Please try again later.</div>
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

    const monthlyWatchedData = stats.monthlyWatched.map((item) => ({
        month: item.month,
        desktop: item.count,
    }))

    const genreDistributionData = stats.genreDistribution.map((genre) => ({
        browser: genre.genre,
        visitors: genre.count,
        fill: `hsl(${Math.random() * 360}, 70%, 50%)`,
    }))

    const totalGenreCount = genreDistributionData.reduce(
        (acc, curr) => acc + curr.visitors,
        0
    )

    const currentMonth = stats.monthlyWatched[stats.monthlyWatched.length - 1]
    const lastMonth = stats.monthlyWatched[stats.monthlyWatched.length - 2]
    const moviesDiff = currentMonth
        ? currentMonth.count - (lastMonth ? lastMonth.count : 0)
        : 0

    const BentoGridItem: React.FC<{
        title: string
        description: string
        icon: React.ReactNode
        children: React.ReactNode
        className?: string
    }> = ({ title, description, icon, children, className }) => (
        <div
            className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 flex flex-col ${className}`}
        >
            <div className="flex items-center space-x-2 mb-4">
                {icon}
                <h3 className="text-xl font-semibold">{title}</h3>
            </div>
            <p className="text-gray-400 mb-4">{description}</p>
            <div className="flex-grow">{children}</div>
        </div>
    )

    return (
        <div className="max-h-screen overflow-auto scrollbar-hide px-12 lg:mt-0 lg:pt-2 pt-10 pb-6 text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full scrollbar-hide mx-auto">
                <BentoGridItem
                    title="Total Movies Watched"
                    description=" lifetime movie count"
                    icon={<IconMovie className="h-6 w-6 text-blue-400" />}
                >
                    <div className="text-4xl font-bold text-center">
                        {stats.totalWatched}
                    </div>
                </BentoGridItem>

                <BentoGridItem
                    title="Monthly Trend"
                    description="movie watching pattern"
                    icon={<IconChartBar className="h-6 w-6 text-green-400" />}
                    className="md:col-span-1 row-span-1"
                >
                    <DynamicBarChart data={monthlyWatchedData} />
                    <div className="flex items-center justify-center mt-4">
                        <span className="text-sm">
                            {moviesDiff > 0 ? "Up" : "Down"} by{" "}
                            {Math.abs(moviesDiff)} this month
                        </span>
                    </div>
                </BentoGridItem>

                <BentoGridItem
                    title="Top 3 Genres"
                    description="most watched genres"
                    icon={<IconList className="h-6 w-6 text-yellow-400" />}
                >
                    <ul className="space-y-2">
                        {stats.topGenres.map((genre, index) => (
                            <li key={index} className="flex justify-between">
                                <span>{genre.genre}</span>
                                <span>{genre.count} movies</span>
                            </li>
                        ))}
                    </ul>
                </BentoGridItem>

                <BentoGridItem
                    title="Genre Distribution"
                    description="Breakdown of  watched genres"
                    icon={<IconChartBar className="h-6 w-6 text-purple-400" />}
                    className="md:col-span-2"
                >
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
                                                            (viewBox.cy || 0) +
                                                            24
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
                </BentoGridItem>

                <BentoGridItem
                    title="Favorite Decade"
                    description=" most watched era"
                    icon={<IconUser className="h-6 w-6 text-red-400" />}
                >
                    <div className="text-center">
                        <div className="text-4xl font-bold mb-2">
                            {stats?.topDecade?.decade}
                        </div>
                        <p className="text-sm text-gray-400">
                            {stats?.topDecade?.count} movies watched
                        </p>
                    </div>
                </BentoGridItem>
            </div>
        </div>
    )
}

export default StatsPageFriends
