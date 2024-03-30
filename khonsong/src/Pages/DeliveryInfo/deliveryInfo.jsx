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

  useEffect(() => {
    console.log("Fetching data...");
    const fetchData = async () => {
      try {
        const response1 = await axios.get("http://ec2-54-82-55-108.compute-1.amazonaws.com:8080/deliverRoute/currentDeliver?deliverRouteID=1");
        const response2 = await axios.get("http://ec2-54-82-55-108.compute-1.amazonaws.com:8080/deliverRoute/restart?deliverRouteID=1");

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
    {name: 'Checkpoint', selector: row => row.checkpoint || '-'}, 
    {name: 'Receiver', selector: row => row.staffName || '-'}, 
    {name: 'Arrival Time', selector: row => row.arrivedTime || '-'}, 
    {name: 'Received Time', selector: row => row.receivedTime || '-'}, 
    {name: 'Order Status', selector: row => row.routeStatus || '-'},
    {name: 'Image', selector: row => row.receivedImage || '-'} 
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
    </div>
  );
};

export default DeliveryInfo;
