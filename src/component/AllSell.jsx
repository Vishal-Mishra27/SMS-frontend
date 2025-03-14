import { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard, Users, Package, ShoppingCart, Receipt, LogOut  } from 'lucide-react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const AllSell = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [getSell, setGetSell] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);

  const itemsPerPage = 10;

  const navigate = useNavigate();
  const userName = "Nishant";

  

  // Fetching sell data
  const fetchSellData = async () => {
    try {
      const response = await axios.get(
        "https://sms-backend-wfdy.onrender.com/api/sell/api/getsellitem"
      );
      setGetSell(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth > 768);
    fetchSellData();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://sms-backend-wfdy.onrender.com/api/sell/api/deletesellitem/${id}`
      );
      fetchSellData();
    } catch (error) {
      console.log(error);
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(getSell.length / itemsPerPage);
  const displayedItems = getSell.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

    const [currentId, setCurrentId] = useState("");

  const [sellForm, setSellForm] = useState({
    customerName: "",
    productName: "",
    quantity: "",
    price: "",
    totalPrice: "",
    finalPrice: "",
  });

  const handleInputChange = (e) => {
    setSellForm({ ...sellForm, [e.target.name]: e.target.value });
    console.log(sellForm);
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

  const handleEdit = (id) => {
    const productToEdit = getSell.find((product) => product._id === id);
    if (productToEdit) {
      setSellForm({
        customerName: productToEdit.customerName,
        productName: productToEdit.productName,
        quantity: productToEdit.quantity,
        price: productToEdit.price,
        totalPrice: productToEdit.totalPrice,
        finalPrice: productToEdit.finalPrice,
      });
      setIsEditMode(true);
      setCurrentId(id);
    }
  };

  const handleSaveChanges = async (e, id) => {
    e.preventDefault();
    try {
      console.log("Sell Details: ", sellForm);
      console.log("userid: ", currentId);
      const res = await axios.put(
        `https://sms-backend-wfdy.onrender.com/api/sell/api/editsellitem/${currentId}`,
        sellForm
      );
      console.log(res);
      setIsEditMode(false);
      fetchSellData();
      toast.success("Sell Details Edited Successfully");
    } catch (error) {
      console.error(error);
    }
  };
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);


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

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-x-auto max-w-full p-4 pl-[66px] sm:pl-0  md:pl-[66px] lg:pl-0">
          <div className="flex justify-between items-center bg-gray-100 p-4 shadow-md">
            <input
              type="text"
              placeholder="Search..."
              className="w-1/2 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400"
            />
            <div className="font-semibold">Welcome, {userName}</div>
          </div>

          <div className="p-6 flex justify-center">
            <h2 className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-lg font-bold text-xl transition">
              All Sell
            </h2>
          </div>

          <div className="overflow-x-auto max-w-full p-4">
            {/* <div className="w-full max-w-5xl overflow-x-auto"> */}
            <table className="min-w-full  border border-gray-300 shadow-md rounded-lg bg-white">
              <thead>
                <tr>
                  <th className="border px-4 py-2">#</th>
                  <th className="border px-4 py-2">Customer Name</th>
                  <th className="border px-4 py-2">Product Name</th>
                  <th className="border px-4 py-2">Quantity</th>
                  <th className="border px-4 py-2">Price</th>
                  <th className="border px-4 py-2">Total Price</th>
                  <th className="border px-4 py-2">Final Price</th>
                  <th className="border px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedItems.map((item, index) => (
                  <tr key={index} className="text-center hover:bg-gray-100">
                    <td className="border px-4 py-2 border-gray-300">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="border  border-gray-300 px-4 py-2">
                      {item.customerName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.productName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.price}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.totalPrice}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.finalPrice}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 flex gap-2 justify-center">
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        onClick={() => handleEdit(item._id)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div />
            <div className="p-6">
              <Outlet />
            </div>
            {/* ---------------------------------------------- */}
            {isEditMode && (
              <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 backdrop-blur-sm pl-[60px] sm:pl-0 md:pl-[60px] lg:pl-0 overflow-hidden">
                <div className="flex md:items-center justify-center p-4 flex-col w-full max-w-lg">
                  <form className="w-full max-w-lg bg-white p-4 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
                    <div className="bg-white p-6 rounded-lg relative">
                      <h2 className="md:text-lg font-bold mb-4 text-center">
                        Edit Sell Product
                      </h2>
                      <button
                        onClick={() => {
                          setIsEditMode(false);
                        }}
                        className="absolute top-4 right-4 mb-6 text-right cursor-pointer"
                      >
                        <X size={24} />
                      </button>
                      <label className="block text-gray-600 font-semibold mb-2">
                        Customer Name
                      </label>
                      <input
                        type="text"
                        placeholder="Customer Name"
                        value={sellForm.customerName}
                        name="customerName"
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
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
                        {getSell.map((product) => (
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
                      />

                      <label className="mt-4 p-2 bg-blue-100 rounded-md">
                        Total Price
                      </label>
                      <p className="mt-4 p-2 rounded-md text-md font-medium text-gray-700">
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

                      <button
                        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200 cursor-pointer"
                        onClick={handleSaveChanges}
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ---------------------------------------------- */}
            {/* </div> */}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 space-x-2 ">
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
        </div>
      </div>
    </>
  );
};

export default AllSell;