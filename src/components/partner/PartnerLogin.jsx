import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock } from 'react-icons/fa'
import partnerHero from '../../assets/images/partner-logo.jpg'
import '../../styles/partner.css'

function PartnerLogin() {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const navigate = useNavigate()

    // Add effect to set navbar color
    useEffect(() => {
        const navbar = document.querySelector('.navbar')
        navbar.style.backgroundColor = '#000'

        // Cleanup function to reset navbar color
        return () => {
            navbar.style.backgroundColor = ''
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        // Here you would validate against your backend
        // For now, we'll use localStorage to simulate authentication
        const partners = JSON.parse(localStorage.getItem('partners') || '[]')
        const partner = partners.find(p => p.email === credentials.email)

        if (partner) {
            // In real app, you'd hash passwords and use proper auth
            localStorage.setItem('currentPartner', JSON.stringify(partner))
            navigate('/partner/dashboard')
        } else {
            setError('Invalid credentials or partner not registered')
        }
    }

    return (
        <div className="partner-login">
            <div className="partner-hero" style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${partnerHero})`
            }}>
                <h1>Partner Portal</h1>
                <p>Join our network of trusted solar energy partners</p>
            </div>

            <div className="login-card">
                <div className="login-header">
                    <h2>Sign In</h2>
                    <p>Welcome back! Please login to your account</p>
                </div>

                {error && (
                    <div className="error-message">
                        <FaLock />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <div className="input-group">
                            <FaEnvelope className="input-icon" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={credentials.email}
                                onChange={(e) => setCredentials({
                                    ...credentials,
                                    email: e.target.value
                                })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="input-group">
                            <FaLock className="input-icon" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({
                                    ...credentials,
                                    password: e.target.value
                                })}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="login-btn">
                        Sign In
                    </button>
                </form>

                <div className="login-footer">
                    <p>Not registered yet? <a href="/get-started">Register as Partner</a></p>
                </div>
            </div>
        </div>
    )
}

export default PartnerLogin 