import React, { useState, useEffect } from "react";
import "./inputOrder.css";
import DropdownMenu from "../../Component/DropdownMenu/dropdownMenu.jsx";
import axios from "axios"; // Importing Axios for making HTTP requests
import { useNavigate } from "react-router-dom"; // Importing useNavigate for navigation

const InputOrder = () => {
  // Hook for navigation
  const navigate = useNavigate();

  // Function to navigate to the history page
  const LinktoHistory = () => {
    navigate("/history");
  };

  // State variables
  const [userId, setUserId] = useState(""); // State for storing user ID
  const [showConfirmBox, setShowConfirmBox] = useState(false); // State for showing confirmation box
  const [dropdowns, setDropdowns] = useState([
    { selectedState: "", isOpen: false },
  ]); // State for dropdown menus
  const states = ["Point A", "Point B", "Point C"]; // Array of checkpoint options
  const [data, setData] = useState({}); // State for storing staff data
  const [staffValid, setStaffValid] = useState(true); // State for validating staff

  // useEffect hook for fetching staff data when user ID changes
  useEffect(() => {
    if (userId !== "") {
      // API endpoint URL for fetching staff data
      const url = `http://ec2-54-82-55-108.compute-1.amazonaws.com:8080/staff/name?staffID=${userId}`;

      // Axios GET request to fetch staff data
      axios
        .get(url)
        .then((res) => {
          if (res.data.data) {
            setData(res.data.data);
            setStaffValid(true);
          } else {
            setStaffValid(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setStaffValid(false);
        });
    }
  }, [showConfirmBox, userId]); // Dependency array to trigger effect on showConfirmBox and userId changes

  // Event handler for user ID input change
  const handleUserIdChange = (event) => {
    setUserId(event.target.value);
    setShowConfirmBox(false);
    setStaffValid(true);
  };

  // Event handler for selecting a checkpoint from dropdown
  const handleItemClick = (index, state) => {
    const isStateAlreadySelected = dropdowns.some((dropdown, i) => {
      return i !== index && dropdown.selectedState === state;
    });

    if (isStateAlreadySelected) {
      alert("Option already selected in another dropdown.");
    } else {
      const updated = [...dropdowns];
      updated[index].selectedState = state;
      updated[index].isOpen = false;
      setDropdowns(updated);
    }
  };

  // Event handler for toggling dropdown menu visibility
  const handleToggleDropdown = (index) => {
    const updated = [...dropdowns];
    updated[index].isOpen = !updated[index].isOpen;
    setDropdowns(updated);
  };

  // Event handler for adding a new dropdown menu
  const handleAddDropdown = () => {
    if (dropdowns.length < 3) {
      setDropdowns([...dropdowns, { selectedState: "", isOpen: false }]);
    }
  };

  // Event handler for deleting a dropdown menu
  const handleDeleteDropdown = (index) => {
    if (index !== 0) {
      const updated = [...dropdowns];
      updated.splice(index, 1);
      setDropdowns(updated);
    }
  };

  // Event handler for showing confirmation box
  const handleShowConfirmBox = () => {
    setShowConfirmBox(true);
  };

  // Event handler for processing order and navigating to the next step
  const handleNext = () => {
    if (!staffValid) {
      alert("No staff found with the given ID.");
      return;
    }
    // Check if any dropdown menu is blank
    if (dropdowns.some((dropdown) => dropdown.selectedState === "")) {
      alert("Please select a checkpoint for all dropdown menus.");
      return;
    }

    const lastCheckpoint = dropdowns[dropdowns.length - 1].selectedState;
    const lastAlphabet = lastCheckpoint.charAt(lastCheckpoint.length - 1);
    const startTime = new Date().toISOString();

    // Data for creating a route
    const routeData = {
      startTime: startTime,
      checkpointsList: dropdowns
        .map((dropdown) =>
          dropdown.selectedState.charAt(dropdown.selectedState.length - 1)
        )
        .sort(),
      issuedBy: userId,
    };

    // Axios POST request to create route
    axios
      .post(
        "http://ec2-54-82-55-108.compute-1.amazonaws.com:8080/deliverRoute/create",
        routeData
      )
      .then((response) => {
        console.log("Route created successfully:", response.data);
        navigate("/status");

        // Resetting state variables
        setUserId("");
        setDropdowns([{ selectedState: "", isOpen: false }]);
        setShowConfirmBox(false);
      })
      .catch((error) => {
        console.error("Error creating route:", error);
      });
  };

  // Event handler for canceling order input
  const handleCancel = () => {
    setUserId("");
    setDropdowns([{ selectedState: "", isOpen: false }]);
    setShowConfirmBox(false);
  };

  // Event handler for clearing input fields
  const handleClear = () => {
    setUserId("");
    setStaffValid(true);
    setShowConfirmBox(false);
  };

  return (
    <div className="container">
      {/* Input field for staff ID */}
      <label>Staff ID :</label>
      <input
        className="input"
        name="User ID"
        value={userId}
        onChange={handleUserIdChange}
      />

      {/* Confirmation box for proceeding with the input */}
      {userId && !showConfirmBox && (
        <div className="confirmation-box">
          <p>Do you want to proceed?</p>
          <button onClick={handleShowConfirmBox}>Yes</button>
          <button onClick={() => setUserId("")}>No</button>
        </div>
      )}

      {/* Popup box for indicating invalid staff ID */}
      {!staffValid && showConfirmBox && (
        <div className="popup-box">
          <p>No staff found</p>
          <button className="clear-btn" onClick={handleClear}>
            Clear
          </button>
        </div>
      )}

      {/* Display staff details and checkpoint selection */}
      {staffValid && showConfirmBox && (
        <>
          <div
            className="img"
            style={{
              backgroundImage: `url("data:image/jpeg;base64,${data.staffPhoto}")`,
            }}
          ></div>

          <label>Staff Name :</label>
          <p className="staff-name">{`${data.staffFname} ${data.staffLname}`}</p>
          <label className="checkpoint">Checkpoint(s) :</label>
          <div>
            <div>
              {dropdowns.map((dropdown, index) => (
                <div key={index} className="cont">
                  {/* Dropdown menu component */}
                  <DropdownMenu
                    selectedState={dropdown.selectedState}
                    isOpen={dropdown.isOpen}
                    handleToggleDropdown={() => handleToggleDropdown(index)}
                    handleItemClick={(state) => handleItemClick(index, state)}
                    states={states}
                  />

                  {/* Buttons for adding/deleting dropdown menus */}
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

          {/* Link to history page */}
          <p className="history-text" onClick={LinktoHistory}>
            History
          </p>

          {/* Buttons for canceling, clearing, and proceeding to the next step */}
          <button className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>

          {/* Conditionally render the "Next" button */}
          {dropdowns.some((dropdown) => dropdown.selectedState !== "") && (
            <button className="btn-next" onClick={handleNext}>
              Next
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default InputOrder;
