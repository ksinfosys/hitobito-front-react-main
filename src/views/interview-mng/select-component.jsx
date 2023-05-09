import React, { useState, useEffect, useRef } from "react";
import TableArrow from "@/assets/images/table-arrow.svg";

function DropdownSelect({ options, defaultOption, onSelect }) {
  const [isRotated, setIsRotated] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    defaultOption || options[0]
  );
  const dropdownRef = useRef(null);

  const handleClick = () => {
    setIsRotated(!isRotated);
    setDropdownOpen(!dropdownOpen);
  };

  const handleOptionClick = (option, index) => {
    setSelectedOption(option);
    setIsRotated(false);
    setDropdownOpen(false);
    onSelect(option, index);
  };

  const rotateStyle = {
    transform: isRotated ? "rotate(180deg)" : "rotate(0deg)",
    transition: "transform 0.1s ease-in-out",
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsRotated(false);
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button onClick={handleClick} className="flex items-center">
        {selectedOption && (
          <div className="text-sm">{selectedOption}</div>
        )}
        <img src={TableArrow} alt="" style={rotateStyle} />
      </button>
      {dropdownOpen && (
        <div className="absolute top-full  bg-white rounded-lg shadow-md mt-2 center_position">
          {options.map((option, index) => (
            <div
              key={index}
              className="px-10 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleOptionClick(option, index)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DropdownSelect;
