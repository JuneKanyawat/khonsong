import "./deliveryInfo.css";
import Datatable from 'react-data-table-component'

const DeliveryInfo = () => {
  const categories = [
    {name: 'Checkpoint', selector: row => row.point}, 
    {name: 'Receiver ID', selector: row => row.id}, 
    {name: 'Arrival Time', selector: row => row.arr}, 
    {name: 'Received Time', selector: row => row.rec}, 
    {name: 'Order Status', selector: row => row.status},
    {name: 'Image', selector: row => row.img} 
  ];

  const data = [
    {
      point: 'A',
      id: 1,
      arr: '10:00:00',
      rec: '10:01:00',
      status: 'completed',
      img: '-',
    }
  ]

  return (
    <div>
      <div className = "container1">
        <h1> Status </h1>
      </div>

      <div className = "container2">
        <h1> All Status </h1>
        <Datatable
          columns = {categories}
          data = {data}
        ></Datatable>
      </div>
    </div>
  );
};

export default DeliveryInfo;
