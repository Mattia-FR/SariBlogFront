import { Outlet } from "react-router-dom";
import "./App.css";
import Footer from "./components/molecules/Footer";
import Header from "./components/organisms/Header";

function App() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
