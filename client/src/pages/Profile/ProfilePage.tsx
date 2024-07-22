import React, { useState } from 'react';

// Define the type for each carousel item
interface CarouselItem {
  title: string;
  description: string;
}

const Profile: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Define the carousel items with type safety
  const carouselItems: CarouselItem[] = [
    { title: 'Item 1', description: 'Description for Item 1' },
    { title: 'Item 2', description: 'Description for Item 2' },
    { title: 'Item 3', description: 'Description for Item 3' },
  ];

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1));
  };

  const handleSelect = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gradient-to-b from-gray-900 to-blue-900 text-white">
      <div className="flex flex-col md:flex-col sm:flex-row w-[90%] h-[90%] gap-4">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row w-full h-1/2 gap-x-4">
          
          {/* Profile Card */}
          <div className="flex items-center justify-center w-full md:w-1/2 h-full bg-gradient-to-r from-blue-800 to-purple-800 p-4 md:p-6 lg:p-8 rounded-none md:rounded-3xl shadow-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-32 h-32 bg-white rounded-full"></div>
              <div className="ml-4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold">John Doe</h2>
                <p className="text-gray-300">Friends</p>
                <div className="flex mt-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="flex items-center justify-center w-full md:w-1/2 h-full bg-gradient-to-r from-blue-800 to-purple-800 p-4 md:p-6 lg:p-8 rounded-none md:rounded-3xl shadow-lg">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold">Bento Stats</h2>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row w-full h-1/2 gap-x-4">

          {/* Map List Card */}
          <div className="flex flex-col items-center justify-center w-full md:w-1/2 h-full bg-gradient-to-r from-blue-800 to-purple-800 p-4 md:p-6 lg:p-8 rounded-none md:rounded-3xl shadow-lg">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4">Map &lt;List&gt;</h2>
            <div className="flex flex-col space-y-2">
              {carouselItems.map((item, index) => (
                <button
                  key={index}
                  className={`p-2 w-72 rounded-lg text-center transition-colors ${
                    activeIndex === index ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gray-700'
                  }`}
                  onClick={() => handleSelect(index)}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>

          {/* Carousel */}
          <div className="flex items-center justify-center w-full md:w-1/2 h-full bg-gradient-to-r from-blue-800 to-purple-800 p-4 md:p-6 lg:p-8 rounded-none md:rounded-3xl shadow-lg relative">
            <button className="text-white hover:text-yellow-400 absolute left-2" onClick={handlePrev}>
              &lt;
            </button>
            <div className="text-center">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold">{carouselItems[activeIndex].title}</h3>
              <p className="mt-2">{carouselItems[activeIndex].description}</p>
            </div>
            <button className="text-white hover:text-yellow-400 absolute right-2" onClick={handleNext}>
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
// import { UserButton } from '@clerk/clerk-react'


// const ProfilePage = () => {
    

//   return (
//     <>
//     <div>ProfilePage</div>
//     <div><UserButton/></div>
//     </>
//   )
// }

// export default ProfilePage