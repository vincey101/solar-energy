import { FaFacebook, FaTwitter, FaLinkedin, FaYoutube, FaInstagram } from 'react-icons/fa'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="#" className="social-link"><FaFacebook /></a>
            <a href="#" className="social-link"><FaTwitter /></a>
            <a href="#" className="social-link"><FaLinkedin /></a>
            <a href="#" className="social-link"><FaYoutube /></a>
            <a href="#" className="social-link"><FaInstagram /></a>
          </div>
        </div>

        <div className="footer-section">
          <h3>SolarEnergy</h3>
          <ul>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/blog">Blog</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Solar Solutions</h3>
          <ul>
            <li><a href="/calculator">Solar Calculator</a></li>
            <li><a href="/system-design">System Design</a></li>
            <li><a href="/financing">Financing Options</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Support</h3>
          <ul>
            <li><a href="/get-started">Contact Support</a></li>
            <li><a href="/resources">Resources</a></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-info">
          <span>© {currentYear} SolarEnergy. All rights reserved.</span>
          <div className="footer-links">
            <a href="/terms">Terms of Use</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/cookie">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 