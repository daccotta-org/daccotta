import { SimpleMovie } from "@/Types/Movie"
export const genreMap: { [key: number]: string } = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
}
export interface MovieStats {
    totalWatched: number
    monthlyWatched: { month: string; count: number }[]
    topGenres: { genre: string; count: number }[]
    genreDistribution: { genre: string; count: number }[]
    topDecade: { decade: string; count: number }
}

export interface JournalEntry {
    _id: string
    movie: SimpleMovie
    dateWatched: Date
    rewatches: number
}

export const calculateStats = (entries: JournalEntry[]): MovieStats => {
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

// export const calculateMonthlyWatched = (
//     entries: JournalEntry[]
// ): { [key: string]: number } => {
//     const monthlyCount: { [key: string]: number } = {}
//     entries.forEach((entry) => {
//         const month = new Date(entry.dateWatched).toLocaleString("default", {
//             month: "long",
//         })
//         monthlyCount[month] = (monthlyCount[month] || 0) + 1
//     })
//     return monthlyCount
// }
// export const calculateMonthlyWatched = (
//     entries: JournalEntry[]
// ): { month: string; count: number }[] => {
//     const monthlyCount: { [key: number]: number } = {}
//     const monthNames = [
//         "Jan",
//         "Feb",
//         "Mar",
//         "Apr",
//         "May",
//         "Jun",
//         "Jul",
//         "Aug",
//         "Sep",
//         "Oct",
//         "Nov",
//         "Dec",
//     ]

//     entries.forEach((entry) => {
//         const date = new Date(entry.dateWatched)
//         const monthIndex = date.getMonth()
//         monthlyCount[monthIndex] = (monthlyCount[monthIndex] || 0) + 1
//     })

//     return monthNames.map((month, index) => ({
//         month,
//         count: monthlyCount[index] || 0,
//     }))
// }
export const calculateMonthlyWatched = (
    entries: JournalEntry[]
): { month: string; count: number }[] => {
    const monthlyCount: { [key: string]: number } = {}
    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ]

    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    // Initialize the last 6 months with zero counts
    for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12
        const year = currentYear - (monthIndex > currentMonth ? 1 : 0)
        const key = `${year}-${monthIndex}`
        monthlyCount[key] = 0
    }

    entries.forEach((entry) => {
        const date = new Date(entry.dateWatched)
        const monthIndex = date.getMonth()
        const year = date.getFullYear()
        const key = `${year}-${monthIndex}`

        // Only count entries from the last 6 months
        if (monthlyCount.hasOwnProperty(key)) {
            monthlyCount[key]++
        }
    })

    const result = []
    for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12
        const year = currentYear - (monthIndex > currentMonth ? 1 : 0)
        const key = `${year}-${monthIndex}`
        result.push({
            month: `${monthNames[monthIndex]} `,
            count: monthlyCount[key],
        })
    }

    return result // Reverse to get chronological order
}
export const calculateTopGenres = (
    entries: JournalEntry[]
): { genre: string; count: number }[] => {
    const genreCounts: { [key: string]: number } = {}
    entries.forEach((entry) => {
        entry.movie.genre_ids?.forEach((genreId) => {
            const genreName = genreMap[genreId] || "Unknown" // Use genre name or 'Unknown' if not found
            genreCounts[genreName] = (genreCounts[genreName] || 0) + 1
        })
    })
    return Object.entries(genreCounts)
        .map(([genre, count]) => ({ genre, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
}

export const calculateGenreDistribution = (
    entries: JournalEntry[]
): { genre: string; count: number }[] => {
    const genreCounts: { [key: string]: number } = {}
    entries.forEach((entry) => {
        entry.movie.genre_ids?.forEach((genreId) => {
            const genreName = genreMap[genreId] || "Unknown" // Use genre name or 'Unknown' if not found
            genreCounts[genreName] = (genreCounts[genreName] || 0) + 1
        })
    })
    return Object.entries(genreCounts).map(([genre, count]) => ({
        genre,
        count,
    }))
}

export const calculateTopDecade = (
    entries: JournalEntry[]
): { decade: string; count: number } => {
    const decadeCounts: { [key: string]: number } = {}
    entries.forEach((entry) => {
        const year = new Date(entry.movie.release_date).getFullYear()
        const decade = `${Math.floor(year / 10) * 10}s`
        decadeCounts[decade] = (decadeCounts[decade] || 0) + 1
    })
    return Object.entries(decadeCounts)
        .map(([decade, count]) => ({ decade, count }))
        .sort((a, b) => b.count - a.count)[0]
}
