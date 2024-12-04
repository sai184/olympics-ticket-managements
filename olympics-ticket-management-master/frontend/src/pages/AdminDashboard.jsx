import { useContext, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { StoreContext } from "../context/StoreContext";
import { assets } from "../assets/assets";
import AddEventDialog from "@/components/AddEventDialog";

const AdminDashboard = () => {
  const [reportData, setReportData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTicketsSold, setTotalTicketsSold] = useState(0);
  const { backendUrl, token } = useContext(StoreContext);

  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);

  const handleAddEventClick = () => {
    setIsAddEventDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddEventDialogOpen(false);
  };

  // Fetch report data from the API
  useEffect(() => {
    fetch(`${backendUrl}/api/admin/reports/sold-tickets`, {
      method: "GET",
      headers: { token: token },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setReportData(data.report);
          setTotalRevenue(data.totalRevenue);
          setTotalTicketsSold(data.totalTicketsSold);
        }
      })
      .catch((err) => console.error("Error fetching report data:", err));
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Dashboard Header */}
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      <div
        className="flex items-center justify-center border border-black rounded-md w-[130px] py-3 px-2 text-[12px] hover:bg-slate-300 cursor-pointer"
        onClick={handleAddEventClick}
      >
        <img src={assets.add} className="mr-2 w-4" /> Add Games
      </div>
      {/* Add Event Dialog */}
      <AddEventDialog
        isOpen={isAddEventDialogOpen}
        onClose={handleCloseDialog}
        backendUrl={backendUrl}
        token={token}
      />
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-4 bg-cyan-600 text-white rounded-lg shadow">
          <h2 className="text-lg font-medium">Total Revenue</h2>
          <p className="text-2xl font-bold">${totalRevenue}</p>
        </div>
        <div className="p-4 bg-green-300 rounded-lg shadow text-black">
          <h2 className="text-lg font-medium">Total Tickets Sold</h2>
          <p className="text-2xl font-bold">{totalTicketsSold}</p>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportData.map((event) => (
          <div
            key={event.event}
            className="p-4  bg-gradient-to-tr from-sky-300 via-fuchsia-300 to-purple-400 rounded-lg shadow-sm"
          >
            <h3 className="text-lg font-bold">{event.event}</h3>
            <p>{event.totalTicketsSold} Tickets Sold</p>
            <p className="mt-2 text-xl font-bold">
              Revenue ${event.totalRevenue}
            </p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Ticket Revenue Analysis</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={reportData} barSize={20}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#ddd"
            />
            <XAxis
              dataKey="event"
              axisLine={false}
              tick={{ fill: "#2b293d" }}
              tickLine={false}
              fontSize={14}
              interval={0}
            />
            <YAxis
              axisLine={false}
              tick={{ fill: "#2b293d" }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                borderColor: "lightgray",
              }}
            />
            <Legend
              align="left"
              verticalAlign="top"
              wrapperStyle={{
                paddingTop: "20px",
                paddingBottom: "40px",
              }}
            />
            <Bar
              dataKey="totalTicketsSold"
              fill="#2b293d"
              radius={[6, 6, 0, 0]}
              name="Total Tickets Sold"
            />
            <Bar
              dataKey="activeTickets"
              fill="#C3EBFA"
              radius={[6, 6, 0, 0]}
              name="Active Tickets"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
