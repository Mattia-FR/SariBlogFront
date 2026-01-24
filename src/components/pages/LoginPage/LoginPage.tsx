import { useNavigate } from "react-router-dom";
import LoginForm from "../../molecules/LoginForm";

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>LoginPage</h1>
      <LoginForm onSuccess={() => navigate("/")} />
    </div>
  );
}

export default LoginPage;
