import { RiEditBoxLine } from "react-icons/ri"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { formattedDate } from "../../../utils/dateFormatter"
import IconBtn from "../../common/IconBtn"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import { useState } from "react"
import { useEffect } from "react"
import { ToastProvider } from 'react-hot-toast';

const API_KEY = "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"

const maxRetries = 10;
let retries = 0;

async function makeOpenAIRequest(answerss, ans, j) {
  try {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: `Correct_answer should be - ${answerss[j][0]}\nStudent's Answer - ${ans} Compare the similarity between the two statements above. Just provide the score ranging from 0 to 10. No need for any extra sentences. If completely incorrect give a 0.`,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      console.error(`Request failed with status: ${response.status}`);
      return null;
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error making request:", error);
    return null;
  }
}

async function performOpenAIRequestWithRetry(answerss, ans, j) {
  while (retries < maxRetries) {
    const result = await makeOpenAIRequest(answerss, ans, j);

    if (result !== null) {
      return result;
    }

    retries += 1;
    const waitTime = Math.pow(2, retries) * 1000;
    console.log(`Retrying in ${waitTime / 1000} seconds...`);
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  console.error("Max retries reached. Unable to make a successful request.");
  return null;
}

const fetchQuizzes = async () => {
  let questionss, answerss;
  try {
    // Fetch quizzes
    const quizzesResponse = await fetch(`http://localhost:4000/quizzes`);
    if (!quizzesResponse.ok) {
      throw new Error('Failed to fetch quizzes');
    }
    const quizzesData = await quizzesResponse.json();
    questionss = quizzesData[0].questions;
    answerss = quizzesData[0].answers;
    // Fetch answers
    const answersResponse = await fetch(`http://localhost:4000/getAnswers`);
    if (!answersResponse.ok) {
      throw new Error('Failed to fetch answers');
    }
    const answersData = await answersResponse.json();
    for (const d of answersData) {
      let j = 0;
      const scoress = [];
      for (const ans of d.answers) {
    /*  ,
      })*/
      const datas = await performOpenAIRequestWithRetry(answerss, ans, j);

      if (datas) {
        console.log("DATA : ", datas);
        const sc = datas.choices[0].text.match(/\d+/);
        const score = parseInt(sc[0], 10);
        scoress.push(score);
        j = j + 1;
      } else {
        console.error("OpenAI request failed after retries.");
        // Handle failure as needed
      }
      }
      const scoreResponse = await fetch(`http://localhost:4000/generateResults`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coll : d.collection,
          SCORES : scoress,
          // Add other data if needed
        })
      })
      console.log("DONEONEON : ", scoress)
    }
  } catch (error) {
    // Check if the error is due to non-JSON response
    if (error instanceof SyntaxError) {
      console.error('Non-JSON response received. Check the server response:', error.message);
    } else {
      console.error('Error:', error);
    }
  }
};



export default function MyProfile() {
  const { user } = useSelector((state) => state.profile)
  const [selected, setSelected] = useState(true);
  const [scores, setScores] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchScores = async () => {
        try {
          const response = await fetch("http://localhost:4000/scores");
          const data = await response.json();
          setScores(data);
        } catch (error) {
          console.error('Error:', error);
        }
    };

    fetchScores();
}, []);

  const navigate = useNavigate()
  if (user?.accountType === ACCOUNT_TYPE.STUDENT)
  {
    return (
      <>
        <h1 className="mb-14 text-3xl font-medium text-richblack-5">
          My Profile
        </h1>
        <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
          <div className="flex items-center gap-x-4">
            <img
              src={user?.image}
              alt={`profile-${user?.firstName}`}
              className="aspect-square w-[78px] rounded-full object-cover"
            />
            <div className="space-y-1">
              <p className="text-lg font-semibold text-richblack-5">
                {user?.firstName + " " + user?.lastName}
              </p>
              <p className="text-sm text-richblack-300">{user?.email}</p>
            </div>
          </div>
          <IconBtn
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings")
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
          <div className="flex w-full items-center justify-between">
            <p className="text-lg font-semibold text-richblack-5">About QUIZ</p>
            <IconBtn
              text="Previous Records"
              onclick={() => {
                navigate("/dashboard/settings")
              }}
            >
              <RiEditBoxLine />
            </IconBtn>
            <IconBtn
              text="Upcoming Quizes"
              onclick={() => {
                navigate("/dashboard/quizes")
              }}
            >
              <RiEditBoxLine />
            </IconBtn>
          </div>
        </div>
        <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
          <div className="flex w-full items-center justify-between">
            <p className="text-lg font-semibold text-richblack-5">
              Personal Details
            </p>
            <IconBtn
              text="Edit"
              onclick={() => {
                navigate("/dashboard/settings")
              }}
            >
              <RiEditBoxLine />
            </IconBtn>
          </div>
          <div className="flex max-w-[500px] justify-between">
            <div className="flex flex-col gap-y-5">
              <div>
                <p className="mb-2 text-sm text-richblack-600">First Name</p>
                <p className="text-sm font-medium text-richblack-5">
                  {user?.firstName}
                </p>
              </div>
              <div>
                <p className="mb-2 text-sm text-richblack-600">Email</p>
                <p className="text-sm font-medium text-richblack-5">
                  {user?.email}
                </p>
              </div>
              <div>
                <p className="mb-2 text-sm text-richblack-600">Gender</p>
                <p className="text-sm font-medium text-richblack-5">
                  {user?.additionalDetails?.gender ?? "Add Gender"}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-y-5">
              <div>
                <p className="mb-2 text-sm text-richblack-600">Last Name</p>
                <p className="text-sm font-medium text-richblack-5">
                  {user?.lastName}
                </p>
              </div>
              <div>
                <p className="mb-2 text-sm text-richblack-600">Phone Number</p>
                <p className="text-sm font-medium text-richblack-5">
                  {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
                </p>
              </div>
              <div>
                <p className="mb-2 text-sm text-richblack-600">Date Of Birth</p>
                <p className="text-sm font-medium text-richblack-5">
                  {formattedDate(user?.additionalDetails?.dateOfBirth) ??
                    "Add Date Of Birth"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
  else if (user?.accountType === ACCOUNT_TYPE.INSTRUCTOR)
  {
    if(selected) {
      return (
        <>
          <h1 className="mb-14 text-3xl font-medium text-richblack-5">
            My Profile
          </h1>
          <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
            <div className="flex items-center gap-x-4">
              <img
                src={user?.image}
                alt={`profile-${user?.firstName}`}
                className="aspect-square w-[78px] rounded-full object-cover"
              />
              <div className="space-y-1">
                <p className="text-lg font-semibold text-richblack-5">
                  {user?.firstName + " " + user?.lastName}
                </p>
                <p className="text-sm text-richblack-300">{user?.email}</p>
              </div>
            </div>
            <IconBtn
              text="Edit"
              onclick={() => {
                navigate("/dashboard/settings")
              }}
            >
              <RiEditBoxLine />
            </IconBtn>
          </div>
          
          <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
            <div className="flex w-full items-center justify-between">
              <p className="text-lg font-semibold text-richblack-5">
                Evaluate Quizzes
              </p>
              <IconBtn
                text="Evaluate"
                onclick={() => {
                 {/* navigate("/dashboard/settings") */}
                  
          
                  fetchQuizzes();
                }}
              >
                <RiEditBoxLine />
              </IconBtn>
            </div>
            {/* <div className="flex max-w-[500px] justify-between">
              <div className="flex flex-col gap-y-5">
                <div>
                  <p className="mb-2 text-sm text-richblack-600">First Name</p>
                  <p className="text-sm font-medium text-richblack-5">
                    {user?.firstName}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-sm text-richblack-600">Email</p>
                  <p className="text-sm font-medium text-richblack-5">
                    {user?.email}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-sm text-richblack-600">Gender</p>
                  <p className="text-sm font-medium text-richblack-5">
                    {user?.additionalDetails?.gender ?? "Add Gender"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-y-5">
                <div>
                  <p className="mb-2 text-sm text-richblack-600">Last Name</p>
                  <p className="text-sm font-medium text-richblack-5">
                    {user?.lastName}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-sm text-richblack-600">Phone Number</p>
                  <p className="text-sm font-medium text-richblack-5">
                    {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-sm text-richblack-600">Date Of Birth</p>
                  <p className="text-sm font-medium text-richblack-5">
                    {formattedDate(user?.additionalDetails?.dateOfBirth) ??
                      "Add Date Of Birth"}
                  </p>
                </div>
              </div>
            </div> */}
          </div>
          <div className="flex w-full items-center justify-center">
              <IconBtn
                text="Scores"
                onclick={() => {                  
                  setSelected(false);
                }}
              >
                <RiEditBoxLine />
              </IconBtn>
            </div>
        </>
      )
    }else {
      return (
        <>
          <div className="cards">
            {
              scores.map((score, index) => (
                
                <div className="card2" style={
                  {
                    display: "flex",
                    direction: "column"
                  }
                }>
                  <h1 className="course-name">
                    {score.name}
                  </h1>
              
                  <div className="course-name">
                    {score.SCORES}
                  </div>
                </div>
              ))
            }
          </div>
          <button className="btn-white" onClick={() => setSelected(true)} style={{
            marginLeft: "405px",
            marginTop: "30px"
          }}>
            Back
          </button>
        </>
      );
    }    
  }
}