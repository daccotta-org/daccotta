import * as React from 'react';

interface StarsProps {
    rating: number | null; // Current rating (can be null)
    onRatingChange: (rating: number) => void; // Function to update rating
}

const Stars: React.FC<StarsProps> = ({ rating, onRatingChange }) => {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="flex space-x-1">
            {stars.map((star) => (
                <svg
                    key={star}
                    onClick={() => onRatingChange(star)}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-6 h-6 cursor-pointer ${rating !== null && rating >= star ? 'text-warning' : 'text-muted-foreground'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M10 15l-5.878 3.09 1.121-6.36L1 6.36l6.364-.554L10 0l2.636 5.818L19 6.36l-4.243 5.73 1.121 6.36L10 15z" />
                </svg>
            ))}
        </div>
    );
};

Stars.displayName = 'Stars';

export default Stars;
