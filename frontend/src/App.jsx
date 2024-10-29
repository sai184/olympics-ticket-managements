import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VisitorLayout from "./components/Layout/VisitorLayout";
import AdminLayout from "./components/Layout/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import VisitorDashboard from "./pages/VisitorDashboard";
import EventBrowse from "./pages/EventBrowse";
import Ticket from "./pages/Ticket";
import Auth from "./pages/Auth";
import AdminPrivateRoute from "./utils/AdminPrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VisitorProfile from "./pages/VisitorProfile";
import AllTickets from "./pages/AllTickets";
import AllEvents from "./pages/AllEvents";

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Visitor Routes */}
        <Route element={<VisitorLayout />}>
          <Route path="/user-dashboard" element={<VisitorDashboard />} />
          <Route path="/events" element={<EventBrowse />} />
          <Route path="/history" element={<Ticket />} />
          <Route path="/profile" element={<VisitorProfile />} />
        </Route>

        {/* Admin Routes - Protected */}
        <Route
          element={
            <AdminPrivateRoute>
              <AdminLayout />
            </AdminPrivateRoute>
          }
        >
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/all-tickets" element={<AllTickets />} />
          <Route path="/all-events" element={<AllEvents />} />
        </Route>

        {/* Auth Route */}
        <Route path="/" element={<Auth />} />
      </Routes>
    </Router>
  );
}

export default App;
