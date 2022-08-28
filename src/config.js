const apiRoot = process.env.REACT_APP_API_ROOT;

export const config = {
  api: {
    user: apiRoot + process.env.REACT_APP_API_USER,
    truck: apiRoot + process.env.REACT_APP_API_TRUCK,
    truckNear: apiRoot + process.env.REACT_APP_API_TRUCK_NEAR,
    evarman: apiRoot + process.env.REACT_APP_API_EVARMAN,
    reservation: apiRoot + process.env.REACT_APP_API_RESERVATION,
  },
  ws: process.env.REACT_APP_WS,
};
