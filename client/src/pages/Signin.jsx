import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "@/redux/features/authSlice";
import API from "@/utils/API";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});

  const error = useSelector((state) => state.auth.error);
  const loading = useSelector((state) => state.auth.loading);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());

    if (!formData.email || !formData.password) {
      dispatch(signInFailure("please fill out all fields"));
    }
    await API.post(`/users/signin/`, formData)
      .then((res) => {
        dispatch(signInSuccess(res.data));
        navigate("/");
      })
      .catch((err) => {
        dispatch(signInFailure(err.response.data.message));
      });
  };

  return (
    <div className="">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left side div */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Blog
            </span>
            Hub
          </Link>
          <p className="text-sm mt-5">
            You can signin with your email or Google
          </p>
        </div>
        {/* right side div */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="">
              <Label>Your Email</Label>
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div className="">
              <Label>Your Password</Label>
              <TextInput
                type="password"
                placeholder="password"
                id="password"
                onChange={handleChange}
              />
            </div>

            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" /> <span className="pl-3">Loading</span>{" "}
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account?</span>{" "}
            <Link to="/signup" className="text-blue-500">
              Sign Up
            </Link>
          </div>
          {error && (
            <Alert className="mt-5" color="failure">
              {error}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signin;
