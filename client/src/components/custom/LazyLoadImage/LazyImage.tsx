import { FC } from "react"
import { LazyLoadImage } from "react-lazy-load-image-component"
import "react-lazy-load-image-component/src/effects/blur.css"

interface ImageProps {
    src: string
    className: string
    alt: string
}
const LazyImage: FC<ImageProps> = ({ src, className, alt = "image" }) => {
    return (
        <LazyLoadImage
            className={className}
            alt={alt}
            effect="blur"
            src={src}
        />
    )
}

export default LazyImage
