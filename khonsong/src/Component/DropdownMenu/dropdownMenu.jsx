import React from "react";
import "./dropdownMenu.css";

const DropdownMenu = ({
  selectedState,
  isOpen,
  handleToggleDropdown,
  handleItemClick,
  states,
}) => {
  return (
    <div>
      <div className="styled-dropdown" onClick={handleToggleDropdown}>
        {selectedState || "Select point"}
      </div>
      {isOpen && (
        <ul className="value-list">
          {states.map((state, index) => (
            <li key={index} onClick={() => handleItemClick(state)}>
              {state}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
