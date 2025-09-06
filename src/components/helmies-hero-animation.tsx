import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function HelmiesHeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Create floating particles
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: linear-gradient(45deg, #8b5cf6, #06b6d4);
        border-radius: 50%;
        pointer-events: none;
      `;
      
      container.appendChild(particle);
      
      // Random starting position
      gsap.set(particle, {
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 10,
        opacity: 0
      });
      
      // Animate particle
      gsap.to(particle, {
        y: -10,
        opacity: 1,
        duration: Math.random() * 3 + 2,
        ease: "none",
        onComplete: () => {
          particle.remove();
        }
      });
      
      gsap.to(particle, {
        x: `+=${Math.random() * 100 - 50}`,
        duration: Math.random() * 2 + 1,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });
    };

    // Create particles periodically
    const particleInterval = setInterval(createParticle, 300);

    // Cleanup
    return () => {
      clearInterval(particleInterval);
      container.querySelectorAll('.particle').forEach(p => p.remove());
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}