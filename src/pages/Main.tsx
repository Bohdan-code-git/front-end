import React from "react";
import Sidebar from "../components/Sidebar";
import "../css/Main.css";
import Restaurant from "../img/Restaurant.svg"
import Interior from "../img/Interior.svg"
import Address from "../icons/Address.svg"


const Main: React.FC = () => {
  return (
    <div className="main-container">
      <Sidebar />

      <main className="content">
        <section className="banner">
          <img
            src={Restaurant}
            alt="Restaurant"
            className="banner-image"
          />
          <div className="banner-text">
            <h1>Online restaurant reservation service</h1>
            <p>chico</p>
          </div>
        </section>

        <section className="info-section">
          <div className="info-card">
            <div className="info-card-1">
                <h2>300+</h2>
                <p>happy clients</p>
            </div>
            <div className="info-card-2">
                <h2>2+</h2>
                <p>years helping to make reservations in your favorite restaurants</p>
            </div>
            
          </div>

          <div className="info-card about">
            <h3>
              Who <span>We</span> Are
            </h3>
            <p>
              We believe dining should be simple and enjoyable. Our platform
              helps you discover the best restaurants and reserve a table online
              in just a few clicks. Whether you’re planning a romantic dinner, a
              family celebration, or a quick lunch with friends — we make it easy
              to find the perfect spot for every occasion.
            </p>
          </div>
        </section>

        <h2 className="section-title">- RESTAURANTS -</h2>

        <section className="restaurant-card">
          <div className="restaurant-info">
            <h3>BAHO</h3>
            <p>
              This warm and modern restaurant features natural wood seating and
              is brightened by large bay windows and globe pendant lights. The
              stylish interior, which includes both high-top and lounge seating
              alongside potted greenery, creates a sophisticated, comfortable
              atmosphere. The setting is ideal for modern European cuisine, fresh
              ingredients, and elevated dining options.
            </p>
            <p className="address"> 
                <img
                    src={Address}
                    alt="address"
                />
            Ivan Mazepa St 3, Kyiv, 02000</p>
          </div>
          <img
            src={Interior}
            alt="Baho restaurant"
            className="restaurant-image"
          />
        </section>
      </main>
    </div>
  );
};

export default Main;

