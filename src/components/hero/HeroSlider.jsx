import { useState, useEffect } from 'react'
import slider1 from '../../assets/images/slider1.jpg'
import slider2 from '../../assets/images/slider2.jpg'
import slider3 from '../../assets/images/slider3.jpg'
import * as tf from '@tensorflow/tfjs'

const slides = [
  {
    id: 1,
    image: slider1,
    title: 'Sustainable Energy\nSolutions',
    description: 'Power your home with clean, renewable solar energy',
  },
  {
    id: 2,
    image: slider2,
    title: 'Smart Solar\nTechnology',
    description: 'Harness the power of renewable energy for a sustainable future',
  },
  {
    id: 3,
    image: slider3,
    title: 'Clean Power\nInnovation',
    description: 'Join thousands of homes already saving with solar energy',
  }
]

function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [model, setModel] = useState(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    async function loadModel() {
      const loadedModel = await tf.loadLayersModel('path/to/your/model.json')
      setModel(loadedModel)
    }
    loadModel()
  }, [])

  const predictConsumption = async (gadgetData) => {
    if (!model) return

    const input = tf.tensor2d([
      gadgetData.map(g => [
        g.powerRating,
        g.customHours,
        g.quantity,
        g.energyEfficiency === 'A+++' ? 4 :
          g.energyEfficiency === 'A++' ? 3 :
            g.energyEfficiency === 'A+' ? 2 : 1
      ])
    ])

    const prediction = await model.predict(input).data()
    return {
      peakHours: prediction[0] > 0.5 ? "daytime" : "evening",
      monthlyTrend: prediction[1],
      optimizationScore: prediction[2]
    }
  }

  return (
    <div className="hero-slider">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide ${index === currentSlide ? 'active' : ''}`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            onError={(e) => {
              console.error(`Failed to load image: ${slide.image}`)
              e.target.style.backgroundColor = '#333'
            }}
          />
          <div className="slide-content">
            <h1>{slide.title}</h1>
            <p>{slide.description}</p>
            <a href="/get-started" className="cta-button">
              Get Started
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}

export default HeroSlider 