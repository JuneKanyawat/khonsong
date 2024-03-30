import { useState, useEffect } from "react";
import "./showHistory.css";
import { FaArrowLeft, FaCaretDown, FaCaretUp } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ShowHistory() {
  // API endpoint URL
  const url =
    "http://ec2-54-82-55-108.compute-1.amazonaws.com:8080/deliverRoute/allDeliver";

  // State variables for data and navigation
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // Function to navigate back to the main page
  const LinktoOrder = () => {
    navigate("/");
  };

  // Function to fetch data from the API
  const fetchInfo = () => {
    return axios.get(url).then((res) => setData(res.data.data));
  };

  // useEffect hook to fetch data on component mount
  useEffect(() => {
    fetchInfo();
  }, []);

  // Rendering the main component
  return (
    <div>
      <div className="history-container">
        <Accordion data={data} LinktoOrder={LinktoOrder} />
      </div>
    </div>
  );
}

// Accordion component to display history items
function Accordion({ data, LinktoOrder }) {
  // State variable to track currently opened item
  const [curOpen, setCurOpen] = useState(null);

  return (
    <div>
      <div className="Head">
        {/* Back button to navigate to the main page */}
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

// AccordionItem component to display individual history item
function AccordionItem({
  title,
  checkPoint,
  userId,
  status,
  routeIDs,
  curOpen,
  onOpen,
}) {
  // State variables for fetched route data and image display
  const [fetchedRouteData, setFetchedRouteData] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  // Function to toggle accordion item open/close
  const isOpen = title === curOpen;

  function handleToggle() {
    // Fetch route data if the item is opened
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

  // Function to handle image click
  function handleImageClick(imageData) {
    setSelectedImage(imageData);
    setShowImage(true);
  }

  // Function to handle image modal close
  function handleCloseImage() {
    setShowImage(false);
  }

  // Rendering individual AccordionItem component
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

      {/* Display fetched route data if item is open */}
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

              {/* Display image if available */}
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

      {/* Display image modal if showImage state is true */}
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

// Function to format time
function formatTime(timeString) {
  const time = new Date(timeString);
  return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
