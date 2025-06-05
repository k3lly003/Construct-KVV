import React from 'react';

export const BrickLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
      <div className="relative w-32 h-32">
        {/* Bricks container */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          {/* Top brick */}
          <div 
            className="w-12 h-6 bg-yellow-400 rounded-sm animate-bounce mx-auto"
            style={{ 
              animationDuration: '1s',
              animationDelay: '0.3s',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          />
          
          {/* Bottom bricks container */}
          <div className="flex space-x-1 mt-1">
            <div 
              className="w-12 h-6 bg-yellow-400 rounded-sm animate-bounce"
              style={{ 
                animationDuration: '1s',
                animationDelay: '0.1s',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            />
            <div 
              className="w-12 h-6 bg-yellow-400 rounded-sm animate-bounce"
              style={{ 
                animationDuration: '1s',
                animationDelay: '0.2s',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            />
          </div>
        </div>

        {/* Dust particles */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 flex justify-center">
          <div className="particle-container">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 bg-gray-300 rounded-full absolute"
                style={{
                  animation: `particle ${1 + Math.random() * 0.5}s infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                  left: `${Math.random() * 100}%`
                }}
              />
            ))}
          </div>
        </div>

        {/* Loading text */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white text-lg font-medium">
          kvv ...
        </div>
      </div>

      <style jsx>{`
        @keyframes particle {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(${Math.random() * 40 - 20}px, -20px) scale(1);
            opacity: 0;
          }
        }

        .particle-container {
          position: relative;
          width: 100%;
          height: 20px;
        }
      `}</style>
    </div>
  );
};
 
// DASHBOARD LOADER
export const BrickLoaderDash: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
      <div className="relative w-32 h-32">
        {/* Bricks container */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          {/* Top brick */}
          <div 
            className="w-12 h-6 bg-yellow-400 rounded-sm animate-bounce mx-auto"
            style={{ 
              animationDuration: '1s',
              animationDelay: '0.3s',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          />
          
          {/* Bottom bricks container */}
          <div className="flex space-x-1 mt-1">
            <div 
              className="w-12 h-6 bg-yellow-400 rounded-sm animate-bounce"
              style={{ 
                animationDuration: '1s',
                animationDelay: '0.1s',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            />
            <div 
              className="w-12 h-6 bg-yellow-400 rounded-sm animate-bounce"
              style={{ 
                animationDuration: '1s',
                animationDelay: '0.2s',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            />
          </div>
        </div>

        {/* Dust particles */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 flex justify-center">
          <div className="particle-container">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 bg-gray-300 rounded-full absolute"
                style={{
                  animation: `particle ${1 + Math.random() * 0.5}s infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                  left: `${Math.random() * 100}%`
                }}
              />
            ))}
          </div>
        </div>

        {/* Loading text */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white text-lg font-medium">
          kvv Dashboard...
        </div>
      </div>

      <style jsx>{`
        @keyframes particle {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(${Math.random() * 40 - 20}px, -20px) scale(1);
            opacity: 0;
          }
        }

        .particle-container {
          position: relative;
          width: 100%;
          height: 20px;
        }
      `}</style>
    </div>
  );
};