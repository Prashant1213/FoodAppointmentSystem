function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-light py-5">
        <div className="container py-5">
          <div className="row align-items-center">

            <div className="col-lg-6">
              <h1 className="display-4 fw-bold">
                Book Your Meal in Advance
              </h1>

              <p className="lead mt-3">
                Discover restaurants, explore menus, choose your
                preferred time and enjoy your meal without waiting.
              </p>

              <button className="btn btn-primary btn-lg mt-3">
                Find Restaurants
              </button>
            </div>

            <div className="col-lg-6 text-center mt-4 mt-lg-0">
              <div className="p-5 bg-white rounded shadow">
                <h3>🍽️ Food Appointment</h3>
                <p className="text-muted">
                  Your table. Your meal. Your time.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-5">
        <div className="container">

          <div className="text-center mb-5">
            <h2>Why Choose Us?</h2>
            <p className="text-muted">
              Make your dining experience easier.
            </p>
          </div>

          <div className="row g-4">

            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center p-4">
                  <h3>📅</h3>
                  <h5 className="mt-3">Book in Advance</h5>
                  <p className="text-muted">
                    Select your preferred date and time before visiting.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center p-4">
                  <h3>🍴</h3>
                  <h5 className="mt-3">Choose Your Meal</h5>
                  <p className="text-muted">
                    Browse restaurant menus and select your food.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center p-4">
                  <h3>💳</h3>
                  <h5 className="mt-3">Easy Payment</h5>
                  <p className="text-muted">
                    Pay only 25% upfront and enjoy a smooth experience.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-light py-5">
        <div className="container">

          <div className="text-center mb-5">
            <h2>How It Works</h2>
          </div>

          <div className="row text-center g-4">

            <div className="col-md-3">
              <h3>1️⃣</h3>
              <h5>Choose Restaurant</h5>
              <p className="text-muted">
                Find your favourite restaurant.
              </p>
            </div>

            <div className="col-md-3">
              <h3>2️⃣</h3>
              <h5>Select Meal</h5>
              <p className="text-muted">
                Browse the menu and choose food.
              </p>
            </div>

            <div className="col-md-3">
              <h3>3️⃣</h3>
              <h5>Book Time</h5>
              <p className="text-muted">
                Select date and available time.
              </p>
            </div>

            <div className="col-md-3">
              <h3>4️⃣</h3>
              <h5>Pay 25%</h5>
              <p className="text-muted">
                Pay the advance and confirm.
              </p>
            </div>

          </div>

        </div>
      </section>
    </>
  )
}

export default Home