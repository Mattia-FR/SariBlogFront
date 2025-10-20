import { Outlet } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./App.css";
import Footer from "./components/molecules/Footer";
import Header from "./components/organisms/Header";

function App() {
  return (
    <ThemeProvider>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
