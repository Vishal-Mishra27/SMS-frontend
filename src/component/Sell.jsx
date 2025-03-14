import { useState, useEffect } from "react";
import { Menu, X, LayoutDashboard, Users, Package, ShoppingCart, Receipt, LogOut } from 'lucide-react';
import { useNavigate, Outlet } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Sell = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [hoveredButtonIndex, setHoveredButtonIndex] = useState(null);
  const [getProduct, setGetProduct] = useState([]);
  const [sellForm, setSellForm] = useState({
    customerName: "",
    productName: "",
    quantity: "",
    price: "",
    totalPrice: "",
    finalPrice: "",
  });
  const navigate = useNavigate();
  // const buttons = ["Vender", "Product", "All Product", "Sell", "All Sell", "Bill", "Logout"];
  const userName = "Nishant";

  

  // Fetch Product Data
  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/product/api/getProduct"
      );
      setGetProduct(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 768);
    };
    fetchProduct();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "productName") {           // for automitacily generiting price
      const selectedProduct = getProduct.find((product) => product.productName === value);
      setSellForm({
        ...sellForm,
        productName: value,
        price: selectedProduct ? selectedProduct.price : "", // Auto-fill price
      });
    } else {
      setSellForm({ ...sellForm, [name]: value });
    }
  };
    useEffect(() => {
      setSellForm((prevDetails) => ({
        ...prevDetails,
        totalPrice:
          prevDetails.price && prevDetails.quantity
            ? prevDetails.price * prevDetails.quantity
            : "",
      }));
    }, [sellForm.price, sellForm.quantity]);

  const handleSubmit=async(e)=>{
    e.preventDefault();
    console.log("i am submitted");
    console.log(sellForm)
    try{
      const res = await axios.post(
        "http://localhost:3000/api/sell/api/sellitem",
        sellForm
      );
      console.log(res)
      setSellForm({
        customerName: "",
        productName: "",
        quantity: "",
        price: "",
        totalPrice: "",
        finalPrice: "",
      })
       toast.success("Sell Details Added Successfully");
      
    }catch(error){
      console.log(error)
    }
  }

  const sidebarButtons = [
    { name: 'Dashboard', icon: <LayoutDashboard size={32} />, hideInMain: true },
    { name: 'Vender', icon: <Users size={32} /> },
    { name: 'Product', icon: <Package size={32} /> },
    { name: 'All Product', icon: <Package size={32} /> },
    { name: 'Sell', icon: <ShoppingCart size={32} /> },
    { name: 'All Sell', icon: <ShoppingCart size={32} /> },
    // { name: 'Bill', icon: <Receipt size={32} /> },
    { name: 'Logout', icon: <LogOut size={32} /> }
  ];
  const handleButtonClick = (btn) => {
    if (btn === "Dashboard"){
      navigate("/dashboard");
    }
    if (btn === "Vender") navigate("/vender");
    else if (btn === "Product") navigate("/product");
    else if (btn === "All Product") navigate("/allproduct");
    else if (btn === "Sell") {
      navigate("/sell");
    } else if (btn === "All Sell") {
      navigate("/allsell");
    } 
    // else if (btn === "Bill") {
    //   navigate("/bill");
    // } 
    else if (btn === "Logout") {
      navigate("/");
    }

  };

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <div className={`${sidebarOpen? "w-64":"w-16"} bg-gray-800 text-white p-4 fixed top-0 left-0 h-full z-20 md:relative md:flex md:flex-col}`}>
        <button onClick={toggleSidebar} className="mb-6 md:hidden">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        {sidebarOpen && (
        <nav className="space-y-4">
          {sidebarButtons.map((btn,i) => (
            <a
              key={btn.name}
              href="#"
              className="flex items-justify space-x-2 hover:bg-gray-700 p-2 rounded "
              onClick={() => handleButtonClick(btn.name)}
              onMouseEnter={()=> setHoveredButtonIndex(i)}
              onMouseLeave={()=> setHoveredButtonIndex(null)}

            >
              {btn.icon}
              <span>{btn.name}</span>
            </a>
          ))}
        </nav>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-x-auto max-w-full p-4 pl-[66px] sm:pl-0  md:pl-[66px] lg:pl-0">
        {/* Navbar */}
        <div className="flex justify-between items-center gap-5 md:gap-0 bg-gray-100 p-4 shadow-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-1/2 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="font-semibold">Welcome, {userName}</div>
        </div>

        {/* Sell Dashboard */}
        <div className="flex md:items-center justify-center md:min-h-screen p-4">
          <form
            className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg"
            onSubmit={handleSubmit}
          >
            <h3 className="text-xl font-bold mb-6 text-black text-center">
              Sell Product
            </h3>

            <label className="block text-gray-600 font-semibold mb-2">
              Customer Name
            </label>
            <input
              type="text"
              placeholder="Customer Name"
              value={sellForm.customerName}
              name="customerName"
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

            <label className="block text-gray-600 font-semibold mb-2">
              Select Product
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              value={sellForm.productName}
              name="productName"
              onChange={handleInputChange}
            >
              <option value="">Select Product</option>
              {getProduct.map((product) => (
                <option key={product._id} value={product.productName}>
                  {product.productName}
                </option>
              ))}
            </select>

            <label className="block text-gray-600 font-semibold mb-2">
              Quantity
            </label>
            <input
              type="number"
              placeholder="No. of Items"
              value={sellForm.quantity}
              name="quantity"
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

            <label className="block text-gray-600 font-semibold mb-2">
              Price
            </label>
            <input
              type="number"
              placeholder="Price per Item"
              value={sellForm.price}
              name="price"
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              readOnly
            />

            <label className="mt-4 p-2 bg-blue-100 rounded-md">
              Total Price
            </label>
            <p
              type="number"
              placeholder="Total Price"
              value={sellForm.totalPrice}
              name="totalPrice"
              onChange={handleInputChange}
              className="mt-4 p-2 rounded-md text-md font-medium text-gray-700"
            >
              {sellForm.price * sellForm.quantity
                ? sellForm.price * sellForm.quantity
                : ""}
            </p>

            <label className="block text-gray-600 font-semibold mb-2">
              Final Price
            </label>
            <input
              type="number"
              placeholder="Final Price"
              value={sellForm.finalPrice}
              name="finalPrice"
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

            <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200 cursor-pointer">
              Submit
            </button>
          </form>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
    </>
  );
};

export default Sell;