import { TextField, Button, FormGroup, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { patchTruck, postTruck } from "../api";
import { actionType } from "../constants";
import { useStateValue } from "../StateProvider";

function Truck() {
  const [{ selectedTruck, selectedCoordinates }, dispatch] = useStateValue();
  const [carNumber, setCarNumber] = useState("");
  const [maxBattery, setMaxBattery] = useState(0);
  const [currBattery, setCurrBattery] = useState(0);
  const [method, setMethod] = useState("");

  useEffect(() => {
    if (selectedTruck) {
      setMethod("patch");
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

  const handleMethodChange = (event, newValue) => {
    if (event.target.value === "post") {
      clearForm();
    }
    setMethod(event.target.value);
  };

  const clearForm = () => {
    dispatch({ type: actionType.SELECT_TRUCK, payload: null });
    setCarNumber("");
    setMaxBattery(0);
    setCurrBattery(0);
  };

  const saveTruck = () => {
    if (method === "post") {
      postTruck(carNumber, selectedCoordinates[0], selectedCoordinates[1], maxBattery, currBattery, 1).catch((err) => {
        alert(err.response.data.message || err);
      });
    } else if (method === "patch") {
      patchTruck(carNumber, selectedCoordinates[0], selectedCoordinates[1], maxBattery, currBattery, 1).catch((err) => {
        alert(err.response.data.message || err);
      });
    }
  };
  return (
    <>
      <FormGroup>
        <RadioGroup row onChange={handleMethodChange} value={method}>
          <FormControlLabel value="post" control={<Radio />} label="추가" />
          <FormControlLabel value="patch" control={<Radio />} label="변경" />
        </RadioGroup>
        <TextField fullWidth label="CarNumber" value={carNumber} onChange={handleCarNumberChange} />
        <TextField fullWidth margin="normal" label="MaxBattery" placeholder="yyyy.MM.dd HH:mm" value={maxBattery} onChange={handleMaxBatteryChange} />
        <TextField fullWidth margin="normal" label="CurrBattery" value={currBattery} onChange={handleCurrBatteryChange} inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }} />
        <TextField fullWidth margin="normal" label="Lng" value={selectedCoordinates[0]} onChange={handleLngChange} />
        <TextField fullWidth margin="normal" label="Lat" value={selectedCoordinates[1]} onChange={handleLatChange} />
        <br></br>
        <Button variant="contained" onClick={saveTruck}>
          저장
        </Button>
      </FormGroup>
    </>
  );
}

export default Truck;
