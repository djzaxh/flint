import { useEffect } from "react";

export function useScrollAnimation() {
  useEffect(() => {
    // Fade and slide up animation
    const fadeUpObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    // Scale animation
    const scaleObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("scale-in");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    // Stagger animation for lists
    const staggerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const children = Array.from(entry.target.children);
            children.forEach((child, index) => {
              setTimeout(() => {
                (child as HTMLElement).style.opacity = "1";
                (child as HTMLElement).style.transform = "translateY(0)";
              }, index * 100);
            });
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    // Get all elements to animate
    const fadeUpElements = document.querySelectorAll(".fade-up-animate");
    const scaleElements = document.querySelectorAll(".scale-animate");
    const staggerElements = document.querySelectorAll(".stagger-animate");

    // Observe elements
    fadeUpElements.forEach((el) => fadeUpObserver.observe(el));
    scaleElements.forEach((el) => scaleObserver.observe(el));
    staggerElements.forEach((el) => staggerObserver.observe(el));

    return () => {
      fadeUpObserver.disconnect();
      scaleObserver.disconnect();
      staggerObserver.disconnect();
    };
  }, []);
}
