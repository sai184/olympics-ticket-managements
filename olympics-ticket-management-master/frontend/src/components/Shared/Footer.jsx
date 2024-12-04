const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <div className="text-yellow-400 text-3xl font-bold">
            Ticket Bookings
          </div>
          <ul className="list-none text-[12px] py-2">
            <li>
              <a href="#" className="hover:text-gray-400">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-400">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-400">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-400">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-400">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-400">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
        <div className="mb-4 md:mb-0">
          <h3 className="font-bold text-sm mb-2">Help</h3>
          <ul className="list-none text-[12px] py-1">
            <li>
              <a href="#" className="hover:text-gray-400">
                Account Support
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-400">
                Listing Events
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-400">
                Event Ticketing
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-400">
                Ticket Purchase Terms & Conditions
              </a>
            </li>
          </ul>
        </div>
        <div className="mb-4 md:mb-0">
          <h3 className="font-bold text-sm mb-2">Categories</h3>
          <ul className="list-none text-[12px] py-1">
            <li>
              <a href="#" className="hover:text-gray-400">
                {" "}
                Sports
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-400">
                Concerts
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-400">
                Theater
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-400">
                Festivals
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center mt-4 border-t border-gray-400 pt-4 text-[14px]">
        <p>&copy; 2024 Olympics Ticketing Systems. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
