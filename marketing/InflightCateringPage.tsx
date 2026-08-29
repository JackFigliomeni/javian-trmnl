import ContactForm from './ContactForm'
import AnimatedHero from './AnimatedHero'
import ScrollReveal from './ScrollReveal'
import CabinDoorReveal from './CabinDoorReveal'
import FoodGallery from './FoodGallery'

export default function InflightCateringPage() {
  return (
    <div className="min-h-screen px-6 py-10 sm:px-12 sm:py-14" style={{ backgroundColor: '#F5EEE6' }}>
      <div className="max-w-3xl mx-auto">
        <AnimatedHero />

        {/* Highlights */}
        <div className="border-t mb-16" style={{ borderColor: '#C4A882' }} />
        <ScrollReveal className="grid sm:grid-cols-3 gap-8 mb-16">
          <div>
            <p
              style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#7B1A1A' }}
              className="mb-2"
            >
              Clients &amp; Crew
            </p>
            <p style={{ fontSize: '15px', color: '#2C1810', lineHeight: 1.6 }}>
              Meals prepared for everyone on board, passengers and crew alike.
            </p>
          </div>
          <div>
            <p
              style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#7B1A1A' }}
              className="mb-2"
            >
              Personal Shopping
            </p>
            <p style={{ fontSize: '15px', color: '#2C1810', lineHeight: 1.6 }}>
              Available on request for anything beyond the standard order.
            </p>
          </div>
          <div>
            <p
              style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#7B1A1A' }}
              className="mb-2"
            >
              Albany-Based
            </p>
            <p style={{ fontSize: '15px', color: '#2C1810', lineHeight: 1.6 }}>
              Serving private aviation out of Albany, New York.
            </p>
          </div>
        </ScrollReveal>

        {/* Sample Fare */}
        <div className="border-t mb-16" style={{ borderColor: '#C4A882' }} />
        <ScrollReveal>
          <div className="mb-6">
            <h2
              className="mb-2"
              style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 500, color: '#2C1810' }}
            >
              A Taste of What We Serve
            </h2>
            <p style={{ fontSize: '15px', color: '#6B4226' }}>
              A few samples from our catering menu.
            </p>
          </div>
          <FoodGallery />
        </ScrollReveal>

        {/* Contact */}
        <div className="border-t my-16" style={{ borderColor: '#C4A882' }} />
        <CabinDoorReveal />
        <ScrollReveal>
          <div className="mb-10">
            <h2
              className="mb-2"
              style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 500, color: '#2C1810' }}
            >
              Inquire About Working With Java&apos;s
            </h2>
            <p style={{ fontSize: '15px', color: '#6B4226' }}>
              Tell us about your flight and what you need — we typically respond within a few hours.
            </p>
          </div>

          <ContactForm />
        </ScrollReveal>

        {/* Footer */}
        <div className="border-t mt-16 pt-8" style={{ borderColor: '#C4A882' }}>
          <p style={{ fontSize: '13px', color: '#6B4226', lineHeight: 1.8 }}>
            145 Wolf Road, Albany, New York 12205
            <br />
            518.435.0843 &nbsp;&middot;&nbsp; Contactus@professorjavas.com
          </p>
        </div>
      </div>
    </div>
  )
}
