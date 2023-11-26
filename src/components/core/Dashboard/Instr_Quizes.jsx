
import "./Quizzes.css"

function Quizes() {
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
            title: "NodeJS Overview Quiz" ,
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


export default Quizes;