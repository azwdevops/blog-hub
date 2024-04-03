import OAuth from "@/components/OAuth";
import API from "@/utils/API";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return setErrorMessage("please fill out all fields");
    }
    await API.post(`/users/signup/`, formData)
      .then((res) => {
        window.alert("Signed up successfully");
        navigate("/signin");
      })
      .catch((err) => {
        setErrorMessage(err.response.data.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="mt-20">
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
            You can signup with your email or Google
          </p>
        </div>
        {/* right side div */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="">
              <Label>Your username</Label>
              <TextInput
                type="text"
                placeholder="username"
                id="username"
                onChange={handleChange}
              />
            </div>
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
            <div className="">
              <Label>Confirm Your Password</Label>
              <TextInput
                type="password"
                placeholder="confirmPassword"
                id="confirmPassword"
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
                "Sign Up"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>{" "}
            <Link to="/signin" className="text-blue-500">
              Sign In
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
