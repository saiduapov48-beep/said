import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import fafacon from '../../assets/fafacon.svg'
import './Login.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [globalError, setGlobalError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function validate() {
    const errs = {}
    if (!email.trim()) errs.email = 'Email is required'
    if (!password) errs.password = 'Password is required'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setGlobalError('')
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setIsLoading(true)
    const result = await login(email, password)
    setIsLoading(false)
    if (result.success) {
      navigate('/profile')
    } else {
      setGlobalError(result.error)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-form__logo">
          <img src={fafacon} alt="logo" className="auth-logo-icon" />
        </div>
        <div className="auth-form__header">
          <h1 className="auth-form__title">LOGIN</h1>
          <p className="auth-form__subtitle">Access your account</p>
        </div>
        <div className="auth-form__body">
          {globalError && <div className="auth-form__global-error">{globalError}</div>}
          <div className="auth-form__field">
            <label className="auth-form__label" htmlFor="login-email">EMAIL</label>
            <input
              id="login-email"
              className={`auth-form__input${errors.email ? ' auth-form__input--error' : ''}`}
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })) }}
              placeholder="your@email.com"
            />
            {errors.email && <div className="auth-form__error">{errors.email}</div>}
          </div>
          <div className="auth-form__field">
            <label className="auth-form__label" htmlFor="login-password">PASSWORD</label>
            <input
              id="login-password"
              className={`auth-form__input${errors.password ? ' auth-form__input--error' : ''}`}
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })) }}
              placeholder="Enter password"
            />
            {errors.password && <div className="auth-form__error">{errors.password}</div>}
          </div>
          <button type="submit" className="auth-form__submit" disabled={isLoading}>
            {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </div>
        <div className="auth-form__footer">
          <span className="auth-form__footer-text">
            Don't have an account?
            <Link to="/register" className="auth-form__footer-link">REGISTER</Link>
          </span>
        </div>
      </form>
    </div>
  )
}