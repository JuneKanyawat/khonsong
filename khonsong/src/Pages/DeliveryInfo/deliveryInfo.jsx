import React, { useState, useEffect } from "react";
import "./deliveryInfo.css";
import Datatable from 'react-data-table-component'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

const DeliveryInfo = () => {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [restart, setRestart] = useState(null);
  const [updateRestart, setUpdateRestart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    console.log("Fetching data...");
    const fetchData = async () => {
      try {
        let response1;
        if (!updateRestart) {
          response1 = await axios.get("http://ec2-54-82-55-108.compute-1.amazonaws.com:8080/deliverRoute/currentDeliver?deliverRouteID=1");
        }
        
        const response2 = await axios.get("http://ec2-54-82-55-108.compute-1.amazonaws.com:8080/deliverRoute/restart?deliverRouteID=1");

        console.log(response1);
        
        const newData = response1.data.data.routesData.map(item => ({
          ...item,
          arrivedTime: item.arrivedTime || '-',
          receivedTime: item.receivedTime || '-',
          staffName: item.staffName || '-',
          receivedImage: item.receivedImage || '-',
        }));

        const restartValue = response2.data.data.restart;

        setData(newData);
        setRestart(restartValue); 
        console.log(newData);
        console.log(restartValue);

        // const allComplete = newData.every(item => item.routeStatus === "complete");}

      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 2000);
    return () => clearInterval(intervalId);
  }, []);

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
    if (!restart) {
      alert = Swal.fire({
        title: "Alert!",
        html: "This alert will stay open until restart is true.",
        showConfirmButton: false, 
        didOpen: () => {
          Swal.showLoading();
        }
      });
    } else {
      if (alert) {
        Swal.close();
        navigate('/');
      }
    }
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
