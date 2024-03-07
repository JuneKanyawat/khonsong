import React from "react";
import styles from "./dropdownMenu.module.css";

const DropdownMenu = ({
  selectedState,
  isOpen,
  handleToggleDropdown,
  handleItemClick,
  states,
}) => {
  return (
    <div>
      <div className={styles["styled-dropdown"]} onClick={handleToggleDropdown}>
        {selectedState || "Select point"}
      </div>
      {isOpen && (
        <ul className={styles["value-list"]}>
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
