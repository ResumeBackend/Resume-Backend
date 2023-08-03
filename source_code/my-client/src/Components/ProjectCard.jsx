import React from "react";

const ProjectCard = props => {

    if (props.project)
    {

        function view()
        {
            props.view(props.project)
        }
        
        return( 
            <div id = "card-border" onClick = {view}> 
                
                <div className="card border-secondary mb-3" id = "card">
                    <div className="card-header">{(props.project.title)? props.project.title : "Project Name"}</div>
                    <div className="card-body text-secondary">
                        <div id = "project-preview">
                            <img src = {props.project.icon} alt = "Item" width = "150px" height = "150px" id = "card-img"
                            onError={event => {
                                // Load the default image
                                event.target.src = "default-img.jpg"
                                event.onerror = null
                            }}></img>
                            {/* Short description */}
                            <p style={{marginLeft: "10px"}}>{props.project.description}</p>
                        </div>
                    </div>
                </div>
        
            </div>
            )
        
    
    }

}

export default ProjectCard;