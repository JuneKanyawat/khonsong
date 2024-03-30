import { useState, useEffect, Children } from "react";
import "./showHistory.css";
import { FaArrowLeft, FaCaretDown, FaCaretUp } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ShowHistory() {
  const url =
    "http://ec2-54-82-55-108.compute-1.amazonaws.com:8080/deliverRoute/allDeliver";
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const LinktoOrder = () => {
    navigate("/");
  };

  const fetchInfo = () => {
    return axios.get(url).then((res) => setData(res.data.data));
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <div>
      <div className="history-container">
        <Accordion data={data} LinktoOrder={LinktoOrder} />
      </div>
    </div>
  );
}

function Accordion({ data, LinktoOrder }) {
  const [curOpen, setCurOpen] = useState(null);

  return (
    <div>
      <div className="Head">
        <p onClick={LinktoOrder}>
          <FaArrowLeft />
        </p>
        <h2 className="heading">History</h2>
      </div>
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
  const [showImage, setShowImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

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

  function handleImageClick(imageData) {
    setSelectedImage(imageData);
    setShowImage(true);
  }

  function handleCloseImage() {
    setShowImage(false);
  }

  return (
    <div
      className={`item ${isOpen ? "open" : "closeing"}`}
      onClick={handleToggle}
    >
      <p className="title">{title}</p>
      <div className="text">
        <p className="name">Point {checkPoint.join(" - Point ")}</p>
        <p>{userId}</p>
        <p>{status}</p>
      </div>
      <p className="icon">{isOpen ? <FaCaretUp /> : <FaCaretDown />}</p>

      {isOpen && fetchedRouteData && (
        <div className="his-box">
          <div className="line-box">
            <b>Route ID</b>
            <b>Arrived Time</b>
            <b>Received Time</b>
            <b>Staff</b>
            <b>Checkpoint</b>
            <b>Image</b>
          </div>
          {fetchedRouteData.map((item) => (
            <div key={item.routeID} className="line-box ">
              <p>{item.routeID}</p>
              <p>{formatTime(item.arrivedTime)}</p>
              <p>{formatTime(item.receivedTime)}</p>
              <p>{item.staffName}</p>
              <p>{item.checkpoint}</p>

              {item.receivedImage ? (
                <button
                  className="img-url"
                  onClick={() => handleImageClick(item.receivedImage)}
                >
                  View
                </button>
              ) : (
                <p>No image</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* display the image */}
      {showImage && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseImage}>
              &times;
            </span>
            <img
              src={`data:image/jpeg;base64,${selectedImage}`}
              alt="Received"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(timeString) {
  const time = new Date(timeString);
  return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
