// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// import axios from "axios"
// import { createUserWithEmailAndPassword } from "firebase/auth"
// import { useNavigate } from "react-router-dom"
// import { IUser } from "../Types/User"
// import { SignUpFormData } from "../Types/validationSchema"
// import { auth } from "../lib/firebase"
// import { SimpleMovie } from "@/Types/Movie"

// interface CreateListData {
//     name: string
//     description: string
//     isPublic: boolean
//     list_type: "user" | "group"
// }

// export const createList = async (userId: string, data: CreateListData) => {
//     console.log("in create list token is : ", auth.currentUser?.getIdToken())
//     console.log("in create list userId is : ", userId)
//     console.log("in create list data is : ", data)
//     try {
//         const idToken = await auth.currentUser?.getIdToken()
//         const response = await axios.post(
//             `http://localhost:8080/api/list/create`,
//             {
//                 ...data,
//                 movies: [],
//                 members: [{ user_id: userId, is_author: true }],
//             },
//             {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${idToken}`,
//                 },
//             }
//         )
//         console.log("response :: ", response.data)
//         return response.data
//     } catch (error) {
//         console.error("Error creating list:", error)
//         throw new Error("Failed to create list")
//     }
// }

// export function useSignUp() {
//     const queryClient = useQueryClient()
//     const navigate = useNavigate()
//     return useMutation({
//         mutationFn: (data: SignUpFormData) => createUser(data),

//         onMutate: () => {
//             console.log("onMutate")
//         },
//         onSuccess: (response) => {
//             console.log("onSuccess")
//             console.log(response.data)
//             navigate("/")

//             //Notify("success", response?.data?.message);
//         },
//         onError: (error) => {
//             if (axios.isAxiosError(error)) {
//                 console.error("onError", error?.response)
//                 //Notify("error", error?.response?.data?.message);
//             }
//         },

//         onSettled: async (_, error) => {
//             if (error) {
//                 console.error("onSettled error", error)
//             } else {
//                 await queryClient.invalidateQueries({ queryKey: ["users"] })
//             }
//         },
//     })
// }
// export const createUser = async (data: SignUpFormData) => {
//     const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         data.email,
//         data.password
//     )
//     const idTokenResult = await userCredential.user.getIdTokenResult()
//     const idToken = idTokenResult.token

//     const response = await axios.post(
//         "http://localhost:8080/api/users",
//         {
//             uid: userCredential.user.uid,
//             username: data.username,
//             email: data.email,
//             // age: data.age,
//             onboarded: false, // Add this line
//         },
//         {
//             headers: {
//                 Authorization: `Bearer ${idToken}`,
//             },
//         }
//     )

//     // Redirect to onboarding page
//     window.location.href = "/onboard"

//     return response
// }

// export const checkEmailExists = async (email: string): Promise<boolean> => {
//     try {
//         const response = await axios.post(
//             "http://localhost:8080/api/user/check-email",
//             { email }
//         )
//         return response.data.exists
//     } catch (error) {
//         throw new Error("Failed to check Email")
//     }
// }

// export const updateUserProfile = async (
//     userId: string,
//     data: Partial<IUser>
// ): Promise<IUser> => {
//     try {
//         const idToken = await auth.currentUser?.getIdToken()
//         console.log("in profile token is : ", idToken)

//         console.log(
//             "data :: of UID before api call ",
//             userId,
//             "is here: ",
//             data
//         )

//         const response = await axios.post(
//             `http://localhost:8080/api/user/${userId}/complete-onboarding`,
//             data,
//             {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${idToken}`,
//                 },
//             }
//         )
//         console.log("response :: ", response.data)

//         const updatedUser = response.data.user

//         // Update local storage if onboarded status changed

//         if (data.onboarded !== undefined) {
//             localStorage.setItem("onboarded", updatedUser.onboarded.toString())
//         }

//         return updatedUser
//     } catch (error) {
//         throw new Error("Failed to update user profile")
//     }
// }

// export const checkOnboardedStatus = async (
//     userId: string
// ): Promise<boolean> => {
//     try {
//         const idToken = await auth.currentUser?.getIdToken()
//         console.log("in check onboarded token is : ", idToken)

//         const response = await axios.get(
//             `http://localhost:8080/api/user/${userId}/onboarded`,
//             {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${idToken}`,
//                 },
//             }
//         )

//         return response.data.onboarded
//     } catch (error) {
//         throw new Error("Failed to check onboarded status")
//     }
// }
// export const searchUsers = async (
//     searchTerm: string,
//     uid: string | undefined
// ) => {
//     try {
//         const idToken = await auth.currentUser?.getIdToken()

//         if (!uid) {
//             throw new Error("User not authenticated")
//         }

//         const response = await axios.get(
//             `http://localhost:8080/api/user/${uid}/search?term=${searchTerm}`,
//             {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${idToken}`,
//                 },
//             }
//         )
//         return response.data
//     } catch (error) {
//         console.error("Error searching users:", error)
//         throw new Error("Failed to search users")
//     }
// }
// // export const searchUsers = async (searchTerm: string): Promise<IUser[]> => {
// //   // Simulate API call delay
// //   await new Promise(resolve => setTimeout(resolve, 500));

// //   return mockUsers.filter(user =>
// //     user.username.toLowerCase().includes(searchTerm.toLowerCase())
// //   );
// // };
// export const useSearchUsers = (searchTerm: string, uid: string | undefined) =>
//     useQuery({
//         queryKey: ["users", searchTerm],
//         queryFn: () => searchUsers(searchTerm, uid),
//         enabled: searchTerm.length > 2,
//     })

// export const checkUsernameAvailability = async (
//     username: string
// ): Promise<boolean> => {
//     try {
//         const idToken = await auth.currentUser?.getIdToken()

//         const response = await axios.get(
//             `http://localhost:8080/api/user/check-username/${username}`,
//             {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${idToken}`,
//                 },
//             }
//         )

//         return response.data.isAvailable
//     } catch (error) {
//         console.error("Error checking username availability:", error)
//         throw new Error("Failed to check username availability")
//     }
// }

// export const getUserData = async (uid?: string) => {
//     const idToken = await auth.currentUser?.getIdToken()

//     const response = await axios.get(`http://localhost:8080/api/user/${uid}`, {
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${idToken}`,
//         },
//     })
//     console.log("response :: ", response.data)
//     return response.data
// }
// export const getUserData_page = async (uid?: string) => {
//     const idToken = await auth.currentUser?.getIdToken()

//     const response = await axios.get(`http://localhost:8080/api/user/${uid}/other`, {
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${idToken}`,
//         },
//     })
//     console.log("response :: ", response.data)
//     return response.data
// }

// export const addMovieToList = async (listId: string, movie: SimpleMovie) => {
//     const idToken = await auth.currentUser?.getIdToken()
//     console.log("movie is : ", movie)
//     const response = await axios.post(
//         `http://localhost:8080/api/list/${listId}/add-movie`,
//         {
//             movie_id: movie.id,
//             title: movie.title,
//             poster_path: movie.poster_path,
//             release_date: movie.release_date,
//             genre_ids: movie.genre_ids,
//         },
//         {
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${idToken}`,
//             },
//         }
//     )
//     return response.data
// }


import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { IUser } from "../Types/User"
import { SignUpFormData } from "../Types/validationSchema"
import { auth } from "../lib/firebase"
import { SimpleMovie } from "@/Types/Movie"
// import { API_BASE_URL } from "../config/environment"

interface CreateListData {
    name: string
    description: string
    isPublic: boolean
    list_type: "user" | "group"
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
})

export const createList = async (userId: string, data: CreateListData) => {
    console.log("in create list token is : ", auth.currentUser?.getIdToken())
    console.log("in create list userId is : ", userId)
    console.log("in create list data is : ", data)
    try {
        const idToken = await auth.currentUser?.getIdToken()
        const response = await api.post(
            `/api/list/create`,
            {
                ...data,
                movies: [],
                members: [{ user_id: userId, is_author: true }],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
            }
        )
        console.log("response :: ", response.data)
        return response.data
    } catch (error) {
        console.error("Error creating list:", error)
        throw new Error("Failed to create list")
    }
}

export const deleteList = async (listId: string) => {
    try {
        const idToken = await auth.currentUser?.getIdToken()
        const response = await api.delete(`/api/list/${listId}/remove-list`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
            },
        })
        console.log("Listsed deleted successfully:", response.data)
        return response.data
    } catch (error) {
        console.error("Error deleting list:", error)
        throw new Error("Failed to delete list")
    }
}

export function useSignUp() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: (data: SignUpFormData) => createUser(data),

        onMutate: () => {
            console.log("onMutate")
        },
        onSuccess: (response) => {
            console.log("onSuccess")
            console.log(response.data)
            navigate("/")

            //Notify("success", response?.data?.message);
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                console.error("onError", error?.response)
                //Notify("error", error?.response?.data?.message);
            }
        },

        onSettled: async (_, error) => {
            if (error) {
                console.error("onSettled error", error)
            } else {
                await queryClient.invalidateQueries({ queryKey: ["users"] })
            }
        },
    })
}

export const createUser = async (data: SignUpFormData) => {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
    )
    const idTokenResult = await userCredential.user.getIdTokenResult()
    const idToken = idTokenResult.token

    const response = await api.post(
        "/api/users",
        {
            uid: userCredential.user.uid,
            username: data.username,
            email: data.email,
            onboarded: false,
        },
        {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        }
    )

    window.location.href = "/onboard"

    return response
}

export const createUserWithGoogle = async (email: string, username: string) => {
    // This assumes the user is already authenticated with Google
    const userCredential = await auth.currentUser;

    if (!userCredential) {
        throw new Error("User is not authenticated with Google");
    }

    const idTokenResult = await userCredential.getIdTokenResult();
    const idToken = idTokenResult.token;

    const response = await api.post(
        "/api/users",
        {
            uid: userCredential.uid,
            username: username, // You may want to prompt for this
            email: email,
            onboarded: false,
        },
        {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        }
    );

    window.location.href = "/onboard"; // Redirect after successful creation

    return response;
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
        const response = await api.post("/api/user/check-email", { email })
        return response.data.exists
    } catch (error) {
        throw new Error("Failed to check Email")
    }
}

export const updateUserProfile = async (
    userId: string,
    data: Partial<IUser>
): Promise<IUser> => {
    try {
        const idToken = await auth.currentUser?.getIdToken()
        console.log("in profile token is : ", idToken)

        console.log(
            "data :: of UID before api call ",
            userId,
            "is here: ",
            data
        )

        const response = await api.post(
            `/api/user/${userId}/complete-onboarding`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
            }
        )
        console.log("response :: ", response.data)

        const updatedUser = response.data.user

        if (data.onboarded !== undefined) {
            localStorage.setItem("onboarded", updatedUser.onboarded.toString())
        }

        return updatedUser
    } catch (error) {
        throw new Error("Failed to update user profile")
    }
}

export const checkOnboardedStatus = async (
    userId: string
): Promise<boolean> => {
    try {
        const idToken = await auth.currentUser?.getIdToken()
        console.log("in check onboarded token is : ", idToken)

        const response = await api.get(
            `/api/user/${userId}/onboarded`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
            }
        )

        return response.data.onboarded
    } catch (error) {
        throw new Error("Failed to check onboarded status")
    }
}

export const searchUsers = async (
    searchTerm: string,
    uid: string | undefined
) => {
    try {
        const idToken = await auth.currentUser?.getIdToken()

        if (!uid) {
            throw new Error("User not authenticated")
        }

        const response = await api.get(
            `/api/user/${uid}/search?term=${searchTerm}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
            }
        )
        return response.data
    } catch (error) {
        console.error("Error searching users:", error)
        throw new Error("Failed to search users")
    }
}

export const useSearchUsers = (searchTerm: string, uid: string | undefined) =>
    useQuery({
        queryKey: ["users", searchTerm],
        queryFn: () => searchUsers(searchTerm, uid),
        enabled: searchTerm.length > 2,
    })

export const checkUsernameAvailability = async (
    username: string
): Promise<boolean> => {
    try {
        const idToken = await auth.currentUser?.getIdToken()

        const response = await api.get(
            `/api/user/check-username/${username}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
            }
        )

        return response.data.isAvailable
    } catch (error) {
        console.error("Error checking username availability:", error)
        throw new Error("Failed to check username availability")
    }
}

export const getUserData = async (uid?: string) => {
    const idToken = await auth.currentUser?.getIdToken()

    const response = await api.get(`/api/user/${uid}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
        },
    })
    console.log("response :: ", response.data)
    return response.data
}

export const getUserData_page = async (uid?: string) => {
    const idToken = await auth.currentUser?.getIdToken()

    const response = await api.get(`/api/user/${uid}/other`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
        },
    })
    console.log("response :: ", response.data)
    return response.data
}

export const addMovieToList = async (listId: string, movie: SimpleMovie) => {
    const idToken = await auth.currentUser?.getIdToken()
    console.log("movie is : ", movie)
    const response = await api.post(
        `/api/list/${listId}/add-movie-in-list`,
        {
            movie_id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            genre_ids: movie.genre_ids,
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
            },
        }
    )
    return response.data
}

export const removeMovieFromList = async (listId: string, movieId: string) => {
    const idToken = await auth.currentUser?.getIdToken()
    const response = await api.delete(
        `/api/list/${listId}/remove-movie`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
            },
            data: { movie_id: movieId }, // Send movie_id in the request body
        }
    )
    return response.data
}

export const updateUserUsername = async (userId: string, newUsername: string) => {
    try {
        const idToken = await auth.currentUser?.getIdToken();
        const response = await api.patch(
            `/api/user/${userId}/update-username`,
            { username: newUsername },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
            }
        );
        console.log("Username updated successfully:", response.data);
        return response.data.user; // Assuming the response contains the updated user object
    } catch (error) {
        console.error("Error updating username:", error);
        //throw new Error("Failed to update username");
    }
};
