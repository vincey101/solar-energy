function ReviewSection() {
    const reviews = [
        {
            name: 'Ashley',
            rating: 5,
            review: 'SolarEnergy made switching to solar so simple. Their team was professional and the installation was completed ahead of schedule. My energy bills have dropped significantly!',
            date: '5 days ago'
        },
        {
            name: 'Derrick',
            rating: 5,
            review: 'Excellent customer service from start to finish. The monitoring system they provided helps me track my savings in real-time. Best investment for my home.',
            date: '3 weeks ago'
        },
        {
            name: 'Carol',
            rating: 5,
            review: 'The entire process was seamless. Their financing options made it affordable, and the system has exceeded my expectations in terms of energy production.',
            date: '1 month ago'
        },
        {
            name: 'Peter',
            rating: 5,
            review: "Very impressed with SolarEnergy's expertise. They designed a custom system for my home and their support team has been responsive to all my questions.",
            date: '1 month ago'
        }
    ]

    return (
        <section className="review-section">
            <div className="review-content">
                <h2>Customer experience</h2>
                <div className="rating-summary">
                    <span className="rating-text">Excellent</span>
                    <div className="stars">
                        {'★'.repeat(4)}{'★'.repeat(1)}
                    </div>
                    <span className="rating-score">4.77</span>
                    <span className="rating-count">based on 300 reviews</span>
                </div>
                <div className="review-grid">
                    {reviews.map((review, index) => (
                        <div key={index} className="review-card">
                            <div className="review-header">
                                <h3>{review.name}</h3>
                                <div className="stars">{'★'.repeat(review.rating)}</div>
                            </div>
                            <p className="review-text">{review.review}</p>
                            <div className="review-meta">
                                <span>{review.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ReviewSection 