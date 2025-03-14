import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import BillingDashboard from "./component/Dashbord";
import Vender from "./component/Vender";
import Product from "./component/Product";
import AllProduct from "./component/AllProduct";
import Sell from "./component/Sell";
import AllSell from "./component/AllSell";
import Bill3 from "./component/Bill3";
import Login from "./component/Login";
import ProtectedRoute from "./component/ProtectedRoute";
import Dashboard from "./component/Dashbord";
function App() {
  const isLoggedIn=window.localStorage.getItem("loggedIn")
  const userType=window.localStorage.getItem("userType")
  return (
    <>
      <BrowserRouter>
        <div className="App">
          {/* <Dashboard isLoggedIn={isLoggedIn} userType={"userType"} /> */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            {/* <Route element={<ProtectedRoute />}> */}
              <Route path="/dashboard" element={<Dashboard/>}/>
              <Route path="/billingDashboard" element={<BillingDashboard />} />
              <Route path="/vender" element={<Vender />} />
              <Route path="/product" element={<Product />} />
              <Route path="/allproduct" element={<AllProduct />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/allsell" element={<AllSell />} />
              <Route path="/bill" element={<Bill3 />} />
            {/* </Route> */}
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;

