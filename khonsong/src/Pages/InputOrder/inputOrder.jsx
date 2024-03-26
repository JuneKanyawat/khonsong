import React, { useState } from "react";
import "./inputOrder.css";
import DropdownMenu from "../../Component/DropdownMenu/dropdownMenu.jsx";

const InputOrder = () => {
  const [userId, setUserId] = useState("");
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [dropdowns, setDropdowns] = useState([
    { selectedState: "", isOpen: false },
  ]);

  const states = ["Point A", "Point B", "Point C"];

  const handleUserIdChange = (event) => {
    setUserId(event.target.value);
    setShowConfirmBox(false);
  };

  const handleItemClick = (index, state) => {
    const updated = [...dropdowns];
    updated[index].selectedState = state;
    updated[index].isOpen = false;
    setDropdowns(updated);
  };

  const handleToggleDropdown = (index) => {
    const updated = [...dropdowns];
    updated[index].isOpen = !updated[index].isOpen;
    setDropdowns(updated);
  };

  const handleAddDropdown = () => {
    if (dropdowns.length < 3) {
      setDropdowns([...dropdowns, { selectedState: "", isOpen: false }]);
    }
  };

  const handleDeleteDropdown = (index) => {
    if (index !== 0) {
      const updated = [...dropdowns];
      updated.splice(index, 1);
      setDropdowns(updated);
    }
  };

  const handleShowConfirmBox = () => {
    setShowConfirmBox(true);
  };

  return (
    <div className="container">
      <label>User ID :</label>
      <input name="User ID" value={userId} onChange={handleUserIdChange} />

      {userId && !showConfirmBox && (
        <div className="confirmation-box">
          <p>Do you want to proceed?</p>
          <button onClick={handleShowConfirmBox}>Yes</button>
          <button onClick={() => setUserId("")}>No</button>
        </div>
      )}

      {showConfirmBox && (
        <>
          <label>User Name :</label>
          <input name="User ID" disabled />

          <label className="checkpoint">Checkpoint (s) :</label>
          <div>
            <div>
              {dropdowns.map((dropdown, index) => (
                <div key={index} className="cont">
                  <DropdownMenu
                    selectedState={dropdown.selectedState}
                    isOpen={dropdown.isOpen}
                    handleToggleDropdown={() => handleToggleDropdown(index)}
                    handleItemClick={(state) => handleItemClick(index, state)}
                    states={states}
                  />

                  {index === 0 ? (
                    <button className="add-btn" onClick={handleAddDropdown}>
                      +
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDeleteDropdown(index)}
                      className="delete-btn"
                    >
                      x
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <button className="btn-cancel" onClick={() => setUserId("")}>
            Cancel
          </button>
          <button className="btn-next">Next</button>
        </>
      )}
    </div>
  );
};

export default InputOrder;
