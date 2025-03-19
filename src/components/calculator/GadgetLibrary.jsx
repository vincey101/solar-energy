import { useState, useEffect } from 'react'
import { FaSearch, FaFilter } from 'react-icons/fa'
import gadgetsHero from '../../assets/images/gadgets-hero.jpg'

// Add console log to check the image path
console.log('Gadgets Hero Image Path:', gadgetsHero)

export const gadgets = [
  {
    id: 1,
    category: 'Kitchen',
    name: 'Refrigerator',
    brand: 'Samsung',
    model: 'RF28T5001SR',
    powerRating: 0.35,
    avgDailyUsage: 24,
    yearlyConsumption: 3066,
    energyEfficiency: 'A++',
  },
  {
    id: 2,
    category: 'Kitchen',
    name: 'Microwave Oven',
    brand: 'LG',
    model: 'NeoChef',
    powerRating: 1.2,
    avgDailyUsage: 0.5,
    yearlyConsumption: 219,
    energyEfficiency: 'A+',
  },
  {
    id: 3,
    category: 'Living Room',
    name: 'LED TV',
    brand: 'Sony',
    model: 'X80J',
    powerRating: 0.15,
    avgDailyUsage: 6,
    yearlyConsumption: 328.5,
    energyEfficiency: 'A+',
  },
  {
    id: 4,
    category: 'Kitchen',
    name: 'Dishwasher',
    brand: 'Bosch',
    model: 'Series 6',
    powerRating: 1.8,
    avgDailyUsage: 1,
    yearlyConsumption: 657,
    energyEfficiency: 'A+++',
  },
  {
    id: 5,
    category: 'Laundry',
    name: 'Washing Machine',
    brand: 'Whirlpool',
    model: 'WFW9620HC',
    powerRating: 2.1,
    avgDailyUsage: 1.5,
    yearlyConsumption: 1150,
    energyEfficiency: 'A++',
  },
  {
    id: 6,
    category: 'Laundry',
    name: 'Clothes Dryer',
    brand: 'LG',
    model: 'DLEX4200',
    powerRating: 3.0,
    avgDailyUsage: 1,
    yearlyConsumption: 1095,
    energyEfficiency: 'A+',
  },
  {
    id: 7,
    category: 'Climate',
    name: 'Air Conditioner',
    brand: 'Daikin',
    model: 'FTXR28TVJUA',
    powerRating: 2.8,
    avgDailyUsage: 8,
    yearlyConsumption: 8176,
    energyEfficiency: 'A+++',
  },
  {
    id: 8,
    category: 'Climate',
    name: 'Electric Heater',
    brand: 'DeLonghi',
    model: 'TRD40615E',
    powerRating: 1.5,
    avgDailyUsage: 6,
    yearlyConsumption: 3285,
    energyEfficiency: 'A',
  },
  {
    id: 9,
    category: 'Kitchen',
    name: 'Electric Oven',
    brand: 'GE',
    model: 'JB655YKFS',
    powerRating: 2.3,
    avgDailyUsage: 1,
    yearlyConsumption: 839.5,
    energyEfficiency: 'A+',
  },
  {
    id: 10,
    category: 'Kitchen',
    name: 'Coffee Maker',
    brand: 'Philips',
    model: '3200 Series',
    powerRating: 1.5,
    avgDailyUsage: 0.5,
    yearlyConsumption: 273.75,
    energyEfficiency: 'A',
  },
  {
    id: 11,
    category: 'Entertainment',
    name: 'Gaming Console',
    brand: 'Sony',
    model: 'PS5',
    powerRating: 0.35,
    avgDailyUsage: 3,
    yearlyConsumption: 383.25,
    energyEfficiency: 'A+',
  },
  {
    id: 12,
    category: 'Office',
    name: 'Desktop Computer',
    brand: 'Dell',
    model: 'XPS 8940',
    powerRating: 0.45,
    avgDailyUsage: 8,
    yearlyConsumption: 1314,
    energyEfficiency: 'A',
  },
  {
    id: 13,
    category: 'Office',
    name: 'Laptop',
    brand: 'MacBook',
    model: 'Pro M1',
    powerRating: 0.06,
    avgDailyUsage: 8,
    yearlyConsumption: 175.2,
    energyEfficiency: 'A+++',
  },
  {
    id: 14,
    category: 'Lighting',
    name: 'LED Bulb',
    brand: 'Philips',
    model: 'Hue White',
    powerRating: 0.009,
    avgDailyUsage: 6,
    yearlyConsumption: 19.71,
    energyEfficiency: 'A+++',
  },
  {
    id: 15,
    category: 'Kitchen',
    name: 'Electric Kettle',
    brand: 'Breville',
    model: 'IQ Kettle',
    powerRating: 1.8,
    avgDailyUsage: 0.25,
    yearlyConsumption: 164.25,
    energyEfficiency: 'A+',
  },
  {
    id: 16,
    category: 'Bathroom',
    name: 'Water Heater',
    brand: 'Rheem',
    model: 'RTEX-13',
    powerRating: 3.0,
    avgDailyUsage: 2,
    yearlyConsumption: 2190,
    energyEfficiency: 'A+',
  },
  {
    id: 17,
    category: 'Climate',
    name: 'Ceiling Fan',
    brand: 'Hunter',
    model: 'Casablanca',
    powerRating: 0.075,
    avgDailyUsage: 12,
    yearlyConsumption: 328.5,
    energyEfficiency: 'A+++',
  },
  {
    id: 18,
    category: 'Kitchen',
    name: 'Food Processor',
    brand: 'Cuisinart',
    model: 'DFP-14BCNY',
    powerRating: 0.72,
    avgDailyUsage: 0.2,
    yearlyConsumption: 52.56,
    energyEfficiency: 'A+',
  },
  {
    id: 19,
    category: 'Entertainment',
    name: 'Sound System',
    brand: 'Sonos',
    model: 'Arc',
    powerRating: 0.106,
    avgDailyUsage: 4,
    yearlyConsumption: 154.76,
    energyEfficiency: 'A++',
  },
  {
    id: 20,
    category: 'Bathroom',
    name: 'Hair Dryer',
    brand: 'Dyson',
    model: 'Supersonic',
    powerRating: 1.6,
    avgDailyUsage: 0.2,
    yearlyConsumption: 116.8,
    energyEfficiency: 'A+',
  },
  {
    id: 21,
    category: 'Living Room',
    name: 'Smart Speaker',
    brand: 'Amazon',
    model: 'Echo (4th Gen)',
    powerRating: 0.03,
    avgDailyUsage: 24,
    yearlyConsumption: 262.8,
    energyEfficiency: 'A+++',
  },
]

function GadgetLibrary() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const categories = ['All', ...new Set(gadgets.map(gadget => gadget.category))]

  const filteredGadgets = gadgets.filter(gadget => {
    const matchesSearch = gadget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gadget.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || gadget.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  useEffect(() => {
    const navbar = document.querySelector('.navbar')
    navbar.classList.add('navbar-white')

    return () => {
      navbar.classList.remove('navbar-white')
    }
  }, [])

  return (
    <div className="gadget-library">
      <div
        className="gadget-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${gadgetsHero})`
        }}
      >
        <div className="gadget-header">
          <h1>Gadget Library</h1>
          <p>Explore power consumption data for common household appliances</p>
        </div>
      </div>

      <div className="gadget-content">
        <div className="gadget-controls">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search gadgets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-box">
            <FaFilter className="filter-icon" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="gadget-grid">
          {filteredGadgets.length > 0 ? (
            filteredGadgets.map(gadget => (
              <div key={gadget.id} className="gadget-card">
                <div className="gadget-info">
                  <h3>{gadget.name}</h3>
                  <p className="brand">{gadget.brand} - {gadget.model}</p>
                  <div
                    className="efficiency-badge"
                    data-rating={gadget.energyEfficiency}
                  >
                    {gadget.energyEfficiency}
                  </div>
                </div>
                <div className="power-details">
                  <div className="detail-item">
                    <span>Power Rating:</span>
                    <strong>{gadget.powerRating} kW</strong>
                  </div>
                  <div className="detail-item">
                    <span>Avg. Daily Usage:</span>
                    <strong>{gadget.avgDailyUsage} hours</strong>
                  </div>
                  <div className="detail-item">
                    <span>Yearly Consumption:</span>
                    <strong>{gadget.yearlyConsumption} kWh</strong>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No gadgets found matching your search criteria</p>
              <button
                className="reset-search"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('All')
                }}
              >
                Reset Search
              </button>
            </div>
          )}
        </div>

        <div className="efficiency-guide">
          <h2>Energy Efficiency Guide</h2>
          <div className="efficiency-ratings">
            <div className="rating-item">
              <span className="rating-badge a-plus-plus-plus">A+++</span>
              <p>Most efficient - Lowest energy consumption</p>
            </div>
            <div className="rating-item">
              <span className="rating-badge a-plus-plus">A++</span>
              <p>Excellent energy efficiency</p>
            </div>
            <div className="rating-item">
              <span className="rating-badge a-plus">A+</span>
              <p>Very good energy efficiency</p>
            </div>
            <div className="rating-item">
              <span className="rating-badge a">A</span>
              <p>Good energy efficiency</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GadgetLibrary 