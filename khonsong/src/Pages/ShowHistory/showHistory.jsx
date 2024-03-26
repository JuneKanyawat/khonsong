import { useState } from "react";
import "./showHistory.css";
import data from "./data.json";

export default function ShowHistory() {
  return (
    <div>
      <div className="history-container">
        {console.log(data)}
        <Accordion data={data.data} />
      </div>
      ;
    </div>
  );
}

function Accordion({ data }) {
  const [curOpen, setCurOpen] = useState(null);
  return (
    <div>
      <h2>History</h2>
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
            <div>
              {el.deliverRouteID}
              {el.checkpointsList}
              {el.startTime}
              {el.finishTime}
              {el.issuedBy}
            </div>
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
      <p className="icon">{isOpen ? "-" : "+"}</p>

      {isOpen && <div className="content-box">{children}</div>}
    </div>
  );
}
