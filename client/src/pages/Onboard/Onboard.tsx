import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { updateUserProfile } from '../../services/userService';
import UsernameAndPicture from './(components)/UsernameAndPictures';
import TopMovies, { topMoviesSchema } from './(components)/TopMovies';
import TopDirectors, { topDirectorsSchema } from './(components)/TopDirectors';
import AddFriends, { friendsSchema } from './(components)/AddFriends';
import { useAuth } from '../../hooks/useAuth';

// Define Zod schema
const onboardingSchema = z.object({
  profile_image: z.string().optional(),
  topMovies: topMoviesSchema.shape.topMovies.optional(), // Incorporate topMoviesSchema
  directors: topDirectorsSchema.shape.directors.optional(), // Incorporate topDirectorsSchema
  friends: z.array(z.string()).optional(),
  onboarded: z.boolean(),
});
type OnboardingData = z.infer<typeof onboardingSchema>;

const OnboardingForm: React.FC = () => {
  const [step, setStep] = React.useState(0);
  const methods = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      profile_image: '',
      topMovies: [],
      directors: [],
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
    console.log("form data", data);
    const topMoviesData = data.topMovies?.map(movie => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date:movie.release_date
    }));

    console.log("topMoviesData:", topMoviesData);
  
    const onboardingData = {
      ...data,
      topMovies: topMoviesData,
    };
  
    mutation.mutate(onboardingData);
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
        <div className=" relative onboarding-form h-[100vh] flex flex-col justify-center items-center">
          <div className="progress-bar">
            {/* Implement progress bar here */}
          </div>
          {renderStep()}
          {step === 3 && (
          <button
          className="btn btn-secondary text-white  mt-2 absolute bottom-4 left-1/2 transform -translate-x-1/2 lg:top-4 lg:right-4 lg:bottom-auto lg:left-auto lg:translate-x-0 lg:translate-y-0"
          type="submit"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Submitting...' : 'Complete Onboarding'}
        </button>
          
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default OnboardingForm;