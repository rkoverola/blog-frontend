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

export default BlogCreationForm