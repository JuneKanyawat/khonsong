import { useState, useEffect } from "react";
import "./showHistory.css";
import { FaCaretDown } from "react-icons/fa6";
import { FaCaretUp } from "react-icons/fa6";
// import data from "./data.json";
import axios from "axios";

export default function ShowHistory() {
  const url =
    "http://ec2-54-82-55-108.compute-1.amazonaws.com:8080/deliverRoute/allDeliver";
  const [data, setData] = useState([]);

  const fetchInfo = () => {
    return axios.get(url).then((res) => setData(res.data.data));
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <div>
      <div className="history-container">
        {console.log(data)}
        <Accordion data={data} />
      </div>
      ;
    </div>
  );
}

function Accordion({ data }) {
  const [curOpen, setCurOpen] = useState(null);
  return (
    <div>
      <h2 className="heading">History</h2>
      <div className="accordion">
        {data.map((el, i) => (
          <AccordionItem
            curOpen={curOpen}
            onOpen={setCurOpen}
            title={el.deliverRouteID}
            checkPoint={el.checkpointsList}
            userId={el.issuedBy}
            status={el.deliverStatus}
            key={el.deliverRouteID}
          >
            <b>Route ID</b>
            <b>Point</b>
            <b>Start Time</b>
            <b>Finish Time</b>

            <p>{el.routeIDs}</p>
            <p>Point {el.checkpointsList.join(" - Point ")}</p>
            <p>{formatTime(el.startTime)}</p>
            <p>{el.finishTime}</p>
          </AccordionItem>
        ))}
      </div>
    </div>
  );
}

function AccordionItem({
  title,
  checkPoint,
  userId,
  status,
  curOpen,
  onOpen,
  startTime,
  finishTime,
  children,
}) {
  const isOpen = title === curOpen;
  function handleToggle() {
    // setIsOpen((isOpen) => !isOpen);
    onOpen(isOpen ? null : title);
  }

  return (
    <div className={`item ${isOpen ? "open" : ""}`} onClick={handleToggle}>
      <p className="title">{title}</p>
      <div className="text">
        <p>Point {checkPoint.join(" - Point ")}</p>
        <p>{userId}</p>
        <p>{status}</p>
      </div>
      <p className="icon">{isOpen ? <FaCaretUp /> : <FaCaretDown />}</p>

      {isOpen && <div className="content-box">{children}</div>}
    </div>
  );
}

function formatTime(timeString) {
  const time = new Date(timeString);
  return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
