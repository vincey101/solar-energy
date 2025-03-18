import { useState, useEffect } from 'react'
import slider1 from '../../assets/images/slider1.jpg'
import slider2 from '../../assets/images/slider2.jpg'
import slider3 from '../../assets/images/slider3.jpg'

const slides = [
  {
    id: 1,
    image: slider1,
    title: 'Sustainable Energy Solutions',
    description: 'Power your home with clean, renewable solar energy',
  },
  {
    id: 2,
    image: slider2,
    title: 'Smart Solar Technology',
    description: 'Advanced solutions for modern energy needs',
  },
  {
    id: 3,
    image: slider3,
    title: 'Affordable Green Energy',
    description: 'Make the switch to solar power today',
  },
]

function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

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