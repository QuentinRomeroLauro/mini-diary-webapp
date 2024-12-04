import React from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const DiaryEditor: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  className,
}) => {
  return (
    <div className={`h-full ${className}`}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-full bg-transparent border-0 focus:ring-0 resize-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        style={{ outline: 'none' }}
      />
    </div>
  );
}; 