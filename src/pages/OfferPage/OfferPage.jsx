import React from "react";
import { Skeleton, Empty } from "antd";
import { useGetOfferQuery } from "../../redux/services/offer/offerApiServices";
import { useGetRedeemsQuery } from "../../redux/services/redeem/redeemApiServices";

import OfferCard from "../../components/OfferCard/OfferCard";
import RedeemCard from "../../components/OfferCard/RedeemCard";

const OfferPage = () => {
  const { data: offerData, isLoading } = useGetOfferQuery();
  const { data: redeemData, isLoading: redeemLoading } = useGetRedeemsQuery();

  const offers = offerData?.data || [];
  const redeems = redeemData?.data || [];

  return (
    <div className="px-5 py-4 font-urbanist">
      {/* ================= REDEEM ================= */}
      <h4 className="text-xl font-semibold text-white mt-10 mb-6">
        Redeem Rewards
      </h4>

      {redeemLoading ? (
        <div className="grid gap-4">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-white/10 bg-white/5 p-4"
            >
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          ))}
        </div>
      ) : redeems.length === 0 ? (
        <Empty
          description={
            <span className="text-white/60">No Redeem Available</span>
          }
        />
      ) : (
        <div className="grid gap-4">
          {redeems.map((redeem) => (
            <RedeemCard key={redeem._id} redeem={redeem} />
          ))}
        </div>
      )}
      {/* ================= OFFERS ================= */}
      <h4 className="text-xl font-semibold text-white my-4">All Offers</h4>
      {isLoading ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
          <Skeleton.Image active className="!w-full !h-52 !rounded-2xl" />
          <div className="mt-4">
            <Skeleton active paragraph={{ rows: 3 }} />
          </div>
        </div>
      ) : offers.length === 0 ? (
        <Empty
          description={
            <span className="text-white/60">No Offer Available</span>
          }
        />
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => (
            <OfferCard key={offer._id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OfferPage;
