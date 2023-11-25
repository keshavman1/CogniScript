import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsAPI"
import { courseCodes, setCourse, setStep } from "../../../../../slices/courseSlice"
import { COURSE_STATUS } from "../../../../../utils/constants"
import IconBtn from "../../../../common/IconBtn"
import Upload from "../Upload"
import ChipInput from "./ChipInput"
import RequirementsField from "./RequirementField"

export default function CourseInformationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm()

  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { course, editCourse } = useSelector((state) => state.course)
  const { user } = useSelector((state) => state.profile)
  let Teacher_id = user._id;
  const [loading, setLoading] = useState(false)
  const isFormUpdated = () => {
    const currentValues = getValues()
    if (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseImage !== course.thumbnail
    ) {
      return true
    }
    return false
  }

  const onSubmit = async (data) => {
  /*  if (editCourse) {
      if (isFormUpdated()) {
        const currentValues = getValues()
        const formData = new FormData()
        formData.append("courseId", course._id)
        if (currentValues.courseTitle !== course.courseName) {
          formData.append("courseName", data.courseTitle)
        }
        if (currentValues.courseImage !== course.thumbnail) {
          formData.append("thumbnailImage", data.courseImage)
        }
        setLoading(true)
        const result = await editCourseDetails(formData, token)
        setLoading(false)
        if (result) {
        //  dispatch(setStep(2))
          dispatch(setCourse(result))
        }
      } else {
        toast.error("No changes made to the form")
      }
      console.log("printing form data",formData);
      console.log("printing rsult",result);

      return
    }
  */
    setLoading(true);
  const formData = new FormData();
  formData.append('courseImage', data.courseImage);
  formData.append('Teacher_id', Teacher_id);

  const result = await addCourseDetails(formData, token);

  if (result) {
    dispatch(setCourse(result));
  }

  setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >
      {/* Course Title */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseTitle">
          Subject Code <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="courseTitle"
          placeholder="Enter Course Code"
          {...register("courseTitle", { required: true })}
          className="form-style w-full"
        />
        {errors.courseTitle && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Subject Name is required
          </span>
        )}
      </div>
      
      
      
      {/* Course Thumbnail Image */}
      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />
      
      {/* SUBMIT Button */}
      <div className="flex justify-end gap-x-2">
        
        <IconBtn
          disabled={loading}
          text={!editCourse ? "Submit" : "Save Changes"}

        >
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  )
}