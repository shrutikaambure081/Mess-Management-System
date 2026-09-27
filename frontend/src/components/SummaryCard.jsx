import React, { useState, useEffect } from 'react';

export default function SummaryCard({ title, value, subtitle, icon }) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simple visibility check - always show for now
    setIsVisible(true);
    
    // Optional: Use IntersectionObserver for scroll-based animation
    // const observer = new IntersectionObserver(
    //   ([entry]) => {
    //     if (entry.isIntersecting) {
    //       setIsVisible(true);
    //     }
    //   },
    //   { threshold: 0.1 }
    // );

    // const card = document.querySelector(`.summary-card[data-title="${title}"]`);
    // if (card) {
    //   observer.observe(card);
    // }

    // return () => observer.disconnect();
  }, [title]);

  useEffect(() => {
    if (isVisible && typeof value === 'string' && value.includes('₹')) {
      const numValue = parseFloat(value.replace('₹', '').replace(/,/g, ''));
      if (!isNaN(numValue)) {
        let current = 0;
        const increment = numValue / 30;
        const timer = setInterval(() => {
          current += increment;
          if (current >= numValue) {
            setAnimatedValue(numValue);
            clearInterval(timer);
          } else {
            setAnimatedValue(Math.floor(current));
          }
        }, 30);
        return () => clearInterval(timer);
      }
    }
  }, [isVisible, value]);

  const displayValue = isVisible && typeof value === 'string' && value.includes('₹') && !isNaN(parseFloat(value.replace('₹', '').replace(/,/g, '')))
    ? `₹${animatedValue.toLocaleString()}`
    : value;

  return (
    <div className="card summary-card" data-title={title}>
      {icon && <div className="summary-icon">{icon}</div>}
      <h3>{title}</h3>
      <div className="summary-value">{displayValue}</div>
      {subtitle && <div className="summary-subtitle">{subtitle}</div>}
    </div>
  );
}
