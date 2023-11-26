import React, { useEffect, useState } from 'react';
import "./Quizzes.css";

function Quizes() {
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await fetch('http://localhost:4000/quizzes');
                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }
                const data = await response.json();
                setQuizzes(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchQuizzes();
    }, []);

    return (
        <div className="cards" style={{ paddingTop: "50px" }}>
            {quizzes.map((quiz, index) => (
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
                    <button className="btn-red" >
                        Open Quiz
                    </button>
                </div>
            ))}
        </div>
    );
}

export default Quizes;
