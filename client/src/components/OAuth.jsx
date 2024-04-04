import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "@/firebase";
import API from "@/utils/API";
import { useDispatch } from "react-redux";
import { signInSuccess } from "@/redux/features/authSlice";
import { useNavigate } from "react-router-dom";
import {
  processingFailure,
  processingStart,
} from "@/redux/features/sharedSlice";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async (e) => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      dispatch(processingStart());
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      await API.post(`/users/google`, {
        name: resultsFromGoogle.user.displayName,
        email: resultsFromGoogle.user.email,
        googlePhotoUrl: resultsFromGoogle.user.photoURL,
      })
        .then((res) => {
          dispatch(signInSuccess(res.data));
          navigate("/");
        })
        .catch((err) => {
          dispatch(processingFailure(err.response.data.message));
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button
      type="button"
      gradientDuoTone="pinkToOrange"
      outline
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" /> Continue with Google
    </Button>
  );
};

export default OAuth;
