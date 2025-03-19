import { useState, useEffect } from 'react'
import { FaStar, FaShieldAlt, FaDollarSign, FaCheck } from 'react-icons/fa'
import equipmentHero from '../../assets/images/equipment.jpg'

// Equipment database
const solarPanels = [
    {
        id: 1,
        manufacturer: 'SunPower',
        model: 'M-Series SPR-M425',
        wattage: 425,
        efficiency: 22.8,
        warranty: 25,
        price: 850,
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
        price: 11500,
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
                                    <div className="spec-item">
                                        <FaShieldAlt />
                                        <span>{panel.warranty} Year Warranty</span>
                                    </div>
                                    <div className="spec-item">
                                        <FaDollarSign />
                                        <span>${panel.price}/panel</span>
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
                                    <div className="spec-item">
                                        <FaShieldAlt />
                                        <span>{battery.warranty} Year Warranty</span>
                                    </div>
                                    <div className="spec-item">
                                        <FaDollarSign />
                                        <span>${battery.price}</span>
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
                                    <div className="spec-item">
                                        <FaShieldAlt />
                                        <span>{inverter.warranty} Year Warranty</span>
                                    </div>
                                    <div className="spec-item">
                                        <FaDollarSign />
                                        <span>${inverter.price}</span>
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

                <div className="equipment-section cost-estimation">
                    <h2>System Cost Estimation</h2>
                    <div className="cost-breakdown">
                        <div className="cost-section">
                            <h3>Equipment Costs</h3>
                            <div className="cost-grid">
                                <div className="cost-item">
                                    <span>Solar Panels ({systemSize.panelCount} units)</span>
                                    <strong>${costBreakdown.equipment.panels.toLocaleString()}</strong>
                                </div>
                                <div className="cost-item">
                                    <span>Battery Storage</span>
                                    <strong>${costBreakdown.equipment.battery.toLocaleString()}</strong>
                                </div>
                                <div className="cost-item">
                                    <span>Inverter</span>
                                    <strong>${costBreakdown.equipment.inverter.toLocaleString()}</strong>
                                </div>
                                <div className="cost-item total">
                                    <span>Equipment Total</span>
                                    <strong>${costBreakdown.equipment.total.toLocaleString()}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="cost-section">
                            <h3>Installation Costs</h3>
                            <div className="cost-grid">
                                <div className="cost-item">
                                    <span>Labor</span>
                                    <strong>${costBreakdown.installation.labor.toLocaleString()}</strong>
                                </div>
                                <div className="cost-item">
                                    <span>Mounting Hardware</span>
                                    <strong>${costBreakdown.installation.mounting.toLocaleString()}</strong>
                                </div>
                                <div className="cost-item">
                                    <span>Electrical Work</span>
                                    <strong>${costBreakdown.installation.electrical.toLocaleString()}</strong>
                                </div>
                                <div className="cost-item">
                                    <span>Permits & Inspection</span>
                                    <strong>${(costBreakdown.installation.permits + costBreakdown.installation.inspection).toLocaleString()}</strong>
                                </div>
                                <div className="cost-item total">
                                    <span>Installation Total</span>
                                    <strong>${costBreakdown.installation.total.toLocaleString()}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="cost-section">
                            <h3>Maintenance Costs</h3>
                            <div className="cost-grid">
                                <div className="cost-item">
                                    <span>Annual Maintenance</span>
                                    <strong>${costBreakdown.maintenance.annual.toLocaleString()}/year</strong>
                                </div>
                                <div className="cost-item">
                                    <span>10-Year Maintenance Estimate</span>
                                    <strong>${costBreakdown.maintenance.tenYear.toLocaleString()}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="total-cost">
                            <h3>Total System Cost</h3>
                            <div className="cost-amount">
                                ${costBreakdown.totalCost.toLocaleString()}
                            </div>
                            <p className="cost-note">
                                * Prices include standard installation. Actual costs may vary based on site conditions and local requirements.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EquipmentRecommendation 