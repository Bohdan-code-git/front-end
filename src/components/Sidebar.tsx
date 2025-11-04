import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/Sidebar.css";
import Home from "../icons/Home.svg";
import New_reservation from "../icons/New_reservation.svg";
import My_reservations from "../icons/My_reservations.svg";
import Log_in from "../icons/Log_in.svg";
import { ReservationDialog } from "../components/ReservationDialog";


const Sidebar: React.FC = () => {

  const location = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleSave = (reservation: any) => {
    console.log("Reservation saved:", reservation);
    setIsDialogOpen(false); 
  };

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-logo">
          <h2>chico</h2>
          <p>- reservation service -</p>
        </div>

        <nav className="nav">
          <Link to="/" className={`nav-btn ${isActive("/") ? "active" : ""}`}>
            <img src={Home} alt="home" />
            Home page
          </Link>

          <button
            onClick={() => setIsDialogOpen(true)}
            className={`nav-btn ${isActive("/new-reservation") ? "active" : ""}`}
          >
            <img src={New_reservation} alt="new" />
            New reservation
          </button>

          <Link
            to="/my-reservations"
            className={`nav-btn ${isActive("/my-reservations") ? "active" : ""}`}
          >
            <img src={My_reservations} alt="my" />
            My reservations
          </Link>
        </nav>
      </div>

      <div className="sidebar-footer">
        <Link
          to="/auth"
          className={`nav-btn ${isActive("/auth") ? "active" : ""}`}
        >
          <img src={Log_in} alt="login" />
          Log in / Register
        </Link>
      </div>
      <ReservationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
      />
    </aside>
  );
};

export default Sidebar;
