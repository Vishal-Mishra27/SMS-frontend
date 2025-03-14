import { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard, Users, Package, ShoppingCart, Receipt, LogOut ,FileSliders } from 'lucide-react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [venderCount, setVenderCount] = useState(0);
  const [allProductCount, setAllProductCount] = useState(0);
  const [allSellCount, setAllSellCount] = useState(0);
  const navigate = useNavigate();

    const fetchVender = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/addNewVender");
        console.log(res.data.message.length);
    setVenderCount(res.data.message.length);
        // setVenderDashboard(true)
      } catch (error) {
        console.error(error);
      }
    };
     const fetchAllProduct = async () => {
       try {
         const response = await axios.get(
           "http://localhost:3000/api/product/api/getProduct"
         );
         console.log(response.data.message.length);
    setAllProductCount(response.data.message.length);
       } catch (error) {
         console.error("error is: ", error);
       }
     };
       const fetchSellData = async () => {
         try {
           const response = await axios.get(
             "http://localhost:3000/api/sell/api/getsellitem"
           );
              setAllSellCount(response.data.message.length);
         } catch (error) {
           console.log(error);
         }
       };
  
  useEffect(() => {
    // Fetch counts from backend (dummy example, replace with actual API call)
    fetchVender()
  fetchAllProduct();
  fetchSellData();
  }, []);

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
        if (btn === "Vender") {
          navigate("/vender");
        } else if (btn === "Product") {
          navigate("/product");
        } else if (btn === "All Product") {
          navigate("/allproduct");
        } else if (btn === "Sell") {
          navigate("/sell");
        } else if (btn === "All Sell") {
          navigate("/allsell");
        } 
        // else if (btn === "Bill")
        //    {
        //   navigate("/bill");
        // } 
        else if (btn === "Logout") {
          navigate("/");
        }
      };

  // const dashboardCards = sidebarButtons.filter(btn => !btn.hideInMain).map((btn, i) => ({
  //   name: btn.name,
  //   icon: btn.icon,
  //   count: btn.name === 'Vender' ? venderCount : btn.name === 'All Product' ? allProductCount : btn.name === 'All Sell' ? allSellCount : undefined
  // }));

  const dashboardCards = sidebarButtons
    .filter((btn) => !btn.hideInMain && btn.name !== "Logout") // Exclude 'Logout'
    .map((btn) => ({
      name: btn.name,
      icon: btn.icon,
      count:
        btn.name === "Vender"
          ? venderCount
          : btn.name === "All Product"
          ? allProductCount
          : btn.name === "All Sell"
          ? allSellCount
          : undefined,
    }));

  
  const colors = ['bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-rose-500'];

  const userName = 'Nishant';

  // const handleButtonClick = (btn) => {
  //   navigate(/${btn.toLowerCase().replace(' ', '')});
  // };
    useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
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
                onMouseEnter={() => setHoverdButtonIndex(i)}
                onMouseLeave={() => setHoverdButtonIndex(null)}
              >
                {btn.icon}
                <span>{btn.name}</span>
              </a>
            ))}
          </nav>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-x-auto max-w-full p-4 pl-[66px] sm:pl-0 md:pl-[66px] lg:pl-0">
        {/* Navbar */}
        <div className="flex justify-between items-center bg-gray-100 p-4 shadow-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-1/2 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="font-semibold">Welcome, {userName}</div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-4">
          {dashboardCards.map((btn, i) => (
            <div
              key={btn.name}
              className={`${colors[i]} text-white p-6 rounded-xl shadow-lg flex flex-col justify-between transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer w-full max-w-xs h-40`}
            >
              <div className="flex items-center justify-between w-full">
                <h2 className="text-lg font-semibold">{btn.name}</h2>
                <div className="text-4xl">{btn.icon}</div>
              </div>
              <p className="text-3xl font-bold text-center mt-2 flex-grow flex items-center justify-center">
                {btn.count !== undefined ? (
                  btn.count
                ) : (
                  <FileSliders size={32} />
                )}
              </p>
              <button
                className="bg-white text-black px-4 py-1 rounded-full shadow-md hover:bg-gray-200 transition w-full mt-auto"
                onClick={() => handleButtonClick(btn.name)}
              >
                {btn.name === "Logout" ? "Log Out" : "More Info"}
              </button>
            </div>
          ))}
        </div>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;