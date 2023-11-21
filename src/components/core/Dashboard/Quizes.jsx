function Quizes() {
    const quiz = 
    {
        title : "HTML QUIZ",
        description : "This course covers the basic concepts of HTML including creating and structuring web pages, adding text, links, images, and more.",
        level : 'Beginner',
        lessionNumber : 6,
        price : 999
    }


    return <div>
        <div className='card' style={{
            width: "400px",
            height: "max-content",
            margin: "1rem",
            padding: "1rem",
            display: "flex",
            flexDirection: 'column',
            background: "white"
        }}>
            <h1 style={{color: "yellow"}}>
                Hello
                {quiz.title}
            </h1>
        </div>
    </div>
}

export default Quizes;