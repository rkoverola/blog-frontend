import { useState } from 'react'

const Blog = ({blog}) => {
  
  const [minimized, setMinimized] = useState(true)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const additionalInfoStyle = minimized
    ? { display: 'none' }
    : { display: '' }
  
  const buttonText = minimized
    ? 'View'
    : 'Hide'

  const toggleMinimized = () => { setMinimized(!minimized) }

  return (
  <div style={blogStyle} >
    <div>
      {blog.title} {blog.author}
      <button onClick={toggleMinimized} >{buttonText}</button>
    </div>
    <div style={additionalInfoStyle} >
      <div>{blog.url}</div>
      <div>
        Likes: {blog.likes}
        <button>Like</button>
      </div>
      <div>{blog.user.name}</div>
    </div>
  </div>  
)}

export default Blog