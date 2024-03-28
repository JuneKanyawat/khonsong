import React, { useState, useEffect } from "react";
import "./inputOrder.css";
import DropdownMenu from "../../Component/DropdownMenu/dropdownMenu.jsx";
import axios from "axios";

const InputOrder = () => {
  const [userId, setUserId] = useState("");
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [dropdowns, setDropdowns] = useState([
    { selectedState: "", isOpen: false },
  ]);
  const states = ["Point A", "Point B", "Point C"];
  const [data, setData] = useState([]);
  const [routeData, setRouteData] = useState({
    startTime: "",
    checkpointsList: [],
    issuedBy: "",
  });

  useEffect(() => {
    if (showConfirmBox && userId !== "") {
      const url = `http://ec2-54-82-55-108.compute-1.amazonaws.com:8080/staff/name?staffID=${userId}`;
      axios
        .get(url)
        .then((res) => setData(res.data.data))
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [showConfirmBox, userId]);

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

  const handleNext = () => {
    const lastCheckpoint = dropdowns[dropdowns.length - 1].selectedState;
    const lastAlphabet = lastCheckpoint.charAt(lastCheckpoint.length - 1);
    const startTime = new Date().toISOString();

    const routeData = {
      startTime: startTime,
      checkpointsList: dropdowns.map((dropdown) =>
        dropdown.selectedState.charAt(dropdown.selectedState.length - 1)
      ),
      issuedBy: userId,
    };
    alert(JSON.stringify(routeData));
    console.log(routeData);
    axios
      .post(
        "http://ec2-54-82-55-108.compute-1.amazonaws.com:8080/deliverRoute/create",
        routeData
      )
      .then((response) => {
        console.log("Route created successfully:", response.data);

        setUserId("");
        setDropdowns([{ selectedState: "", isOpen: false }]);
        setShowConfirmBox(false);
      })
      .catch((error) => {
        console.error("Error creating route:", error);
      });
  };

  return (
    <div className="container">
      <label>Staff ID :</label>
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
          {/* {console.log(data)} */}
          <div
            className="img"
            style={{ backgroundImage: `url("${data.staffPhoto}")` }}
          ></div>

          <label>Staff Name :</label>
          <p className="staff-name">{`${data.staffFname} ${data.staffLname}`}</p>
          <label className="checkpoint">Checkpoint(s):</label>
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

          <p className="history-text">History</p>
          <button className="btn-cancel" onClick={() => setUserId("")}>
            Cancel
          </button>
          <button className="btn-next" onClick={handleNext}>
            Next
          </button>
        </>
      )}
    </div>
  );
};

export default InputOrder;
