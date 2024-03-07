import React, { useState } from "react";
import styles from "./inputOrder.module.css";
import DropdownMenu from "../../Component/DropdownMenu/dropdownMenu.jsx";

const InputOrder = () => {
  const [userId, setUserId] = useState("");
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [dropdowns, setDropdowns] = useState([
    { selectedState: "", isOpen: false },
  ]);
  const states = ["Point A", "Point B", "Point C"];

  const handleUserIdChange = (event) => {
    setUserId(event.target.value);
    setShowAdditionalFields(false);
  };

  const handleItemClick = (index, state) => {
    const updatedDropdowns = [...dropdowns];
    updatedDropdowns[index].selectedState = state;
    updatedDropdowns[index].isOpen = false;

    setDropdowns(updatedDropdowns);
  };

  const handleToggleDropdown = (index) => {
    const updatedDropdowns = [...dropdowns];
    updatedDropdowns[index].isOpen = !updatedDropdowns[index].isOpen;
    setDropdowns(updatedDropdowns);
  };

  const handleAddDropdown = () => {
    setDropdowns([...dropdowns, { selectedState: "", isOpen: false }]);
  };

  const handleShowAdditionalFields = () => {
    setShowAdditionalFields(true);
  };

  return (
    <div className={styles["container"]}>
      <label>User ID :</label>
      <input name="User ID" value={userId} onChange={handleUserIdChange} />

      {userId && !showAdditionalFields && (
        <div className={styles["confirmation-box"]}>
          <p>Do you want to proceed?</p>
          <button onClick={handleShowAdditionalFields}>Yes</button>
          <button onClick={() => setUserId("")}>No</button>
        </div>
      )}

      {showAdditionalFields && (
        <>
          <label>User Name :</label>
          <input name="User ID" disabled />

          <label className={styles["checkpoint"]}>Checkpoint (s) :</label>
          <div className={styles["cont"]}>
            <div>
              {dropdowns.map((dropdown, index) => (
                <div key={index} className={styles["option-box"]}>
                  <DropdownMenu
                    selectedState={dropdown.selectedState}
                    isOpen={dropdown.isOpen}
                    handleToggleDropdown={() => {
                      handleToggleDropdown(index);
                    }}
                    handleItemClick={(state) => {
                      handleItemClick(index, state);
                    }}
                    states={states}
                  />
                </div>
              ))}
            </div>
            <button className={styles["add-btn"]} onClick={handleAddDropdown}>
              +
            </button>
          </div>
          <button className={styles["btn-cancel"]}>Cancel</button>
          <button className={styles["btn-next"]}>Next</button>
        </>
      )}
    </div>
  );
};

export default InputOrder;
