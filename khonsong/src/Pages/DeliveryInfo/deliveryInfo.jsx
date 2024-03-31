import React, { useState, useEffect } from "react";
import "./deliveryInfo.css";
import Datatable from 'react-data-table-component'
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from 'sweetalert2'
import { BiCheck, BiX, BiHomeAlt2 } from "react-icons/bi";

const DeliveryInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { routeId, checkpoints } = location.state;
  const steps = ["Origin", ...checkpoints];
  // console.log(steps);

  const [data, setData] = useState(null);
  const [restart, setRestart] = useState(null);
  const [updateRestart, setUpdateRestart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [currStep, setCurrStep] = useState(1);
  const [complete, setComplete] = useState(Array(checkpoints.length).fill(false));


  useEffect(() => {
    console.log("Fetching data...");
    const fetchData = async () => {
      try {
        let response1;
        let response2;
        if (!updateRestart) {
          response1 = await axios.get(`http://ec2-54-82-55-108.compute-1.amazonaws.com:8080/deliverRoute/currentDeliver?deliverRouteID=${userId}`);

          const routeData = response1.data.data.routesData;
          const newData = routeData.map(item => ({
            ...item,
            arrivedTime: item.arrivedTime || '-',
            receivedTime: item.receivedTime || '-',
            staffName: item.staffName || '-',
            receivedImage: item.receivedImage || '-',
          }));

          setData(newData); 
          console.log(newData);

          const completeData = routeData.map(route => route.routeStatus === "complete");;
          console.log(completeData)
          setComplete(completeData);

          const allComplete = newData.every(item => item.routeStatus === "complete");
          console.log(allComplete);
          if (allComplete) {
            setUpdateRestart(true);
            console.log("Restart!");
            setCurrStep(1);
            checkRestart();
          }

        } else {
          response2 = await axios.get(`http://ec2-54-82-55-108.compute-1.amazonaws.com:8080/deliverRoute/restart?deliverRouteID=${userId}`);

          const restartValue = response2.data.data.restart;

          setRestart(restartValue); 
          console.log(restartValue);
        }

      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 2000);
    return () => clearInterval(intervalId);
  }, [updateRestart]);

  const handleImageClick = (imageData) => {
    setSelectedImage(imageData);
    setShowImage(true);
  };

  const handleCloseImage = () => {
    setShowImage(false);
  };

  function formatTime(timeString) {
    const time = new Date(timeString);
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const checkRestart = () => {
    Swal.fire({
      title: "Delivery Completed!",
      icon: "success",
      html: "returning to origin...",
      showConfirmButton: false,
      didOpen: () => {
        const checkRestartInterval = setInterval(() => {
          if (restart) {
            clearInterval(checkRestartInterval);
            Swal.close();
            setUpdateRestart(false);
            navigate('/');
          }
        }, 100);
      }
    });    
  };

  const categories = [
    {name: 'Checkpoint', selector: row => row.checkpoint || '-', center: true }, 
    {name: 'Receiver', 
      cell: row => {
        const [firstName, ...lastName] = row.staffName.split(' ');
        const surname = lastName.join(' ');
        return `${firstName}\n${surname}`;
      }, center: true },  
    {name: 'Arrival Time', selector: row => formatTime(row.arrivedTime) || '-', center: true }, 
    {name: 'Received Time', selector: row => formatTime(row.receivedTime) || '-', center: true }, 
    {name: 'Order Status', selector: row => row.routeStatus || '-', center: true },
    {name: 'Image', 
      cell: row => (
        <button
          className = "img-url"
          onClick = {() => handleImageClick(row.receivedImage)}
        >
          View
        </button>
      ), center: true 
    } 
  ];

  return (
    <div>
      <div className = "container1">
        <h1> Status </h1>
        <div className = "stepper">
          {steps?.map((step, i) => (
            <div
              key={i}
              className={`step-item ${currStep === i + 1 && "active"} ${complete[i] && "complete"}`}
            >
              <div className={`step ${i === 0 ? "origin" : ""} ${complete[i] ? "complete" : ""}`}>
                {i === 0 ? (
                  <BiHomeAlt2 size = {20} /> 
                ) : complete[i] ? (
                  <BiCheck size = {24} /> 
                ) : (
                  <BiX size = {24} /> 
                )}
              </div>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </div>

      <div className = "container2">
        <h1> All Status </h1>
        {data !== null && (
          <Datatable
            columns = {categories}
            data = {data}
          ></Datatable>
        )}
      </div>
      {showImage && (
        <div className = "modal">
          <div className = "modal-content">
            <span className = "close" onClick={handleCloseImage}>
              &times;
            </span>
            <img
              src = {`data:image/jpeg;base64,${selectedImage}`}
              alt = "Received"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryInfo;
