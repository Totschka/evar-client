export const actionType = {
  CONN_SOCK: 0,
  SET_MAP: 1,
  SET_TRUCKS: 2,
  INSERT_TRUCK: 3,
  UPDATE_TRUCK: 4,
  REMOVE_TRUCK: 5,
  SET_RESERVATIONS: 6,
  INSERT_RESERVATION: 7,
  UPDATE_RESERVATION: 8,
  REMOVE_RESERVATION: 9,
  SELECT_COORDINATE: 10,
  SELECT_TRUCK: 11,
  SELECT_RESERVATION: 12,
  SELECT_TAB: 13,
};

export const truckStatus = {
  READY: 1,
  ALLOCATE: 2,
  CHARGING: 3,
  OFF: 4,
  getName: (code) => {
    let name = "";
    switch (code) {
      case truckStatus.READY:
        name = "대기";
        break;
      case truckStatus.ALLOCATE:
        name = "할당됨";
        break;
      case truckStatus.CHARGING:
        name = "충전중";
        break;
      case truckStatus.OFF:
        name = "휴무";
        break;
      default:
        break;
    }

    return name;
  },
};

export const reservationStatus = {
  READY: 1,
  ALLOCATE: 2,
  CHARGING: 3,
  COMPLETE: 4,
  getName: (code) => {
    let name = "";
    switch (code) {
      case reservationStatus.READY:
        name = "예약중";
        break;
      case reservationStatus.ALLOCATE:
        name = "할당됨";
        break;
      case reservationStatus.CHARGING:
        name = "충전중";
        break;
      case reservationStatus.COMPLETE:
        name = "충전완료";
        break;
      default:
        break;
    }

    return name;
  },
};
