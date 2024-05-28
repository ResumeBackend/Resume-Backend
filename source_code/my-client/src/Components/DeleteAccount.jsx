import React, { useState } from 'react';


export default function DeleteAccount() {
    const [deleted, setDeleted] = useState(false)
    const [username, setUsername] = useState('')
    const [pass, setPass] = useState('')

   
    if (deleted)
        return <div style = {{display: "flex", flexDirection: "column",  alignItems: "center", marginTop: "100px"}}>
            <p>If an account with username {username} exists,</p>
            <p>Click the link in your email to delete the account.</p>
        </div>

  return(
    <div>
        <div style = {{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        }}>
            <p style={{ fontSize:'30px', fontWeight:'100'}}>Delete Account</p>
                    <form>
                        <div className="form-group">
                            <input type="text" style = {{margin:'5px'}} onChange = {(e) => {setUsername(e.target.value)}}value = {username} className="form-control" id="usernameInput" placeholder="Username"></input>
                        </div>

                        <div className="form-group">
                            <input type="password" style = {{margin:'5px'}}  onChange = {(e) => {setPass(e.target.value)}}value = {pass} className="form-control" id="passwordInput" placeholder="Password"></input>
                        </div>


                        <div style = {{margin:'5px', marginTop:'15px'}}>
                            <button disabled = {!document.getElementById("usernameInput")?.value || !document.getElementById("passwordInput")?.value} type="button" className="btn btn-outline-primary" id = "login-btn" onClick = {() => {setDeleted(true)}}>Delete Account</button>
                         
                            
                        </div>

                    </form>
            </div>

            
        </div>

   
  )
}