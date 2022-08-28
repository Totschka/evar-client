import { useEffect, useRef, useState } from "react";
import { getReservation, getTruck } from "../api";
import { actionType, reservationStatus, truckStatus } from "../constants";
import { useStateValue } from "../StateProvider";
import "./KakaoMap.css";

const { kakao } = window;

const KakaoMap = () => {
  const refMapLoaded = useRef(false);
  const refMap = useRef(null);
  const [{ map, sock, trucks, reservations }, dispatch] = useStateValue();

  useEffect(() => {
    console.log("render map");
    const map = loadMap();
  }, []);

  useEffect(() => {
    if (refMapLoaded.current && trucks) {
      for (let i = 0; i < trucks.length; i++) {
        try {
          const truck = trucks[i];

          if (truck.marker) {
            updateMarker(truck, "truck");
          } else {
            const marker = getMarker(truck, "truck");
            marker.setMap(map);
            truck.marker = marker;
          }

          console.log(truck);
        } catch (err) {
          console.log(err);
        }
      }
    }
  }, [trucks, refMapLoaded]);

  useEffect(() => {
    if (refMapLoaded.current && reservations) {
      for (let i = 0; i < reservations.length; i++) {
        try {
          const reservation = reservations[i];

          if (reservation.marker) {
            updateMarker(reservation, "reservation");
          } else {
            const marker = getMarker(reservation, "reservation");
            marker.setMap(map);
            reservation.marker = marker;
          }

          console.log(reservation);
        } catch (err) {
          console.log(err);
        }
      }
    }
  }, [reservations, refMapLoaded]);

  useEffect(() => {
    if (sock) {
      console.log("sock effect");
      sock.on("updateReservationStatus", function (data) {
        const op = data.operationType;
        switch (op) {
          case "insert":
            dispatch({
              type: actionType.INSERT_RESERVATION,
              payload: data.fullDocument,
            });
            break;
          case "update":
            dispatch({
              type: actionType.UPDATE_RESERVATION,
              payload: {
                documentKey: data.documentKey._id,
                updateFields: data.updateDescription.updatedFields,
              },
            });
            break;
          case "delete":
            dispatch({
              type: actionType.REMOVE_RESERVATIONR,
              payload: data.documentKey._id,
            });
            break;
          default:
            break;
        }
        console.log("updateReservationStatus", data);
      });

      sock.on("updateTruckStatus", function (data) {
        const op = data.operationType;
        switch (op) {
          case "insert":
            dispatch({
              type: actionType.INSERT_TRUCK,
              payload: data.fullDocument,
            });
            break;
          case "update":
            dispatch({
              type: actionType.UPDATE_TRUCK,
              payload: {
                documentKey: data.documentKey._id,
                updateFields: data.updateDescription.updatedFields,
              },
            });
            break;
          case "delete":
            dispatch({
              type: actionType.REMOVE_TRUCK,
              payload: data.documentKey._id,
            });
            break;
          default:
            break;
        }
        console.log("updateTruckStatus", data);
      });
    }
  }, [sock]);

  function getMarker(item, type) {
    const lng = item.location.coordinates[0];
    const lat = item.location.coordinates[1];
    const position = new kakao.maps.LatLng(lat, lng);

    let markerImage;
    if (type === "truck") {
      const imageSrc = "/assets/marker_truck.png";
      const imageSize = new kakao.maps.Size(40, 40);
      markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
    }

    // 마커에 표시할 인포윈도우를 생성합니다
    const infowindow = getInfoWindow(item, type);

    const marker = new kakao.maps.Marker({
      position: position,
      image: type === "truck" ? markerImage : undefined,
    });

    const infoHandler = makeClickListener(map, marker, infowindow, item, type);
    item.infoHandler = infoHandler;

    kakao.maps.event.addListener(marker, "click", infoHandler);

    return marker;
  }

  function updateMarker(item, type) {
    const lng = item.location.coordinates[0];
    const lat = item.location.coordinates[1];
    const position = new kakao.maps.LatLng(lat, lng);

    // 마커에 표시할 인포윈도우를 생성합니다
    const infowindow = getInfoWindow(item, type);

    const marker = item.marker;
    marker.setPosition(position);

    kakao.maps.event.removeListener(marker, "click", item.infoHandler);

    const infoHandler = makeClickListener(map, marker, infowindow, item, type);
    item.infoHandler = infoHandler;
    kakao.maps.event.addListener(marker, "click", infoHandler);

    return marker;
  }

  function getInfoWindow(item, type) {
    // 마커에 표시할 인포윈도우를 생성합니다
    let content;

    if (type === "truck") {
      content = `
      <div class="infoWindow">
        <table>
          <tr>
            <th>${item.car_number}</th>
            <td></td>
          </tr>
          <tr>
            <td>배터리</td>
            <td>${Math.round((item.curr_battery / item.max_battery) * 100)}%</td>
          </tr>
          <tr>
            <td>상태</td>
            <td>${truckStatus.getName(item.status)}</td>
          </tr>
        </table>
      </div>`;
    } else {
      content = `
      <div class="infoWindow">
        <table>
          <tr>
            <th colspan=2>${item.user_id}</th>
          </tr>
          <tr>
            <td>예약일</td>
            <td>${new Date(item.reservation_date).toLocaleString()}</td>
          </tr>
          <tr>
            <td>상태</td>
            <td>${reservationStatus.getName(item.reservation_status)}</td>
          </tr>
        </table>
      </div>`;
    }

    const infowindow = new kakao.maps.InfoWindow({
      removable: true,
      content: content,
    });

    return infowindow;
  }

  function makeClickListener(map, marker, infowindow, item, type) {
    item.infoWindow = infowindow;
    return function () {
      if (type === "truck") {
        dispatch({ type: actionType.SELECT_TRUCK, payload: item });
        dispatch({ type: actionType.SELECT_TAB, payload: 1 });
        infowindow.open(map, marker);
      } else {
        dispatch({ type: actionType.SELECT_RESERVATION, payload: item });
        dispatch({ type: actionType.SELECT_TAB, payload: 0 });
      }
    };
  }

  function loadMap() {
    if (kakao) {
      kakao.maps.load(function () {
        const container = refMap.current;
        const options = {
          center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
          level: 9, //지도의 레벨(확대, 축소 정도)
        };

        const map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

        // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
        var zoomControl = new kakao.maps.ZoomControl();
        map.addControl(zoomControl, kakao.maps.ControlPosition.LEFT);

        kakao.maps.event.addListener(map, "click", function (mouseEvent) {
          // 클릭한 위도, 경도 정보를 가져옵니다
          var latlng = mouseEvent.latLng;

          var message = "클릭한 위치의 위도는 " + latlng.getLat() + " 이고, ";
          message += "경도는 " + latlng.getLng() + " 입니다";
          console.log(message);
          dispatch({ type: actionType.SELECT_COORDINATE, payload: [latlng.getLng(), latlng.getLat()] });
        });
        dispatch({ type: actionType.SET_MAP, payload: map });

        refMapLoaded.current = true;

        getTruck().then((trucks) => {
          dispatch({
            type: actionType.SET_TRUCKS,
            payload: trucks,
          });
        });

        getReservation().then((reservations) => {
          dispatch({
            type: actionType.SET_RESERVATIONS,
            payload: reservations,
          });
        });

        return map;
      });
    }
  }

  function bindTruck() {}

  function bindReservation() {}

  return (
    <>
      <div className="map" ref={refMap}></div>
    </>
  );
};

export default KakaoMap;
