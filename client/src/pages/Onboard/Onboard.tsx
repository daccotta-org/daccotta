import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../../services/userService';

//import individual screen components
import UsernameAndPicture from './(components)/UsernameAndPictures';
import TopMovies from './(components)/TopMovies';
import TopDirectors from './(components)/TopDirectors';
import AddFriends from './(components)/AddFriends';
 import { useAuth } from '../../hooks/useAuth';

// Define Zod schema
const onboardingSchema = z.object({
  username: z.string().min(3).max(20),
  profilePicture: z.any().optional(),
  topMovies: z.array(z.string()).max(5).optional(),
  topDirectors: z.array(z.string()).max(5).optional(),
  friends: z.array(z.string()).optional(),
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
    },
  });

  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: OnboardingData) => updateUserProfile(user?.uid ?? '', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      navigate('/home');
    },
  });

  const onSubmit = (data: OnboardingData) => {
    mutation.mutate(data);
  };

  const handleNext = () => {
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
        <div className="onboarding-form">
          <div className="progress-bar">
            {/* Implement progress bar here */}
          </div>
          {renderStep()}
          {step === 3 && (
            <button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Submitting...' : 'Complete Onboarding'}
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default OnboardingForm;