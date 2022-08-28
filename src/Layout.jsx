import "./Layout.css";
import KakaoMap from "./components/KakaoMap";
import Console from "./components/Console";

function Layout() {
  return (
    <div className="container">
      <div className="left">
        <KakaoMap></KakaoMap>
      </div>
      <div className="right">
        <Console></Console>
      </div>
    </div>
  );
}

export default Layout;
