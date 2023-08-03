
import { NavLink } from "react-router-dom";

const Nav = props => {


        return (
            <>
            
            <div id = "nav">
                <div class="navbar-container">
                    
                    <ul class="navbar">
                        <li><NavLink to = "/">Welcome</NavLink></li>
                        <li><NavLink to = "/projects">Projects</NavLink></li>
                        <li><NavLink to = "/contact">Contact</NavLink></li>
                        <li><NavLink to = {props.token()? "/account": "/login"} key = "1">{props.token()? "My Account": "Login"}</NavLink></li>
                    </ul>
                
                </div>
                <hr></hr>
            </div>

            
            </>
        )
    }

    

export default Nav;