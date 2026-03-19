import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaUser, FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@heroui/react";

let schemaSignUp = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(20, "Name must be less than 20 characters"),
    email: z
      .email("Please enter a valid email address")
      .regex(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/),
    password: z
      .string()
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/),
    rePassword: z
      .string()
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/),
    dateOfBirth: z.string(),
    gender: z.enum(["male", "female"]),
  })
  .refine(
    (value) => {
      return value.password === value.rePassword;
    },
    {
      error: "Passwords do not match",
      path: ["rePassword"],
    },
  );

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [showRePassword, setShowRePassword] = useState(false);

  let { handleSubmit, register, formState } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      gender: "",
      dateOfBirth: "",
    },
    resolver: zodResolver(schemaSignUp),
  });
  console.log(formState.errors);

  async function handleFormSignup(values) {
    try {
      const { data } = await axios.post(
        "https://route-posts.routemisr.com/users/signup",
        values,
      );
      console.log(data);
      toast.success("Signup successful! Please login to your account.");
      navigate("/login");
    } catch (error) {
      console.log(error.response.data.error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="min-h-screen flex">
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-600 rounded-full mb-4">
                  <FaUser className="text-blue-600 dark:text-white text-xl" />
                </div>
                <h2 className="text-2xl font-bold">Create Account</h2>

                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Get started with your account
                </p>
              </div>

              <form onSubmit={handleSubmit(handleFormSignup)}>
                {/* Full Name */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    {...register("name")}
                  />
                  {formState.errors.name && (
                    <p className="mt-2 text-sm text-red-500">
                      {formState.errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
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
                  {formState.errors.email && (
                    <p className="mt-2 text-sm text-red-500">
                      {formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gender
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    {...register("gender")}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {formState.errors.gender && (
                    <p className="mt-2 text-sm text-red-500">
                      {formState.errors.gender.message}
                    </p>
                  )}
                </div>

                {/* Birth Date */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Birth Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    {...register("dateOfBirth")}
                  />
                  {formState.errors.dateOfBirth && (
                    <p className="mt-2 text-sm text-red-500">
                      {formState.errors.dateOfBirth.message}
                    </p>
                  )}
                </div>

                {/* Password */}
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
                  {formState.errors.password && (
                    <p className="mt-2 text-sm text-red-500">
                      {formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Re-enter Password */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Re-enter Password
                  </label>
                  <div className="relative">
                    <input
                      type={showRePassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12"
                      {...register("rePassword")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100"
                      onClick={() => setShowRePassword((s) => !s)}
                    >
                      {showRePassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {formState.errors.rePassword && (
                    <p className="mt-2 text-sm text-red-500">
                      {formState.errors.rePassword.message}
                    </p>
                  )}
                </div>

                {/* Submit */}

                <Button
                  type="submit"
                  disabled={handleFormSignup}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {handleFormSignup ? "Create Account" : "Processing..."}
                </Button>

                <p className="mt-6 text-center text-gray-600">
                  Already have an account?{" "}
                  <Link
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                    to="/login"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>

        <div className="hidden lg:block lg:w-1/2 bg-cover bg-center bg-[url('https://images.pexels.com/photos/1435075/pexels-photo-1435075.jpeg')]">
          <div className="h-full bg-black/35 bg-opacity-50 flex items-center justify-center">
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
