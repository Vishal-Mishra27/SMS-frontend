import { useState, useEffect } from "react";
import { Menu, X, LayoutDashboard, Users, Package, ShoppingCart, Receipt, LogOut  } from 'lucide-react';
import { useNavigate, Outlet } from "react-router-dom";
import axios from "axios";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Product = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  // const [productForm, setProductForm] = useState(false);
  const [HoveredButtonIndex, setHoveredButtonIndex] = useState();
  const [ProductDetails, setProductDetails] = useState({
    venderName: "",
    productName: "",
    quantity: "",
    price: "",
    totalPrice: "",
  });
  const [addVender, setAddvender] = useState([]);
  const navigate = useNavigate();
  const buttons = [
    "Vender",
    "Product",
    "All Product",
    "Sell",
    "All Sell",
    // "Bill",
    "Logout",
  ];

  const userName = "Nishant";

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

  }
  const fetchVender = async () => {
    try {
      const res = await axios.get("https://sms-backend-wfdy.onrender.com/api/addNewVender");
      console.log(res.data.message);
      setAddvender(res.data.message);
    } catch (error) {
      console.error("error is : ", error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 768);
    };
    fetchVender();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("i am submitted");
    console.log("ProductDetails: ", ProductDetails);
    try {
      const res = await axios.post(
        "https://sms-backend-wfdy.onrender.com/api/product/api/postProduct",
        ProductDetails
      );
      console.log(res.data);
      // setProductForm(false)
      setProductDetails({
        venderName: "",
        productName: "",
        quantity: "",
        price: "",
        totalPrice: "",
      })
      toast.success("Product Added Successfully");
    } catch (error) {
      console.error("error is : ", error);
    }
  };

  const handleInputChange = (e) => {
    setProductDetails({ ...ProductDetails, [e.target.name]: e.target.value });
    console.log(ProductDetails);
  };

  useEffect(() => {
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      totalPrice:
        prevDetails.price && prevDetails.quantity
          ? prevDetails.price * prevDetails.quantity
          : "",
    }));
  }, [ProductDetails.price, ProductDetails.quantity]);


  return (
    <div className="flex h-screen">
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
        <div className="flex justify-between items-center bg-gray-100 p-4 shadow-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-1/2 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="font-semibold">Welcome, {userName}</div>
        </div>

        {/* Product Dashboard  */}
        <div className="flex md:items-center justify-center md:max-h-screen p-4  flex-col">
          {/* <h2 className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition">
            Add Product
          </h2> */}

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg bg-white p-4 rounded-lg shadow-lg"
          >
            <div className="bg-white p-6 rounded-lg max-w-md relative">
              <h2 className="md:text-lg font-bold mb-4 text-center">
                Add New Product
              </h2>
              <label className="block text-gray-700 font-semibold mb-2">
                Vender Name
              </label>
              <select
                type="string"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                value={ProductDetails.venderName}
                name="venderName"
                onChange={handleInputChange}
              >
                <option value="">Select Vender</option>
                {addVender.map((vender) => (
                  <option key={vender._id} value={vender.name}>
                    {vender.name}
                  </option>
                ))}
              </select>
              <label className="block text-gray-700 font-semibold mb-2">
                Product Name
              </label>
              <input
                type="string"
                placeholder="Product Name"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                value={ProductDetails.productName}
                name="productName"
                onChange={handleInputChange}
              />
              <label className="block text-gray-700 font-semibold mb-2">
                Quantity
              </label>
              <input
                type="number"
                placeholder="No. of Quantity"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                value={ProductDetails.quantity}
                name="quantity"
                onChange={handleInputChange}
              />
              <label className="block text-gray-700 font-semibold mb-2">
                Price
              </label>
              <input
                type="number"
                placeholder="Price/Item"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                value={ProductDetails.price}
                name="price"
                onChange={handleInputChange}
              />
              <label className="mt-4 p-2 bg-blue-100 rounded-md">
                Total Price
              </label>
              <p
                className="mt-4 p-2 rounded-md text-md font-medium text-gray-700"
                type="number"
                value={ProductDetails.totalPrice}
                name="totalPrice"
                onChange={handleInputChange}
              >
                {ProductDetails.price * ProductDetails.quantity
                  ? ProductDetails.price * ProductDetails.quantity
                  : ""}
              </p>
              {/* <input placeholder="Total Price" /> */}
              <div className="flex justify-center space-x-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default Product;
