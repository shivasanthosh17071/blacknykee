import React, { useState } from "react";

function AddressForm({ onAddressChange, address, setAddress }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...address, [name]: value };
    setAddress(updated);
    onAddressChange && onAddressChange(updated); // Notify parent if needed
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            console.log(data.address);
            const { road, neighbourhood, city, state, country, postcode } =
              data.address;

            const updatedAddress = {
              line1: neighbourhood || road || "",
              city: city || "",
              state: state || "",
              country: country || "",
              postalCode: postcode || "",
            };

            setAddress(updatedAddress);
            onAddressChange && onAddressChange(updatedAddress);
          } catch (error) {
            console.error("Failed to fetch location info", error);
            alert("Unable to fetch address from location.");
          }
        },
        (err) => {
          alert("Location access denied. Please allow it.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="mb-3">
      <h6 className="text-dark">Shipping Address</h6>
      <button
        className="btn btn-outline-secondary btn-sm mb-2"
        onClick={handleGetLocation}
      >
        Get Current Location <i className="bi bi-geo-alt-fill"></i>
      </button>
      <input
        type="text"
        name="line1"
        placeholder="Address Line 1"
        className="form-control mb-2"
        value={address.line1}
        onChange={handleChange}
      />
      <input
        type="text"
        name="city"
        placeholder="City"
        className="form-control mb-2"
        value={address.city}
        onChange={handleChange}
      />
      <input
        type="text"
        name="state"
        placeholder="State"
        className="form-control mb-2"
        value={address.state}
        onChange={handleChange}
      />
      <input
        type="text"
        name="country"
        placeholder="Country"
        className="form-control mb-2"
        value={address.country}
        onChange={handleChange}
      />
      <input
        type="text"
        name="postalCode"
        placeholder="Postal Code"
        className="form-control mb-2"
        value={address.postalCode}
        onChange={handleChange}
      />
    </div>
  );
}

export default AddressForm;
