import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import './Quizzes.css';

function Quizes() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setView] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [baseURL] = useState('http://localhost:4000');
  const { user } = useSelector((state) => state.profile);
  const [showThankYou, setShowThankYou] = useState(false);
  const [profile, setProfile] = useState(null);
  const [time, setTime] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(`${baseURL}/quizzes`);
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        setQuizzes(data);
        setQuestions(data[0]?.questions || []);
        setUserAnswers(Array(data[0]?.questions.length).fill(''));
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

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        if (time > 0) {
          setTime((prevTime) => prevTime - 1);
        } else {
          clearInterval(interval);
          submitQuiz();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [time, timerActive]);

  const resetQuizState = () => {
    setView(true);
    setTimerActive(false);
    setShowThankYou(false);
    setQuizSubmitted(false);
  };

  const submitQuiz = async () => {
    try {
      const response = await fetch(`${baseURL}/submitAnswers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profile, answers: userAnswers }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      console.log('Answers submitted successfully!');
      setShowThankYou(true);
      setQuizSubmitted(true);

      // Display a toast when the quiz is submitted
      toast.success('Quiz Submitted');

    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      {timerActive && (
        <div
          className="timer"
          style={{
            position: 'fixed',
            top: '9px',
            right: '150px',
            color: time <= 60 ? 'red' : 'white',
            fontWeight: '600',
            fontSize: '20px',
            border: '2px solid red',
            padding: '5px',
          }}
        >
          Timer: {formatTime(time)}
        </div>
      )}

      <div className="cards" style={{ paddingTop: '50px' }}>
        {quizzes.map((quiz, index) => (
          <div
            key={index}
            className="card"
            style={{
              width: '400px',
              height: 'max-content',
              margin: '1rem',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              background: 'white',
            }}
          >
            <h1 style={{ color: 'black' }}>{quiz.uid}</h1>
            <p>Instructor: {quiz.teacher_id}</p>
            {(selectedQuiz || quizSubmitted) && (
              <button
                className={`btn-red`}
                onClick={async () => {
                  if (!showThankYou && !quizSubmitted) {
                    try {
                      const response = await fetch(`${baseURL}/quizzes/${quiz.uid}`);
                      if (!response.ok) {
                        throw new Error('Network response was not ok');
                      }
                      const quizData = await response.json();
                      setView(false);
                      setQuestions(quizData.questions || []);
                      setUserAnswers(Array(quizData.questions.length).fill(''));
                      setTime(60);
                      setTimerActive(true);
                      console.log('Quiz data:', quizData);
                    } catch (error) {
                      console.error('Fetch error:', error);
                    }
                  }
                }}
                disabled={!selectedQuiz || quizSubmitted} 
              >
                {'Open Quiz'}
              </button>
            )}
          </div>
        ))}
      </div>

      {!selectedQuiz && (
        <div>
          <button
            style={{
              alignContent: 'center',
              justifyContent: 'center',
              marginLeft: '400px',
            }}
            className="btn-white"
            onClick={resetQuizState}
          >
            Close Quiz
          </button>

          {showThankYou && <div className="quiz-submitted-message">Quiz submitted. Thank you!</div>}

          {questions.map((question, index) => (
            <div
              key={index}
              className="card2"
              style={{
                width: '1000px',
                height: 'max-content',
                margin: '1rem',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                background: 'white',
              }}
            >
              <h1 style={{ color: 'black', fontWeight: 'bold' }}>Question. {question}</h1>
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
                  borderColor: 'black',
                  borderWidth: '2px',
                }}
              />
            </div>
          ))}

          <button
            style={{
              alignContent: 'center',
              justifyContent: 'center',
              margin: '30px auto',
              display: 'block',
            }}
            className={`btn-white ${showThankYou || quizSubmitted ? 'btn-disabled' : ''}`}
            onClick={() => {
              setTimerActive(false);
              submitQuiz();
              resetQuizState();
            }}
          >
            Submit Quiz
          </button>
        </div>
      )}
    </div>
  );
}

export default Quizes;
