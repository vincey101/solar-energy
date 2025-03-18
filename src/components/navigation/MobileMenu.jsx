import { useState } from 'react'
import { FaBars, FaTimes, FaChevronRight } from 'react-icons/fa'

function MobileMenu({ navItems }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(null)

  const handleClose = () => {
    setIsOpen(false)
    setActiveSection(null)
  }

  return (
    <div className="mobile-menu">
      {!isOpen && (
        <button className="hamburger" onClick={() => setIsOpen(true)}>
          <FaBars />
        </button>
      )}
      
      <div className={`mobile-nav ${isOpen ? 'open' : ''}`}>
        <button className="mobile-nav-close" onClick={handleClose}>
          <FaTimes />
        </button>
        <ul className="mobile-nav-links">
          {navItems.map((item, index) => (
            <li key={index} className="mobile-nav-item">
              <div 
                className="mobile-nav-header"
                onClick={() => setActiveSection(activeSection === index ? null : index)}
              >
                <span>{item.title}</span>
                <FaChevronRight className={`mobile-chevron ${activeSection === index ? 'active' : ''}`} />
              </div>
              <div className={`mobile-dropdown ${activeSection === index ? 'active' : ''}`}>
                {item.dropdownItems.map((dropdownItem, idx) => (
                  <a 
                    key={idx} 
                    href={dropdownItem.path} 
                    className="mobile-dropdown-link"
                    onClick={handleClose}
                  >
                    {dropdownItem.title}
                  </a>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default MobileMenu 