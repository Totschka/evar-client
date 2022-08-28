import { TextField, Button } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { patchTruck, postReservation, postTruck } from "../api";
import { actionType } from "../constants";
import { useStateValue } from "../StateProvider";

function Truck() {
  const [{ selectedTruck, selectedCoordinates }, dispatch] = useStateValue();
  const [carNumber, setCarNumber] = useState("");
  const [maxBattery, setMaxBattery] = useState("");
  const [currBattery, setCurrBattery] = useState(0);

  useEffect(() => {
    if (selectedTruck) {
      setCarNumber(selectedTruck.car_number);
      setMaxBattery(selectedTruck.max_battery);
      setCurrBattery(selectedTruck.curr_battery);
      dispatch({ type: actionType.SELECT_COORDINATE, payload: selectedTruck.location.coordinates });
    }
  }, [selectedTruck]);

  const handleCarNumberChange = (event, newValue) => {
    setCarNumber(event.target.value);
  };

  const handleMaxBatteryChange = (event, newValue) => {
    setMaxBattery(event.target.value);
  };

  const handleCurrBatteryChange = (event, newValue) => {
    setCurrBattery(event.target.value);
  };

  const handleLngChange = (event, newValue) => {
    dispatch({ type: actionType.SELECT_COORDINATE, payload: [event.target.value, selectedCoordinates[1]] });
  };

  const handleLatChange = (event, newValue) => {
    dispatch({ type: actionType.SELECT_COORDINATE, payload: [selectedCoordinates[0], event.target.value] });
  };

  const addTruck = () => {
    postTruck(carNumber, selectedCoordinates[0], selectedCoordinates[1], maxBattery, currBattery, 1);
  };

  const updateTruck = () => {
    patchTruck(carNumber, selectedCoordinates[0], selectedCoordinates[1]);
  };

  return (
    <>
      <TextField fullWidth label="CarNumber" value={carNumber} onChange={handleCarNumberChange} />
      <TextField fullWidth margin="normal" label="MaxBattery" placeholder="yyyy.MM.dd HH:mm" value={maxBattery} onChange={handleMaxBatteryChange} />
      <TextField fullWidth margin="normal" label="CurrBattery" value={currBattery} onChange={handleCurrBatteryChange} inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }} />
      <TextField fullWidth margin="normal" label="Lng" value={selectedCoordinates[0]} onChange={handleLngChange} />
      <TextField fullWidth margin="normal" label="Lat" value={selectedCoordinates[1]} onChange={handleLatChange} />

      <Button variant="contained" onClick={addTruck}>
        트럭 추가
      </Button>

      <Button variant="contained" onClick={updateTruck}>
        트럭 변경
      </Button>
    </>
  );
}

export default Truck;
