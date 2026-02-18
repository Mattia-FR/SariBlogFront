import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "./toast.css";
import Footer from "./components/molecules/Footer";
import Header from "./components/organisms/Header";

function App() {
  return (
    <div className="app-layout">
      <ToastContainer position="top-right" autoClose={3000} />
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
