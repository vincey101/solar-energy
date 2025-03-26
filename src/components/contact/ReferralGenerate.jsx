import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaCopy, FaWhatsapp, FaFacebook, FaTwitter, FaEdit, FaCheck } from 'react-icons/fa'
import '../../styles/referral.css'

function ReferralGenerate() {
    const [user, setUser] = useState(null)
    const [referralLink, setReferralLink] = useState('')
    const [customSuffix, setCustomSuffix] = useState('')
    const [isEditingSuffix, setIsEditingSuffix] = useState(false)
    const [suffixError, setSuffixError] = useState('')
    const [copied, setCopied] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const customer = JSON.parse(localStorage.getItem('currentCustomer'))
        const partner = JSON.parse(localStorage.getItem('currentPartner'))
        const currentUser = customer || partner

        if (!currentUser) {
            navigate('/referral')
            return
        }

        setUser(currentUser)
        // Generate a random initial suffix instead of using name/email
        const initialSuffix = Math.random().toString(36).substring(2, 8)
        setCustomSuffix(initialSuffix)
        generateReferralLink(currentUser, initialSuffix)
    }, [navigate])

    const generateReferralLink = (user, suffix = customSuffix) => {
        const baseUrl = window.location.origin
        
        // Create a unique identifier
        const uniqueIdentifier = {
            id: user.id,
            type: user.companyName ? 'partner' : 'customer',
            timestamp: Date.now()
        }
        
        // Create a unique code
        const uniqueCode = btoa(JSON.stringify(uniqueIdentifier))
            .replace(/[^a-zA-Z0-9]/g, '')
            .substring(0, 8)
        
        // Use random suffix if none provided
        const finalSuffix = suffix || Math.random().toString(36).substring(2, 8)
        setReferralLink(`${baseUrl}/get-started?ref=${finalSuffix}-${uniqueCode}`)
    }

    const validateSuffix = (suffix) => {
        // Only allow letters, numbers, hyphens, and underscores
        const validPattern = /^[a-zA-Z0-9-_]+$/
        if (!validPattern.test(suffix)) {
            return "Only letters, numbers, hyphens, and underscores are allowed"
        }
        if (suffix.length < 3) {
            return "Suffix must be at least 3 characters long"
        }
        if (suffix.length > 30) {
            return "Suffix must be less than 30 characters"
        }
        return ""
    }

    const handleSuffixSubmit = () => {
        const error = validateSuffix(customSuffix)
        if (error) {
            setSuffixError(error)
            return
        }
        setSuffixError('')
        generateReferralLink(user, customSuffix)
        setIsEditingSuffix(false)
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const shareViaWhatsApp = () => {
        const message = encodeURIComponent(`Join me on RoiAfrica Solar! Use my referral link: ${referralLink}`)
        window.open(`https://wa.me/?text=${message}`, '_blank')
    }

    const shareViaFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank')
    }

    const shareViaTwitter = () => {
        const message = encodeURIComponent(`Join me on RoiAfrica Solar! Use my referral link: ${referralLink}`)
        window.open(`https://twitter.com/intent/tweet?text=${message}`, '_blank')
    }

    if (!user) return null

    return (
        <div className="referral-generate">
            <div className="referral-content">
                <h1>Your Referral Link</h1>
                <p>Share this link with friends and earn rewards when they sign up!</p>

                <div className="referral-link-container">
                    <input 
                        type="text" 
                        value={referralLink} 
                        readOnly 
                        className="referral-link-input"
                    />
                    <button 
                        className="copy-button" 
                        onClick={copyToClipboard}
                    >
                        <FaCopy />
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>

                <div className="customize-link">
                    {isEditingSuffix ? (
                        <div className="suffix-edit">
                            <input
                                type="text"
                                value={customSuffix}
                                onChange={(e) => setCustomSuffix(e.target.value.toLowerCase())}
                                placeholder="Enter custom suffix"
                                className="suffix-input"
                            />
                            <button 
                                className="save-suffix" 
                                onClick={handleSuffixSubmit}
                            >
                                <FaCheck />
                                Save
                            </button>
                        </div>
                    ) : (
                        <button 
                            className="customize-button"
                            onClick={() => setIsEditingSuffix(true)}
                        >
                            <FaEdit />
                            Customize Link
                        </button>
                    )}
                    {suffixError && (
                        <p className="suffix-error">{suffixError}</p>
                    )}
                </div>

                <div className="share-buttons">
                    <button onClick={shareViaWhatsApp} className="share-button whatsapp">
                        <FaWhatsapp />
                        Share via WhatsApp
                    </button>
                    <button onClick={shareViaFacebook} className="share-button facebook">
                        <FaFacebook />
                        Share on Facebook
                    </button>
                    <button onClick={shareViaTwitter} className="share-button twitter">
                        <FaTwitter />
                        Share on Twitter
                    </button>
                </div>

                <div className="referral-info">
                    <h2>How it works</h2>
                    <ul>
                        <li>Share your unique referral link with friends</li>
                        <li>They sign up using your link</li>
                        <li>You earn rewards for each successful referral</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ReferralGenerate 