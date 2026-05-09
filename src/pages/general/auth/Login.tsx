import React, { useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useUser } from "../../../contexts/user/UserContext";
import { getErrorMessage } from "../../../helpers/api";
import axios from "axios";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = yup.object({
    email: yup.string().required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const { login } = useUser();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
          values,
        );
        const token: string = res.data.token;

        if (res.status === 200) {
          toast.success(res.data.message);
          await login(token);
          setTimeout(() => {
            const loading = toast.loading("Redirecting to dashboard...");
            setTimeout(() => {
              toast.dismiss(loading);
              if (res.data.role === "admin") {
                navigate("/admin/overview");
              } else if (res.data.role === "employee") {
                navigate("/dashboard/overview");
              }
            }, 1000);
          }, 1000);
        }
      } catch (error: unknown) {
        const errMsg = getErrorMessage(error, "Failed to login");

        toast.error(errMsg);
      } finally {
        setSubmitting(false);
        resetForm();
      }
    },
  });

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-linear-to-br from-primary to-primary/80">
      <div className="hidden lg:flex flex-1 items-center px-10 xl:px-16">
        <div className="flex flex-col gap-6 text-white max-w-xl">
          <div className="flex flex-col gap-4">
            <h2 className="text-4xl font-bold leading-tight">Hey, Hello!</h2>

            <h4 className="text-base font-medium text-white/90 leading-relaxed">
              Electrical Inventory & Deployment Management System
            </h4>
          </div>

          <p className="text-sm text-white/70 leading-7">
            Track electrical materials, manage field deployments, monitor
            inventory movement, and coordinate operational tasks efficiently.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-[45%] min-h-screen lg:min-h-0 flex items-center justify-center px-5 sm:px-8 lg:px-10 py-8">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-xl py-8 sm:py-10">
          <div className="flex flex-col gap-3 items-center px-6 sm:px-10">
            <h2 className="text-2xl font-bold text-center">Welcome Back</h2>

            <p className="text-sm text-center text-gray-600 leading-6">
              Sign in to manage inventory operations, deployment workflows, and
              field activity tracking.
            </p>
          </div>

          <form
            className="flex flex-col gap-6 mt-10 px-6 sm:px-10"
            onSubmit={formik.handleSubmit}
          >
            <div className="flex flex-col gap-2">
              <input
                type="email"
                className={`border ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : "border-primary/80"
                } rounded-full px-5 py-3.5 outline-none w-full text-sm sm:text-base`}
                placeholder="Email Address"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              {formik.touched.email && formik.errors.email && (
                <span className="text-red-500 pl-3 text-sm">
                  {formik.errors.email}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`border ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : "border-primary/80"
                } rounded-full px-5 py-3.5 outline-none w-full text-sm sm:text-base`}
                placeholder="Password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <span
                className="absolute right-5 top-4 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </span>

              {formik.touched.password && formik.errors.password && (
                <span className="text-red-500 pl-3 text-sm">
                  {formik.errors.password}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="rounded-full px-4 py-3.5 cursor-pointer bg-primary text-white font-medium hover:opacity-90 transition"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
