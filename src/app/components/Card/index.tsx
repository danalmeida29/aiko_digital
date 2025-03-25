import React from 'react';
import { Typography } from '@mui/material'; 

interface CardProps {
  title?: string;
  description?: string;
  size?: string;
  fontSize?: string;
  listItems?: { text: string; icon?: React.ReactNode }[];
}

export const Card: React.FC<CardProps> = ({ title, description, size = 'w-80 p-6', listItems, fontSize }) => {

  return (
    <div className={`bg-white shadow-lg rounded-lg ${size}`}>
      <div className="text-center mb-4">
        <Typography variant="h5" component="h2" className="font-semibold">
          {title}
        </Typography>
        <Typography variant="body2" component="p" className="text-gray-600 mt-2">
          {description}
        </Typography>
      </div>

      {listItems && (
        <ul className="space-y-2 mt-4">
          {listItems.map((item, index) => (
            <li key={index} className={`flex items-center space-x-2 ${fontSize}`}>
              {item.icon && <span className="text-lg">{item.icon}</span>}
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
