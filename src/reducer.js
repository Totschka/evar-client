import { io } from "socket.io-client";
import { config } from "./config";
import { actionType } from "./constants";
import { Map, List } from "immutable";

export const initialState = {
  map: null,
  globalVal: 0,
  sock: null,
  reservations: [],
  trucks: [],
  selectedCoordinates: [0, 0],
  selectedTruck: null,
  selectedReservation: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionType.CONN_SOCK:
      return connSock(state);
    case actionType.SET_MAP:
      return { ...state, map: action.payload };
    case actionType.SET_TRUCKS:
      return { ...state, trucks: action.payload };
    case actionType.INSERT_TRUCK:
      console.log("insert");
      return { ...state, trucks: [...state.trucks, action.payload] };
    case actionType.UPDATE_TRUCK:
      const id = action.payload.documentKey;
      const updateFields = action.payload.updateFields;
      const newTrucks = state.trucks.map((t) => {
        if (t._id === id) {
          if (updateFields["location.coordinates.0"] || updateFields["location.coordinates.1"]) {
            updateFields.location = t.location;
            let newCoordinates = t.location.coordinates;
            if (updateFields["location.coordinates.0"]) {
              newCoordinates[0] = updateFields["location.coordinates.0"];
              delete updateFields["location.coordinates.0"];
            }
            if (updateFields["location.coordinates.1"]) {
              newCoordinates[1] = updateFields["location.coordinates.1"];
              delete updateFields["location.coordinates.1"];
            }
          }
          t = { ...t, ...updateFields };
        }

        return t;
      });
      return { ...state, trucks: newTrucks };
    case actionType.REMOVE_TRUCK:
      const removeId = action.payload;
      const filteredTrucks = state.trucks.filter((e, i) => {
        if (e._id === removeId) {
          e.marker.setMap(null);
        }

        return e._id !== removeId;
      });
      return { ...state, trucks: filteredTrucks };
    case actionType.SET_RESERVATIONS:
      return { ...state, reservations: action.payload };
    case actionType.INSERT_RESERVATION:
      return { ...state, reservations: action.payload };
    case actionType.UPDATE_RESERVATION:
      return { ...state, reservations: action.payload };
    case actionType.SELECT_COORDINATE:
      return { ...state, selectedCoordinates: action.payload };
    case actionType.SELECT_TRUCK:
      return { ...state, selectedTruck: action.payload };
    case actionType.SELECT_RESERVATION:
      return { ...state, selectedReservation: action.payload };

    default:
      return state;
  }
};

function connSock(state, chatIdx) {
  let sock = null;

  try {
    sock = connectWebSocket(state, chatIdx);
  } catch (e) {
    console.log(e);
  }

  return {
    ...state,
    sock: sock,
  };
}

function connectWebSocket(state, chatIdx) {
  if (state.sock) {
    try {
      state.sock.close();
    } catch (e) {
      console.log(e);
    }
  }

  let addrWs = config.ws;

  return io(addrWs);
}

export default reducer;
