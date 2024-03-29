import React, { useState, useEffect } from "react";
import "./deliveryInfo.css";
import Datatable from 'react-data-table-component'
import axios from "axios";

const DeliveryInfo = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log("Fetching data...");
    const fetchData = async () => {
      try {
        const response = await axios.get("http://ec2-54-82-55-108.compute-1.amazonaws.com:8080/deliverRoute/currentDeliver?deliverRouteID=1");
        const newData = response.data.data.routesData.map(item => ({
          ...item,
          arrivedTime: item.arrivedTime || '-',
          receivedTime: item.receivedTime || '-',
          staffName: item.staffName || '-',
          receivedImage: item.receivedImage || '-',
        }));
        setData(newData);
        console.log(newData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 2000);

    return () => clearInterval(intervalId);
  }, []);

  function sameData(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
  
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
  
    return true;
  }

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
