import { LoginForm } from "wasp/client/auth";
// Wasp's type-safe Link component
import { Link } from "wasp/client/router";

export function LoginPage() {
  return (
    <div className="login h-full flex gap-3 flex-col max-w-lg mx-auto p-8">
      <LoginForm />
      <br />
      <span>
        I don't have an account yet (<Link to="/signup">go to signup</Link>).
      </span>
      <span className='text-sm'>
        Forgot your password?{' '}
        <Link to='/request-password-reset' className='underline'>
          reset it
        </Link>
        .
      </span>
    </div>
  );
}
