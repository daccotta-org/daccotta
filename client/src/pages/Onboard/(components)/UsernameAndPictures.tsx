import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { checkUsernameAvailability } from '../../../services/userService';
import { z } from 'zod';

// Assuming you have these avatar images
const avatars = [
  '/avatars01.png',
  '/avatars02.png',
  '/avatars03.png',
  '/avatars04.png',
  '/avatars05.png'
];

const usernameSchema = z.string()
  .min(5, 'Username must be at least 5 characters long')
  .max(25, 'Username must not exceed 10 characters')
  .regex(/^[a-zA-Z][a-zA-Z0-9]+$/, 'Username must start with a letter and contain only letters and numbers')
  .refine((val) => /[0-9]/.test(val), 'Username must contain at least one number');

interface UsernameAndAvatarProps {
  onNext: () => void;
}

const UsernameAndAvatar: React.FC<UsernameAndAvatarProps> = ({ onNext }) => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);

  const username = watch('username');

  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const checkAvailability = async () => {
      if (username && username.length >= 5) {
        setIsChecking(true);
        try {
          const isAvailable = await checkUsernameAvailability(username);
          setIsUsernameAvailable(isAvailable);
        } catch (error) {
          console.error('Error checking username availability:', error);
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

  const handleAvatarSelect = (index: number) => {
    setSelectedAvatar(index);
    setValue('avatarIndex', index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUsernameAvailable && selectedAvatar !== null) {
      onNext();
    }
  };

  return (
    <div className="p-4 bg-gradient-to-tr from-secondary to-primary shadow-lg rounded-lg max-w-md hover:ring-1">
      <h2 className="text-2xl font-bold mb-4">Choose Your Username and Avatar</h2>
       {/* <p>{isUsernameAvailable} ||  {selectedAvatar}</p> */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2">Hi, {}</label>
          <input
            {...register('username', { 
              required: 'Username is required',
              validate: (value) => {
                const result = usernameSchema.safeParse(value);
                return result.success || result.error.errors[0].message;
              }
            })}
            id="username"
            type="text"
            placeholder="Your username"
            className="input input-bordered w-full"
          />
          {errors.username && <p className="text-red-500">{errors.username.message as string}</p>}
          {isUsernameAvailable === false && <p className="text-red-500">This username is already taken</p>}
          {isUsernameAvailable === true && <p className="text-green-500">Username is available</p>}
        </div>
        <div className="mb-4">
          <p className="mb-2">Select an Avatar</p>
          <div className="flex space-x-2">
            {avatars.map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt={`Avatar ${index + 1}`}
                className={`w-16 h-16 cursor-pointer ${selectedAvatar === index ? 'border-4 border-blue-500' : ''}`}
                onClick={() => handleAvatarSelect(index)}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-start">
        <button
          type="submit"
          className="btn btn-secondary"
          disabled={!isUsernameAvailable || selectedAvatar === null}
          onClick={handleSubmit}
        >
          Next
        </button>
        </div>
      </form>
    </div>
  );
};

export default UsernameAndAvatar;


