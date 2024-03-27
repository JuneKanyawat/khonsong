import React, { useState, useEffect } from "react";
import "./inputOrder.css";
import DropdownMenu from "../../Component/DropdownMenu/dropdownMenu.jsx";
import axios from "axios";
// import { useNavigate } from "react-router-dom";

const InputOrder = () => {
  const url =
    "http://ec2-54-82-55-108.compute-1.amazonaws.com:8080/staff/name?staffID=10";
  const [userId, setUserId] = useState("");
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [dropdowns, setDropdowns] = useState([
    { selectedState: "", isOpen: false },
  ]);

  const states = ["Point A", "Point B", "Point C"];
  const [data, setData] = useState([]);

  // const navigate = useNavigate();

  // const LinktoHistory = () => {
  //   navigate("/show-history");
  // };

  useEffect(() => {
    if (showConfirmBox) {
      const fetchInfo = () => {
        axios.get(url).then((res) => setData(res.data.data));
      };

      fetchInfo();
    }
  }, [showConfirmBox, url]);

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
          {console.log(data)}
          <div
            className="img"
            style={{
              backgroundImage: `url("https://i.postimg.cc/KvwprzTq/8-AA2-EF79-5-A54-4-F45-902-F-11-C0-B2-DC3-DE5.jpg")`,
            }}
          ></div>

          <label>Staff Name :</label>
          <p className="staff-name">
            {`${data.staffFname} ${data.staffLname}`}
          </p>
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

          {/* <button onClick={LinktoHistory} className="hero-btn share">
            History
          </button> */}

          <p className="history-text">History</p>
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
