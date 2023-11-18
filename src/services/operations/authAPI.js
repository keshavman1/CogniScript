import { toast } from "react-hot-toast"
import { setLoading, setToken } from "../../slices/authSlice"
import { resetCart } from "../../slices/cartSlice"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiconnector"
import { endpoints } from "../apis"
import { ACCOUNT_TYPE } from "../../utils/constants"

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      })
      console.log("SENDOTP API RESPONSE............", response)

      console.log(response.data.success)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("OTP Sent Successfully")
      navigate("/verify-email")
    } catch (error) {
      console.log("SENDOTP API ERROR............", error)
      toast.error("Could Not Send OTP")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      })

      console.log("SIGNUP API RESPONSE............", response)

      if (response.data.success) {
        toast.success("Signup Successful")
        navigate("/login")
      } else {
        // Check for specific error messages from the API response
        if (response.data.message === "User already exists") {
          toast.error("User already exists. Please sign in to continue.")
        } else if (response.data.message === "Password and Confirm Password do not match") {
          toast.error("Password and Confirm Password do not match. Please try again.")
        } else if (response.data.message === "The OTP is not valid") {
          toast.error("The OTP is not valid. Please check your OTP.")
        } else if (response.data.message === "All Fields are required") {
          toast.error("YAHI DIKKAT THI!!!")
        } else {
          toast.error("Signup Failed. Please try again.")
        }
        navigate("/signup")
      }
    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      toast.error("Signup Failed. Please try again.")
      navigate("/signup")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}


export function login(email, password, accountType , navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
        accountType,
      })

      console.log("LOGIN API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Login Successful")

      if (accountType === "Student"){
        dispatch(setToken(response.data.token))
        const userImage = response.data?.student?.image
          ? response.data.student.image
          : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.student.firstName} ${response.data.student.lastName}`
        dispatch(setUser({ ...response.data.student, image: userImage, accountType: ACCOUNT_TYPE.STUDENT }))
        
        localStorage.setItem("token", JSON.stringify(response.data.token))
        localStorage.setItem("user", JSON.stringify(response.data.student))
        navigate("/dashboard/my-profile")
      }
      else if (accountType === "Instructor"){
        dispatch(setToken(response.data.token))

        const userImage = response.data?.instructor?.image
          ? response.data.instructor.image
          : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.instructor.firstName} ${response.data.instructor.lastName}`
        dispatch(setUser({ ...response.data.instructor, image: userImage, accountType: ACCOUNT_TYPE.INSTRUCTOR }))
        
        localStorage.setItem("token", JSON.stringify(response.data.token))
        localStorage.setItem("user", JSON.stringify(response.data.instructor))
        navigate("/dashboard/my-profile")
      }
    } catch (error) {
      console.log("LOGIN API ERROR............", error)
      toast.error("Login Failed")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}



export function getPasswordResetToken(email , setEmailSent) {
  return async(dispatch) => {
    dispatch(setLoading(true));
    try{
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {email,})

      console.log("RESET PASSWORD TOKEN RESPONSE....", response);

      if(!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Reset Email Sent");
      setEmailSent(true);
    }
    catch(error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error("Failed to send email for resetting password");
    }
    dispatch(setLoading(false));
  }
}

export function resetPassword(password, confirmPassword, token) {
  return async(dispatch) => {
    dispatch(setLoading(true));
    try{
      const response = await apiConnector("POST", RESETPASSWORD_API, {password, confirmPassword, token});

      console.log("RESET Password RESPONSE ... ", response);


      if(!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password has been reset successfully");
    }
    catch(error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error("Unable to reset password");
    }
    dispatch(setLoading(false));
  }
}