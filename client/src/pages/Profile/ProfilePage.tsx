import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

// Define the type for each carousel item
interface CarouselItem {
  title: string;
  description: string;
}

const Profile: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  const { user } = useAuth();

  // Define the carousel items with type safety
  const carouselItems: CarouselItem[] = [
    { title: "Item 1", description: "Description for Item 1" },
    { title: "Item 2", description: "Description for Item 2" },
    { title: "Item 3", description: "Description for Item 3" },
  ];

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prevIndex) =>
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleSelect = (index: number) => {
    if (index > activeIndex) {
      setDirection(1);
    } else {
      setDirection(-1);
    }
    setActiveIndex(index);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      position: "absolute" as const,
      top: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative" as const,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      position: "absolute" as const,
      top: 0,
    }),
  };
  return (
    <div className="flex flex-col rounded-md items-center justify-center w-full h-full bg-gradient-to-tr from-primary to-secondary text-white">
      <div className="flex flex-col md:flex-col sm:flex-row w-[90%] h-[90%] gap-4">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row w-full h-1/2 gap-x-4">
          {/* Profile Card */}
          <motion.div
            className="flex items-center justify-center w-full md:w-1/2 h-full bg-gradient-to-br from-secondary to-primary p-4 md:p-6 lg:p-8 rounded-none md:rounded-3xl shadow-lg hover:ring-2 hover:ease-in ease-out transition duration-300"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 w-32 h-32 bg-white rounded-full"></div>
              <div className="ml-4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
                  {user?.displayName}
                </h2>
                <p className="text-gray-300">Friends</p>
                <div className="flex mt-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Card */}
          <div className="flex items-center justify-center w-full md:w-1/2 h-full  bg-gradient-to-br from-secondary to-primary p-4 md:p-6 lg:p-8 rounded-none md:rounded-3xl shadow-lg hover:ring-2 hover:ease-in ease-out transition duration-300">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
              Bento Stats
            </h2>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row w-full h-1/2 gap-x-4">
          {/* Map List Card */}
          <div className="flex flex-col items-center justify-center w-full md:w-1/2 h-full  bg-gradient-to-br from-secondary to-primary p-4 md:p-6 lg:p-8 rounded-none md:rounded-3xl shadow-lg hover:ring-2 hover:ease-in ease-out transition duration-300">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4">
              Map &lt;List&gt;
            </h2>
            <div className="flex flex-col space-y-2">
            {carouselItems.map((item, index) => (
                <button
                  key={index}
                  className={`p-2 w-72 rounded-lg text-center transition-all duration-700 ease-in-out ${
                    activeIndex === index
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  onClick={() => handleSelect(index)}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>

          {/* Carousel */}
          <div className="flex items-center justify-center w-full md:w-1/2 h-full  bg-gradient-to-br from-secondary to-primary p-4 md:p-6 lg:p-8 rounded-none md:rounded-3xl shadow-lg relative hover:ring-2 hover:ease-in ease-out transition duration-300 overflow-hidden">
            <button
              className="text-white hover:text-yellow-400 absolute left-2"
              onClick={handlePrev}
            >
              &lt;
            </button>
            <AnimatePresence custom={direction}>
              <motion.div
                key={activeIndex}
                className="w-full h-full flex items-center justify-center"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = Math.abs(offset.x) * velocity.x;
                  if (swipe < -1000) {
                    handleNext();
                  } else if (swipe > 1000) {
                    handlePrev();
                  }
                }}
              >
                <div className="text-center">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold transition">
                    {carouselItems[activeIndex].title}
                  </h3>
                  <p className="mt-2 transition">{carouselItems[activeIndex].description}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            <button
              className="text-white hover:text-yellow-400 absolute right-2"
              onClick={handleNext}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
