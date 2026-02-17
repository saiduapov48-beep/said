import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div className="footer__grid">
          <div>
            <div className="footer__brand-name">MAISON APPLE</div>
            <p className="footer__brand-desc">
              Premium reservation platform for Apple devices.
              Curated selection. Minimal aesthetic. Maximum precision.
            </p>
          </div>
          <div>
            <div className="footer__col-title">NAVIGATE</div>
            <Link to="/" className="footer__link">HOME</Link>
            <Link to="/catalog" className="footer__link">CATALOG</Link>
            <Link to="/about" className="footer__link">ABOUT</Link>
          </div>
          <div>
            <div className="footer__col-title">ACCOUNT</div>
            <Link to="/login" className="footer__link">LOGIN</Link>
            <Link to="/register" className="footer__link">REGISTER</Link>
            <Link to="/profile" className="footer__link">PROFILE</Link>
          </div>
          <div>
            <div className="footer__col-title">CATEGORIES</div>
            <Link to="/catalog?category=iphone" className="footer__link">IPHONE</Link>
            <Link to="/catalog?category=macbook" className="footer__link">MACBOOK</Link>
            <Link to="/catalog?category=ipad" className="footer__link">IPAD</Link>
            <Link to="/catalog?category=accessories" className="footer__link">ACCESSORIES</Link>
          </div>
        </div>
        <div className="footer__bottom">
          <span className="footer__copy">&copy; 2026 MAISON APPLE. ALL RIGHTS RESERVED.</span>
          <span className="footer__copy">DESIGNED WITH PRECISION</span>
        </div>
      </div>
    </footer>
  )
}
