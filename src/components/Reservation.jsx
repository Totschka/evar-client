import { TextField, Button, InputLabel, Select, MenuItem, FormGroup, FormLabel, Divider, RadioGroup, Radio, FormControlLabel, FormControl } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { getTruckNear, patchReservation, postReservation } from "../api";
import { actionType, reservationStatus, truckStatus } from "../constants";
import { useStateValue } from "../StateProvider";

const useDebouncedEffect = (func, delay, deps) => {
  const callback = useCallback(func, deps);

  useEffect(() => {
    const timer = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [callback, delay]);
};

function Reservation() {
  const [{ trucks, selectedReservation, selectedCoordinates, selectedTab }, dispatch] = useStateValue();
  const [reservationId, setReservationId] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [rsvStatus, setReservationStatus] = useState(1);
  const [allocateTruck, setAllocateTruck] = useState("");
  const [chargeAmount, setChargeAmount] = useState(0);
  const [method, setMethod] = useState("");
  const [nearTrucks, setNearTrucks] = useState();

  useEffect(() => {
    if (selectedReservation) {
      setMethod("patch");
      setReservationId(selectedReservation.reservation_id);
      setEmail(selectedReservation.user_id);
      const gmt = new Date(selectedReservation.reservation_date);
      const month = gmt.getMonth() + 1;
      setDate(`${gmt.getFullYear()}.${month < 10 ? "0" + month : month}.${gmt.getDate()} ${gmt.getHours()}:${gmt.getMinutes() < 10 ? "0" + gmt.getMinutes() : gmt.getMinutes()}`);
      setChargeAmount(selectedReservation.charge_amount);
      setReservationStatus(selectedReservation.reservation_status);

      if (selectedReservation.allocate_truck) {
        setAllocateTruck(selectedReservation.allocate_truck);
      }

      dispatch({ type: actionType.SELECT_COORDINATE, payload: selectedReservation.location.coordinates });
    }
  }, [selectedReservation]);

  useDebouncedEffect(
    () => {
      if (selectedTab === 0) {
        getTruckNear(selectedCoordinates[0], selectedCoordinates[1]).then((res) => setNearTrucks(res));
      }
    },
    1000,
    [selectedCoordinates]
  );

  const handleEmailChange = (event, newValue) => {
    setEmail(event.target.value);
  };

  const handleDateChange = (event, newValue) => {
    setDate(event.target.value);
  };

  const handleReservatioinStatusChange = (event, newValue) => {
    setReservationStatus(event.target.value);
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

  const saveReservation = () => {
    if (method === "post") {
      postReservation(email, selectedCoordinates[0], selectedCoordinates[1], date, chargeAmount).catch((err) => {
        alert(err.response.data.message || err);
      });
    } else if (method === "patch") {
      patchReservation(reservationId, rsvStatus, selectedCoordinates[0], selectedCoordinates[1], date, chargeAmount, allocateTruck).catch((err) => {
        alert(err.response.data.message || err);
      });
    }
  };

  const handleMethodChange = (event, newValue) => {
    if (event.target.value === "post") {
      clearForm();
    }
    setMethod(event.target.value);
  };

  const clearForm = () => {
    dispatch({ type: actionType.SELECT_RESERVATION, payload: null });
    setReservationId("");
    setEmail("");
    setDate("");
    setReservationStatus(1);
    setAllocateTruck("");
    setChargeAmount(0);
  };

  const handleAllocateTruckChange = (event, newValue) => {
    console.log(event.target.value);
    setAllocateTruck(event.target.value);
  };

  return (
    <>
      <FormGroup>
        <RadioGroup row onChange={handleMethodChange} value={method}>
          <FormControlLabel value="post" control={<Radio />} label="추가" />
          <FormControlLabel value="patch" control={<Radio />} label="변경" />
        </RadioGroup>
        <TextField fullWidth label="Email" value={email} onChange={handleEmailChange} />
        <FormControl margin="normal">
          <InputLabel>Status</InputLabel>
          <Select label="Status" value={rsvStatus} onChange={handleReservatioinStatusChange}>
            <MenuItem key={reservationStatus.READY} value={1}>
              {reservationStatus.getName(reservationStatus.READY)}
            </MenuItem>
            <MenuItem key={reservationStatus.ALLOCATE} value={2}>
              {reservationStatus.getName(reservationStatus.ALLOCATE)}
            </MenuItem>
            <MenuItem key={reservationStatus.CHARGING} value={3}>
              {reservationStatus.getName(reservationStatus.CHARGING)}
            </MenuItem>
            <MenuItem key={reservationStatus.COMPLETE} value={4}>
              {reservationStatus.getName(reservationStatus.COMPLETE)}
            </MenuItem>
          </Select>
        </FormControl>
        <TextField fullWidth margin="normal" label="Date" placeholder="yyyy.MM.dd HH:mm" value={date} onChange={handleDateChange} />
        <TextField fullWidth margin="normal" label="ChargeAmount" value={chargeAmount} onChange={handleChargeAmountChange} inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }} />
        <TextField fullWidth margin="normal" label="Lng" value={selectedCoordinates[0]} onChange={handleLngChange} />
        <TextField fullWidth margin="normal" label="Lat" value={selectedCoordinates[1]} onChange={handleLatChange} />
        <FormControl margin="normal">
          <InputLabel>AllocateTruck</InputLabel>
          <Select label="AllocateTruck" value={allocateTruck} onChange={handleAllocateTruckChange}>
            <MenuItem key={0} value={""}>
              없음
            </MenuItem>
            {selectedReservation ? (
              <MenuItem key={selectedReservation.allocate_truck} value={selectedReservation.allocate_truck}>
                {selectedReservation.allocate_truck}
              </MenuItem>
            ) : null}
            {nearTrucks
              ? nearTrucks.map((e, i) => {
                  if (e.status !== truckStatus.READY || e.curr_battery < chargeAmount) {
                    return null;
                  }
                  return (
                    <MenuItem key={e._id} value={e.car_number}>
                      {e.car_number}
                    </MenuItem>
                  );
                })
              : trucks.map((e, i) => {
                  if (e.status !== truckStatus.READY || e.curr_battery < chargeAmount) {
                    return null;
                  }
                  return (
                    <MenuItem key={e._id} value={e.car_number}>
                      {e.car_number}
                    </MenuItem>
                  );
                })}
          </Select>
        </FormControl>
        <br></br>
        <Button variant="contained" onClick={saveReservation}>
          저장
        </Button>
      </FormGroup>
    </>
  );
}

export default Reservation;
