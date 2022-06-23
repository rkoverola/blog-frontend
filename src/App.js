import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const existingLoggedUserJson = window.localStorage.getItem('loggedUser')
    if(existingLoggedUserJson) {
      const user = JSON.parse(existingLoggedUserJson)
      setUser(user)
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
      setUser(user)
      setUsername('')
      setPassword('')
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
      <div>
        {blogs.map(blog => <Blog key={blog.id} blog={blog} /> )}
      </div>
    </div>
  )
}

export default App
