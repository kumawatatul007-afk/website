import React, { useState, useEffect } from 'react';

/**
 * OptimizedImage Component
 * Handles lazy loading, loading states, and fallback for images.
 */
const OptimizedImage = ({ 
    src, 
    alt, 
    className = "", 
    style = {}, 
    fallback = "https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/project-5.jpg",
    priority = false,   // set true for above-the-fold / LCP images
    width,
    height,
    ...props 
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(src);

    useEffect(() => {
        setCurrentSrc(src);
        setError(false);
        setIsLoaded(false);
    }, [src]);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setError(true);
        if (currentSrc !== fallback) {
            setCurrentSrc(fallback);
        }
    };

    return (
        <div 
            className={`optimized-image-container ${isLoaded ? 'loaded' : 'loading'} ${className}`}
            style={{ 
                position: 'relative', 
                overflow: 'hidden',
                backgroundColor: '#f1f5f9',
                ...style 
            }}
        >
            <img
                src={currentSrc}
                alt={alt}
                onLoad={handleLoad}
                onError={handleError}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 0.4s ease-in-out',
                    ...props.imgStyle
                }}
                loading={priority ? 'eager' : 'lazy'}
                fetchpriority={priority ? 'high' : 'auto'}
                decoding={priority ? 'sync' : 'async'}
                width={width}
                height={height}
                {...props}
            />
            {!isLoaded && !error && (
                <div 
                    className="image-skeleton"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'skeleton-loading 1.5s infinite'
                    }}
                />
            )}
            <style>{`
                @keyframes skeleton-loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    );
};

export default OptimizedImage;
