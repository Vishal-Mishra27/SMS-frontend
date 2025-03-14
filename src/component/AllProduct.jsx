import { useState, useEffect } from "react";
import { Menu, X, LayoutDashboard, Users, Package, ShoppingCart, Receipt, LogOut } from 'lucide-react';
import { useNavigate, Outlet } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AllProduct = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [AllProduct, setAllProduct] = useState(false);
  const [getAllProduct, setgetAllProduct] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
  // const [editData, seteditData] = useState([])
  const [addVender, setAddvender] = useState([]);

  const [ProductDetails, setProductDetails] = useState({
    venderName: "",
    productName: "",
    quantity: "",
    price: "",
    totalPrice: "",
  });
  const [hoveredButtonIndex, setHoveredButtonIndex] = useState(null);
  const navigate = useNavigate();

  const userName = "Nishant";
  
  const fetchAllProduct = async () => {
    try {
      const response = await axios.get(
        "https://sms-backend-wfdy.onrender.com/api/product/api/getProduct"
      );
      console.log(response.data.message);
      setgetAllProduct(response.data.message);
      setAllProduct(true);
    } catch (error) {
      console.error("error is: ", error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 768);
    };
    fetchAllProduct();
    fetchVender();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  //   delete product

  const handleDelete = async (id) => {
    await axios.delete(
      `  https://sms-backend-wfdy.onrender.com/deleteProduct/deleteProduct${id}`
    );
    fetchAllProduct();
    toast.success("Product Delete Successfully");
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

  const handleEdit = (id) => {
    const productToEdit = getAllProduct.find((product) => product._id === id);
    if (productToEdit) {
      setProductDetails({
        venderName: productToEdit.venderName,
        productName: productToEdit.productName,
        quantity: productToEdit.quantity,
        price: productToEdit.price,
        totalPrice: productToEdit.totalPrice,
      });
      setIsEditMode(true);
      setCurrentId(id);
    }
  };

  const handleSaveChanges = async (e, id) => {
    e.preventDefault();
    try {
      console.log("ProductDetails: ", ProductDetails);
      console.log("userid: ", currentId);
      const res = await axios.put(
        `https://sms-backend-wfdy.onrender.com/api/editProduct/api/editProductitem/${currentId}`,
        ProductDetails
      );
      console.log(res);
      setIsEditMode(false);
      fetchAllProduct();
      toast.success("Product Edited Successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const fetchVender = async () => {
    try {
      const res = await axios.get(
        "https://sms-backend-wfdy.onrender.com/api/addNewVender"
      );
      console.log(res.data.message);
      setAddvender(res.data.message);
    } catch (error) {
      console.error("error is : ", error);
    }
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = getAllProduct.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(getAllProduct.length / itemsPerPage);


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
        <div
          className={`${
            sidebarOpen ? "w-64" : "w-16"
          } bg-gray-800 text-white p-4 fixed top-0 left-0 h-full z-20 md:relative md:flex md:flex-col}`}
        >
          <button onClick={toggleSidebar} className="mb-6 md:hidden">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          {sidebarOpen && (
            <nav className="space-y-4">
              {sidebarButtons.map((btn, i) => (
                <a
                  key={btn.name}
                  href="#"
                  className="flex items-justify space-x-2 hover:bg-gray-700 p-2 rounded "
                  onClick={() => handleButtonClick(btn.name)}
                  onMouseEnter={() => setHoveredButtonIndex(i)}
                  onMouseLeave={() => setHoveredButtonIndex(null)}
                >
                  {btn.icon}
                  <span>{btn.name}</span>
                </a>
              ))}
            </nav>
          )}
        </div>

        {/* --------------------------------------------------------------------- */}
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-x-auto max-w-full p-4 pl-[66px] sm:pl-0  md:pl-[66px] lg:pl-0">
          <div className="flex justify-between items-center bg-gray-100 p-4 shadow-md">
            <input
              type="text"
              placeholder="Search..."
              className="w-1/2 p-2 rounded border border-gray-300  focus:ring-2 focus:ring-blue-400"
            />
            <div className="font-semibold">Welcome, {userName}</div>
          </div>
          {/* Dashboard Buttons */}
          {/* --------------------------------------------------------------------------------------------- */}
          {/* <div className={flex-1 flex flex-col ${sidebarOpen && window.innerWidth <= 768 ? 'ml-0' : 'ml-16 md:ml-0'}}> */}
          {/* <div className="flex justify-between items-center bg-gray-100 p-4 shadow-md">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-1/2 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" 
          />
          <div className="font-semibold">Welcome, {userName}</div>
        </div> */}

          {/* --------------------------------------------------------------------------------------------- */}
          <div className="p-6 flex justify-center">
            <h2 className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-lg font-bold text-xl transition">
              All Product
            </h2>
          </div>
          {AllProduct && (
            <div className="overflow-x-auto max-w-full p-4 pl-[1px] sm:pl-0  md:pl-[1px] lg:pl-0">
              <table className="min-w-full border border-gray-300 shadow-md rounded-lg bg-white">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">#</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Vender Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Product Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Quantity
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Price/Item
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Total Price
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => (
                    <tr key={index} className="text-center hover:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-700">
                        {item.venderName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-700">
                        {item.productName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-700">
                        {item.quantity}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-700">
                        {item.price}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-700">
                        {item.totalPrice}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 flex gap-5 items-center justify-center">
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer"
                          onClick={() => handleEdit(item._id)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* ------------------------------------------------------------- */}
          {isEditMode && (
            <div className="fixed flex items-center justify-center  sm:pl-0  md:pl-[60px] lg:pl-0 lg:mt-16 md:ml-auto">
              <div className="flex md:items-center justify-center md:max-h-screen p-4  flex-col ">
                <form
                  // onSubmit={handleSubmit}
                  className="w-full max-w-lg bg-white p-4 rounded-lg shadow-lg"
                >
                  <div className="bg-white p-6 rounded-lg max-w-md relative">
                    <h2 className="md:text-lg font-bold mb-4 text-center">
                      Edit Product
                    </h2>
                    <button
                      onClick={() => {
                        setIsEditMode(false);
                      }}
                      className="absolute top-4 right-4 mb-6 text-right cursor-pointer"
                    >
                      <X size={24} />
                    </button>
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
                      type="number"
                      placeholder="Total Price"
                      className="mt-4 p-2 rounded-md text-md font-medium text-gray-700"
                      value={ProductDetails.totalPrice}
                      name="totalPrice"
                      onChange={handleInputChange}
                    >
                      {ProductDetails.price * ProductDetails.quantity
                        ? ProductDetails.price * ProductDetails.quantity
                        : ""}
                    </p>

                    <div className="flex justify-center space-x-4">
                      <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition cursor-pointer"
                        onClick={(e) => handleSaveChanges(e)}
                      >
                        Save Chnages
                      </button>
                      <button
                        // type="submit"
                        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition cursor-pointer"
                        onClick={() => {
                          setIsEditMode(false);
                        }}
                      >
                        Cancle
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* ------------------------------------------------------------------------------------- */}
          {/* Page Content */}
          <div className="p-6">
            <Outlet />
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-4 py-2 bg-gray-300 rounded-lg "
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300"
                  } rounded-lg`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </div>
    </>
  );
};

export default AllProduct;