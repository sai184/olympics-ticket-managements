// import { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { StoreContext } from "../context/StoreContext";

// const EventPage = () => {
//   const { backendUrl } = useContext(StoreContext);
//   const [events, setEvents] = useState([]);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const response = await axios.get(`${backendUrl}/api/event/`);
//         if (response.data.events) {
//           setEvents(response.data.events); // Update state with fetched events
//         } else {
//           console.error("No events found.");
//         }
//       } catch (error) {
//         console.error("Error fetching events:", error);
//       }
//     };

//     fetchEvents();
//   }, []);

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">All Events</h1>

//       {events.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {events.map((event) => (
//             <div
//               key={event._id}
//               className="bg-white shadow-lg rounded-lg p-4 border border-gray-200"
//             >
//               <h2 className="text-lg font-bold mb-2">{event.name}</h2>
//               <p className="text-sm text-gray-600 mb-1">
//                 Date: {new Date(event.date).toLocaleDateString()}
//               </p>
//               <p className="text-sm text-gray-600 mb-1">Time: {event.time}</p>
//               <p className="text-sm text-gray-600 mb-1">Venue: {event.venue}</p>
//               <p className="text-sm text-gray-600 mb-1">
//                 Total Tickets: {event.totalTickets}
//               </p>
//               <p className="text-sm text-gray-600 mb-1">
//                 Available Tickets: {event.availableTickets}
//               </p>
//               <p className="text-sm text-gray-600 mb-1">
//                 Price: ${event.price}
//               </p>
//               <p className="text-sm text-gray-600 mb-1">
//                 Status:{" "}
//                 <span
//                   className={`font-bold ${
//                     event.status === "upcoming"
//                       ? "text-blue-500"
//                       : event.status === "completed"
//                       ? "text-green-500"
//                       : "text-red-500"
//                   }`}
//                 >
//                   {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
//                 </span>
//               </p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No events found.</p>
//       )}
//     </div>
//   );
// };

// export default EventPage;

import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const EventPage = () => {
  const { backendUrl, token } = useContext(StoreContext);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/event/`);
      if (response.data.events) {
        setEvents(response.data.events);
      } else {
        console.error("No events found.");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  //   const handleRemoveTickets = async (eventId) => {
  //     const ticketsToRemove = prompt(
  //       "Enter the number of tickets to remove (only numbers):"
  //     );

  //     // Validate input for numbers only
  //     if (ticketsToRemove && /^\d+$/.test(ticketsToRemove)) {
  //       console.log("i love Token", token);

  //       try {
  //         const response = await axios.delete(
  //           `${backendUrl}/api/event/tickets/${eventId}/remove`,
  //           {
  //             headers: { token: token },
  //           },
  //           {
  //             data: { ticketsToRemove: ticketsToRemove },
  //           }
  //         );

  //         if (response.data.success) {
  //           alert("Tickets removed successfully!");
  //           fetchEvents(); // Re-fetch events to update the list
  //         }
  //       } catch (error) {
  //         console.error("Error removing tickets:", error);
  //         alert("Failed to remove tickets. Please try again.");
  //       }
  //     } else {
  //       alert("Please enter a valid number.");
  //     }
  //   };

  const handleRemoveTickets = async (eventId) => {
    const ticketsToRemove = prompt(
      "Enter the number of tickets to remove (only numbers):"
    );

    // Validate input for numbers only
    if (ticketsToRemove && /^\d+$/.test(ticketsToRemove)) {
      console.log("Token:", token); // Logging token to check if it's available

      try {
        const response = await axios({
          method: "delete",
          url: `${backendUrl}/api/event/tickets/${eventId}/remove`,
          headers: {
            token: token, // Pass the token as a header
          },
          data: {
            ticketsToRemove: ticketsToRemove, // Pass the ticketsToRemove in the request body
          },
        });

        if (response.data.success) {
          toast.success("Tickets removed successfully!");
          fetchEvents(); // Re-fetch events to update the list with updated tickets
        }
      } catch (error) {
        console.error("Error removing tickets:", error);
        alert("Failed to remove tickets. Please try again.");
      }
    } else {
      alert("Please enter a valid number.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white shadow-lg rounded-lg p-4 border border-gray-200"
            >
              <h2 className="text-lg font-bold mb-2">{event.name}</h2>
              <p className="text-sm text-gray-600 mb-1">
                Date: {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 mb-1">Time: {event.time}</p>
              <p className="text-sm text-gray-600 mb-1">Venue: {event.venue}</p>
              <p className="text-sm text-gray-600 mb-1">
                Total Tickets: {event.totalTickets}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Available Tickets: {event.availableTickets}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Price: ${event.price}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Status:{" "}
                <span
                  className={`font-bold ${
                    event.status === "upcoming"
                      ? "text-blue-500"
                      : event.status === "completed"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </p>
              <button
                onClick={() => handleRemoveTickets(event._id)}
                className="mt-2 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
              >
                Remove Ticket
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No events found.</p>
      )}
    </div>
  );
};

export default EventPage;
