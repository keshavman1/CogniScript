import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import "./Quizzes.css";

function Quizes() {
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setView] = useState(true); 
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState(Array.from({ length: 0 }, () => ''));
    const baseURL = 'http://localhost:4000'; // Your base URL

    const { user } = useSelector((state) => state.profile); // Access user profile from Redux

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await fetch(`${baseURL}/quizzes`);
                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }
                const data = await response.json();
                setQuizzes(data);
                console.log("THIS : ", data[0].questions);
                setQuestions(data[0].questions);
                setUserAnswers(Array.from({ length: data[0].questions.length }, () => ''));
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchQuizzes();
    }, [baseURL]);

    useEffect(() => {
        if (user) {
            setProfile(user);
        }
    }, [user]);

    const [profile, setProfile] = useState(null); 

    // Placeholder for user ID obtained after authentication
    // const userId = '6561820e510c0f0009bf1f89'; // Replace this with actual user ID after authentication

    return (
        <div>
            <div className='cards' style={{ paddingTop: "50px" }}> 
                {selectedQuiz && quizzes.map((quiz, index) => (
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
                            {quiz.uid}
                        </h1>
                        <p>Instructor: {quiz.teacher_id}</p>
                        <button className="btn-red" onClick={async () => {
                            try {
                                const response = await fetch(`${baseURL}/quizzes/${quiz.uid}`);
                                if (!response.ok) {
                                    throw new Error('Network response was not ok');
                                }
                                const quizData = await response.json();
                                setView(false);
                                setQuestions(quizData.questions);
                                setUserAnswers(Array.from({ length: quizData.questions.length }, () => ''));
                                console.log('Quiz data:', quizData);
                            } catch (error) {
                                console.error('Fetch error:', error);
                            }
                        }}>
                            Open Quiz
                        </button>
                    </div>
                ))}
            </div>
            
            {!selectedQuiz && (
                <div>
                    <button 
                        style={{
                            alignContent: "center",
                            justifyContent: "center",
                            marginLeft: "400px"             
                        }} 
                        className="btn-white" 
                        onClick={() => {
                            setView(true);
                        }}
                    >
                        Close Quiz
                    </button>

                    {questions.map((question, index) => (
                        <div 
                            key={index} 
                            className='card2' 
                            style={{
                                width: "1000px",
                                height: "max-content",
                                margin: "1rem",
                                padding: "1rem",
                                display: "flex",
                                flexDirection: 'column',
                                background: "white",
                            }}>
                            <h1 style={{color: "black", fontWeight: "bold"}}>
                                Question. {question}
                            </h1>
                            <br />
                            <textarea
                                value={userAnswers[index]}
                                onChange={(e) => {
                                    const updatedAnswers = [...userAnswers];
                                    updatedAnswers[index] = e.target.value;
                                    setUserAnswers(updatedAnswers);
                                }}
                                name={`answer-${index}`}
                                id={`answer-${index}`}
                                cols="100"
                                rows="5"
                                style={{
                                    borderColor: "black",
                                    borderWidth: "2px"
                                }}
                            />
                        </div>
                    ))}

<button
                style={{
                    alignContent: "center",
                    justifyContent: "center",
                    margin: "20px auto",
                    display: "block"
                }}
                className="btn-white"
                onClick={async () => {
                    console.log(user);
                    try {
                        const response = await fetch("http://localhost:4000/submitAnswers", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ profile, answers: userAnswers }), // Include user profile along with answers
                        });
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        console.log('Answers submitted successfully!');
                        // Clear user answers or perform any other action upon successful submission
                    } catch (error) {
                        console.error('Fetch error:', error);
                    }
                }}
            >
                Submit
            </button>
                </div>
            )}
        </div>
    );
}

export default Quizes;