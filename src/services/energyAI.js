import * as tf from '@tensorflow/tfjs'

class EnergyAIService {
  constructor() {
    this.model = null
    this.isInitialized = false
    this.gadgetFeatures = ['wattage', 'hours', 'type', 'efficiency']
    this.gadgetDatabase = {
      // Kitchen Appliances
      'refrigerator': { type: 'appliance', baseWattage: 150, efficiencyFactor: 0.9, hours: 24, variations: {
        'mini': 80,
        'side by side': 180,
        'french door': 200
      }},
      'freezer': { type: 'appliance', baseWattage: 200, efficiencyFactor: 0.85, hours: 24 },
      'microwave': { type: 'appliance', baseWattage: 1000, efficiencyFactor: 0.9, hours: 0.5, variations: {
        'small': 600,
        'large': 1200
      }},
      'electric stove': { type: 'appliance', baseWattage: 2000, efficiencyFactor: 0.8, hours: 1 },
      'oven': { type: 'appliance', baseWattage: 2400, efficiencyFactor: 0.8, hours: 1 },
      'dishwasher': { type: 'appliance', baseWattage: 1200, efficiencyFactor: 0.95, hours: 1 },
      'coffee maker': { type: 'appliance', baseWattage: 900, efficiencyFactor: 0.9, hours: 0.5 },
      'toaster': { type: 'appliance', baseWattage: 850, efficiencyFactor: 0.95, hours: 0.2 },
      'kettle': { type: 'appliance', baseWattage: 1500, efficiencyFactor: 0.9, hours: 0.25 },
      
      // Entertainment & Office
      'tv': { type: 'electronics', baseWattage: 100, efficiencyFactor: 0.95, hours: 4, variations: {
        'led': 60,
        'lcd': 100,
        'plasma': 300,
        'oled': 80,
        '32 inch': 50,
        '43 inch': 70,
        '55 inch': 100,
        '65 inch': 120,
        '75 inch': 150
      }},
      'laptop': { type: 'electronics', baseWattage: 50, efficiencyFactor: 0.9, hours: 6, variations: {
        'gaming': 180,
        'ultrabook': 35,
        'macbook': 30,
        'chromebook': 25
      }},
      'desktop computer': { type: 'electronics', baseWattage: 200, efficiencyFactor: 0.85, hours: 8, variations: {
        'gaming': 500,
        'office': 150,
        'workstation': 300
      }},
      'gaming console': { type: 'electronics', baseWattage: 150, efficiencyFactor: 0.9, hours: 3, variations: {
        'ps5': 200,
        'xbox series x': 180,
        'nintendo switch': 18
      }},
      'monitor': { type: 'electronics', baseWattage: 30, efficiencyFactor: 0.95, hours: 8, variations: {
        '24 inch': 25,
        '27 inch': 35,
        '32 inch': 45,
        'ultrawide': 50
      }},
      
      // Laundry
      'washing machine': { type: 'appliance', baseWattage: 500, efficiencyFactor: 0.9, hours: 1, variations: {
        'front load': 400,
        'top load': 550,
        'commercial': 800
      }},
      'dryer': { type: 'appliance', baseWattage: 3000, efficiencyFactor: 0.8, hours: 1 },
      'iron': { type: 'appliance', baseWattage: 1200, efficiencyFactor: 0.95, hours: 0.5 },
      
      // Climate Control
      'air conditioner': { type: 'hvac', baseWattage: 1500, efficiencyFactor: 0.85, hours: 8, variations: {
        'window': 1000,
        'split': 1500,
        'portable': 1200,
        '9000 btu': 900,
        '12000 btu': 1200,
        '18000 btu': 1800,
        '24000 btu': 2400
      }},
      'fan': { type: 'hvac', baseWattage: 60, efficiencyFactor: 0.95, hours: 8, variations: {
        'ceiling': 75,
        'table': 40,
        'pedestal': 50,
        'industrial': 200
      }},
      'heater': { type: 'hvac', baseWattage: 1500, efficiencyFactor: 0.9, hours: 4, variations: {
        'space heater': 1500,
        'infrared': 1200,
        'oil filled': 800,
        'ceramic': 1000
      }},
      
      // Small Electronics
      'phone charger': { type: 'electronics', baseWattage: 5, efficiencyFactor: 0.9, hours: 8 },
      'wifi router': { type: 'electronics', baseWattage: 7, efficiencyFactor: 0.95, hours: 24 },
      'modem': { type: 'electronics', baseWattage: 10, efficiencyFactor: 0.95, hours: 24 },
      
      // Audio Equipment
      'speaker': { type: 'electronics', baseWattage: 20, efficiencyFactor: 0.9, hours: 3, variations: {
        'bluetooth': 10,
        'soundbar': 30,
        'home theater': 100,
        'subwoofer': 50
      }},
      'radio': { type: 'electronics', baseWattage: 15, efficiencyFactor: 0.9, hours: 4 },
      
      // Kitchen Small Appliances
      'blender': { type: 'appliance', baseWattage: 300, efficiencyFactor: 0.9, hours: 0.2 },
      'food processor': { type: 'appliance', baseWattage: 400, efficiencyFactor: 0.9, hours: 0.3 },
      'mixer': { type: 'appliance', baseWattage: 250, efficiencyFactor: 0.9, hours: 0.3 }
    }
  }

  async initialize() {
    try {
      // Simple initialization to get started
      this.isInitialized = true
      console.log('AI Service initialized')
      return true
    } catch (error) {
      console.error('Failed to initialize AI:', error)
      return false
    }
  }

  async predictEnergyConsumption(gadgetInfo) {
    if (!this.isInitialized) {
      throw new Error('AI model not initialized')
    }

    try {
      // Normalize input data
      const input = tf.tensor2d([[
        this.normalizeWattage(gadgetInfo.wattage),
        this.normalizeHours(gadgetInfo.hours),
        this.encodeType(gadgetInfo.type),
        this.normalizeEfficiency(gadgetInfo.efficiency)
      ]])

      // Make prediction
      const prediction = await this.model.predict(input).data()
      return this.denormalizeConsumption(prediction[0])
    } catch (error) {
      console.error('Prediction failed:', error)
      throw error
    }
  }

  // Helper methods for data normalization
  normalizeWattage(wattage) {
    return wattage / 3000 // Assuming max wattage is 3000W
  }

  normalizeHours(hours) {
    return hours / 24
  }

  encodeType(type) {
    const types = ['appliance', 'electronics', 'lighting', 'hvac']
    return types.indexOf(type.toLowerCase()) / types.length
  }

  normalizeEfficiency(efficiency) {
    const ratings = ['A+++', 'A++', 'A+', 'A', 'B', 'C', 'D']
    return (ratings.length - ratings.indexOf(efficiency)) / ratings.length
  }

  denormalizeConsumption(value) {
    return value * 100 // Scale back to kWh
  }

  // Method to handle custom gadget queries
  async searchGadget(query) {
    query = query.toLowerCase()
    
    // Check for variations first
    for (const [gadgetName, info] of Object.entries(this.gadgetDatabase)) {
      if (info.variations) {
        for (const [variant, wattage] of Object.entries(info.variations)) {
          if (query.includes(variant)) {
            return {
              name: `${variant} ${gadgetName}`,
              type: info.type,
              estimatedWattage: wattage,
              suggestedHours: info.hours,
              confidence: 0.95
            }
          }
        }
      }
    }
    
    // Direct match
    if (this.gadgetDatabase[query]) {
      const info = this.gadgetDatabase[query]
      return {
        name: query,
        type: info.type,
        estimatedWattage: info.baseWattage,
        suggestedHours: info.hours,
        confidence: 0.95
      }
    }

    // Partial match
    const matches = Object.entries(this.gadgetDatabase)
      .filter(([key]) => key.includes(query) || query.includes(key))
      .map(([key, info]) => ({
        name: key,
        type: info.type,
        estimatedWattage: info.baseWattage,
        suggestedHours: info.hours,
        confidence: 0.8
      }))

    if (matches.length > 0) {
      return matches[0]
    }

    // Fallback with more intelligent estimation
    return this.estimateUnknownGadget(query)
  }

  estimateUnknownGadget(query) {
    const words = query.toLowerCase().split(' ')
    let baseEstimate = 100 // Default wattage
    let confidence = 0.4

    const powerKeywords = {
      'small': 0.5,
      'mini': 0.3,
      'portable': 0.7,
      'large': 1.5,
      'heavy': 2,
      'industrial': 3,
      'commercial': 2.5,
      'professional': 2
    }

    const categoryEstimates = {
      'heater': 1500,
      'cooker': 1200,
      'fan': 60,
      'light': 10,
      'charger': 20,
      'pump': 400,
      'motor': 500
    }

    // Check for category-based estimates
    for (const [category, estimate] of Object.entries(categoryEstimates)) {
      if (query.includes(category)) {
        baseEstimate = estimate
        confidence = 0.6
        break
      }
    }

    // Apply modifiers
    words.forEach(word => {
      if (powerKeywords[word]) {
        baseEstimate *= powerKeywords[word]
      }
    })

    return {
      name: query,
      type: 'unknown',
      estimatedWattage: Math.round(baseEstimate),
      suggestedHours: 1,
      confidence: confidence
    }
  }

  async predict(gadgets) {
    if (!this.isInitialized) {
      await this.initialize()
    }

    if (!gadgets || gadgets.length === 0) {
      return {
        peakHours: 'Add gadgets to see usage analysis',
        monthlyTrend: 'Add gadgets to see consumption trends',
        optimization: 'Add gadgets to see optimization tips'
      }
    }

    try {
      const peakHours = this.analyzePeakHours(gadgets)
      const monthlyTrend = this.analyzeMonthlyTrend(gadgets)
      const optimization = this.generateOptimizationTips(gadgets)

      return {
        peakHours,
        monthlyTrend,
        optimization
      }
    } catch (error) {
      console.error('Prediction failed:', error)
      return {
        peakHours: 'Unable to analyze at this time',
        monthlyTrend: 'Unable to analyze at this time',
        optimization: 'Unable to analyze at this time'
      }
    }
  }

  analyzePeakHours(gadgets) {
    const hourlyUsage = new Array(24).fill(0)
    let totalDailyConsumption = 0

    gadgets.forEach(gadget => {
      const hours = gadget.customHours || gadget.avgDailyUsage
      const power = gadget.powerRating * (gadget.quantity || 1)
      totalDailyConsumption += power * hours

      // Estimate usage distribution
      if (gadget.category === 'lighting') {
        // Evening hours for lighting
        for (let i = 17; i < 23; i++) hourlyUsage[i] += power
      } else if (gadget.category === 'hvac') {
        // Peak hours for HVAC
        for (let i = 12; i < 20; i++) hourlyUsage[i] += power
      } else {
        // Distribute usage across typical hours
        const startHour = this.getTypicalStartHour(gadget)
        for (let i = 0; i < hours; i++) {
          hourlyUsage[(startHour + i) % 24] += power
        }
      }
    })

    // Find peak hours
    const peakHour = hourlyUsage.indexOf(Math.max(...hourlyUsage))
    return `Peak usage occurs around ${this.formatHour(peakHour)}. ` +
           `Daily consumption: ${totalDailyConsumption.toFixed(1)} kWh`
  }

  analyzeMonthlyTrend(gadgets) {
    const monthlyConsumption = gadgets.reduce((total, gadget) => {
      const dailyUsage = gadget.powerRating * (gadget.customHours || gadget.avgDailyUsage) * (gadget.quantity || 1)
      return total + (dailyUsage * 30) // Monthly estimate
    }, 0)

    const seasonalImpact = this.estimateSeasonalImpact(gadgets)

    return `Estimated monthly consumption: ${monthlyConsumption.toFixed(1)} kWh. ` +
           `${seasonalImpact}`
  }

  generateOptimizationTips(gadgets) {
    const analysis = gadgets.reduce((acc, gadget) => {
      const dailyConsumption = gadget.powerRating * (gadget.customHours || gadget.avgDailyUsage) * (gadget.quantity || 1)
      const rating = gadget.efficiency || 'B'

      if (rating === 'A+++' || rating === 'A++') {
        acc.ultraEfficient.push({ name: gadget.name, consumption: dailyConsumption })
      } else if (rating === 'A+') {
        acc.efficient.push({ name: gadget.name, consumption: dailyConsumption })
      } else {
        acc.standard.push({
          name: gadget.name,
          consumption: dailyConsumption,
          potential: dailyConsumption * 0.4 // 40% potential savings
        })
      }
      acc.totalConsumption += dailyConsumption
      return acc
    }, {
      totalConsumption: 0,
      ultraEfficient: [],
      efficient: [],
      standard: []
    })

    if (analysis.standard.length > 0) {
      const upgradableAppliances = analysis.standard
        .map(item => `${item.name} (${item.consumption.toFixed(1)} kWh/day)`)
        .join(', ')
      
      const totalSavings = analysis.standard
        .reduce((sum, item) => sum + item.potential, 0)

      return `Upgrade potential found! Consider replacing: ${upgradableAppliances}. ` +
             `Potential energy savings: ${totalSavings.toFixed(1)} kWh/day ` +
             `(${(totalSavings * 365).toFixed(1)} kWh/year)`
    }

    return `Your appliances are energy efficient. ` +
           `Total daily consumption: ${analysis.totalConsumption.toFixed(1)} kWh. ` +
           `Keep maintaining optimal usage patterns.`
  }

  getTypicalStartHour(gadget) {
    const startHours = {
      'appliance': 8, // Kitchen appliances typically used during day
      'electronics': 9, // Office equipment during work hours
      'hvac': 12, // Peak during afternoon
      'lighting': 17 // Evening usage
    }
    return startHours[gadget.category] || 8
  }

  formatHour(hour) {
    return `${hour % 12 || 12}${hour < 12 ? 'AM' : 'PM'}`
  }

  estimateSeasonalImpact(gadgets) {
    const hasHVAC = gadgets.some(g => g.category === 'hvac')
    if (hasHVAC) {
      return 'Expect 20-30% higher consumption during peak summer/winter months.'
    }
    return 'Minimal seasonal variation expected.'
  }
}

export const energyAI = new EnergyAIService() 