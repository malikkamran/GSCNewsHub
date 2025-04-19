import { Helmet } from "react-helmet";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Helmet>
        <title>Login | GSC Supply Chain News CMS</title>
      </Helmet>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#BB1919]">GSC News</h1>
          <p className="text-gray-600 mt-2">Content Management System</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}