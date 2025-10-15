import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function AnimatedCounter({ 
  end, 
  duration = 2, 
  suffix = "", 
  prefix = "",
  className = ""
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!elementRef.current || hasAnimated.current) return;

    const element = elementRef.current;
    
    const obj = { value: 0 };
    const animation = gsap.to(obj, {
        value: end,
        duration,
        ease: "power2.out",
        onUpdate: function() {
          setCount(Math.floor(obj.value));
        },
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          onEnter: () => {
            hasAnimated.current = true;
          }
        }
      }
    );

    return () => {
      animation.kill();
    };
  }, [end, duration]);

  return (
    <span ref={elementRef} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}