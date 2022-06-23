import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

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
    } catch(error) {
      console.log('Got error', error)
    }
  }

  if(user === null) {
    return (
      <div>
        <h2>Log in to the application</h2>
        <form onSubmit={handleLoginSubmit} >
          <div>
            Username <input type={'text'} value={username} onChange={({ target }) => { setUsername(target.value) }} />
          </div>
          <div>
            Password <input type={'password'} value={password} onChange={({ target }) => { setPassword(target.value) }} />
          </div>
          <div>
            <button type='submit'>Login</button>
          </div>
        </form>
      </div>
    )
  }
  return (
    <div>
      <h2>Blogs</h2>
      <div>
        {user.name} is logged in
        <button onClick={handleLogout} >Log out</button>
      </div>
      <h2>Create new</h2>
      <div>
        <form onSubmit={handleBlogSubmit} >
          <div>
            Title <input type={'text'} value={title} onChange={({ target }) => { setTitle(target.value) }} />
          </div>
          <div>
            Author <input type={'text'} value={author} onChange={({ target }) => { setAuthor(target.value) }} />
          </div>
          <div>
            URL <input type={'text'} value={url} onChange={({ target }) => { setUrl(target.value) }} />
          </div>
          <div>
            <button type='submit'>Create</button>
          </div>
        </form>
      </div>
      <div>
        {blogs.map(blog => <Blog key={blog.id} blog={blog} /> )}
      </div>
    </div>
  )
}

export default App
