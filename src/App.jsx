import React, { useEffect } from "react";
import { getReservation, getTruck } from "./api";
import "./App.css";
import { actionType } from "./constants";
import Layout from "./Layout";
import { useStateValue } from "./StateProvider";

function App() {
  const [state, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({ type: actionType.CONN_SOCK });
  }, []);

  return (
    <div className="App">
      <Layout></Layout>
    </div>
  );
}

export default App;
