import { Outlet } from "react-router-dom";
import "./App.css";
import Footer from "./components/molecules/Footer";
import Header from "./components/organisms/Header";

function App() {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
