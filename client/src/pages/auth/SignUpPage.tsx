
// SignUp.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, SignUpFormData } from '../../Types/validationSchema';

import { useNavigate } from 'react-router-dom';

import { useSignUp } from '../../services/queries';
import { z } from 'zod';


const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { register,handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });
  const createUser = useSignUp();

  const onSubmit=async(values: z.infer<typeof signUpSchema>)=>
  {
    console.log("hello");
    
     createUser.mutate(values);
   
  

  }




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
              <button className="btn btn-primary" type="submit" disabled={createUser.isPending }>
                {createUser.isPending  ? 'Signing Up...' : 'Sign Up'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
