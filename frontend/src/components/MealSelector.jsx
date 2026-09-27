import React, { useState } from 'react';

const prices = {
  breakfast: 30,
  lunch: 50,
  dinner: 40,
  snacks: 10,
};

const mealIcons = {
  breakfast: '🌅',
  lunch: '🍽️',
  dinner: '🌙',
  snacks: '🍿',
};

export default function MealSelector({ meals, onChange }) {
  const [hoveredMeal, setHoveredMeal] = useState(null);

  const toggle = (key) => {
    onChange({ ...meals, [key]: !meals[key] });
  };

  const calculateTotal = () => {
    return Object.keys(meals).reduce((total, key) => {
      return meals[key] ? total + prices[key] : total;
    }, 0);
  };

  return (
    <div className="meal-selector">
      <h3>Select Meals</h3>
      <div className="meal-options">
        {Object.keys(prices).map((key) => (
          <label
            key={key}
            className={`meal-option ${meals[key] ? 'selected' : ''}`}
            onMouseEnter={() => setHoveredMeal(key)}
            onMouseLeave={() => setHoveredMeal(null)}
          >
            <input
              type="checkbox"
              checked={meals[key]}
              onChange={() => toggle(key)}
            />
            <span className="meal-icon">{mealIcons[key]}</span>
            <span className="meal-name">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </span>
            <span className="meal-price">₹{prices[key]}</span>
          </label>
        ))}
      </div>
      <div className="meal-total">
        <span className="total-label">Total:</span>
        <span className="total-value">₹{calculateTotal()}</span>
      </div>
    </div>
  );
}
