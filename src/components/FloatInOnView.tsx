import React, { useRef, useEffect, useState, PropsWithChildren } from 'react';

interface FloatInOnViewProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const FloatInOnView: React.FC<FloatInOnViewProps> = ({ children, className = '', ...props }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={
        `${className} ${isVisible ? 'animate-float-in' : 'opacity-0 translate-y-10'} transition-all duration-700`
      }
      {...props}
    >
      {children}
    </div>
  );
};

export default FloatInOnView; 