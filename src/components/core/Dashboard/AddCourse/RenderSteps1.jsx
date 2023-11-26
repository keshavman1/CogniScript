import { FaCheck } from "react-icons/fa"
import { useSelector } from "react-redux"

import Course from "./CourseInformation/Course"
export default function RenderSteps1() {
  const { step } = useSelector((state) => state.course)

  const steps = [
    {
      id: 1,
      title: "Course Information",
    },
    {
      id: 2,
      title: "Course Builder",
    },
    {
      id: 3,
      title: "Publish",
    },
  ]

  return (
    <>
      {/* Render specific component based on current step */}
      {step === 1 && <Course/>}
      
    </>
  )
}