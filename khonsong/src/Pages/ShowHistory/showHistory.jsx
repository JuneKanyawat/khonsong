import { useState, useEffect, Children } from "react";
import "./showHistory.css";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
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
        <Accordion data={data} />
      </div>
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
            routeIDs={el.routeIDs}
            key={el.deliverRouteID}
          ></AccordionItem>
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
  routeIDs,
  curOpen,
  onOpen,
}) {
  const [fetchedRouteData, setFetchedRouteData] = useState(null);
  const isOpen = title === curOpen;

  function handleToggle() {
    if (!isOpen) {
      axios
        .get(
          `http://ec2-54-82-55-108.compute-1.amazonaws.com:8080/route/routeForDeliver?inputRoutes=${routeIDs}`
        )
        .then((response) => {
          setFetchedRouteData(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching route data:", error);
        });
    }
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

      {isOpen && fetchedRouteData && (
        <div className="his-box">
          <div className="line-box">
            <p>hi</p>
            <p>hi</p>
            <p>hi</p>
            <p>hi</p>
            <p>hi</p>
            <p>hi</p>
          </div>
          {fetchedRouteData.map((item) => (
            <div key={item.routeID} className="line-box">
              <p>{item.routeID}</p>
              <p>{formatTime(item.arrivedTime)}</p>
              <p>{formatTime(item.receivedTime)}</p>
              <p>{item.staffName}</p>
              <p>{item.checkpoint}</p>
              <p>{item.routeStatus}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
function formatTime(timeString) {
  const time = new Date(timeString);
  return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
