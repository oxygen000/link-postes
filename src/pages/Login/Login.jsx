import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaUser, FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { authContext } from "../../context/AuthContextProvider";
import { CircularProgress } from "react-loader-spinner";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@heroui/react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setToken, login } = useContext(authContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onLogin(values) {
    try {
      const { data } = await axios.post(
        "https://route-posts.routemisr.com/users/signin",
        values
      );

      toast.success("Login successful! Redirecting to home page...");
      setToken(data.data.token);
      localStorage.setItem("token", data.data.token);
      login(data.data.token, data.data.user);

      navigate("/");
    } catch (error) {
      console.log(error.response.data.error);
      toast.error("Login failed. Please check your credentials.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="min-h-screen flex">

        {/* LEFT */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8">

              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 dark:bg-blue-600 rounded-full mb-4">
                  <FaUser className="text-white text-xl" />
                </div>

                <h2 className="text-2xl font-bold">Login</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to your account</p>
              </div>

              <form onSubmit={handleSubmit(onLogin)}>

                {/* EMAIL */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>

                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-10"
                      {...register("email")}
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300">
                      <FaEnvelope />
                    </span>
                  </div>

                  {errors.email && (
                    <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                {/* PASSWORD */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12"
                      {...register("password")}
                    />

                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100"
                      onClick={() => setShowPassword((s) => !s)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                {/* LOGIN BUTTON */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-500 dark:bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex justify-center">
                      <CircularProgress height="20" width="20" color="#ffffff" visible={true} />
                    </div>
                  ) : (
                    "Login"
                  )}
                </Button>

                {/* SOCIAL */}
                <div className="flex gap-3 w-full mt-4">
                  <Button
                    type="button"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <FcGoogle className="text-lg" />
                    Google
                  </Button>

                  <Button
                    type="button"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 dark:bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    <FaFacebookF className="text-lg" />
                    Facebook
                  </Button>
                </div>

                {/* SIGNUP */}
                <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
                  Don’t have an account?{" "}
                  <Link className="text-blue-500 dark:text-blue-400 hover:underline font-semibold" to="/signup">
                    Sign up
                  </Link>
                </p>

              </form>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hidden lg:block lg:w-1/2 bg-cover bg-center bg-[url('https://images.pexels.com/photos/1435075/pexels-photo-1435075.jpeg')]">
          <div className="h-full bg-black/40 flex items-center justify-center">
            <div className="text-center text-white px-12">
              <h2 className="text-4xl font-bold mb-6">Linked Posts</h2>
              <p className="text-xl">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Facilis, expedita.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}