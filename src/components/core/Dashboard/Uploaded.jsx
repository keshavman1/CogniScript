// import RenderSteps1 from "./AddCourse/RenderSteps1";

// export default function AddCourse() {
//   return (
//     <div className="flex w-full items-start gap-x-6">
//       {/* First column */}
//       <div className="flex flex-1 flex-col">
//         <h1 className="mb-14 text-3xl font-medium text-richblack-5">
//           Questions Of Quiz ARE :

//         </h1>
//         <div className="flex-1">
//           <RenderSteps1 />
//         </div>
//       </div>

//       {/* Second column - Answered of the quiz are */}
//       <div className="sticky top-10 hidden max-w-[400px] flex-1 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 xl:block">
//         <p className="mb-8 text-lg text-richblack-5">Answers of the quiz are</p>
//         <ul className="ml-5 list-item list-disc space-y-4 text-xs text-richblack-5">
//           {/* List items */}
//         </ul>
//       </div>

//       {/* Third column - Add your third column here */}
//       {/* <div className="your-class-name">
//         Your content here
//       </div> */}
//     </div>
//   );
// }


import "./Instr_Quizes"

function Intr_Quizes() {
    const quiz = [
        {
            title: "CSS Fundamentals Quiz",
            instructor: "Rahul Sir",
        },
        {
            title: "JavaScript Basics Quiz",
            instructor: "Anita Ma'am",
        },
        {
            title: "ReactJS Introduction Quiz",
            instructor: "Vikas Sir",
        },
        {
            title: "Web Design Principles Quiz",
            instructor: "Neha Ma'am",
        },
        {
            title: "NodeJS Overview Quiz",
            instructor: "Amit Sir",
        },
        {
            title: "Advanced HTML Techniques Quiz",
            instructor: "Sonia Ma'am",
        },
        {
            title: "Advanced HTML Techniques Quiz",
            instructor: "Sonia Ma'am",
        },
    ]
    

    return <div className="cards" style={{
        paddingTop: "50px"
    }}>
{       quiz.map((q, index) => (
                <div 
                    key={index} 
                    className='card' 
                    style={{
                        width: "400px",
                        height: "max-content",
                        margin: "1rem",
                        padding: "1rem",
                        display: "flex",
                        flexDirection: 'column',
                        background: "white"
                    }}>
                    <h1 style={{color: "black"}}>
                        Hello {q.title}
                    </h1>
                    <button className="btn-red">
                        Open Quiz
                    </button>
                </div>
            ))}
    </div>
}


export default Intr_Quizes;
