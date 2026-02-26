import fafacon from '../../assets/fafacon.svg'
import './About.css'

export default function About() {
  return (
    <div className="about">
      <div className="about__logo">
        <img src={fafacon} alt="logo" className="about-logo-icon" />
      </div>
      <section className="about__hero">
        <div className="about__label">OUR PHILOSOPHY</div>
        <h1 className="about__title">WHERE TECHNOLOGY MEETS RESTRAINT</h1>
        <p className="about__text">
          Maison Apple is a reservation platform inspired by the intersection of
          haute couture and consumer technology. We believe that the act of choosing
          a device should feel as deliberate and refined as selecting a piece from
          a design house collection.
        </p>
      </section>

      <section className="about__values" aria-label="Our values">
        <div className="about__value">
          <div className="about__value-number">01</div>
          <h2 className="about__value-title">PRECISION</h2>
          <p className="about__value-desc">
            Every detail is intentional. From the grid-based layout to the
            typographic hierarchy, nothing is left to chance.
          </p>
        </div>
        <div className="about__value">
          <div className="about__value-number">02</div>
          <h2 className="about__value-title">RESTRAINT</h2>
          <p className="about__value-desc">
            We remove the unnecessary. What remains is pure function,
            presented with the confidence of simplicity.
          </p>
        </div>
        <div className="about__value">
          <div className="about__value-number">03</div>
          <h2 className="about__value-title">AUTHENTICITY</h2>
          <p className="about__value-desc">
            Only genuine Apple devices. Every product is verified,
            every specification confirmed, every reservation honored.
          </p>
        </div>
        <div className="about__value">
          <div className="about__value-number">04</div>
          <h2 className="about__value-title">CURATION</h2>
          <p className="about__value-desc">
            A selective catalog. Not everything Apple makes, but everything
            worth reserving. Quality over quantity.
          </p>
        </div>
        <div className="about__value">
          <div className="about__value-number">05</div>
          <h2 className="about__value-title">EXPERIENCE</h2>
          <p className="about__value-desc">
            The journey matters as much as the destination. Browsing should
            feel like walking through a gallery.
          </p>
        </div>
        <div className="about__value">
          <div className="about__value-number">06</div>
          <h2 className="about__value-title">TRANSPARENCY</h2>
          <p className="about__value-desc">
            Clear pricing, honest availability, straightforward specifications.
            No hidden costs, no fine print.
          </p>
        </div>
      </section>

      <section className="about__process">
        <h2 className="about__process-title">HOW IT WORKS</h2>
        <div className="about__steps">
          <div className="about__step">
            <div className="about__step-number">01</div>
            <h3 className="about__step-title">BROWSE</h3>
            <p className="about__step-desc">Explore our curated catalog of Apple devices</p>
          </div>
          <div className="about__step">
            <div className="about__step-number">02</div>
            <h3 className="about__step-title">SELECT</h3>
            <p className="about__step-desc">Choose your device and review specifications</p>
          </div>
          <div className="about__step">
            <div className="about__step-number">03</div>
            <h3 className="about__step-title">RESERVE</h3>
            <p className="about__step-desc">Submit your reservation with a preferred date</p>
          </div>
          <div className="about__step">
            <div className="about__step-number">04</div>
            <h3 className="about__step-title">COLLECT</h3>
            <p className="about__step-desc">Receive confirmation and collect your device</p>
          </div>
        </div>
      </section>
    </div>
  )
}
