import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useAuth } from "../context/useAuth";

export const ThemeSwitcher = () => {
  const { isDark, onThemeChange } = useAuth();
  const [isChecked, setIsChecked] = useState(isDark);

  useEffect(() => {
    setIsChecked(isDark);
  }, [isDark]);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    onThemeChange();
  };

  return (
    <label className="flex cursor-pointer select-none items-center">
      <div className="relative">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="sr-only"
        />
        {/* Track */}
        <div
          className={`block h-8 w-14 rounded-full ${
            isDark ? 'bg-blue-200' : 'bg-slate-800'
          }`}
        ></div>
        {/* Thumb (circle) */}
        <div
          className={`absolute top-1 h-6 w-6 rounded-full transition-all duration-300 ${
            isDark ? 'left-7 bg-blue-500 ' : 'left-1 bg-gray-600'
          }`}
        >
            {isDark?<Sun className="text-yellow-500" />:<Moon className="text-white"/>}
        </div>
      </div>
    </label>
  );
};
