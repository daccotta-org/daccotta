import React, { useState } from "react"
import { useFormContext } from "react-hook-form"
import { RxCrossCircled } from "react-icons/rx"
import { toast } from "react-toastify"
import { z } from "zod"
import "../../../index.css"
import { useSearchPerson } from "../../../services/directorService"

// Define the Director schema
const directorSchema = z.object({
    id: z.number(),
    name: z.string(),
    profile_path: z.string().nullable(),
    known_for_department: z.literal("Directing"),
})

// Use the Director schema in the directors schema
export const topDirectorsSchema = z.object({
    directors: z.array(directorSchema).max(5),
})

export type Director = z.infer<typeof directorSchema>
export type TopDirectorsData = z.infer<typeof topDirectorsSchema>

interface Props {
    onNext: () => void
    onPrevious: () => void
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

const directors: React.FC<Props> = ({ onNext, onPrevious, handleKeyDown }) => {
    const {
        setValue,
        watch,
        formState: { errors },
    } = useFormContext<TopDirectorsData>()
    const [searchTerm, setSearchTerm] = useState("")

    const { data: directorsData, isLoading } = useSearchPerson(
        searchTerm,
        "Directing"
    )

    const directors = watch("directors") || []

    const handleAddDirector = (director: Director) => {
        const isDuplicate = directors.some((d) => d.id === director?.id)
        if (isDuplicate) {
            toast.warn("This director is already in your top list.")
        } else if (directors.length < 5) {
            setValue("directors", [...directors, director])
            console.log("top: ", directors)

            toast.success("Director added to your top list!")
        } else {
            toast.error("You can only select up to 5 directors")
        }
        setSearchTerm("")
    }

    const handleRemoveDirector = (directorId: number) => {
        setValue(
            "directors",
            directors.filter((director) => director?.id !== directorId)
        )
        toast.info("Director removed from your top list.")
    }

    return (
        <div className="w-full h-full lg:grid lg:grid-cols-5 lg:min-h-screen ">
            <div className="w-full h-full flex flex-col items-center py-24 col-span-2 justify-start lg:justify-center bg-main">
                <h2 className="text-3xl font-bold mb-12 px-4 text-center">
                    Select Your Top 5 Directors
                </h2>
                <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder="Search directors"
                        value={searchTerm}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input input-bordered w-[320px] sm:w-[400px] bg-transparent text-white"
                    />
                    {isLoading && <p>Loading...</p>}
                    {directorsData &&
                        directorsData.results &&
                        directorsData.results.length > 0 && (
                            <ul className="absolute z-10 w-full overflow-y-auto  max-h-[300px] lg:h-28 mt-1 bg-white text-gray-800 rounded-lg shadow-lg">
                                {directorsData.results
                                    .slice(0, 10)
                                    .map((director: Director) => (
                                        <li
                                            key={director?.id}
                                            className="flex items-center space-x-4 p-3 hover:bg-gray-100 cursor-pointer border-b-2"
                                            onClick={() =>
                                                handleAddDirector(director)
                                            }
                                        >
                                            {director?.profile_path && (
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w92${director?.profile_path}`}
                                                    alt={director?.name}
                                                    className="w-12 h-12 object-cover rounded-full"
                                                />
                                            )}
                                            <span className="flex-grow text-sm">
                                                {director?.name}
                                            </span>
                                        </li>
                                    ))}
                            </ul>
                        )}
                </div>
                {directors.length > 0 && (
                    <div className="mb-6 w-[320px] sm:w-[400px]">
                        <h3 className="text-xl font-semibold mb-3">
                            Selected Directors:
                        </h3>
                        <ul className="space-y-4 h-[180px] overflow-y-auto">
                            {directors.map((director) => (
                                <li
                                    key={director?.id}
                                    className="flex items-center space-x-4 bg-white bg-opacity-10 p-1 w-[320px] sm:w-[400px] border border-primary border-1 rounded-lg hover:bg-primary hover:text-white transition-colors"
                                >
                                    {director?.profile_path && (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w92${director?.profile_path}`}
                                            alt={director?.name}
                                            className="w-12 h-12 object-cover rounded-full"
                                        />
                                    )}
                                    <span className="flex-grow text-sm">
                                        {director?.name}
                                    </span>
                                    <button
                                        type="button"
                                        className=""
                                        onClick={() =>
                                            handleRemoveDirector(director?.id)
                                        }
                                    >
                                        <RxCrossCircled size="24px" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {errors.directors && (
                    <span className="text-red-300 block mb-4">
                        {errors.directors.message}
                    </span>
                )}
                <div className="mt-10 self-end lg:self-auto flex w-full justify-evenly">
                    <button
                        type="button"
                        className="btn btn-secondary text-white"
                        onClick={onPrevious}
                    >
                        Previous
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline hover:bg-primary hover:text-white"
                        onClick={onNext}
                    >
                        Next
                    </button>
                </div>
            </div>
            <div className="hidden lg:flex lg:items-center lg:justify-center lg:col-span-3 bg-[#FAEBD7]">
                <div className="w-full h-full flex items-center justify-center">
                    <img
                        src="/profile_page.svg"
                        alt="Sign Up Illustration"
                        className="w-[400px] h-auto"
                    />
                </div>
            </div>
        </div>
    )
}

export default directors
