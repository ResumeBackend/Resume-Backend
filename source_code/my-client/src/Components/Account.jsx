import React from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Account = (props) => 
{
    const host = props.host

    const navigate = useNavigate();
    loadAccount() // fetch current details

    function loadAccount()
    {
        // fetch current username and password, store them if empty (component mounting)
        if (!document.getElementById("passwordInput")?.value && !document.getElementById("usernameInput")?.value && props.token())
        {
            let data = {'username': props.token()}
            
            axios.post(`${host}/get-password`, data) //post the username, get the password
            .then(function (response) {
                document.getElementById("passwordInput").value = response.data.password // display current password
                document.getElementById("usernameInput").value = props.token()
            })
            .catch(function (response) {
                //handle error
                console.log(response);
            });
        }
    }

    //update DB and user token on session storage
    function updateAccount()
    {
        let newPassword = document.getElementById("passwordInput").value
        let newUsername = document.getElementById("usernameInput").value
        let oldUsername = props.token()
        
        props.setToken(newUsername)

        let data = {'username': newUsername, 'password': newPassword, 'oldUsername': oldUsername}

        axios.post(`${host}/update-account`, data)

        navigate('/account'); // re render
         
    }

    //logout of this account
    function logout()
    {
        sessionStorage.clear()
        navigate('/')
        window.location.reload()
    }
    
    function validateData()

    {
        let valid = true
        // return false if no password is present
        if (! document.getElementById("passwordInput").value || ! document.getElementById("usernameInput").value)
            valid = false

        if (valid) // entries are syntactically good...
        {
            // Now, we must check and make sure the username is available
            let username = document.getElementById("usernameInput").value
            let data = {'username': username}
            let myname = props.token()
            // we need to check the database for this username
            axios.post(`${host}/getUser`, data)
            .then(function (response) {
                
                if (!response.data["exists"] || username === myname) // Username available! Or, its my username!
                {
                    document.getElementById('login-btn').disabled = false;
                    document.getElementById("errorMsg").style.display = "none"
                      
                }
                else
                {
                    document.getElementById('login-btn').disabled = true;
                    error("username taken!")
                }

                
            })
        }
        else // Syntax is bad, user or pass is empty
        {
            document.getElementById("errorMsg").style.display = "none"
            document.getElementById('login-btn').disabled = true;
        }
        
    }
    // display this error
    function error(err)
    {
        document.getElementById("errorMsg").style.display = "flex"
        document.getElementById("errorMsg").innerHTML = err
    }

    //show password
    function mouseoverPass() {
        let obj = document.getElementById('passwordInput');
        obj.type = 'text';
      }
      function mouseoutPass() {
        let obj = document.getElementById('passwordInput');
        obj.type = 'password';
      }



    return(

        <div style = {{margin:'20px', display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'}}>
            <p style={{ fontSize:'30px', fontWeight:'100'}}>MODIFY ACCOUNT</p>
                <form>
                    <div className="form-group">
                        <label style = {{marginLeft:'5px'}}>Username</label>
                        <input style = {{margin:'5px'}} type="text" className="form-control" onInput={validateData} id="usernameInput"  placeholder="Enter username"></input>
                    </div>

                    <div className="form-group">
                        <label style = {{marginLeft:'5px'}}>Password</label>
                        <img src="eye.png" id="eye" alt="O" width="23px" onMouseOver={mouseoverPass} onMouseOut={mouseoutPass} />
                        <input style = {{margin:'5px'}} type="password" className="form-control" onInput={validateData} id="passwordInput" placeholder="Enter password"></input>
                        
                    </div>

                    <p id = "errorMsg">Error msg</p>

                    <div style = {{margin:'5px', display:'flex', justifyContent:'space-between'}}>
                        <button type="button" className="btn btn-outline-secondary" id = "login-btn" onClick = {logout}>Logout</button>
                        <button style = {{marginRight:'-10px'}}type="button" className="btn btn-outline-primary" id = "login-btn" onClick = {updateAccount}>Update</button>

                        
                    </div>
                </form>
        </div>
    
       
      )
}

export default Account;