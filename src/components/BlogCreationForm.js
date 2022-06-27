import { useState } from 'react'

const BlogCreationForm = ({ addBlog }) => {
  
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange = ({ target }) => { setTitle(target.value) }
  const handleAuthorChange = ({ target }) => { setAuthor(target.value) }
  const handleUrlChange = ({ target }) => { setUrl(target.value) }

  const handleBlogSubmit = (event) => {
    event.preventDefault()
    console.log('Submitting', title, author, url)
    const blogObject = {
      title: title,
      author: author,
      url: url
    }
    setTitle('')
    setAuthor('')
    setUrl('')
    addBlog(blogObject)
  }

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

export default BlogCreationForm