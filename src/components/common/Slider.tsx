"use client";

import React, { useState } from "react";
import Label from "../form/Label";

interface SliderProps {
  maxValue?: number;
}


const Slider: React.FC<SliderProps> = ({maxValue}) => {
  const [value, setValue] = useState<number>(0);

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setValue(newValue);
  };

  return (
    <div className="flex justify-center items-center gap-4">
        <input
          type="range"
          id="volume-slider"
          min="0"
          max={maxValue}
          value={value}
          onChange={handleValueChange}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full"
        />
        <Label className="h-5 text-md">{value}</Label>
    </div>
  );
};

export default Slider;