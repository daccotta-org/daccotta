import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"
import "../../index.css"

import {
    checkEmailExists,
    checkUsernameAvailability,
    useSignUp,
} from "../../services/userService"
import { z } from "zod"

// Schema definitions
const usernameSchema = z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(25, "Username must not exceed 25 characters")
    .regex(
        /^[a-zA-Z][a-zA-Z0-9]+$/,
        "Username must start with a letter and contain only letters and numbers"
    )

const extendedSignUpSchema = z
    .object({
        username: usernameSchema,
        email: z.string().email("Invalid email address"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters long"),
        confirmPassword: z.string(),
        age: z
            .number()
            .min(13, "You must be at least 13 years old")
            .max(120, "Invalid age"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    })

type ExtendedSignUpFormData = z.infer<typeof extendedSignUpSchema>

const SignUp: React.FC = () => {
    const [isUsernameAvailable, setIsUsernameAvailable] = useState<
        boolean | null
    >(null)

    const [isChecking, setIsChecking] = useState(false)
    const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(
        null
    )
    const [isCheckingEmail, setIsCheckingEmail] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        watch,
    } = useForm<ExtendedSignUpFormData>({
        resolver: zodResolver(extendedSignUpSchema),
    })
    const createUser = useSignUp()

    // useEffect to check if email is available
    const username = watch("username")
    useEffect(() => {
        const checkAvailability = async () => {
            if (username && username.length >= 3) {
                setIsChecking(true)
                try {
                    const isAvailable =
                        await checkUsernameAvailability(username)
                    setIsUsernameAvailable(isAvailable)
                } catch (error) {
                    console.error(
                        "Error checking username availability:",
                        error
                    )
                    setIsUsernameAvailable(null)
                } finally {
                    setIsChecking(false)
                }
            } else {
                setIsUsernameAvailable(null)
            }
        }

        const debounce = setTimeout(checkAvailability, 500)
        return () => clearTimeout(debounce)
    }, [username])

    const onSubmit = async (values: ExtendedSignUpFormData) => {
      if (!isUsernameAvailable) {
        setError("username", {
          type: "manual",
          message: "Username is not available",
        });
        return;
      }
    
      if (!isEmailAvailable) {
        setError("email", {
          type: "manual",
          message: "Email is already in use",
        });
        return;
      }
    
      createUser.mutate(values);
    };

    //userEffect to check if email is available
    const email = watch("email")

    useEffect(() => {
        const checkEmailAvailability = async () => {
            if (email && email.endsWith("@gmail.com")) {
                setIsCheckingEmail(true)
                try {
                    const emailExists = await checkEmailExists(email)
                    setIsEmailAvailable(!emailExists)
                } catch (error) {
                    console.error("Error checking email availability:", error)
                    setIsEmailAvailable(null)
                } finally {
                    setIsCheckingEmail(false)
                }
            } else {
                setIsEmailAvailable(null)
            }
        }

        const debounce = setTimeout(checkEmailAvailability, 500)
        return () => clearTimeout(debounce)
    }, [email]);



    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-5">
            <div className="flex flex-col items-center justify-center py-12 lg:py-2 lg:col-span-2 bg-main">
                <div className="mx-auto w-full max-w-md px-4">
                    <h2 className="text-3xl font-bold text-center self-start mb-8 lg:mb-2">
                        Sign Up
                    </h2>
                    <p className="text-center text-gray-600 mb-2">
                        Enter your details below to create a new account
                    </p>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-2"
                    >
                        <div className="form-control relative">
                            <label className="label">
                                <span className="label-text">Username</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className={`input input-bordered bg-transparent w-full pr-10 ${
                                        errors.username ? "input-error" : ""
                                    }`}
                                    {...register("username")}
                                />
                                {username && username.length >= 3 && (
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        {isChecking ? (
                                            <span className="loading loading-spinner loading-sm"></span>
                                        ) : isUsernameAvailable ? (
                                            <FaCheckCircle className="text-success" />
                                        ) : (
                                            <FaTimesCircle
                                                className="text-error tooltip tooltip-top"
                                                data-tip="unvalid username"
                                            />
                                        )}
                                    </span>
                                )}
                            </div>
                            {errors.username && (
                                <label className="label">
                                    <span className="label-text-alt text-error">
                                        {errors.username.message}
                                    </span>
                                </label>
                            )}
                            {isUsernameAvailable === false &&
                                !errors.username && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            Username is not available
                                        </span>
                                    </label>
                                )}
                        </div>
                        <div className="form-control relative">
  <label className="label">
    <span className="label-text">Email</span>
  </label>
  <div className="relative">
    <input
      type="email"
      placeholder="Email"
      className={`input input-bordered bg-transparent w-full pr-10 ${
        errors.email ? "input-error" : ""
      }`}
      {...register("email")}
    />
    {email && email.endsWith("@gmail.com") && (
      <span className="absolute inset-y-0 right-0 flex items-center pr-3">
        {isCheckingEmail ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : isEmailAvailable === true ? (
          <FaCheckCircle className="text-success" />
        ) : isEmailAvailable === false ? (
          <FaTimesCircle className="text-error tooltip tooltip-top" data-tip="Email already in use" />
        ) : null}
      </span>
    )}
  </div>
  {errors.email && (
    <label className="label">
      <span className="label-text-alt text-error">{errors.email.message}</span>
    </label>
  )}
  {isEmailAvailable === false && !errors.email && (
    <label className="label">
      <span className="label-text-alt text-error">Email is already in use</span>
    </label>
  )}
</div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Password"
                                className="input input-bordered bg-transparent w-full"
                                {...register("password")}
                            />
                            {errors.password && (
                                <span className="text-error">
                                    {errors.password.message}
                                </span>
                            )}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Confirm Password
                                </span>
                            </label>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                className="input input-bordered bg-transparent w-full"
                                {...register("confirmPassword")}
                            />
                            {errors.confirmPassword && (
                                <span className="text-error">
                                    {errors.confirmPassword.message}
                                </span>
                            )}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Age</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Age"
                                className="input input-bordered bg-transparent w-full"
                                {...register("age", { valueAsNumber: true })}
                            />
                            {errors.age && (
                                <span className="text-error">
                                    {errors.age.message}
                                </span>
                            )}
                        </div>
                        <div className="form-control mt-6">
                            <button
                                className="btn btn-primary text-white w-full"
                                type="submit"
                                disabled={
                                  createUser.isPending || 
                                  isChecking || 
                                  !isUsernameAvailable || 
                                  isCheckingEmail || 
                                  !isEmailAvailable
                                }
                            >
                                {createUser.isPending
                                    ? "Signing Up..."
                                    : "Sign Up"}
                            </button>
                            <p className="lg:mt-4 mt-12 text-center">
                                Already have an account?{" "}
                                <Link
                                    to="/signin"
                                    className="link link-primary"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            <div className="hidden lg:flex lg:items-center lg:justify-center bg-[#E6E3D3] lg:col-span-3">
                <div className="w-full h-full flex items-center justify-center">
                    <img
                        src="movie_signup.svg"
                        alt="Sign In Illustration"
                        className="w-[400px] h-auto"
                    />
                </div>
            </div>
        </div>
    )
}

export default SignUp

// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Link, useNavigate } from "react-router-dom";
// import { useSignUp } from "../../services/queries";
// import { useAuth } from "../../hooks/useAuth";
// import {
//   checkEmailExists,
//   checkUsernameAvailability,
// } from "../../services/userService";
// import { z } from "zod";

// // Schema definitions
// const usernameSchema = z
//   .string()
//   .min(4, "Username must be at least 5 characters long")
//   .max(25, "Username must not exceed 25 characters")
//   .regex(
//     /^[a-zA-Z][a-zA-Z0-9]+$/,
//     "Username must start with a letter and contain only letters and numbers"
//   )

// const extendedSignUpSchema = z
//   .object({
//     username: usernameSchema,
//     email: z.string().email("Invalid email address"),
//     password: z.string().min(8, "Password must be at least 8 characters long"),
//     confirmPassword: z.string(),
//     age: z
//       .number()
//       .min(13, "You must be at least 13 years old")
//       .max(120, "Invalid age"),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords don't match",
//     path: ["confirmPassword"],
//   });

// type ExtendedSignUpFormData = z.infer<typeof extendedSignUpSchema>;

// const SignUp: React.FC = () => {
//   const navigate = useNavigate();
//   const { isOnboarded } = useAuth();
//   const [isUsernameAvailable, setIsUsernameAvailable] = useState<
//     boolean | null
//   >(null);
//   const [isChecking, setIsChecking] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setError,
//     watch,
//   } = useForm<ExtendedSignUpFormData>({
//     resolver: zodResolver(extendedSignUpSchema),
//   });
//   const createUser = useSignUp();

//   const username = watch("username");

//   useEffect(() => {
//     const checkAvailability = async () => {
//       if (username && username.length >= 3) {
//         setIsChecking(true);
//         try {
//           const isAvailable = await checkUsernameAvailability(username);
//           setIsUsernameAvailable(isAvailable);
//         } catch (error) {
//           console.error("Error checking username availability:", error);
//           setIsUsernameAvailable(null);
//         } finally {
//           setIsChecking(false);
//         }
//       } else {
//         setIsUsernameAvailable(null);
//       }
//     };

//     const debounce = setTimeout(checkAvailability, 500);
//     return () => clearTimeout(debounce);
//   }, [username]);

//   const onSubmit = async (values: ExtendedSignUpFormData) => {
//     const emailExists = await checkEmailExists(values.email);
//     if (emailExists) {
//       setError("email", { type: "manual", message: "Email is already taken" });
//       return;
//     }

//     if (!isUsernameAvailable) {
//       setError("username", {
//         type: "manual",
//         message: "Username is not available",
//       });
//       return;
//     }

//     createUser.mutate(values);
//   };

//   return (
//     <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-5 bg-base-100">
//       <div className="flex flex-col items-center justify-center py-12 lg:py-2 lg:col-span-2 bg-base-100">
//         <div className="mx-auto w-full max-w-md px-4">
//           <h2 className="text-3xl font-bold text-center self-start">Sign Up</h2>
//           <p className="text-center text-gray-600 mb-2">
//             Enter your details below to create a new account
//           </p>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">
//                   Username
//                   {errors.username && (
//                     <span className="text-error">
//                       {errors.username.message}
//                     </span>
//                   )}
//                   {isUsernameAvailable === false && (
//                     <span className="text-error tooltip tooltip-right" data-tip="UserName not available">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 512 512"
//                          className="w-4 h-4 inline-block ml-2 bg-red-600 rounded-2xl"
//                       >
//                         <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z" />
//                       </svg>
//                     </span>
//                   )}
//                   {isUsernameAvailable === true && (
//                     <span className="text-success tooltip tooltip-right" data-tip="UserName not available">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 512 512"
//                         className="w-4 h-4 inline-block ml-2 bg-green-600 rounded-2xl"
//                       >
//                         <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z" />
//                       </svg>
//                     </span>
//                   )}
//                 </span>
//               </label>
//               <input
//                 type="text"
//                 placeholder="Username"
//                 className="input input-bordered bg-transparent w-full"
//                 {...register("username")}
//               />
//             </div>
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Email</span>
//               </label>
//               <input
//                 type="email"
//                 placeholder="Email"
//                 className="input input-bordered bg-transparent w-full"
//                 {...register("email")}
//               />
//               {errors.email && (
//                 <span className="text-error">{errors.email.message}</span>
//               )}
//             </div>
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Password</span>
//               </label>
//               <input
//                 type="password"
//                 placeholder="Password"
//                 className="input input-bordered bg-transparent w-full"
//                 {...register("password")}
//               />
//               {errors.password && (
//                 <span className="text-error">{errors.password.message}</span>
//               )}
//             </div>
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Confirm Password</span>
//               </label>
//               <input
//                 type="password"
//                 placeholder="Confirm Password"
//                 className="input input-bordered bg-transparent w-full"
//                 {...register("confirmPassword")}
//               />
//               {errors.confirmPassword && (
//                 <span className="text-error">
//                   {errors.confirmPassword.message}
//                 </span>
//               )}
//             </div>
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Age</span>
//               </label>
//               <input
//                 type="number"
//                 placeholder="Age"
//                 className="input input-bordered bg-transparent w-full"
//                 {...register("age", { valueAsNumber: true })}
//               />
//               {errors.age && (
//                 <span className="text-error">{errors.age.message}</span>
//               )}
//             </div>
//             <div className="form-control mt-6">
//               <button
//                 className="btn btn-primary text-white w-full"
//                 type="submit"
//                 disabled={
//                   createUser.isPending || isChecking || !isUsernameAvailable
//                 }
//               >
//                 {createUser.isPending ? "Signing Up..." : "Sign Up"}
//               </button>
//               <p className="mt-4 text-center">
//                 Already have an account?{" "}
//                 <Link to="/signin" className="link link-primary">
//                   Sign In
//                 </Link>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>

//       <div className="hidden lg:flex lg:items-center lg:justify-center lg:bg-primary lg:col-span-3">
//         <div className="w-full h-full flex items-center justify-center">
//           <img
//             src="movie_signup.svg"
//             alt="Sign In Illustration"
//             className="w-[400px] h-auto"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;
