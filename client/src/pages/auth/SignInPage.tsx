import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, SignInFormData } from '../../Types/validationSchema';
import { auth } from './firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { useMutation } from '@tanstack/react-query';

const SignIn: React.FC = () => {
  
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const signInMutation = useMutation({
    mutationFn: (data: SignInFormData) =>
      signInWithEmailAndPassword(auth, data.email, data.password),
    onSuccess: () => {
// Handle successful sign-in
    },
    onError: (error) => {
      console.error('Failed to sign in:', error);
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
      console.error('Failed to sign in with Google:', error);
    }
  };

  const signInWithApple = async () => {
    try {
      const provider = new OAuthProvider('apple.com');
      await signInWithPopup(auth, provider);
// Handle successful sign-in
    } catch (error) {
      console.error('Failed to sign in with Apple:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Sign In</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered"
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
                className="input input-bordered"
                {...register('password')}
              />
              {errors.password && <span className="text-error">{errors.password.message}</span>}
            </div>
            <div className="form-control mt-6">
              {/* <button className="btn btn-primary" type="submit" disabled={signInMutation.isLoading}>
                {signInMutation.isLoading ? 'Signing In...' : 'Sign In'}
              </button> */}
            </div>
          </form>
          <div className="divider">OR</div>
          <button className="btn btn-outline" onClick={signInWithGoogle}>Sign In with Google</button>
          <button className="btn btn-outline mt-2" onClick={signInWithApple}>Sign In with Apple</button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;