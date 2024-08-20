import axios from 'axios';
import React, { useState} from "react";

const Welcome = (props) => {
    // eslint-disable-next-line
    const [joke, setJoke] = useState("")
    const [loaded, setLoaded] = useState(false)
    //get joke from Joke API

    const [adaptability, setAdaptability] = useState("Starting and operating a business alone had a large learning curve. I was required to learn a large degree of legal, marketing, estimation, scheduling, accounting, efficiency, customer relations and many more skills in order to achieve and maintain success. With regards to software, college forced my hand to independently learn many languages quickly, as well as various topics such as algorithms, hardware, software development, web, databases, theory etc. Regardless of the topics, I'm able to quickly pick up a new skill and excel at it.")
    const [timemanagement, setTimemanagement] = useState("During college, I learned to balance school work, programming projects, and my construction company. I also take down time seriously, as I feel a healthy balance is what keeps my creativity flowing, and prevents burnout.")
    const [interpersonal, setInterpersonal] = useState("Proficient in developing and maintaining positive client and employee relationships. Leveraged exceptional interpersonal skills from running my company through delivery of highly respected customer service and satisfaction. As a result, received consistent positive feedback and built a reputation for effective communication and collaboration. I'm excited to bring these same relationship-building abilities to the software industry!")
    const [leadership, setLeadership] = useState("I led a few software projects, most notably DocXtract, organizing and conducting meetings, assigning tasks, developing ideas and plans, as well as keeping the team on track and jumping in when members needed help. This project was the only one selected from the class to be displayed at the University Showcase. Additionally, owning and operating my construction company requires imense leadership and responsibility to manage all of the jobs, sub contractors, clients and maitenance. I was a Teaching Assistant for Intro to Computer Science at UAlbany, and created many software projects on my own.")
    const [skill, setSkill] = useState(leadership)
    const [about, setAbout] = useState("I studied physics, neuroscience & python at Binghamton University, and then continued my study of Computer Science at University at Albany. I made Dean's list every semester of college, and have a minor in Mathematics. I graduated a year early with a 4.0 GPA in 2023, and will earn my Masters this upcoming Spring.")


    // Load data if not yet loaded
    if (!loaded)
    {
        setLoaded(true)

        // Do we have it saved for this session?
        let content = JSON.parse(sessionStorage.getItem('content'));

        // If the value has not been set, fetch it and store it
        if (content === null || content === undefined) {
            axios.get(`${props.host}/getData`)
            .then((res) => {
                content = res.data[0] // Store it from the api

                // Store the content in sessionStorage
                sessionStorage.setItem('content', JSON.stringify(content))

                // Store the content in state
                setAdaptability(content['adaptability'])
                setTimemanagement(content['time'])
                setInterpersonal(content['interpersonal'])
                setLeadership(content['leadership'])
                setAbout(content['about'])
            })
            .catch((e) => {
                console.log(e)
            })
        } // end content fetch
        else
        {
            // Content was already locally stored so update the react state with its values
            setAdaptability(content['adaptability'])
            setTimemanagement(content['time'])
            setInterpersonal(content['interpersonal'])
            setLeadership(content['leadership'])
            setAbout(content['about'])
        }

    }

    


    // eslint-disable-next-line
    async function getJoke()
    {
        await axios.get('https://v2.jokeapi.dev/joke/Programming,Pun?blacklistFlags=nsfw,religious,racist&format=txt')
        .then((response) => {
            setJoke(response.data)
        })
    }

    // Download Resume
    const handleDownload = async () => {
        try {
          const response = await axios.get(`${props.host}/download/resume`, {
            responseType: 'blob', // Treat response as binary data
          });
    
          // Create a URL for the  blob response and initiate download
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'resume_peter_buonaiuto.pdf');
          document.body.appendChild(link);
          link.click();
          link.remove();
        } catch (error) {
          console.error('Error downloading file:', error);
        }
    }
    

    // activate the given skill <p>
    function setActive(clickedElement) {
        // Remove the "active" class from all nav-links
        const skills = document.getElementsByClassName('skill-listing');
        for (const skill of skills) {
          skill.classList.remove('active');
        }
      
        // Add the "active" class to the clicked nav-link
        clickedElement.classList.add('active');
      }

    function getAge()
    {
        const birthDate = '2002-10-26'
        const birthYear = new Date(birthDate).getFullYear();
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const age = currentYear - birthYear;
        
        // Check if the birthday for this year has already passed
        const birthMonth = new Date(birthDate).getMonth();
        const currentMonth = currentDate.getMonth();
        const birthDay = new Date(birthDate).getDate();
        const currentDay = currentDate.getDate();
        
        if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
            // Subtract 1 from age if the birthday has not occurred this year
            return age - 1;
        } else {
            return age;
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 90px)" }}>
          <div id="introduction" style={{ display: 'flex', justifyContent: 'left', padding: '20px' }}>
            <div id="welcome">
              <img id="logo" src="icon.png" width="200px" alt="logo" />
              <div style={{ marginTop: "20px" }}>
                <img id="helloworld" src="helloworld.gif" alt="gif" />
              </div>
            </div>
      
            <div style={{ maxWidth: "1000px" }}>
              <div style={{ display: 'inline-block' }}>
                <p className="blue-underline" style={{ fontSize: '25px', fontWeight: '100' }}>ABOUT ME</p>
              </div>
              <p>I'm {getAge()} years old from Long Island, New York.</p>
              <p>{about}</p>
              <p style={{ display: 'inline' }}>
                I acquired experience in project management and business through my construction company, 
              </p> 
              <a href='https://www.instagram.com/built.by.peter/' target="_blank" rel="noreferrer" style={{ display: 'inline', color: 'black', fontStyle: 'oblique' }}>
                Built By Peter LLC
              </a>
              <p style={{ display: 'inline' }}>
                , which I began operations at 14 and incorporated at 18. Whether it be building homes or software, I've always had a passion for creativity and production of things that are enjoyable to others.
              </p>
            </div>
          </div>
      
          <div id="resume" style={{ marginLeft: '20px', marginTop: 'auto' }}>
            <div style={{ display: 'block' }}>
              <div style={{ display: 'inline-block' }}>
                <p className='blue-underline' style={{ fontSize: '25px', fontWeight: '100' }}>SKILLS</p>
              </div>
            </div>
      
            <div style={{ display: 'flex' }}>
              <div style={{ borderRight: '1px solid gray', paddingRight: '20px' }}>
                <ul className="skills">
                  <li><p className='skill-listing active' onClick={(e) => { setSkill(leadership); setActive(e.currentTarget); }}>Leadership</p></li>
                  <li><p className='skill-listing' onClick={(e) => { setSkill(interpersonal); setActive(e.currentTarget); }}>Interpersonal</p></li>
                  <li><p className='skill-listing' onClick={(e) => { setSkill(adaptability); setActive(e.currentTarget); }}>Adaptability</p></li>
                  <li><p className='skill-listing' onClick={(e) => { setSkill(timemanagement); setActive(e.currentTarget); }}>Time Management</p></li>
                </ul>
              </div>
      
              <div style={{ display: "inline", margin: '20px', fontStyle: 'italic', width: '70%' }}>
                {/* Here is the skill content */}
                {skill}
              </div>
            </div>
      
            <button style={{ float: 'right', margin: '10px' }} type="button" className="btn btn-outline-primary" onClick={handleDownload}>Download Resume</button>
          </div>
        </div>
      );
      
      
}

export default Welcome;