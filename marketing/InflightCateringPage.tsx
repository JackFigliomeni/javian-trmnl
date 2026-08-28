import Image from 'next/image'
import Link from 'next/link'
import ContactForm from './ContactForm'

export default function InflightCateringPage() {
  return (
    <div className="min-h-screen px-6 py-10 sm:px-12 sm:py-14" style={{ backgroundColor: '#F5EEE6' }}>
      <div className="max-w-3xl mx-auto">
        {/* Top bar */}
        <div className="flex items-start justify-between mb-20">
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '0.2em',
              color: '#6B4226',
              textTransform: 'uppercase',
            }}
          >
            Professor Java&apos;s &nbsp;&middot;&nbsp; Catering &amp; Concierge &nbsp;&middot;&nbsp; Albany
          </p>
          <Image
            src="/professor-logo.png"
            alt="Professor Java's Logo"
            width={40}
            height={58}
            className="object-contain"
          />
        </div>

        {/* Headline */}
        <h1
          className="mb-8"
          style={{
            fontSize: 'clamp(32px, 6vw, 58px)',
            fontWeight: 500,
            color: '#2C1810',
            letterSpacing: '0.01em',
            lineHeight: 1.15,
          }}
        >
          Professor Java&apos;s Inflight Catering and Concierge
        </h1>

        <p
          className="mb-6"
          style={{ fontSize: '22px', color: '#6B4226', lineHeight: 1.5 }}
        >
          Catering from takeoff to touchdown.
        </p>

        <p
          className="mb-10 max-w-xl"
          style={{ fontSize: '17px', color: '#2C1810', lineHeight: 1.7 }}
        >
          We prepare meals for clients and crew aboard private aircraft,
          coordinated around your flight schedule and delivered to your FBO.
          Personal shopping is also available on request.
        </p>

        {/* Sign in button */}
        <div className="mb-16">
          <Link
            href="/login"
            className="inline-block"
            style={{
              background: 'transparent',
              border: '1px solid #C4A882',
              color: '#6B4226',
              padding: '12px 24px',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
            }}
          >
            Client &amp; Staff Sign In →
          </Link>
        </div>

        {/* Highlights */}
        <div className="border-t mb-16" style={{ borderColor: '#C4A882' }} />
        <div className="grid sm:grid-cols-3 gap-8 mb-16">
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
        </div>

        {/* Contact */}
        <div className="border-t mb-12" style={{ borderColor: '#C4A882' }} />
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
