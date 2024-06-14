// components/ChangeOrderButton.js
"use client";

import myFetch from "../../components/myFetch";
import fetchOrders from "../../components/fetchPhotoTagOrders";

import React from "react";

const ChangeOrderButton = ({ tagId, photos }) => {
  const handleInitOrder = async () => {
    const orderData = photos.map((photo, index) => ({
      tagId: tagId,
      photoId: photo.id,
      order: index + 1,
    }));

    try {
      for (const order of orderData) {
        const payload = {
          data: order,
        };

        const response = await myFetch('/api/photo-tag-orders', 'POST', payload, 'POST order');

        if (response && response.data) {
          console.log("Order saved successfully", response.data);
        } else {
          console.error("Failed to save order");
        }
      }
      const photoTagOrders = await fetchOrders(tagId); 
      console.log("photoTagOrders",photoTagOrders)
    } catch (error) {
      console.error("An error occurred while saving order:", error);
    }
  };

  return (
    <button onClick={handleInitOrder} className="p-2 rounded-sm bg-blue-500 text-white">
      INIT ORDER
    </button>
  );
};

export default ChangeOrderButton;
