import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import fafacon from '../../assets/fafacon.svg'
import '../Login/Login.css'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [globalError, setGlobalError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function validate() {
    const errs = {}
    if (!name.trim()) errs.name = 'Name is required'
    if (!email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email format'
    if (!password) errs.password = 'Password is required'
    else if (password.length < 6) errs.password = 'Minimum 6 characters'
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match'
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
    const result = await register(name, email, password)
    setIsLoading(false)
    if (result.success) {
      navigate('/profile')
    } else {
      setGlobalError(result.error)
    }
  }

  function clearError(field) {
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-form__logo">
          <img src={fafacon} alt="logo" className="auth-logo-icon" />
        </div>
        <div className="auth-form__header">
          <h1 className="auth-form__title">REGISTER</h1>
          <p className="auth-form__subtitle">Create your account</p>
        </div>
        <div className="auth-form__body">
          {globalError && <div className="auth-form__global-error">{globalError}</div>}
          <div className="auth-form__field">
            <label className="auth-form__label" htmlFor="reg-name">FULL NAME</label>
            <input
              id="reg-name"
              className={`auth-form__input${errors.name ? ' auth-form__input--error' : ''}`}
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); clearError('name') }}
              placeholder="Your full name"
            />
            {errors.name && <div className="auth-form__error">{errors.name}</div>}
          </div>
          <div className="auth-form__field">
            <label className="auth-form__label" htmlFor="reg-email">EMAIL</label>
            <input
              id="reg-email"
              className={`auth-form__input${errors.email ? ' auth-form__input--error' : ''}`}
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError('email') }}
              placeholder="your@email.com"
            />
            {errors.email && <div className="auth-form__error">{errors.email}</div>}
          </div>
          <div className="auth-form__field">
            <label className="auth-form__label" htmlFor="reg-password">PASSWORD</label>
            <input
              id="reg-password"
              className={`auth-form__input${errors.password ? ' auth-form__input--error' : ''}`}
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearError('password') }}
              placeholder="Minimum 6 characters"
            />
            {errors.password && <div className="auth-form__error">{errors.password}</div>}
          </div>
          <div className="auth-form__field">
            <label className="auth-form__label" htmlFor="reg-confirm">CONFIRM PASSWORD</label>
            <input
              id="reg-confirm"
              className={`auth-form__input${errors.confirmPassword ? ' auth-form__input--error' : ''}`}
              type="password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); clearError('confirmPassword') }}
              placeholder="Repeat password"
            />
            {errors.confirmPassword && <div className="auth-form__error">{errors.confirmPassword}</div>}
          </div>
          <button type="submit" className="auth-form__submit" disabled={isLoading}>
            {isLoading ? 'CREATING...' : 'CREATE ACCOUNT'}
          </button>
        </div>
        <div className="auth-form__footer">
          <span className="auth-form__footer-text">
            Already have an account?
            <Link to="/login" className="auth-form__footer-link">LOGIN</Link>
          </span>
        </div>
      </form>
    </div>
  )
}