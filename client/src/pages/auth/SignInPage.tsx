import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth } from "../../lib/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type SignInFormData = z.infer<typeof signInSchema>;

const SignInPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const signInMutation = useMutation({
    mutationFn: (data: SignInFormData) =>
      signInWithEmailAndPassword(auth, data.email, data.password),
    onSuccess: () => {
      // Handle successful sign-in
    },
    onError: (error) => {
      console.error("Failed to sign in:", error);
    },
  });

  const onSubmit = (data: SignInFormData) => {
    signInMutation.mutate(data);
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Handle successful sign-in
    } catch (error) {
      console.error("Failed to sign in with Google:", error);
    }
  };

  const signInWithApple = async () => {
    try {
      const provider = new OAuthProvider("apple.com");
      await signInWithPopup(auth, provider);
      // Handle successful sign-in
    } catch (error) {
      console.error("Failed to sign in with Apple:", error);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="w-full lg:grid lg:grid-cols-5 h-screen bg-base-100">
      {/* Form Section */}
      <div className="h-full flex flex-col items-center justify-evenly  p-8  lg:p-20 lg:col-span-2  bg-base-100">
        <h2 className="text-3xl font-bold mb-2   ">Sign In</h2>
        <img
          src="/movie_signup.svg"
          alt="Sign In Illustration"
          className="w-[400px] h-auto lg:hidden"
        />
        <div className="flex flex-col gap-2  w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
            <div className="form-control mb-4">
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
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Password"
                className="input bg-transparent input-bordered w-full"
                {...register("password")}
              />
              {errors.password && (
                <span className="text-error">{errors.password.message}</span>
              )}
            </div>
            <div className="form-control mb-4">
              <button
                className="btn btn-primary text-white w-full"
                type="submit"
                disabled={signInMutation.isPending}
              >
                {signInMutation.isPending ? "Signing In..." : "Sign In"}
              </button>
            </div>
            <div className="divider">OR</div>

            <button
              className="btn btn-link w-full mt-2"
              onClick={() => navigate("/signup")}
            >
              Sign Up?
            </button>
          </form>
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden lg:flex lg:items-center lg:justify-center lg:bg-primary lg:col-span-3">
        <div className="w-full h-full flex items-center justify-center">
          <img
            src="/movie_signup.svg"
            alt="Sign In Illustration"
            className="w-[400px] h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
