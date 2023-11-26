import React, { useEffect, useState } from 'react';
import "./Quizzes.css";

function Quizes() {
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setView] = useState(true); 
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await fetch('http://localhost:4000/quizzes');
                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }
                const data = await response.json();
                setQuizzes(data);
                console.log(data);
                setQuestions(data[0].questions);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchQuizzes();
    }, []);

    console.log(questions);

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
                    <h1 style={{color: "black"}}>`
                        {quiz.uid}
                    </h1>
                    <p>Instructor: {quiz.teacher_id}</p>
                    <button className="btn-red" onClick={async () => {
                        try {
                            const response = await fetch(`http://localhost:4000/quizzes/${quiz.uid}`);
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            const quizData = await response.json();
                            setView(false);
                            setQuestions(quizData.questions);
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
            
            {
                !selectedQuiz && <button style={{
                    alignContent: "center",
                    justifyContent: "center",
                    marginLeft: "400px"             
                }} className="btn-white" onClick={() => {
                    setView(true);
                }}>
                Close Quiz
                </button>
            }

            {!selectedQuiz && questions.map((question, index) => (
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
                    <textarea name="" id="" cols="100" rows="5" style={{
                        borderColor: "black", borderWidth: "2px"}} />
                </div>
            ))}
        </div>
    );
}

export default Quizes;
