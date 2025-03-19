import * as tf from '@tensorflow/tfjs'

class EnergyAI {
  constructor() {
    this.model = null
    this.trained = false
  }

  async initialize() {
    try {
      // Create and compile model
      const model = tf.sequential()
      
      model.add(tf.layers.dense({
        units: 16,
        inputShape: [4],
        activation: 'relu'
      }))
      
      model.add(tf.layers.dense({
        units: 8,
        activation: 'relu'
      }))
      
      model.add(tf.layers.dense({
        units: 3,
        activation: 'sigmoid'
      }))

      model.compile({
        optimizer: 'adam',
        loss: 'binaryCrossentropy'
      })

      this.model = model
      
      // Train immediately after initialization
      await this.trainModel()
      
      this.trained = true
      console.log('AI Model initialized and trained successfully')
      return true
    } catch (error) {
      console.error('Failed to initialize AI model:', error)
      return false
    }
  }

  async trainModel() {
    // Simple training data
    const xs = tf.tensor2d([
      [0.2, 0.3, 0.1, 0.8], // Low power, morning usage, efficient
      [0.8, 0.7, 0.5, 0.3], // High power, evening usage, less efficient
      [0.5, 0.5, 0.2, 0.6], // Medium power, mixed usage, moderately efficient
      [0.9, 0.8, 0.7, 0.2], // Very high power, evening usage, inefficient
      [0.3, 0.2, 0.1, 0.9], // Low power, morning usage, very efficient
    ])

    const ys = tf.tensor2d([
      [1, 0, 1], // Day peak, low consumption, efficient
      [0, 1, 0], // Night peak, high consumption, inefficient
      [1, 0.5, 0.5], // Mixed peak, medium consumption, moderate
      [0, 1, 0], // Night peak, very high consumption, inefficient
      [1, 0, 1], // Day peak, low consumption, efficient
    ])

    await this.model.fit(xs, ys, {
      epochs: 50,
      batchSize: 1
    })

    // Clean up tensors
    xs.dispose()
    ys.dispose()
  }

  async predict(gadgets) {
    if (!this.model || !this.trained || gadgets.length === 0) {
      console.log('Model not ready or no gadgets')
      return null
    }

    try {
      // Prepare input data
      const inputData = gadgets.map(g => [
        g.powerRating / 5.0, // Normalize power
        g.customHours / 24.0, // Normalize hours
        g.quantity / 10.0, // Normalize quantity
        this.getEfficiencyScore(g.energyEfficiency)
      ])

      // Make prediction using tf.tidy for memory management
      const prediction = await tf.tidy(() => {
        const input = tf.tensor2d(inputData)
        const avgInput = input.mean(0).expandDims(0)
        return this.model.predict(avgInput).dataSync()
      })

      // Calculate some basic metrics
      const totalDailyUsage = gadgets.reduce((sum, g) => 
        sum + (g.powerRating * g.quantity * g.customHours), 0
      )

      // Generate insights based on predictions
      return {
        peakHours: this.getPeakHoursMessage(prediction[0], gadgets),
        monthlyTrend: this.getMonthlyTrendMessage(prediction[1], totalDailyUsage),
        optimization: this.getOptimizationMessage(prediction[2], gadgets)
      }
    } catch (error) {
      console.error('Prediction failed:', error)
      return null
    }
  }

  getPeakHoursMessage(score, gadgets) {
    const totalPower = gadgets.reduce((sum, g) => sum + (g.powerRating * g.quantity), 0)
    const dayHours = gadgets.filter(g => g.customHours >= 6 && g.customHours <= 18).length
    const nightHours = gadgets.length - dayHours
    
    const highPowerGadgets = gadgets
      .filter(g => g.powerRating > 1.0)
      .map(g => g.name)
      .join(', ')

    if (score > 0.7) {
      return `Optimal usage pattern detected! ${dayHours} of ${gadgets.length} appliances run during solar peak hours. ` +
             `This maximizes solar energy utilization and reduces grid dependency.`
    } else if (score > 0.3) {
      return `Mixed usage detected - ${dayHours} daytime and ${nightHours} evening appliances. ` +
             `High-power appliances (${highPowerGadgets}) could be scheduled during peak sun hours (10 AM - 4 PM) ` +
             `to maximize solar efficiency.`
    } else {
      return `Heavy evening usage detected. Consider running ${highPowerGadgets} during daylight hours ` +
             `to optimize solar power usage and reduce evening grid load.`
    }
  }

  getMonthlyTrendMessage(score, dailyUsage) {
    const monthlyUsage = dailyUsage * 30
    const yearlyUsage = monthlyUsage * 12
    const co2Reduction = yearlyUsage * 0.4 // 0.4 kg CO2 per kWh average
    const treesEquivalent = (co2Reduction / 21).toFixed(1) // Average tree absorbs 21 kg CO2 per year

    if (score > 0.7) {
      return `Seasonal impact analysis: Summer consumption could peak at ${(monthlyUsage + monthlyUsage * 0.3).toFixed(1)} kWh/month ` +
             `due to cooling needs. Yearly usage: ${yearlyUsage.toFixed(1)} kWh. ` +
             `Solar adoption could reduce CO2 emissions by ${co2Reduction.toFixed(1)} kg/year (equivalent to ${treesEquivalent} trees).`
    } else if (score > 0.3) {
      return `Projected monthly usage: ${monthlyUsage.toFixed(1)} kWh with moderate seasonal variations. ` +
             `Annual consumption: ${yearlyUsage.toFixed(1)} kWh. ` +
             `Solar energy could offset ${(yearlyUsage * 0.7).toFixed(1)} kWh of grid power per year.`
    } else {
      return `Stable consumption pattern: ${monthlyUsage.toFixed(1)} kWh/month. ` +
             `Annual consumption: ${yearlyUsage.toFixed(1)} kWh. ` +
             `Your consistent usage pattern is ideal for solar power planning.`
    }
  }

  getOptimizationMessage(score, gadgets) {
    const efficiencyAnalysis = gadgets.reduce((acc, gadget) => {
      const rating = gadget.energyEfficiency
      const dailyConsumption = gadget.powerRating * gadget.customHours * gadget.quantity
      
      acc.totalConsumption += dailyConsumption
      
      // Categorize by efficiency rating
      if (rating === 'A+++') {
        acc.ultraEfficient.push({ name: gadget.name, consumption: dailyConsumption })
      } else if (rating === 'A++') {
        acc.veryEfficient.push({ name: gadget.name, consumption: dailyConsumption })
      } else if (rating === 'A+') {
        acc.efficient.push({ name: gadget.name, consumption: dailyConsumption })
      } else if (rating === 'A') {
        acc.standard.push({
          name: gadget.name,
          consumption: dailyConsumption,
          potential: dailyConsumption * 0.4 // 40% potential savings to A+++
        })
      }
      return acc
    }, {
      totalConsumption: 0,
      ultraEfficient: [], // A+++
      veryEfficient: [], // A++
      efficient: [],     // A+
      standard: []       // A
    })

    // Generate message based on efficiency distribution
    if (efficiencyAnalysis.standard.length > 0) {
      const upgradableAppliances = efficiencyAnalysis.standard
        .map(item => `${item.name} (${item.consumption.toFixed(1)} kWh/day)`)
        .join(', ')
      
      const totalSavings = efficiencyAnalysis.standard
        .reduce((sum, item) => sum + item.potential, 0)
      const yearlySavings = totalSavings * 365 * 0.15 // $0.15/kWh

      return `Energy-saving opportunity! These appliances have standard efficiency (A rating): ${upgradableAppliances}. ` +
             `Upgrading to A+++ models could save approximately ${totalSavings.toFixed(1)} kWh/day ` +
             `($${yearlySavings.toFixed(2)}/year). This represents a ${((totalSavings / efficiencyAnalysis.totalConsumption) * 100).toFixed(1)}% ` +
             `reduction in your total energy consumption.`
    } else if (efficiencyAnalysis.efficient.length > efficiencyAnalysis.ultraEfficient.length) {
      // More A+ than A+++ appliances
      const upgradePotential = efficiencyAnalysis.efficient
        .map(item => item.name)
        .join(', ')
      
      return `Good efficiency profile! Your appliances rated A+ (${upgradePotential}) ` +
             `are energy-efficient, but could be upgraded to A+++ for 20-30% more savings. ` +
             `Total daily consumption: ${efficiencyAnalysis.totalConsumption.toFixed(1)} kWh.`
    } else if (efficiencyAnalysis.veryEfficient.length > efficiencyAnalysis.ultraEfficient.length) {
      // More A++ than A+++ appliances
      return `Very good efficiency profile! Most of your appliances are A++ rated. ` +
             `Total daily consumption: ${efficiencyAnalysis.totalConsumption.toFixed(1)} kWh. ` +
             `Consider A+++ models for future replacements for maximum efficiency.`
    } else {
      // Mostly A+++ appliances
      return `Excellent energy efficiency! Your appliances use the highest A+++ rating technology. ` +
             `Current daily consumption: ${efficiencyAnalysis.totalConsumption.toFixed(1)} kWh. ` +
             `Maintain peak efficiency with regular maintenance.`
    }
  }

  getEfficiencyScore(rating) {
    const scores = {
      'A+++': 1.0,
      'A++': 0.8,
      'A+': 0.6,
      'A': 0.4,
      'B': 0.2
    }
    return scores[rating] || 0.2
  }
}

export const energyAI = new EnergyAI() 