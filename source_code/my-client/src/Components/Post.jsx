import React from "react";

const Post = props => {

    if (props.post)
    {
        // Called when we click on it - go to parent project page and display this post data!
        function view()
        {
            props.view(props.post)
        }
        
        return( 
            <div id = "post" onClick={view}>
                <p id = "post-date">{props.post.date}</p>
                <p>{props.post.title}</p>
            </div>
            )
    }
}

export default Post;