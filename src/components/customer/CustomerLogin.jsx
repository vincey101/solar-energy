import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock, FaPhone } from 'react-icons/fa'
import customerHero from '../../assets/images/home-solar.jpg'
import '../../styles/customer.css'

function CustomerLogin() {
    const [credentials, setCredentials] = useState({
        email: '',
        phoneNumber: ''
    })
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const navbar = document.querySelector('.navbar')
        navbar.style.backgroundColor = '#000'

        return () => {
            navbar.style.backgroundColor = ''
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        // Simulated authentication - replace with real backend auth
        const customers = JSON.parse(localStorage.getItem('customers') || '[]')
        const customer = customers.find(c => c.email === credentials.email)

        if (customer) {
            localStorage.setItem('currentCustomer', JSON.stringify(customer))
            navigate('/customer/dashboard')
        } else {
            setError('Invalid credentials or customer not registered')
        }
    }

    return (
        <div className="customer-login">
            <div className="customer-hero" style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${customerHero})`
            }}>
                <h1>Customer Portal</h1>
                <p>Monitor and manage your solar energy system</p>
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
                            <FaPhone className="input-icon" />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={credentials.phoneNumber}
                                onChange={(e) => setCredentials({
                                    ...credentials,
                                    phoneNumber: e.target.value
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
                    <p>Not registered yet? <a href="/get-started?type=user">Register as Customer</a></p>
                </div>
            </div>
        </div>
    )
}

export default CustomerLogin 