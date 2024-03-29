import InputOrder from "../src/Pages/InputOrder/inputOrder.jsx";
import ShowHistory from "../src/Pages/ShowHistory/showHistory.jsx";
import DeliveryInfo from "../src/Pages/DeliveryInfo/deliveryInfo.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<InputOrder />} />
          <Route exact path="/status" element={<DeliveryInfo />} />
          <Route exact path="/history" element={<ShowHistory />} />
        </Routes>
      </BrowserRouter>
      {/* <InputOrder /> */}
      {/* <DeliveryInfo /> */}
      {/* <ShowHistory /> */}
    </>
  );
}

export default App;
