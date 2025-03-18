import solarPanel from '../../assets/images/solar-panel.jpg'

function PowerSection() {
  return (
    <section className="power-section">
      <div className="power-content">
        <h2>Power your home with SolarEnergy</h2>
        <div className="power-info">
          <div className="info-image">
            <img src={solarPanel} alt="Solar Panel Installation" />
          </div>
          <div className="info-text">
            <p>
              Join over 1 million homeowners who have embraced sustainable living
              with our cutting-edge solar and battery solutions. Our expertise ensures
              you get the most efficient and reliable solar system for your home.
            </p>
            <p>
              Take control of your home's energy with real-time monitoring and
              intelligent optimization. Our commitment to sustainability includes:
            </p>
            <ul className="benefits-list">
              <li>Professional system design tailored to your home</li>
              <li>Expert installation by certified technicians</li>
              <li>24/7 system monitoring and performance tracking</li>
              <li>Comprehensive warranty and maintenance support</li>
              <li>Flexible financing options to fit your budget</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PowerSection 