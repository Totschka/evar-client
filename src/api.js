import axios from "axios";
import { config } from "./config";

export function getTruck(car_number) {
  const url = config.api.truck + (car_number || "");

  return axios.get(url).then((res) => {
    return res.data;
  });
}

export function getTruckNear(lng, lat) {
  const url = config.api.truckNear + lng + "&" + lat;

  return axios.get(url).then((res) => {
    return res.data;
  });
}

export function postTruck(car_number, lng, lat, max_battery, curr_battery, evarman_id) {
  const url = config.api.truck;
  const data = {
    car_number,
    location: { type: "Point", coordinates: [lng, lat] },
    max_battery,
    curr_battery,
    evarman_id,
  };

  return axios.post(url, data).then((res) => {
    return res.data;
  });
}

export function patchTruck(car_number, lng, lat, max_battery, curr_battery, status) {
  const url = config.api.truck + (car_number || "");
  const data = {
    car_number,
    location: { type: "Point", coordinates: [lng, lat] },
    max_battery,
    curr_battery,
    status,
  };

  return axios.patch(url, data).then((res) => {
    return res.data;
  });
}

export function getReservation(reservation_id) {
  const url = config.api.reservation + (reservation_id || "");

  return axios.get(url).then((res) => {
    return res.data;
  });
}

export function postReservation(email, lng, lat, date, chargeAmount) {
  const url = config.api.reservation;
  const data = {
    user_id: email,
    reservation_date: date,
    charge_amount: chargeAmount,
    location: { type: "Point", coordinates: [lng, lat] },
  };

  return axios.post(url, data).then((res) => {
    return res.data;
  });
}

export function patchReservation(reservation_id, reservation_status, lng, lat, date, chargeAmount, car_number) {
  const url = config.api.reservation + (reservation_id || "");
  const data = {
    reservation_id,
    reservation_status,
    reservation_date: date,
    charge_amount: chargeAmount,
    location: { type: "Point", coordinates: [lng, lat] },
    allocate_truck: car_number,
  };
  return axios.patch(url, data).then((res) => {
    return res.data;
  });
}
