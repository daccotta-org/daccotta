import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { avatars } from '../../../assets/avatars';
// Assuming you have these avatar images
// const avatars = [
//   '/avatars01.png',
//   '/avatars02.png',
//   '/avatars03.png',
//   '/avatars04.png',
//   '/avatars05.png'
// ];



interface UsernameAndAvatarProps {
  onNext: () => void;
}

const UsernameAndAvatar: React.FC<UsernameAndAvatarProps> = ({ onNext }) => {
  const { register, setValue,watch,  formState: { errors } } = useFormContext();
  const profileUrl = watch('profile_image'); 
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState<number | null>(null);

  const handleAvatarSelect = (index: number) => {
    setSelectedAvatarIndex(index);
    console.log(avatars[index].profile);
    setValue('profile_image', avatars[index].profile); // Set only the profile URL
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileUrl != "") {
      console.log(profileUrl);
      onNext();
    }
  };

  return (
  
    <div className='w-full h-full lg:grid lg:grid-cols-5 lg:min-h-screen bg-base-100'>
    <div className=" h-full w-full p-4 pt-16 bg-base-100 shadow-lg rounded-lg  hover:ring-1 col-span-2 flex flex-col justify-center lg:justify-evenly items-center">
      <h2 className="text-3xl font-bold mb-4">Choose an Avatar</h2>
       {/* <p>{isUsernameAvailable} ||  {selectedAvatar}</p> */}
      <form onSubmit={handleSubmit}>
        
        <div className="mb-4">
          <div className="flex flex-wrap justify-center items-start gap-4 lg:gap-3 lg:space-x-2 ">
          {avatars.map((avatar, index) => (
                <img
                  key={avatar.id}
                  src={avatar.profile}
                  alt={`Avatar ${index + 1}`}
                  className={` w-32 h-32    lg:w-32 lg:h-32 hover:scale-105 transition duration-150 cursor-pointer ${selectedAvatarIndex === index ? 'border-4 border-primary' : ''}`}
                  onClick={() => handleAvatarSelect(index)}
                
                />
              ))}
          </div>
        </div>
        <div className="flex justify-center px-14">
        <button
          type="submit"
          className="btn btn-block btn-outline hover:bg-primary hover:text-white"
          disabled={!profileUrl}
          onClick={handleSubmit}
        >
          Next
        </button>
        </div>
      </form>
    </div>
    <div className="hidden lg:flex lg:items-center lg:justify-center lg:bg-primary lg:col-span-3">
        <div className="w-full h-full flex items-center justify-center">
          <img src="/profile_page.svg" alt="Sign Up Illustration" className="w-[400px] h-auto" />
        </div>
      </div>
    </div>
  );
};

export default UsernameAndAvatar;



