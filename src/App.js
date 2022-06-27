import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const BlogCreationForm = ({handleBlogSubmit, handleTitleChange, handleAuthorChange, handleUrlChange, title, author, url}) => {
  return (
    <form onSubmit={handleBlogSubmit} >
      <div>
        Title <input type={'text'} value={title} onChange={handleTitleChange} />
      </div>
      <div>
        Author <input type={'text'} value={author} onChange={handleAuthorChange} />
      </div>
      <div>
        URL <input type={'text'} value={url} onChange={handleUrlChange} />
      </div>
      <div>
        <button type='submit'>Create</button>
      </div>
    </form>
  )
}

const LoginForm = ({handleLoginSubmit, handleUsernameChange, handlePasswordChange, username, password}) => {
  return (
    <form onSubmit={handleLoginSubmit} >
      <div>
        Username <input type={'text'} value={username} onChange={handleUsernameChange} />
      </div>
      <div>
        Password <input type={'password'} value={password} onChange={handlePasswordChange} />
      </div>
      <div>
        <button type='submit'>Login</button>
      </div>
    </form>
  )
}

const NotificationBar = ({ message, type }) => {
  return (
    <h3 className={type}>{message}</h3>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notification, setNotification] = useState('')
  const [notificationType, setNotificationType] = useState('')

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

  const handleBlogSubmit = async (event) => {
    event.preventDefault()
    try {
      console.log('Submitting', title, author, url)
      const blogObject = {
        title: title,
        author: author,
        url: url
      }
      const addedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(addedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      flashNotification('Blog creation successful', 'Info')
    } catch(error) {
      console.log('Got error', error)
      flashNotification('Blog creation failed', 'Error')
    }
  }

  const handleUsernameChange = ({ target }) => { setUsername(target.value) }
  const handlePasswordChange = ({ target }) => { setPassword(target.value) }
  const handleTitleChange = ({ target }) => { setTitle(target.value) }
  const handleAuthorChange = ({ target }) => { setAuthor(target.value) }
  const handleUrlChange = ({ target }) => { setUrl(target.value) }

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
        <Togglable buttonText={'Create new'} >
          <BlogCreationForm 
            handleBlogSubmit={handleBlogSubmit}
            handleTitleChange={handleTitleChange}
            handleAuthorChange={handleAuthorChange}
            handleUrlChange={handleUrlChange}
            title={title}
            author={author}
            url={url}
          />
        </Togglable>
      </div>
      <div>
        {blogs.map(blog => <Blog key={blog.id} blog={blog} /> )}
      </div>
    </div>
  )
}

export default App
