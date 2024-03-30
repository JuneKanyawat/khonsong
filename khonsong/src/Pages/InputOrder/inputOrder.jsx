import React, { useState, useEffect } from "react";
import "./inputOrder.css";
import DropdownMenu from "../../Component/DropdownMenu/dropdownMenu.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const InputOrder = () => {
  const navigate = useNavigate();
  const LinktoHistory = () => {
    navigate("/history");
  };

  const [userId, setUserId] = useState("");
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [dropdowns, setDropdowns] = useState([
    { selectedState: "", isOpen: false },
  ]);
  const states = ["Point A", "Point B", "Point C"];
  const [data, setData] = useState({});
  const [staffValid, setStaffValid] = useState(true);

  useEffect(() => {
    if (userId !== "") {
      const url = `http://ec2-54-82-55-108.compute-1.amazonaws.com:8080/staff/name?staffID=${userId}`;
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
  }, [showConfirmBox, userId]);

  const handleUserIdChange = (event) => {
    setUserId(event.target.value);
    setShowConfirmBox(false);
    setStaffValid(true);
  };

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

  const handleNext = () => {
    if (!staffValid) {
      alert("No staff found with the given ID.");
      return;
    }

    const lastCheckpoint = dropdowns[dropdowns.length - 1].selectedState;
    const lastAlphabet = lastCheckpoint.charAt(lastCheckpoint.length - 1);
    const startTime = new Date().toISOString();

    const routeData = {
      startTime: startTime,
      checkpointsList: dropdowns
        .map((dropdown) =>
          dropdown.selectedState.charAt(dropdown.selectedState.length - 1)
        )
        .sort(),
      issuedBy: userId,
    };
    console.log(routeData);
    axios
      .post(
        "http://ec2-54-82-55-108.compute-1.amazonaws.com:8080/deliverRoute/create",
        routeData
      )
      .then((response) => {
        console.log("Route created successfully:", response.data);
        navigate("/status");

        setUserId("");
        setDropdowns([{ selectedState: "", isOpen: false }]);
        setShowConfirmBox(false);
      })
      .catch((error) => {
        console.error("Error creating route:", error);
      });
  };

  const handleCancel = () => {
    setUserId("");
    setDropdowns([{ selectedState: "", isOpen: false }]);
    setShowConfirmBox(false);
  };

  const handleClear = () => {
    setUserId("");
    setStaffValid(true);
    setShowConfirmBox(false);
  };

  return (
    <div className="container">
      <label>Staff ID :</label>
      <input
        className="input"
        name="User ID"
        value={userId}
        onChange={handleUserIdChange}
      />

      {userId && !showConfirmBox && (
        <div className="confirmation-box">
          <p>Do you want to proceed?</p>
          <button onClick={handleShowConfirmBox}>Yes</button>
          <button onClick={() => setUserId("")}>No</button>
        </div>
      )}

      {!staffValid && showConfirmBox && (
        <div className="popup-box">
          <p>No staff found</p>
          <button className="clear-btn" onClick={handleClear}>
            Clear
          </button>
        </div>
      )}

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

          <p className="history-text" onClick={LinktoHistory}>
            History
          </p>
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
