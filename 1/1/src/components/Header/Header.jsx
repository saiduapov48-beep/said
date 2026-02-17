import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useFavorites } from '../../context/FavoritesContext.jsx'
import './Header.css'

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth()
  const { count } = useFavorites()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  const linkClass = ({ isActive }) =>
    `header__link${isActive ? ' header__link--active' : ''}`

  const mobileLinkClass = ({ isActive }) =>
    `header__mobile-link${isActive ? ' header__mobile-link--active' : ''}`

  return (
    <header className="header" role="banner">
      <div className="header__inner">
        <Link to="/" className="header__logo">
          MAISON<span>APPLE</span>
        </Link>

        <nav className="header__nav" aria-label="Main navigation">
          <NavLink to="/" className={linkClass} end>HOME</NavLink>
          <NavLink to="/catalog" className={linkClass}>CATALOG</NavLink>
          <NavLink to="/about" className={linkClass}>ABOUT</NavLink>
          {isAuthenticated && (
            <NavLink to="/favorites" className={linkClass}>
              FAVORITES
              {count > 0 && <span className="header__badge">{count}</span>}
            </NavLink>
          )}
        </nav>

        <div className="header__actions">
          {isAuthenticated ? (
            <>
              <NavLink to="/profile" className={linkClass}>
                {user.name.toUpperCase()}
              </NavLink>
              <button className="header__action-btn" onClick={handleLogout}>
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>LOGIN</NavLink>
              <NavLink to="/register" className={linkClass}>REGISTER</NavLink>
            </>
          )}
        </div>

        <button
          className={`header__burger${menuOpen ? ' header__burger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className="header__burger-line" />
          <span className="header__burger-line" />
          <span className="header__burger-line" />
        </button>
      </div>

      <div className={`header__mobile-menu${menuOpen ? ' header__mobile-menu--open' : ''}`}>
        <NavLink to="/" className={mobileLinkClass} end onClick={closeMenu}>HOME</NavLink>
        <NavLink to="/catalog" className={mobileLinkClass} onClick={closeMenu}>CATALOG</NavLink>
        <NavLink to="/about" className={mobileLinkClass} onClick={closeMenu}>ABOUT</NavLink>
        {isAuthenticated && (
          <NavLink to="/favorites" className={mobileLinkClass} onClick={closeMenu}>
            FAVORITES {count > 0 && `(${count})`}
          </NavLink>
        )}
        {isAuthenticated ? (
          <>
            <NavLink to="/profile" className={mobileLinkClass} onClick={closeMenu}>PROFILE</NavLink>
            <button className="header__mobile-link" onClick={handleLogout}>LOGOUT</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={mobileLinkClass} onClick={closeMenu}>LOGIN</NavLink>
            <NavLink to="/register" className={mobileLinkClass} onClick={closeMenu}>REGISTER</NavLink>
          </>
        )}
      </div>
    </header>
  )
}
