import { TextField, Button } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { postReservation } from "../api";
import { actionType } from "../constants";
import { useStateValue } from "../StateProvider";

function Reservation() {
  const [{ selectedReservation, selectedCoordinates }, dispatch] = useStateValue();
  const [reservationId, setReservationId] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [truck, setTruck] = useState("");
  const [chargeAmount, setChargeAmount] = useState(0);

  useEffect(() => {
    if (selectedReservation) {
      setEmail(selectedReservation.user_id);
      const gmt = new Date(selectedReservation.reservation_date);
      setDate(`${gmt.getFullYear()}.${gmt.getMonth() + 1}.${gmt.getDate()} ${gmt.getHours()}:${gmt.getMinutes() < 10 ? "0" + gmt.getMinutes() : gmt.getMinutes()}`);
      setChargeAmount(selectedReservation.charge_amount);

      if (selectedReservation.allocate_truck) {
        setTruck(selectedReservation.allocate_truck);
      }

      dispatch({ type: actionType.SELECT_COORDINATE, payload: selectedReservation.location.coordinates });
    }
  }, [selectedReservation]);

  const handleEmailChange = (event, newValue) => {
    setEmail(event.target.value);
  };

  const handleDateChange = (event, newValue) => {
    setDate(event.target.value);
  };

  const handleTruckChange = (event, newValue) => {
    setTruck(event.target.value);
  };

  const handleChargeAmountChange = (event, newValue) => {
    setChargeAmount(event.target.value);
  };

  const handleLngChange = (event, newValue) => {
    dispatch({ type: actionType.SELECT_COORDINATE, payload: [event.target.value, selectedCoordinates[1]] });
  };

  const handleLatChange = (event, newValue) => {
    dispatch({ type: actionType.SELECT_COORDINATE, payload: [selectedCoordinates[0], event.target.value] });
  };

  const addReservation = () => {
    postReservation(email, selectedCoordinates[0], selectedCoordinates[1], date, chargeAmount);
  };
  return (
    <>
      <TextField fullWidth label="Email" value={email} onChange={handleEmailChange} />
      <TextField fullWidth margin="normal" label="Date" placeholder="yyyy.MM.dd HH:mm" value={date} onChange={handleDateChange} />
      <TextField fullWidth margin="normal" label="ChargeAmount" value={chargeAmount} onChange={handleChargeAmountChange} inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }} />
      <TextField fullWidth margin="normal" label="Lng" value={selectedCoordinates[0]} onChange={handleLngChange} />
      <TextField fullWidth margin="normal" label="Lat" value={selectedCoordinates[1]} onChange={handleLatChange} />
      {/* <TextField fullWidth margin="normal" label="Truck" value={truck} onChange={handleTruckChange} /> */}

      <Button variant="contained" onClick={addReservation}>
        예약 추가
      </Button>
    </>
  );
}

export default Reservation;
