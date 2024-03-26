import { useState } from "react";
import "./showHistory.css";
import data from "./data.json";
import { FaCaretDown } from "react-icons/fa6";
import { FaCaretUp } from "react-icons/fa6";

export default function ShowHistory() {
  return (
    <div>
      <div className="history-container">
        {/* <Accordion data={data.data} /> */}
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
            <div>
              <p>{el.deliverRouteID}</p>
              <p>{el.checkpointsList}</p>
              <p>{el.startTime}</p>
              <p>{el.finishTime}</p>
              <p>{el.issuedBy}</p>
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
      <p className="icon">{isOpen ? <FaCaretUp /> : <FaCaretDown />}</p>

      {isOpen && <div className="content-box">{children}</div>}
    </div>
  );
}
