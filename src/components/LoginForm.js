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

export default LoginForm