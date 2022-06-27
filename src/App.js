import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogCreationForm from './components/BlogCreationForm'
import LoginForm from './components/LoginForm'
import NotificationBar from './components/NotificationBar'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState('')
  const [notificationType, setNotificationType] = useState('')
  const blogCreationFormRef = useRef()

  useEffect( () => {
    async function getData() {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    getData()
  }, [])

  useEffect(() => {
    const existingLoggedUserJson = window.localStorage.getItem('loggedUser')
    if(existingLoggedUserJson) {
      const user = JSON.parse(existingLoggedUserJson)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const flashNotification = (message, type) => {
    setNotification(message)
    setNotificationType(type)
    setTimeout(() => { setNotification('') }, 5000)
    setTimeout(() => { setNotificationType('') }, 5000)
  }

  const handleLogout = () => {
    console.log('Logging out')
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      console.log('Got user', user)
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch(error) {
      console.log('Got error', error)
      flashNotification('Invalid username or password','Error')
    }
  }

  const addBlog = (blogObject) => {
    blogService.create(blogObject)
    .then((addedBlog) => {
      setBlogs(blogs.concat(addedBlog))
      blogCreationFormRef.current.toggleVisibility()
      flashNotification('Blog creation successful', 'Info')
    })
    .catch((error) => {  
      console.log('Got error', error)
      flashNotification('Blog creation failed', 'Error')
    })
  }

  const addLike = (blogObject, id) => {
    console.log('Adding like to', blogObject)
    blogService.update(blogObject, id)
    .then(updatedBlog => {
      const blogsCopy = blogs.slice()
      const replaceIndex = blogsCopy.findIndex(b => b.id === id)
      const modifiedBlogs = blogsCopy.fill(updatedBlog, replaceIndex, replaceIndex + 1)
      setBlogs(modifiedBlogs)
    })
    .catch((error) => {
      console.log('Got error', error)
      flashNotification('Like operation failed', 'Error')
    })
  }

  const handleUsernameChange = ({ target }) => { setUsername(target.value) }
  const handlePasswordChange = ({ target }) => { setPassword(target.value) }

  if(user === null) {
    return (
      <div>
        <h2>Log in to the application</h2>
        <NotificationBar message={notification} type={notificationType} />
        <LoginForm
          handleLoginSubmit={handleLoginSubmit}
          handleUsernameChange={handleUsernameChange}
          handlePasswordChange={handlePasswordChange}
          username={username}
          password={password}
        />
      </div>
    )
  }
  return (
    <div>
      <h2>Blogs</h2>
      <NotificationBar message={notification} type={notificationType} />
      <div>
        {user.name} is logged in
        <button onClick={handleLogout} >Log out</button>
      </div>
      <h2>Create new</h2>
      <div>
        <Togglable buttonText={'Create new'} ref={blogCreationFormRef} >
          <BlogCreationForm addBlog={addBlog} />
        </Togglable>
      </div>
      <div>
        {blogs.map(blog => <Blog key={blog.id} blog={blog} addLike={addLike} /> )}
      </div>
    </div>
  )
}

export default App
