import { useState, useEffect } from 'react'
import { FaStar, FaShieldAlt, FaDollarSign, FaCheck } from 'react-icons/fa'
import equipmentHero from '../../assets/images/equipment.jpg'
import { africanCurrencyService } from '../../services/africanCurrencyService'

// Equipment database
const solarPanels = [
    {
        id: 1,
        manufacturer: 'SunPower',
        model: 'M-Series SPR-M425',
        wattage: 425,
        efficiency: 22.8,
        warranty: 25,
        price: 350000,
        features: [
            'Industry-leading efficiency',
            'Maxeon Gen 7 cells',
            '40-year useful life',
            '92% output guarantee at 25 years'
        ]
    },
    {
        id: 2,
        manufacturer: 'Panasonic',
        model: 'EverVolt Solar Module',
        wattage: 410,
        efficiency: 22.2,
        warranty: 25,
        price: 780,
        features: [
            'HIT® Technology',
            'Temperature coefficient of -0.26%/°C',
            'All-weather performance',
            'Made in USA'
        ]
    },
    {
        id: 3,
        manufacturer: 'Canadian Solar',
        model: 'HiKu7 Mono',
        wattage: 445,
        efficiency: 21.9,
        warranty: 25,
        price: 695,
        features: [
            'Bifacial technology',
            'Up to 30% additional back-side power',
            'Salt & ammonia resistance',
            'PID resistance'
        ]
    },
    {
        id: 4,
        manufacturer: 'JinkoSolar',
        model: 'Tiger Neo N-type',
        wattage: 435,
        efficiency: 21.7,
        warranty: 25,
        price: 670,
        features: [
            'N-type TOPCon cells',
            'Bifacial capability',
            '1% first-year degradation',
            'Enhanced low-light performance'
        ]
    },
    {
        id: 5,
        manufacturer: 'LONGi Solar',
        model: 'Hi-MO 6 72HC',
        wattage: 455,
        efficiency: 22.0,
        warranty: 25,
        price: 710,
        features: [
            'HPBC cell technology',
            'Ultra-high power output',
            'Better shading tolerance',
            'Smart soldering technology'
        ]
    }
]

const batteries = [
    {
        id: 1,
        manufacturer: 'Tesla',
        model: 'Powerwall+ 2024',
        capacity: 13.5,
        power: 9.6,
        warranty: 10,
        price: 4500000,
        features: [
            'Integrated inverter & backup gateway',
            'Storm Watch weather monitoring',
            '100% depth of discharge',
            'Liquid cooling system'
        ]
    },
    {
        id: 2,
        manufacturer: 'Enphase',
        model: 'IQ Battery 5P',
        capacity: 15,
        power: 7.6,
        warranty: 10,
        price: 12000,
        features: [
            'Microinverter architecture',
            'Lithium iron phosphate cells',
            'Modular design (3kWh increments)',
            'No single point of failure'
        ]
    },
    {
        id: 3,
        manufacturer: 'Generac',
        model: 'PWRcell',
        capacity: 18,
        power: 9,
        warranty: 10,
        price: 13500,
        features: [
            'Modular battery design',
            'Smart Management Modules',
            'Outdoor rated enclosure',
            'Integrated load management'
        ]
    },
    {
        id: 4,
        manufacturer: 'LG Energy Solution',
        model: 'RESU16H Prime',
        capacity: 16,
        power: 7,
        warranty: 10,
        price: 9500,
        features: [
            'Premium cell technology',
            'Advanced BMS system',
            'Expandable up to 32kWh',
            'UL 9540A certified'
        ]
    },
    {
        id: 5,
        manufacturer: 'Sonnen',
        model: 'ecoLinx 20',
        capacity: 20,
        power: 8,
        warranty: 15,
        price: 18000,
        features: [
            'Smart home integration',
            'Cobalt-free battery cells',
            'Automatic load balancing',
            '15-year/15000 cycle warranty'
        ]
    }
]

const inverters = [
    {
        id: 1,
        manufacturer: 'SolarEdge',
        model: 'SE11400H-US',
        power: 11.4,
        efficiency: 99.2,
        warranty: 12,
        price: 3200,
        features: [
            'HD-Wave technology',
            'Built-in RSD compliance',
            'Revenue grade metering',
            'Arc fault protection'
        ]
    },
    {
        id: 2,
        manufacturer: 'Enphase',
        model: 'IQ8+ Microinverter',
        power: 7.6,
        efficiency: 97.5,
        warranty: 25,
        price: 215,
        features: [
            'Module-level MPPT',
            'Sunlight backup ready',
            'Grid-forming capability',
            'Individual panel optimization'
        ]
    },
    {
        id: 3,
        manufacturer: 'Fronius',
        model: 'Primo GEN24 Plus 10.0',
        power: 10,
        efficiency: 98.2,
        warranty: 10,
        price: 2900,
        features: [
            'Hybrid inverter capability',
            'Dynamic Peak Manager',
            'PV Point emergency power',
            'Active cooling technology'
        ]
    },
    {
        id: 4,
        manufacturer: 'SMA',
        model: 'Sunny Tripower CORE1',
        power: 12,
        efficiency: 98.4,
        warranty: 10,
        price: 3400,
        features: [
            'Commercial grade reliability',
            'Integrated string monitoring',
            'OptiTrac Global Peak',
            'SMA Smart Connected service'
        ]
    },
    {
        id: 5,
        manufacturer: 'Huawei',
        model: 'SUN2000 10KTL',
        power: 10,
        efficiency: 98.6,
        warranty: 10,
        price: 2800,
        features: [
            'AI-powered MPPT',
            'Built-in PID recovery',
            'Arc fault protection',
            'Smart IV curve diagnosis'
        ]
    }
]

// Add this after the equipment database constants
const installationCosts = {
    baseLabor: 2500,
    laborPerPanel: 100,
    mounting: 800,
    electrical: 1200,
    permits: 500,
    inspection: 300,
    maintenance: {
        annual: 200,
        inverterReplacement: 2000,
        cleaning: 150
    }
}

// Add price formatting function
const formatPrice = (priceInNaira) => {
    return africanCurrencyService.convertPrice(priceInNaira).formatted;
}

function EquipmentRecommendation() {
    const [systemSize, setSystemSize] = useState({
        panelCount: 0,
        batteryCapacity: 0,
        inverterSize: 0
    })

    const [recommendations, setRecommendations] = useState({
        panels: null,
        battery: null,
        inverter: null
    })

    const [costBreakdown, setCostBreakdown] = useState({
        equipment: {
            panels: 0,
            battery: 0,
            inverter: 0,
            total: 0
        },
        installation: {
            labor: 0,
            mounting: 0,
            electrical: 0,
            permits: 0,
            inspection: 0,
            total: 0
        },
        maintenance: {
            annual: 0,
            tenYear: 0
        },
        totalCost: 0
    })

    const [userLocation, setUserLocation] = useState(null)
    const [customKWh, setCustomKWh] = useState('')
    const [selectedSize, setSelectedSize] = useState('5')
    const [priceEstimate, setPriceEstimate] = useState(null)
    const [loadInputs, setLoadInputs] = useState([])
    const [showLoadCalculator, setShowLoadCalculator] = useState(false)
    const [selectedCountry, setSelectedCountry] = useState('NGN')

    useEffect(() => {
        // Get system design data from localStorage
        const savedDesign = localStorage.getItem('systemDesign')
        if (savedDesign) {
            const design = JSON.parse(savedDesign)
            setSystemSize(design)
        }
    }, [])

    useEffect(() => {
        // Recommend equipment based on system size
        const recommendEquipment = () => {
            // Recommend panel based on count and efficiency
            const recommendedPanel = solarPanels.reduce((prev, current) =>
                (current.efficiency > prev.efficiency) ? current : prev
            )

            // Recommend battery based on required capacity
            const recommendedBattery = batteries.find(b =>
                b.capacity >= systemSize.batteryCapacity / 1000
            ) || batteries[0]

            // Recommend inverter based on system size
            const recommendedInverter = inverters.find(i =>
                i.power >= systemSize.inverterSize
            ) || inverters[0]

            setRecommendations({
                panels: recommendedPanel,
                battery: recommendedBattery,
                inverter: recommendedInverter
            })
        }

        recommendEquipment()
    }, [systemSize])

    useEffect(() => {
        const calculateCosts = () => {
            const selectedPanel = recommendations.panels
            const selectedBattery = recommendations.battery
            const selectedInverter = recommendations.inverter

            if (!selectedPanel || !selectedBattery || !selectedInverter) return

            const panelsCost = selectedPanel.price * systemSize.panelCount
            const batteryCost = selectedBattery.price
            const inverterCost = selectedInverter.price

            const equipmentTotal = panelsCost + batteryCost + inverterCost

            const laborCost = installationCosts.baseLabor +
                (installationCosts.laborPerPanel * systemSize.panelCount)

            const installationTotal = laborCost +
                installationCosts.mounting +
                installationCosts.electrical +
                installationCosts.permits +
                installationCosts.inspection

            const annualMaintenance = installationCosts.maintenance.annual
            const tenYearMaintenance = (annualMaintenance * 10) +
                installationCosts.maintenance.inverterReplacement +
                (installationCosts.maintenance.cleaning * 10)

            setCostBreakdown({
                equipment: {
                    panels: panelsCost,
                    battery: batteryCost,
                    inverter: inverterCost,
                    total: equipmentTotal
                },
                installation: {
                    labor: laborCost,
                    mounting: installationCosts.mounting,
                    electrical: installationCosts.electrical,
                    permits: installationCosts.permits,
                    inspection: installationCosts.inspection,
                    total: installationTotal
                },
                maintenance: {
                    annual: annualMaintenance,
                    tenYear: tenYearMaintenance
                },
                totalCost: equipmentTotal + installationTotal
            })
        }

        calculateCosts()
    }, [recommendations, systemSize])

    useEffect(() => {
        async function detectLocation() {
            const location = await africanCurrencyService.detectUserLocation()
            setUserLocation(location)
            updatePriceEstimate(selectedSize)
        }
        detectLocation()
    }, [])

    const updatePriceEstimate = (kWh) => {
        const estimate = africanCurrencyService.calculatePrice(Number(kWh))
        setPriceEstimate(estimate)
    }

    const handleSizeChange = (e) => {
        const size = e.target.value
        setSelectedSize(size)
        updatePriceEstimate(size)
    }

    const handleCustomKWhChange = (e) => {
        const value = e.target.value
        setCustomKWh(value)
        if (value) {
            updatePriceEstimate(Number(value))
        }
    }

    const handleLoadChange = (index, field, value) => {
        const newLoadInputs = [...loadInputs]
        newLoadInputs[index][field] = value
        setLoadInputs(newLoadInputs)

        // Calculate total kWh and update price
        const totalKWh = calculateTotalLoad()
        if (totalKWh >= 0) {
            setCustomKWh(totalKWh.toString())
            updatePriceEstimate(totalKWh)
        }
    }

    const addLoadInput = () => {
        setLoadInputs([...loadInputs, { name: '', watts: '' }]) // Remove hours field
    }

    const calculateTotalLoad = () => {
        const totalKWh = loadInputs.reduce((total, load) => {
            const kwh = parseFloat(load.watts) || 0
            return total + kwh
        }, 0)
        return +totalKWh.toFixed(1) // Round to 1 decimal place
    }

    return (
        <div className="equipment-recommendation">
            <div
                className="equipment-hero"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${equipmentHero})`
                }}
            >
                <div className="equipment-header">
                    <h1>Recommended Equipment</h1>
                    <p>High-quality components for your solar system</p>
                </div>
            </div>

            <div className="equipment-content">
                <div className="equipment-section">
                    <h2>Solar Panels</h2>
                    <div className="equipment-cards">
                        {solarPanels.map(panel => (
                            <div
                                key={panel.id}
                                className={`equipment-card ${panel.id === recommendations.panels?.id ? 'recommended' : ''}`}
                            >
                                {panel.id === recommendations.panels?.id && (
                                    <div className="recommended-badge">
                                        <FaStar /> Recommended
                                    </div>
                                )}
                                <div className="manufacturer-brand">
                                    <div className="manufacturer-name">{panel.manufacturer}</div>
                                    <div className="model-name">{panel.model}</div>
                                </div>
                                <div className="specs-grid">
                                    <div className="spec-item">
                                        <span>Wattage</span>
                                        <strong>{panel.wattage}W</strong>
                                    </div>
                                    <div className="spec-item">
                                        <span>Efficiency</span>
                                        <strong>{panel.efficiency}%</strong>
                                    </div>
                                </div>
                                <div className="features-list">
                                    {panel.features.map((feature, index) => (
                                        <div key={index} className="feature-item">
                                            <FaCheck /> {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="equipment-section">
                    <h2>Battery Storage</h2>
                    <div className="equipment-cards">
                        {batteries.map(battery => (
                            <div
                                key={battery.id}
                                className={`equipment-card ${battery.id === recommendations.battery?.id ? 'recommended' : ''}`}
                            >
                                {battery.id === recommendations.battery?.id && (
                                    <div className="recommended-badge">
                                        <FaStar /> Recommended
                                    </div>
                                )}
                                <div className="manufacturer-brand">
                                    <div className="manufacturer-name">{battery.manufacturer}</div>
                                    <div className="model-name">{battery.model}</div>
                                </div>
                                <div className="specs-grid">
                                    <div className="spec-item">
                                        <span>Capacity</span>
                                        <strong>{battery.capacity} kWh</strong>
                                    </div>
                                    <div className="spec-item">
                                        <span>Power</span>
                                        <strong>{battery.power} kW</strong>
                                    </div>
                                </div>
                                <div className="features-list">
                                    {battery.features.map((feature, index) => (
                                        <div key={index} className="feature-item">
                                            <FaCheck /> {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="equipment-section">
                    <h2>Inverters</h2>
                    <div className="equipment-cards">
                        {inverters.map(inverter => (
                            <div
                                key={inverter.id}
                                className={`equipment-card ${inverter.id === recommendations.inverter?.id ? 'recommended' : ''}`}
                            >
                                {inverter.id === recommendations.inverter?.id && (
                                    <div className="recommended-badge">
                                        <FaStar /> Recommended
                                    </div>
                                )}
                                <div className="manufacturer-brand">
                                    <div className="manufacturer-name">{inverter.manufacturer}</div>
                                    <div className="model-name">{inverter.model}</div>
                                </div>
                                <div className="specs-grid">
                                    <div className="spec-item">
                                        <span>Power</span>
                                        <strong>{inverter.power} kW</strong>
                                    </div>
                                    <div className="spec-item">
                                        <span>Efficiency</span>
                                        <strong>{inverter.efficiency}%</strong>
                                    </div>
                                </div>
                                <div className="features-list">
                                    {inverter.features.map((feature, index) => (
                                        <div key={index} className="feature-item">
                                            <FaCheck /> {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="system-size-selector">
                    <h2>System Cost Estimation</h2>
                    <p>Get an instant estimate based on your power needs by selecting custom system</p>
                    <div className="size-options">
                        <select value={selectedSize} onChange={handleSizeChange}>
                            <option value="3">3 kWh System</option>
                            <option value="5">5 kWh System</option>
                            <option value="10">10 kWh System</option>
                            <option value="15">15 kWh System</option>
                            <option value="20">20 kWh System</option>
                            <option value="custom">Custom system</option>
                        </select>
                    </div>

                    {selectedSize === 'custom' && (
                        <div className="load-calculator">
                            <h3>Calculate Your Power Needs</h3>
                            <div className="load-inputs">
                                {loadInputs.map((load, index) => (
                                    <div key={index} className="load-input">
                                        <input
                                            type="text"
                                            placeholder="Appliance name"
                                            value={load.name}
                                            onChange={(e) => handleLoadChange(index, 'name', e.target.value)}
                                        />
                                        <input
                                            type="number"
                                            placeholder="kWh"
                                            value={load.watts}
                                            onChange={(e) => handleLoadChange(index, 'watts', e.target.value)}
                                            step="0.1"
                                            min="0"
                                        />
                                    </div>
                                ))}
                                <button onClick={addLoadInput} className="add-appliance-btn">
                                    Add Appliance
                                </button>
                            </div>
                            <div className="total-load">
                                Total System Size: {calculateTotalLoad()} kWh
                            </div>
                        </div>
                    )}

                    <div className="country-selector">
                        <label>Select Your Country</label>
                        <select
                            value={selectedCountry}
                            onChange={(e) => {
                                setSelectedCountry(e.target.value)
                                africanCurrencyService.setCurrency(e.target.value)
                                // Update price estimate for both fixed and custom sizes
                                if (selectedSize === 'custom') {
                                    updatePriceEstimate(calculateTotalLoad())
                                } else {
                                    updatePriceEstimate(selectedSize)
                                }
                            }}
                        >
                            {/* West Africa */}
                            <optgroup label="West Africa">
                                <option value="NGN">Nigeria</option>
                                <option value="GHS">Ghana</option>
                                <option value="XOF">Benin</option>
                                <option value="XOF">Burkina Faso</option>
                                <option value="XOF">Côte d'Ivoire</option>
                                <option value="GMD">Gambia</option>
                                <option value="GNF">Guinea</option>
                                <option value="XOF">Guinea-Bissau</option>
                                <option value="LRD">Liberia</option>
                                <option value="XOF">Mali</option>
                                <option value="XOF">Niger</option>
                                <option value="XOF">Senegal</option>
                                <option value="SLL">Sierra Leone</option>
                                <option value="XOF">Togo</option>
                            </optgroup>

                            {/* East Africa */}
                            <optgroup label="East Africa">
                                <option value="KES">Kenya</option>
                                <option value="TZS">Tanzania</option>
                                <option value="UGX">Uganda</option>
                                <option value="RWF">Rwanda</option>
                                <option value="BIF">Burundi</option>
                                <option value="ETB">Ethiopia</option>
                                <option value="SOS">Somalia</option>
                                <option value="DJF">Djibouti</option>
                                <option value="ERN">Eritrea</option>
                                <option value="SSP">South Sudan</option>
                            </optgroup>

                            {/* North Africa */}
                            <optgroup label="North Africa">
                                <option value="EGP">Egypt</option>
                                <option value="SDG">Sudan</option>
                                <option value="LYD">Libya</option>
                                <option value="TND">Tunisia</option>
                                <option value="DZD">Algeria</option>
                                <option value="MAD">Morocco</option>
                            </optgroup>

                            {/* Southern Africa */}
                            <optgroup label="Southern Africa">
                                <option value="ZAR">South Africa</option>
                                <option value="ZMW">Zambia</option>
                                <option value="BWP">Botswana</option>
                                <option value="NAD">Namibia</option>
                                <option value="LSL">Lesotho</option>
                                <option value="SZL">Eswatini</option>
                                <option value="MZN">Mozambique</option>
                                <option value="MGA">Madagascar</option>
                                <option value="ZWL">Zimbabwe</option>
                            </optgroup>

                            {/* Central Africa */}
                            <optgroup label="Central Africa">
                                <option value="XAF">Cameroon</option>
                                <option value="XAF">Central African Republic</option>
                                <option value="XAF">Chad</option>
                                <option value="XAF">Republic of Congo</option>
                                <option value="CDF">DR Congo</option>
                                <option value="XAF">Equatorial Guinea</option>
                                <option value="XAF">Gabon</option>
                                <option value="AOA">Angola</option>
                            </optgroup>

                            {/* Island Nations */}
                            <optgroup label="Island Nations">
                                <option value="MUR">Mauritius</option>
                                <option value="SCR">Seychelles</option>
                                <option value="KMF">Comoros</option>
                                <option value="CVE">Cape Verde</option>
                                <option value="STN">São Tomé and Príncipe</option>
                            </optgroup>
                        </select>
                    </div>

                    {priceEstimate && (
                        <div className="price-estimate">
                            <h3>Estimated System Cost</h3>
                            <div className="price-amount">
                                {priceEstimate.formattedPrice}
                            </div>
                            <div className="price-note">
                                <p>
                                    * This is an estimated price for a {selectedSize === 'custom' ? calculateTotalLoad() : selectedSize}kWh system
                                    in {africanCurrencyService.getCountryName(selectedCountry)}.
                                </p>
                                <p>
                                    Actual costs may vary based on specific requirements and location.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default EquipmentRecommendation 