import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { updateUserProfile } from '../../services/userService';
import UsernameAndPicture from './(components)/UsernameAndPictures';
import TopMovies from './(components)/TopMovies';
import TopDirectors from './(components)/TopDirectors';
import AddFriends from './(components)/AddFriends';
import { useAuth } from '../../hooks/useAuth';


//import individual screen components
// import AddFriends from './(components)/AddFriends';
// import TopDirectors from './(components)/TopDirectors';
// import TopMovies from './(components)/TopMovies';
// import UsernameAndPicture from './(components)/UsernameAndPictures';

// Define Zod schema
const onboardingSchema = z.object({
  username: z.string().min(3).max(20),
  profilePicture: z.any().optional(),
  topMovies: z.array(z.string()).max(5).optional(),
  topDirectors: z.array(z.string()).max(5).optional(),
  friends: z.array(z.string()).optional(),
  onboarded : z.boolean()
});

type OnboardingData = z.infer<typeof onboardingSchema>;

const OnboardingForm: React.FC = () => {
  const [step, setStep] = React.useState(0);
  const methods = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      username: '',
      topMovies: [],
      topDirectors: [],
      friends: [],
      onboarded: false
    },
  });

  // const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, updateOnboardingStatus } = useAuth();
  const {isOnboarded}= useAuth();
  console.log(isOnboarded);

  const mutation = useMutation({
    mutationFn: (data: OnboardingData) => {
      if (!user) {
        throw new Error('User not logged in');
      }
      return updateUserProfile(user.uid, { ...data, onboarded: true });
    },
    onSuccess: (updatedUser) => {
      console.log(updatedUser);
      updateOnboardingStatus(true); // Update the onboarding status in AuthContext
      queryClient.invalidateQueries({ queryKey: ['user'] });
      navigate('/profile');
    },
    onError: (error) => {
      console.error('Error updating user profile:', error);
    }
  });

  const onSubmit = (data: OnboardingData) => {
    console.log("this is user data : ",data);
    
    mutation.mutate(data);
  };

  const handleNext = () => {
    console.log(step);
    setStep((prevStep) => prevStep + 1);
   
    
  };

  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <UsernameAndPicture onNext={handleNext} />;
      case 1:
        return <TopMovies onNext={handleNext} onPrevious={handlePrevious} />;
      case 2:
        return <TopDirectors onNext={handleNext} onPrevious={handlePrevious} />;
      case 3:
        return <AddFriends onPrevious={handlePrevious} />;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="onboarding-form h-[100vh] flex flex-col justify-center items-center">
          <div className="progress-bar">
            {/* Implement progress bar here */}
          </div>
          {renderStep()}
          {step === 3 && (
            <button className='btn btn-secondary mt-2' type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Submitting...' : 'Complete Onboarding'}
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default OnboardingForm;