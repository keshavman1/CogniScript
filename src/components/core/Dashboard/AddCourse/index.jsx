import RenderSteps from "./RenderSteps"

export default function AddCourse() {
  return (
    <>
      <div className="flex w-full items-start gap-x-6">
        <div className="flex flex-1 flex-col">
          <h1 className="mb-14 text-3xl font-medium text-richblack-5">
            Add New Quiz
          </h1>
          <div className="flex-1">
            <RenderSteps />
          </div>
        </div>
        {/* Course Upload Tips */}
        <div className="sticky top-10 hidden max-w-[400px] flex-1 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 xl:block">
          <p className="mb-8 text-lg text-richblack-5">⚡ Course Upload Tips</p>
          <ul className="ml-5 list-item list-disc space-y-4 text-xs text-richblack-5">
            <li>Upload the Quiz in doc/docx format only.</li>
            <li>The required format for Questions is like : "Q1. What is the time complexity of the quicksort algorithm in the average case?".
                Every Question must start with 'Q' followed by the number.</li>
            <li>The required format for Answers is like : "Ans1. The average-case time complexity of Quicksort is O(n log n).".</li>
            <li>
              There is no need to mention any other information. Mention the Subject Code from these:
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

