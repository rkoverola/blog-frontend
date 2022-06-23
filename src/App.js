import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const handleLoginSubmit = (event) => {
    event.preventDefault()
    console.log('Got login', username, password)
  }

  return (
    <div>
      <h2>Log in to the application</h2>
      <form onSubmit={handleLoginSubmit} >
        <div>
          Username <input type={'text'} onChange={({ target }) => { setUsername(target.value) }} />
        </div>
        <div>
          Password <input type={'password'} onChange={({ target }) => { setPassword(target.value) }} />
        </div>
        <div>
          <button type='submit'>Login</button>
        </div>
      </form>
      <h2>Blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
