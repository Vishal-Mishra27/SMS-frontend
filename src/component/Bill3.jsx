import { useState, useEffect } from "react";
import { Menu, X, LayoutDashboard, Users, Package, ShoppingCart, Receipt, LogOut } from 'lucide-react';
import { useNavigate, Outlet } from "react-router-dom";
import axios from "axios";
import { FaCalculator, FaInfoCircle, FaPrint, FaTrash } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";

const Bill3 = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [hoveredButtonIndex, setHoveredButtonIndex] = useState(null);
  const [getProduct, setGetProduct] = useState([]);
  const [getSell, setGetSell] = useState([]);

  const [sellForm, setSellForm] = useState({
    customerName: "",
    productName: "",
    quantity: "",
    price: "",
    totalPrice: "",
    finalPrice: "",
    sgstRate: 9,
    cgstRate: 9,
    discountType: "percentage",
    discountValue: 0,
  });
  const navigate = useNavigate();
  const buttons = [
    "Vender",
    "Product",
    "All Product",
    "Sell",
    "All Sell",
    "Bill",
    "Logout",
  ];
  const userName = "Ayush";

  // const handleButtonClick = (btn) => {
  //   if (btn === "Vender") navigate("/vender");
  //   else if (btn === "Product") navigate("/product");
  //   else if (btn === "All Product") navigate("/allproduct");
  //   else if (btn === "Sell") navigate("/sell");
  //   else if (btn === "All Sell") {
  //     navigate("/allsell");
  //   } else if (btn === "Bill") {
  //     navigate("/bill");
  //   } else if (btn === "Logout") {
  //     navigate("/");
  //   }
  // };

  // Fetch Product Data
  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        "https://product-management-system-mjfo.onrender.com/api/product/api/getProduct"
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
    fetchSellData();


    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "productName") {
      // for automitacily generiting price
      const selectedProduct = getProduct.find(
        (product) => product.productName === value
      );
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("i am submitted");
    console.log(sellForm);
  };


  const [taxRates, setTaxRates] = useState({ sgst: 0, cgst: 0, totalTax: 0 });
const [amount, setAmount] = useState(sellForm.totalPrice || 0);

useEffect(() => {
  setAmount(sellForm.totalPrice || 0);
}, [sellForm.totalPrice]);

  const handleTaxChange = (e) => {
    const { name, value } = e.target;
    const taxValue = parseFloat(value) || 0;

    const updatedTaxRates = { ...taxRates, [name]: taxValue };
    updatedTaxRates.totalTax =
      (amount * (updatedTaxRates.sgst + updatedTaxRates.cgst)) / 100;
    setTaxRates(updatedTaxRates);
  };

  const handleAmountChange = (e) => {
    const newAmount = parseFloat(e.target.value) || 0;
    setAmount(newAmount);
    setTaxRates((prev) => ({
      ...prev,
      totalTax: (newAmount * (prev.sgst + prev.cgst)) / 100,
    }));
  };


  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState(0);
  const [finalPrice, setFinalPrice] = useState(amount);

  useEffect(() => {
    let discountedPrice = amount;

    if (discountType === "percentage") {
      discountedPrice = amount - (amount * discountValue) / 100;
    } else if (discountType === "fixed") {
      discountedPrice = amount - discountValue;
    }

    setFinalPrice(Math.max(discountedPrice, 0)); // Ensure the price doesn't go negative
  }, [discountType, discountValue]);

const grandTotal = () => {
  return finalPrice + taxRates.totalTax;
};

useEffect(() => {
  grandTotal();
  console.log("grand total: ",grandTotal())
}, [finalPrice.toFixed(2)]);
    const fetchSellData = async () => {
      try {
        const response = await axios.get(
          "https://product-management-system-mjfo.onrender.com/api/sell/api/getsellitem"
        );
        console.log(response.data.message);
        setGetSell(response.data.message);
      } catch (error) {
        console.log(error);
      }
    };


    // const downloadInvoice = () => {
    //   const invoiceData = `
    // Customer Name: ${sellForm.customerName}
    // ---------------------------------
    // Products:${sellForm.productName}
    // ---------------------------------
    // Quantity:${sellForm.quantity}
    // ---------------------------------
    // Price:${sellForm.price}
    // ---------------------------------
    // Total Price: ${amount.toFixed(2)}
    // Discount Applied (${discountType}): ${discountValue}
    // Discounted Price: ${finalPrice.toFixed(2)}
    // GST (SGST + CGST): ${taxRates.totalTax.toFixed(2)}
    // ---------------------------------
    // Grand Total: ${grandTotal().toFixed(2)}
    // `;

    //   const blob = new Blob([invoiceData], { type: "text/plain" });
    //   const link = document.createElement("a");
    //   link.href = URL.createObjectURL(blob);
    //   link.download = Invoice_${sellForm.customerName}.txt;
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    // };

    const downloadInvoice = () => {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(18);
      doc.text("Invoice", 90, 10);

      // Customer Details
      doc.setFontSize(12);
      doc.text(`Customer Name: ${sellForm.customerName}`, 14, 20);

      // Product Table
      const tableColumn = ["Product Name", "Quantity", "Unit Price", "Total"];
const tableRows = [
  [
    sellForm.productName,
    sellForm.quantity,
    sellForm.price,
    sellForm.totalPrice,
  ],
];

      
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 30,
  });

      // Summary
      let yPosition = doc.lastAutoTable.finalY + 10;; // Get last position
      doc.text(`Total Price: ${amount.toFixed(2)}`, 14, yPosition);
      doc.text(
       ` Discount Applied (${discountType}): ${discountValue}`,
        14,
        yPosition + 10
      );
      doc.text(
       ` Discounted Price: ${finalPrice.toFixed(2)}`,
        14,
        yPosition + 20
      );
      doc.text(
        `GST (SGST + CGST): ${taxRates.totalTax.toFixed(2)}`,
        14,
        yPosition + 30
      );
      doc.text(`Grand Total: ${grandTotal().toFixed(2)}`, 14, yPosition + 40);

      // Save PDF
      doc.save(`Invoice_${sellForm.customerName}`.pdf);
    };

    const sidebarButtons = [
      { name: 'Dashboard', icon: <LayoutDashboard size={32} />, hideInMain: true },
      { name: 'Vender', icon: <Users size={32} /> },
      { name: 'Product', icon: <Package size={32} /> },
      { name: 'All Product', icon: <Package size={32} /> },
      { name: 'Sell', icon: <ShoppingCart size={32} /> },
      { name: 'All Sell', icon: <ShoppingCart size={32} /> },
      { name: 'Bill', icon: <Receipt size={32} /> },
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
      } else if (btn === "Bill") {
        navigate("/bill");
      } else if (btn === "Logout") {
        navigate("/");
      }
  
    };
  
    return (
      <>
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
        <div className="flex justify-between items-center gap-5 md:gap-0 bg-gray-100 p-4 shadow-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-1/2 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="font-semibold">Welcome, {userName}</div>
        </div>

        {/* Sell Dashboard */}
        <div className=" md:mt-64 flex md:items-center justify-center md:min-h-screen p-4">
          <form
            className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg"
            onSubmit={handleSubmit}
          >
            <h3 className="text-xl font-bold mb-6 text-black text-center">
              Billing
            </h3>
            {/* ------------------------------------------------------------------------------------------------------------------------------------------------- */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Customer Name
              </label>
              <select
                type="string"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                // value={sellForm.customerName}
                value={sellForm.customerName}
                name="customerName"
                // onChange={handleCustomerNameChange}
                onChange={handleInputChange}
              >
                {" "}
                <option value="">Select Customer</option>
                {getSell.map((Customer) => (
                  <option key={Customer._id} value={Customer.customerName}>
                    {Customer.customerName}
                  </option>
                ))}
              </select>
            </div>
            {/* ------------------------------------------------------------------------------------------------------------------------------------------------- */}

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
            {/* <input
              type="number"
              placeholder="Total Price"
              value={sellForm.totalPrice}
              name="totalPrice"
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            /> */}
            <p
              className="mt-4 p-2 rounded-md text-md font-medium text-gray-700"
              type="number"
              value={sellForm.totalPrice}
              name="totalPrice"
              onChange={handleInputChange}
            >
              {sellForm.price * sellForm.quantity
                ? sellForm.price * sellForm.quantity
                : ""}
            </p>
            {/* <label className="block text-gray-600 font-semibold mb-2">
              Final Price
            </label>
            <input
              type="number"
              placeholder="Final Price"
              value={sellForm.finalPrice}
              name="finalPrice"
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            /> */}

            {/* -----------------------------------------------------Tax Calculations------------------------------------------------- */}
            {/* <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Tax Calculations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SGST Rate (%)
                    <span className="ml-1 text-blue-600">
                      <FaInfoCircle />
                    </span>
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    CGST Rate (%)
                    <span className="ml-1 text-blue-600">
                      <FaInfoCircle />
                    </span>
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div> */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Tax Calculations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p>{sellForm.totalPrice}</p>
                </div> */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SGST Rate (%)
                    <span className="ml-1 text-blue-600">
                      <FaInfoCircle />
                    </span>
                  </label>
                  <input
                    type="number"
                    name="sgst"
                    value={taxRates.sgst}
                    onChange={handleTaxChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    CGST Rate (%)
                    <span className="ml-1 text-blue-600">
                      <FaInfoCircle />
                    </span>
                  </label>
                  <input
                    type="number"
                    name="cgst"
                    value={taxRates.cgst}
                    onChange={handleTaxChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4 p-2 bg-blue-100 rounded-md">
                <h3 className="text-md font-medium text-gray-700">
                  Total Tax: ₹{taxRates.totalTax.toFixed(2)}
                </h3>
              </div>
            </div>
            {/* ------------------------------------------------------------Discount------------------------------------------------------------------------------------------------------------------------ */}

            {/* ----------------------------------------------------------------------------------------------- */}
            {/* <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Discount
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Discount Type
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div> */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Discount
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Discount Type
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="mt-4 p-3 bg-white rounded-md shadow">
                <h3 className="text-md font-medium text-gray-700">
                  Final Price: ₹{finalPrice.toFixed(2)}
                </h3>
              </div>
            </div>

            {/* ------------------------------------summary report--------------------------------------------------------------------------------------------- */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Summary
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Price:</span>
                  <span>₹{amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST Amount:</span>
                  <span>₹{taxRates.totalTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>₹{finalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Grand Total:</span>
                  <span>₹{grandTotal()}</span>
                </div>
              </div>
            </div>
            {/* -------------------------------------------------------------------------------------------------------------------- */}
            <button
              onClick={downloadInvoice}
              // className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200 cursor-pointer"
            >
              Download Invoice
            </button>
          </form>
        </div>
        <div></div>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
    </>
  );
};

export default Bill3;