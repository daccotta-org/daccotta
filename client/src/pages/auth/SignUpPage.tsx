
// SignUp.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, SignUpFormData } from '../../Types/validationSchema';
import { auth } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const SignUp: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const signUpMutation = useMutation({
    mutationFn: async (data: SignUpFormData) => {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const idToken = await userCredential.user.getIdToken();
      console.log("header authariation ")
      console.log(`Bearer ${idToken}`)

      return axios.post('http://localhost:8080/api/users', {
        uid: userCredential.user.uid,
        email: data.email,
        userName: data.userName,
        age: data.age,
      }, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
        
      });
      
    },
    onSuccess: () => {
// Handle successful sign-up
    },
    onError: (error) => {
      console.error('Failed to sign up:', error);
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    signUpMutation.mutate(data);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Sign Up</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                placeholder="Username"
                className="input input-bordered"
                {...register('userName')}
              />
              {errors.userName && <span className="text-error">{errors.userName.message}</span>}
            </div>
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
            <div className="form-control">
              <label className="label">
                <span className="label-text">Age</span>
              </label>
              <input
                type="number"
                placeholder="Age"
                className="input input-bordered"
                {...register('age', { valueAsNumber: true })}
              />
              {errors.age && <span className="text-error">{errors.age.message}</span>}
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary" type="submit" disabled={signUpMutation.isPending }>
                {signUpMutation.isPending  ? 'Signing Up...' : 'Sign Up'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
