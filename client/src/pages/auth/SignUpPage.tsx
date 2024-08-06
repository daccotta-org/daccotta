
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, SignUpFormData } from '../../Types/validationSchema';
import { Link, useNavigate } from 'react-router-dom';
import { useSignUp } from '../../services/queries';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { checkEmailExists } from '../../services/userService'; // Adjust the import

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { isOnboarded } = useAuth();
  console.log(isOnboarded);
  
  const { register, handleSubmit, formState: { errors }, setError } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });
  const createUser = useSignUp();

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    const emailExists = await checkEmailExists(values.email); // Check if email exists
    if (emailExists) {
      setError('email', { type: 'manual', message: 'Email is already taken' });
      return;
    }

    createUser.mutate(values);
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-5 bg-base-100">
      {/* Form Section */}
      <div className="flex flex-col items-center justify-center py-12 lg:py-2 lg:col-span-2 bg-base-100">
        <div className="mx-auto w-full max-w-md px-4">
          <h2 className="text-3xl font-bold text-center self-start">Sign Up</h2>
          <p className="text-center text-gray-600 mb-2">
            Enter your details below to create a new account
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered bg-transparent w-full"
                {...register('email')}
              />
              {errors.email && <span className="text-error">{errors.email.message}</span>}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered bg-transparent w-full"
                {...register('password')}
              />
              {errors.password && <span className="text-error">{errors.password.message}</span>}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                className="input input-bordered bg-transparent w-full"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && <span className="text-error">{errors.confirmPassword.message}</span>}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Age</span>
              </label>
              <input
                type="number"
                placeholder="Age"
                className="input input-bordered bg-transparent w-full"
                {...register('age', { valueAsNumber: true })}
              />
              {errors.age && <span className="text-error">{errors.age.message}</span>}
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary text-white w-full" type="submit" disabled={createUser.isPending}>
                {createUser.isPending ? 'Signing Up...' : 'Sign Up'}
              </button>
              <p className="mt-4 text-center">
                Already have an account? <Link to="/signin" className="link link-primary">Sign In</Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden lg:flex lg:items-center lg:justify-center lg:bg-primary lg:col-span-3">
      <div className="w-full h-full flex items-center justify-center">
          <img src="/movie_signup.svg" alt="Sign In Illustration" className="w-[400px] h-auto" />
        </div>
      </div>
    </div>
  );
};

export default SignUp;



