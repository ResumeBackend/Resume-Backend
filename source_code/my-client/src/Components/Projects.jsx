import axios from 'axios';
import React, { useState, useRef, useEffect} from "react";
import ProjectCard from './ProjectCard';
import Blog from './Blog';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import FormData from 'form-data';

// React quill import
import ReactQuill from "react-quill"
import 'quill-video-embed';
import 'react-quill/dist/quill.snow.css'

const Projects = (props) => {

    // Quill
    const defaultProjectHtml = "Project content here"
    const defaultBlogHtml = "Post content here"
    
    const [convertedText, setConvertedText] = useState(defaultBlogHtml);
    const [projectHtml, setProjectHtml] = useState(defaultProjectHtml);
    const toolbarOptions = [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ list: 'bullet' }, { list: 'ordered' }],
        [{ align: [] }],
        [{ color: [] }],
        ['image', 'video', 'link'],
        [{ script: 'sub' }, { script: 'super' }, 'formula'],
      ];


    const [post, setPost] = useState()
    const [project, setProject] = useState(null)
    const [projectComponents, setProjectComponents] = useState();
    const host = props.host
    const { projectId } = useParams();
    const navigate = useNavigate();
    const BlogRef = useRef(null);

    const maxDescLength = 200
    const [descLength, setDescLength] = useState(0)



    // use effect - set project when mounts 
    useEffect(() => {
        // Component mounts
        getProjects()

        if (projectId)
        {
            // Clear the previous project
            
            // Ask the server to find the closest matching project for us
            axios.get(`${host}/findProject/${projectId}`)
            .then((response) => {
                setProject(response.data);
              })
            .catch((res) => {
                console.log(res)
            })
            
            
        }
        else{
            // When we are on the project navigation page, we must clear the previously viewed project. This is because
            // Once the component mounts, for a brief moment, it will try to load the previous project if it is valid before
            // the state updates. This causes the old project to be passed to the blog before the new project content
            // is loaded, causing the state to be out of date by one render. This solves that by making sure the old project
            // is removed from memory before the state updates when clicking on the new project.
            setProject(null)
        }
    
        return () => {
          // Clean up - component unmounts
        };
        // eslint-disable-next-line 
      }, [projectId]); // Empty array will execute effect during mount

    // Get the projects from DB
    async function getProjects()
    {
        await axios.get(`${host}/getProjects`)
        .then((response) => {
            
            let projects= []
            response.data.forEach((project, index) => 
            {
                projects.push({_id: project._id, title: project.title, date:project.date, description: project.description, icon: project.icon, html: project.html})
            })
            
            refreshList(projects); // Populate the list with our items array from DB
          })
        .catch((res) => {
            console.log(res)
        })
    }

    // Show the loaded projects in a list
    function refreshList(projects) {

        let comps = [];

        if (projects.length === 0)
        {
            comps.push(<h2>No projects exist!</h2>)

        }
        
        else
        {

            // Add each element that matches the filter
        for (let i = 0; i < projects.length; i++)
        {
            comps.push(<ProjectCard host = {host} project = {projects[i]} view = {viewProject} key={i} />)
        }
        
        }
        setProjectComponents(comps);
        
      
    }

    // View the selected project when clicked
    function viewProject(project)
    {
        navigate('/projects/'+project.title.replace(/\s/g, '').toLowerCase());

    }

    
    

    // New project creation
    function newProject()
    {
        document.getElementById('myModal').style.display = 'block';
        document.getElementById('title').value = ''
        document.getElementById('description').value = ''
        document.getElementById('image').value = ''

        setProject(null);
        setProjectHtml(defaultProjectHtml)
    }

    // Nullify post ref when making new post
    // Reset rich text entry
    function newPostClicked()
    {
        setPost(null)
        setConvertedText(defaultBlogHtml)
    }

    function closeModal()
    {
        document.getElementById('myModal').style.display = 'none';
    }

    function closePostModal()
    {
        document.getElementById('newPostModal').style.display = 'none';
    }

    function closeViewModal()
    {
        document.getElementById('viewPostModal').style.display = 'none';
    }

    function closeEditModal()
    {
        document.getElementById('editProjectModal').style.display = 'none';
    }

    // Submit was clicked. Add the project and close the modal.
    async function addProject()
    {
        let form = new FormData()
        form.set('image', document.getElementById('image').files[0])
        form.set('token', localStorage.getItem('id')) // for auth
        form.set('html', projectHtml)

        let im = ""
        if (document.getElementById('image').files.length > 0)
        {
            im = document.getElementById('image').files[0]
        }
        else{
            im = project.icon
        }
        
            
        

        // is it a new project or an update?
        if (!project)
        {
            form.set('title', document.getElementById('title').value)
            form.set('description', document.getElementById('description').value)
            await axios.post(`${host}/addProject`, form,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authentication: 'Bearer ...',
                },
                })
            .then(function (response) {
            getProjects();

            })
            .catch(function (response) {
            //handle error
            console.log(response);
            });

            closeModal()
        }
        else // editing
        {
            let proj = {_id: project._id, title: document.getElementById('title_editProject').value, date:project.date, description: document.getElementById('description_editProject').value, icon: im, html: projectHtml}

            // Update the HTML on the page
            document.getElementById('projectHtml').innerHTML = projectHtml
            form.set('title', document.getElementById('title_editProject').value)
            form.set('description', document.getElementById('description_editProject').value)
            form.set('id', project._id)
            await axios.post(`${host}/editProject`, form,   
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authentication: 'Bearer ...',
                },
                })
            .then(function (response) {
                setProject(proj)
                getProjects();
        
            })
            .catch(function (response) {
                console.log(response)
            });
        }
        
        closeEditModal()
    }

    // View this blog post by openining a modal. Called from the blog component.
    function viewPost(post)
    {
        //post should have .title, .date, .text
        document.getElementById('viewPostModal').style.display = 'block'
        // set html
        document.getElementById('postContent').innerHTML = post.text
        setPost(post)
    }

    // Clicked submit to add a post. Must add the post and refrsh
    // Check if we are adding or editing!
    function addPost()
    {
        let title = document.getElementById('title').value
        
        // Are we adding a new post?
        if (!post)
        {
            if (BlogRef.current) {
                BlogRef.current.addPost(title, convertedText);
              }
        }
        else // we are editing because post is valid
        {
            if (BlogRef.current) {
                BlogRef.current.editPost(title, convertedText, post.id);
                BlogRef.current.fetchPosts();
              }
        }
        
        closePostModal()
    }

    // Edit post called - open edit modal and fill in values
    function editPost()
    {
        document.getElementById('viewPostModal').style.display = 'none';
        document.getElementById('newPostModal').style.display = 'block';

        document.getElementById('title').value = post.title;
        setConvertedText(post.text)
    }
    
    // Edit project called - open edit modal and fill in values
    function editProject()
    {
        document.getElementById('editProjectModal').style.display = 'block';

        document.getElementById('title_editProject').value = project.title;
        document.getElementById('description_editProject').value = project.description;
        updateDescLength()
        setProjectHtml(project.html)
    }

    function updateDescLength()
    {
        setDescLength(document.getElementById('description_editProject')?.value.length)
    }

    // UI FOR SPECIFIC PROJECT PAGE
    if (projectId && project)
    {
        return(
            <>
            <h3 onClick= {localStorage.getItem('admin') === 'true' ? editProject: null} style={{display: "inline", cursor: 'pointer', fontWeight: '100', color: 'gray', marginLeft: '10px', position: 'relative', top: "-4.2rem"}}>{project.title.toUpperCase()}</h3>

            {/* Inject project html here */}
            <div class = 'ql-editor'id = "projectHtml" style = {{width: '80%'}} dangerouslySetInnerHTML={{ __html: project.html.replace('/inventory" rel="noopener noreferrer" target="_blank"', '/inventory" rel="noopener noreferrer" target="_self"') }}></div>


            {/* To the right side we need to display this blog */}
            <div id = "blog">
                <Blog ref = {BlogRef} viewPost = {viewPost} newPost = {newPostClicked} host = {host} project={project}></Blog>
            </div>

            {/* New post modal */}
            <div id="newPostModal" class="modal">
                <div class="modal-content">

                    <div class="header">
                        <div class="left-section">
                            {/* <span id="editIcon" class="icon" onclick={editPost}>Edit</span> */}
                        </div>
                        <div class="right-section">
                            <span id="closeIcon" class="icon" onClick={closePostModal}>Close</span>
                        </div>
                    </div>

                    
                    <label for="title">Title:</label>
                    <input  class="form-control" type="text" id="title"></input>
                    

                    {/* Quill Content  */}
                    <ReactQuill
                        theme='snow'
                        value={convertedText}
                        onChange={setConvertedText}
                        style={{minHeight: '200px', marginTop: '20px'}}
                        modules={{
                            toolbar: toolbarOptions
                          }}
                    />
                    
                    <button type="button" onClick={addPost}>Submit</button>
                </div>
            </div>

            {/* View post modal */}
            <div id="viewPostModal" class="modal">
                <div class="modal-content">

                    <div class="header">
                        <div class="left-section">
                            <span id="editIcon" class="icon" onClick={editPost} style={{display: localStorage.getItem('admin') === 'true' ? 'inline-block': 'none'}}>Edit</span>
                        </div>
                        <div class="right-section">
                            <span id="closeIcon" class="icon" onClick={closeViewModal}>Close</span>
                        </div>
                    </div>
                    
                    {/* Title */}
                    <div>
                        <h3 style={{ marginTop: '20px', fontWeight: '100'}}>{post?.title}</h3>
                        <p style={{ marginTop: '2px', fontWeight: '100'}}>{post?.date}</p>
                    </div>
                    <hr></hr>
                    <div class = 'ql-editor' id = "postContent">
                        {/* Content injected here */}
                    </div>
                </div>
            </div>


            {/* Edit project modal */}
            <div id="editProjectModal" class="modal">
                <div class="modal-content">
                    <div class="header">
                        <div class="left-section">
                            
                        </div>
                        <div class="right-section">
                            <span id="closeIcon" class="icon" onClick={closeEditModal}>Close</span>
                        </div>
                    </div>

                    <label for="image">Image:</label>
                    <input type="file"  class="form-control" id="image" accept="image/*"></input>
                    
                    <label for="title">Title:</label>
                    <input type="text" class="form-control" id="title_editProject"></input>
                    
                    <label for="description">Description:</label>
                    <textarea maxLength={maxDescLength} id="description_editProject"  onChange= {updateDescLength}class="form-control"  ></textarea>
                    <p>{descLength}/{maxDescLength}</p>

                    {/* Quill Content  */}
                    <h3 style={{ marginTop: '20px', fontWeight: '100'}}>Project Page</h3>
                    <ReactQuill
                            theme='snow'
                            value={projectHtml}
                            onChange={setProjectHtml}
                            style={{minHeight: '200px', marginTop: '5px'}}
                            modules={{
                                toolbar: toolbarOptions
                                
                            }}
                        />
                    
                    <button type="button" onClick={addProject}>Submit</button>
                </div>
            </div>

            </>
        )
    }

    // UI FOR PROJECT NAVIGATION MENU
    else return(
    <div>
        <h3 style={{display: 'inline', fontWeight: '100', color: 'gray', marginLeft: '10px', position: 'relative', top: "-4.2rem"}}>PETER BUONAIUTO</h3>

        {/* Admins get a new project button */}
        <div id="newproject" style={{ top: '-2rem', position: 'relative', width: '100%', float:'right', display: localStorage.getItem('admin') === 'true' ? "inline-block" : "none" }}>
            <button type="button" className="btn btn-light" id = "new-project-btn" onClick = {newProject}>New Project</button>
        </div>

        {/* New project modal */}
        <div id="myModal" class="modal">
            <div class="modal-content">
                <span class="close" onClick={closeModal}>&times;</span>
                <label for="image">Image:</label>
                <input  class="form-control" type="file" id="image" accept="image/*"></input>
                
                <label for="title">Title:</label>
                <input  class="form-control" type="text" id="title"></input>
                
                <label for="description">Description:</label>
                <textarea  class="form-control" id="description"></textarea>

                {/* Quill Content  */}
                <h3 style={{ marginTop: '20px', fontWeight: '100'}}>Project Page</h3>
                <ReactQuill
                        theme='snow'
                        value={projectHtml}
                        onChange={setProjectHtml}
                        style={{minHeight: '200px', marginTop: '5px'}}
                        modules={{
                            toolbar: toolbarOptions
                          }}
                    />
                
                <button type="button" onClick={addProject}>Submit</button>
            </div>
        </div>

        <div>
            {projectComponents}
        </div>
    </div>
    )
}

export default Projects;