import signupImg from "../assets/Images/signup.webp"
import Template from "../components/core/Auth/Template"

function Signup() {
  return (
    <Template
      title="Join CogniScript! JIIT's own quiz platform."
      description1="Build skills for today, tomorrow, and beyond."
      description2="Education to future-proof your career."
      image={signupImg}
      formType="signup"
    />
  )
}

export default Signup