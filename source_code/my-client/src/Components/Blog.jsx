import React, {useState, forwardRef, useImperativeHandle} from "react";
import Post from "./Post";
import axios from 'axios';

const Blog = forwardRef((props, ref) => {

    const project = props.project
    const host = props.host
    const [postComponents, setPostComponents] = useState();
    const [first, setFirst] = useState(true)

     // Try to load the items on the first refresh
     if (first)
     {
        fetchPosts()
        setFirst(false)
     }

    // Fetch the posts from the databse for this project. Each project has an array of object id's. 
    // For each one, get the database item (post) and add it's metadata to the array.
    async function fetchPosts()
    {
        await axios.get(`${host}/getPosts/${project._id}`)
        .then((response) => {
            
            let posts = response.data

            // For each document, create a component and render it.
            refreshPosts(posts); // Populate the list with our items array from DB
          })
        .catch((res) => {
            console.log(res)
        })
    }
    
    // Clicked on a post in this blog thread (from child component.) Come upstream to here then to project page to open post
    function viewPost(post)
    {
        props.viewPost(post)
    }

    // TODO: Call this to add a new post, which will refresh after
    async function addPost(title, text) // date calculated in API
    {
        const post = {title: title, text: text, project_id: project._id, token: sessionStorage.getItem('id')}
        await axios.post(`${host}/addPost`, post)
        .then(function (response) {
        //finally...
        fetchPosts()
    
        })
        .catch(function (response) {
        //handle error
        console.log(response);
        });


        
    }

    // Edit a post
    async function editPost(title, text, id) // date calculated in API
    {
        const post = {title: title, text: text, id: id, token: sessionStorage.getItem('id')}
        await axios.post(`${host}/editPost`, post)
        .then(function (response) {
        //finally...
        fetchPosts()
    
        })
        .catch(function (response) {
        //handle error
        console.log(response);
        });


        
    }

    useImperativeHandle(ref, () => ({
        addPost, editPost, fetchPosts
      }));
    

    // Refresh the blog: Draw all components from DB entries
    function refreshPosts(posts)
    {
        let comps = [];

        if (posts.length === 0)
        {
            comps.push(<p style = {{fontWeight: 100, textAlign: 'center', marginTop: '20%'}}>No posts exist!</p>)

        }

        else
        {
            for (let i = 0; i < posts.length; i++)
            {
                comps.push(<Post post = {posts[i]} view = {viewPost} key={i} />)
            }
        }
        setPostComponents(comps);
    }

    // Prompt the modal for a new post
    function newPost()
    {
        document.getElementById('newPostModal').style.display = 'block';
        document.getElementById('title').value = ''
        props.newPost() // Tell the parent to nullify the previous post reference
    }


    // The UI for the blog
    return(
        <>
        {/* The admin new post button and the BLOG title text*/}
        <div id = "blog-header">
            <h3 style={{marginLeft: '0.1vw', margin: 'auto', fontWeight: '50', color: 'gray'}}>BLOG</h3>
            <div id="newproject" style={{ marginLeft: 'auto', display: sessionStorage.getItem('admin') === 'true' ? "flex" : "none" }}>
                <button type="button" className="btn btn-outline-secondary" id = "new-project-btn" onClick = {newPost}>New Post</button>
            </div>
        </div>
        <hr></hr>
        

        <div id = "posts">
            {postComponents}
        </div>
        

        
        </>
    )
})

export default Blog