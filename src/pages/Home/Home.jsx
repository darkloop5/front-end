import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";

import BalanceCard from "../../components/HomeComponents/AccountBalance/BalanceCard";
import GlassCard from "../../components/GlassCard/GlassCard";
import TopSection from "../../components/TopSection/TopSection";
import HomeSlider from "../../components/HomeComponents/HomeSlider/HomeSlider";
import Task from "../../components/HomeComponents/Task/Task";

import { useGetOfferQuery } from "../../redux/services/offer/offerApiServices";
import useAuthData from "../../hooks/useAuthData";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthData();

  const { data: offer } = useGetOfferQuery();

  const [openOffer, setOpenOffer] = useState(false);
  const [homeOffer, setHomeOffer] = useState(null);

  const offerData = offer?.data || [];


  useEffect(() => {
    if (!offerData.length) return;

    const filteredOffer = offerData.find(
      (item) => item.showOn === "Home"
    );

    if (!filteredOffer) return;

    setHomeOffer(filteredOffer);

    // Bangladesh Time
    const bdNow = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
      })
    );

    const today = bdNow.toDateString();
    const currentHour = bdNow.getHours();

    let savedData =
      JSON.parse(localStorage.getItem("dailyOffer")) || {};

    // New day reset
    if (savedData.date !== today) {
      savedData = {
        date: today,
        shown: [],
      };

      localStorage.setItem(
        "dailyOffer",
        JSON.stringify(savedData)
      );
    }

    let session = null;

    // Morning = 6AM - 11:59AM
    if (currentHour >= 6 && currentHour < 12) {
      session = "morning";
    }

    // Lunch = 12PM - 5:59PM
    else if (currentHour >= 12 && currentHour < 18) {
      session = "lunch";
    }

    // Night = 6PM - 11:59PM
    else if (currentHour >= 18 && currentHour <= 23) {
      session = "night";
    }

    if (
      session &&
      !savedData.shown.includes(session)
    ) {
      setOpenOffer(true);

      savedData.shown.push(session);

      localStorage.setItem(
        "dailyOffer",
        JSON.stringify(savedData)
      );
    }
  }, [offerData]);

  const handleBlockedClick = () => {
    if (!user) {
      navigate("/login");
    }
  };

  return (
    <div className="px-4 relative" onClick={handleBlockedClick}>
      {!user && (
        <div className="fixed inset-0 z-50 cursor-pointer" />
      )}

      <TopSection />

      <GlassCard>
        <BalanceCard />
      </GlassCard>

      <HomeSlider />
      <Task />

      {/* Offer Modal */}
      <Modal
        open={openOffer}
        footer={null}
        centered
        width={300}
        onCancel={() => setOpenOffer(false)}
      >
        {homeOffer && (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">
              {homeOffer.title}
            </h2>

            {homeOffer.image && (
              <img
                src={homeOffer.image}
                alt="offer"
                className="w-full rounded-lg mb-3"
              />
            )}

            <p>{homeOffer.description}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Home;