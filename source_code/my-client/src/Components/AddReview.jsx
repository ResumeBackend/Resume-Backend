import React, { useState } from 'react';
import axios from 'axios';

const AddReview = (props) => {
  const [name, setName] = useState('');
  const [review, setReview] = useState('');
  const [pwd, setPwd] = useState('');
  const [done, setDone] = useState(false);
  const [fail, setFail] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
        name: name,
        review: review,
        pwd: pwd,
      };
    axios.post(`${props.host}/addReview`, formData)
    .then(function (response) {
      // Success

    })
    .catch(function (response) {
    //handle error
    console.log(response);
    setFail(true)
    });

    setDone(true)
  };

  if (done)
  {
    if (fail)
    {
      return (
        <div style = {{
          display: 'flex', 
          padding: '20%', 
          alignItems: 'center',
          flexDirection: 'column',}}>
  
          <h1 style = {{color: 'rgb(92, 119, 226)'}}>Oh no!</h1>
          <p style = {{ color: 'gray'}}>There was an error submitting the review.</p>
        </div>
        )
    }
    else
    {
      // Success
      return (
      <div style = {{
        display: 'flex', 
        padding: '20%', 
        alignItems: 'center',
        flexDirection: 'column',}}>

        <h1 style = {{color: 'rgb(92, 119, 226)'}}>Success!</h1>
        <p style = {{ color: 'gray'}}>Your review has been added.</p>
      </div>
      )
    }
  }

  // Message not yet sent: Show form

  return (
    <div style = {{margin:'20px', display: 'flex',
    
    alignItems: 'center',
    flexDirection: 'column',
    }}>
        <img src = 'email.png' alt="email icon" width= "100px"></img>
        <p style={{ fontSize:'30px', fontWeight:'100', textAlign: 'center'}}>ADD REVIEW</p>
        <div >
            <form onSubmit={handleSubmit} >
              <input style = {{margin:'5px'}}type="text" class='form-control  'value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
              <textarea style = {{margin:'5px', height: '200px'}}class='form-control  'value={review} onChange={(e) => setReview(e.target.value)} placeholder="Review" required />
              <input style = {{margin:'5px'}}type="password" class='form-control  'value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Password" required/>

              <button type="submit" class="btn btn-light">Add</button>
            </form>
        </div>
    </div>
  );
};

export default AddReview;