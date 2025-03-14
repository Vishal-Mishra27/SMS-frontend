import React, { useState, useEffect } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { Menu, X, LayoutDashboard, Users, Package, ShoppingCart, Receipt, LogOut } from 'lucide-react';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Vender() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [VenderDashboard, setVenderDashboard] = useState(false);
  const [AllProduct, setAllProduct] = useState(false);
  const [hoveredButtonIndex, setHoveredButtonIndex] = useState(null);
 
  const [venderForm, SetVenderForm] = useState({ name: "", mobile: "" });
  const [addVender, setAddvender] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // New State for search input

  const handleInputChange = (e) => {
    SetVenderForm({ ...venderForm, [e.target.name]: e.target.value });
  };


  //post
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://sms-backend-wfdy.onrender.com/api/addNewVender", venderForm);
      setVenderDashboard(false);
      SetVenderForm({ name: "", mobile: "" });
      // alert("Vender Added Successfully...!");
            toast.success("Vender Added Successfully");
      fetchVender();
    } catch (error) {
      console.error(error);
    }
  };


  //get
  const fetchVender = async () => {
    try {
      const res = await axios.get("https://sms-backend-wfdy.onrender.com/api/addNewVender");
      console.log(res.data.message.length)
      console.log(res.data.message)
      setAddvender(res.data.message);
      setAllProduct(true);
      // setVenderDashboard(true)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVender();
  }, []);

  //delete
  const handleDelete = async (id) => {
    await axios.delete(`https://sms-backend-wfdy.onrender.com/api/DeleteVender${id}`);
    fetchVender();
  };

  const navigate = useNavigate();
  // const buttons = ["Vender", "Product", "All Product", "Sell", "All Sell", "Bill", "Logout"];
  const userName = "Nishant";

  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Filter venders based on search term
  const filteredVenders = addVender.filter((vender) =>
    vender.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
    const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = addVender.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(addVender.length / itemsPerPage);

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

    const [currentId, setCurrentId] = useState("");
    const [isEditMode,setIsEditMode] =useState("")
    const [getAllProduct,setgetAllProduct ]=useState("")
      const [ProductDetails, setProductDetails] = useState({
        name: "",
        mobile: ""
      });
    const handleEdit = (id) => {
      const productToEdit = addVender.find((product) => product._id === id);
      if (productToEdit) {
        setProductDetails({
          name: productToEdit.name,
          mobile: productToEdit.mobile,
        });
        setIsEditMode(true);
        setCurrentId(id);
      }
    };

     const handleSaveChanges = async (e, id) => {
       e.preventDefault();
       try {
         console.log("ProductDetails11: ", venderForm);
         console.log("userid: ", currentId);
         const res = await axios.put(
           ` https://sms-backend-wfdy.onrender.com/api/editvender/api/editVender/${currentId}`,
           venderForm
         );
         console.log(res);
         setIsEditMode(false);
      SetVenderForm({ name: "", mobile: "" });
        fetchVender()
         toast.success("Vender Edited Successfully");
       } catch (error) {
         console.error(error);
       }
     };

  return (
    <>
      <div className="flex h-screen">
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

        <div className="flex-1 flex flex-col overflow-x-auto max-w-full p-4 pl-[66px] sm:pl-0  md:pl-[66px] lg:pl-0">
          {/* Navbar with Search Input */}
          <div className="flex justify-between items-center bg-gray-100 p-4 shadow-md">
            <input
              type="text"
              placeholder="Search Vender..."
              className="w-1/2 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="font-semibold">Welcome, {userName}</div>
          </div>
          <div className="p-6 flex justify-center">
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition cursor-pointer"
              onClick={() => setVenderDashboard(true)}
            >
              Add Vender
            </button>
          </div>
          {VenderDashboard && (
            <form onSubmit={handleSubmit}>
              <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 backdrop-blur-sm">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                  <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 cursor-pointer"
                    onClick={() => setVenderDashboard(false)}
                  >
                    <X size={24} />
                  </button>

                  <h2 className="text-lg font-bold mb-4">Add New Vender</h2>

                  <label className="block text-gray-700 font-semibold mb-2">
                    Vender Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Name"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                    value={venderForm.name}
                    name="name"
                    onChange={handleInputChange}
                  />

                  <label className="block text-gray-700 font-semibold mb-2">
                    Mobile No.
                  </label>
                  <input
                    type="number"
                    placeholder="Enter Mobile No."
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                    value={venderForm.mobile}
                    name="mobile"
                    onChange={handleInputChange}
                  />

                  <div className="flex justify-center space-x-4">
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition cursor-pointer"
                      onClick={() => setVenderDashboard(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
          {/* Display Filtered Venders */}
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
                      Vender Mobile No.
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
                        {item.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-700">
                        {item.mobile}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 flex gap-5 items-center justify-center">
                        <button
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>

                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer"
                          onClick={() => handleEdit(item._id)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="p-6">
            <Outlet />
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
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
                    <input
                      type="text"
                      placeholder="Enter Name"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                      value={venderForm.name}
                      name="name"
                      onChange={handleInputChange}
                    />

                    <label className="block text-gray-700 font-semibold mb-2">
                      Mobile No.
                    </label>
                    <input
                      type="number"
                      placeholder="Enter Mobile No."
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                      value={venderForm.mobile}
                      name="mobile"
                      onChange={handleInputChange}
                    />

                    <div className="flex justify-center space-x-4">
                      <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition cursor-pointer"
                        onClick={(e) => handleSaveChanges(e)}
                      >
                        Save Changes
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
        </div>
      </div>
    </>
  );
}

export default Vender;