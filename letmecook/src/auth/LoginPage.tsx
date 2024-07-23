import { LoginForm } from "wasp/client/auth";
// Wasp's type-safe Link component
import { Link } from "wasp/client/router";

export function LoginPage() {
  return (
    <div className="login h-full max-w-lg mx-auto p-8">
      <LoginForm />
      <br />
      <span>
        I don't have an account yet (<Link to="/signup">go to signup</Link>).
      </span>
    </div>
  );
}
