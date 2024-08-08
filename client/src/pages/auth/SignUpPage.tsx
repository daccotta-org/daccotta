import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useSignUp } from "../../services/queries";
import { useAuth } from "../../hooks/useAuth";
import {
  checkEmailExists,
  checkUsernameAvailability,
} from "../../services/userService";
import { z } from "zod";

// Schema definitions
const usernameSchema = z
.string()
.min(4, "Username must be at least 4 characters long")
.max(25, "Username must not exceed 25 characters")
.regex(
  /^[a-zA-Z][a-zA-Z0-9]+$/,
  "Username must start with a letter and contain only letters and numbers"
);



  const extendedSignUpSchema = z
  .object({
    username: usernameSchema,
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
    age: z
      .number()
      .min(13, "You must be at least 13 years old")
      .max(120, "Invalid age"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ExtendedSignUpFormData = z.infer<typeof extendedSignUpSchema>;

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { isOnboarded } = useAuth();
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<
    boolean | null
  >(null);
  const [isChecking, setIsChecking] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<ExtendedSignUpFormData>({
    resolver: zodResolver(extendedSignUpSchema),
  });
  const createUser = useSignUp();

  const username = watch("username");

  useEffect(() => {
    const checkAvailability = async () => {
      if (username && username.length >= 3) {
        setIsChecking(true);
        try {
          const isAvailable = await checkUsernameAvailability(username);
          setIsUsernameAvailable(isAvailable);
        } catch (error) {
          console.error("Error checking username availability:", error);
          setIsUsernameAvailable(null);
        } finally {
          setIsChecking(false);
        }
      } else {
        setIsUsernameAvailable(null);
      }
    };

    const debounce = setTimeout(checkAvailability, 500);
    return () => clearTimeout(debounce);
  }, [username]);

  const onSubmit = async (values: ExtendedSignUpFormData) => {
    const emailExists = await checkEmailExists(values.email);
    if (emailExists) {
      setError("email", { type: "manual", message: "Email is already taken" });
      return;
    }

    if (!isUsernameAvailable) {
      setError("username", {
        type: "manual",
        message: "Username is not available",
      });
      return;
    }

    createUser.mutate(values);
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-5 bg-base-100">
      <div className="flex flex-col items-center justify-center py-12 lg:py-2 lg:col-span-2 bg-base-100">
        <div className="mx-auto w-full max-w-md px-4">
          <h2 className="text-3xl font-bold text-center self-start">Sign Up</h2>
          <p className="text-center text-gray-600 mb-2">
            Enter your details below to create a new account
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Username
                  {errors.username && (
                    <span className="text-error">{errors.username.message}</span>
                  )}
                </span>
              </label>
              <input
                type="text"
                placeholder="Username"
                className={`input input-bordered bg-transparent w-full ${
                  errors.username || !isUsernameAvailable ? "input-error" : ""
                }`}
                {...register("username")}
              />
              {isUsernameAvailable === false && (
                <label className="label">
                  <span className="label-text text-error">
                    Username is not available
                  </span>
                </label>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered bg-transparent w-full"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-error">{errors.email.message}</span>
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
                <span className="text-error">{errors.password.message}</span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
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
                <span className="text-error">{errors.age.message}</span>
              )}
            </div>
            <div className="form-control mt-6">
              <button
                className="btn btn-primary text-white w-full"
                type="submit"
                disabled={
                  createUser.isPending || isChecking || !isUsernameAvailable
                }
              >
                {createUser.isPending ? "Signing Up..." : "Sign Up"}
              </button>
              <p className="mt-4 text-center">
                Already have an account?{" "}
                <Link to="/signin" className="link link-primary">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex lg:items-center lg:justify-center lg:bg-primary lg:col-span-3">
        <div className="w-full h-full flex items-center justify-center">
          <img
            src="movie_signup.svg"
            alt="Sign In Illustration"
            className="w-[400px] h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;


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



