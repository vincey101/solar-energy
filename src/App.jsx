import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import HeroSlider from './components/hero/HeroSlider'
import ReferralDashboard from './components/referral/ReferralDashboard'
import SystemMonitoring from './components/monitoring/SystemMonitoring'
import EnergyPredictor from './components/ai/EnergyPredictor'
import ReferralGenerator from './components/referral/ReferralGenerator'
import CommissionStructure from './components/referral/CommissionStructure'
import ReferralTracking from './components/referral/ReferralTracking'
import LiveMonitoring from './components/monitoring/LiveMonitoring'
import MaintenanceSchedule from './components/monitoring/MaintenanceSchedule'
import PerformanceReports from './components/monitoring/PerformanceReports'
import EfficiencyTips from './components/resources/EfficiencyTips'
import EducationalContent from './components/resources/EducationalContent'
import SupportCenter from './components/resources/SupportCenter'
import EnergyPrediction from './components/ai/EnergyPrediction'
import SystemOptimization from './components/ai/SystemOptimization'
import CreditAssessment from './components/ai/CreditAssessment'
import PowerSection from './components/home/PowerSection'
import ReviewSection from './components/home/ReviewSection'
import { useEffect } from 'react'
import Footer from './components/footer/Footer'
import MobileMenu from './components/navigation/MobileMenu'
import GadgetLibrary from './components/calculator/GadgetLibrary'
import Calculator from './components/calculator/Calculator'
import GetStarted from './components/home/GetStarted'
import SystemDesign from './components/design/SystemDesign'
import EquipmentRecommendation from './components/design/EquipmentRecommendation'
import PartnerDashboard from './components/partner/PartnerDashboard'
import PartnerProjects from './components/partner/PartnerProjects'
import PartnerPayments from './components/partner/PartnerPayments'
import PartnerSettings from './components/partner/PartnerSettings'
import PartnerLogin from './components/partner/PartnerLogin'
import CustomerLogin from './components/customer/CustomerLogin'
import ProtectedRoute from './components/partner/ProtectedRoute'
import OnboardingFlow from './components/home/OnboardingFlow'

const navItems = [
  {
    title: 'Calculator & Assessment',
    dropdownItems: [
      { title: 'Gadget Library', path: '/gadget-library' },
      { title: 'Calculator Tool', path: '/calculator' },
      // { title: 'Energy Consumption Assessment', path: '/assessment' },
    ],
  },
  {
    title: 'System Design',
    dropdownItems: [
      { title: 'System Design', path: '/system-design' },
      { title: 'Equipment Recommendation', path: '/equipment' },
      // { title: 'System Cost Estimation', path: '/cost-estimation' },
    ],
  },
  {
    title: 'Financing',
    dropdownItems: [
      { title: 'Financing Options', path: '/financing' },
      { title: 'Payment Plan Calculator', path: '/payment-calculator' },
      { title: 'Wallet Balance', path: '/wallet' },
    ],
  },
  {
    title: 'Legal',
    dropdownItems: [
      { title: 'Electronic Signatures', path: '/signatures' },
      { title: 'Home Ownership Verification', path: '/verification' },
      { title: 'Rental Property Verification', path: '/rental-verification' },
    ],
  },
  {
    title: 'Referral Program',
    dropdownItems: [
      { title: 'Generate Referral Link', path: '/referral/generate' },
      { title: 'Commission Structure', path: '/referral/commission' },
      { title: 'Track Referrals', path: '/referral/tracking' },
    ],
  },
  {
    title: 'System Monitoring',
    dropdownItems: [
      { title: 'Live Monitoring', path: '/monitoring/live' },
      { title: 'Maintenance Schedule', path: '/monitoring/maintenance' },
      { title: 'Performance Reports', path: '/monitoring/reports' },
    ],
  },
  // {
  //   title: 'Resources',
  //   dropdownItems: [
  //     { title: 'Energy Efficiency Tips', path: '/resources/efficiency' },
  //     { title: 'Educational Content', path: '/resources/education' },
  //     { title: 'Support Center', path: '/resources/support' },
  //   ],
  // },
  {
    title: 'Partner Portal',
    dropdownItems: [
      { title: 'Dashboard', path: '/partner/dashboard' },
      { title: 'Project Tracking', path: '/partner/projects' },
      { title: 'Payment History', path: '/partner/payments' },
      { title: 'Account Settings', path: '/partner/settings' },
    ],
  },
]

function App() {
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="mobile-only">
            <MobileMenu navItems={navItems} />
          </div>
          <a href="/" className="logo">
            <span className="logo-solar">Solar</span><span className="logo-energy">Energy</span>
          </a>
          <ul className="nav-links desktop-only">
            {navItems.map((item, index) => (
              <li key={index} className="nav-item">
                <a href="#" className="nav-link">
                  {item.title}
                  <svg
                    className="dropdown-icon"
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1L5 5L9 1"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                <div className="dropdown">
                  {item.dropdownItems.map((dropdownItem, idx) => (
                    <a
                      key={idx}
                      href={dropdownItem.path}
                      className="dropdown-link"
                    >
                      {dropdownItem.title}
                    </a>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={
            <>
              <OnboardingFlow />
            </>
          } />
          <Route path="/referral" element={<ReferralDashboard />} />
          <Route path="/monitoring" element={<SystemMonitoring />} />
          <Route path="/ai-predictions" element={<EnergyPredictor />} />
          <Route path="/referral/generate" element={<ReferralGenerator />} />
          <Route path="/referral/commission" element={<CommissionStructure />} />
          <Route path="/referral/tracking" element={<ReferralTracking />} />
          <Route path="/monitoring/live" element={<LiveMonitoring />} />
          <Route path="/monitoring/maintenance" element={<MaintenanceSchedule />} />
          <Route path="/monitoring/reports" element={<PerformanceReports />} />
          <Route path="/resources/efficiency" element={<EfficiencyTips />} />
          <Route path="/resources/education" element={<EducationalContent />} />
          <Route path="/resources/support" element={<SupportCenter />} />
          <Route path="/ai/prediction" element={<EnergyPrediction />} />
          <Route path="/ai/optimization" element={<SystemOptimization />} />
          <Route path="/ai/credit" element={<CreditAssessment />} />
          <Route path="/gadget-library" element={<GadgetLibrary />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/system-design" element={<SystemDesign />} />
          <Route path="/equipment" element={<EquipmentRecommendation />} />
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/partner/login" element={<PartnerLogin />} />
          <Route path="/partner/dashboard" element={
            <ProtectedRoute>
              <PartnerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/partner/projects" element={
            <ProtectedRoute>
              <PartnerProjects />
            </ProtectedRoute>
          } />
          <Route path="/partner/payments" element={
            <ProtectedRoute>
              <PartnerPayments />
            </ProtectedRoute>
          } />
          <Route path="/partner/settings" element={
            <ProtectedRoute>
              <PartnerSettings />
            </ProtectedRoute>
          } />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
