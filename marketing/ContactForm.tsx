'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const underlineBase: React.CSSProperties = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: '#C4A882',
    padding: '8px 0',
    fontSize: '18px',
    color: '#2C1810',
    outline: 'none',
  }

  const underlineFocused: React.CSSProperties = {
    ...underlineBase,
    borderBottomColor: '#7B1A1A',
  }

  const fieldStyle = (name: string) =>
    focusedField === name ? underlineFocused : underlineBase

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setStatus('sending')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, company, email, message }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      setStatus('sent')
      setFirstName('')
      setLastName('')
      setCompany('')
      setEmail('')
      setMessage('')
    } catch {
      setError('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div
        className="px-6 py-8 text-center"
        style={{ border: '1px solid #C4A882', backgroundColor: '#FBF7F2' }}
      >
        <p className="text-xl mb-2" style={{ color: '#2C1810' }}>
          Thank you — your inquiry has been received.
        </p>
        <p style={{ color: '#6B4226', fontSize: '14px' }}>
          We typically respond within a few hours.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6 mb-6">
        <div>
          <label
            htmlFor="firstName"
            className="block mb-2"
            style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6B4226' }}
          >
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onFocus={() => setFocusedField('firstName')}
            onBlur={() => setFocusedField(null)}
            style={fieldStyle('firstName')}
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block mb-2"
            style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6B4226' }}
          >
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onFocus={() => setFocusedField('lastName')}
            onBlur={() => setFocusedField(null)}
            style={fieldStyle('lastName')}
          />
        </div>

        <div>
          <label
            htmlFor="company"
            className="block mb-2"
            style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6B4226' }}
          >
            Company (optional)
          </label>
          <input
            id="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            onFocus={() => setFocusedField('company')}
            onBlur={() => setFocusedField(null)}
            style={fieldStyle('company')}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block mb-2"
            style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6B4226' }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            style={fieldStyle('email')}
          />
        </div>
      </div>

      <div className="mb-6">
        <label
          htmlFor="message"
          className="block mb-2"
          style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6B4226' }}
        >
          Message
        </label>
        <textarea
          id="message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => setFocusedField('message')}
          onBlur={() => setFocusedField(null)}
          style={{ ...fieldStyle('message'), resize: 'vertical' }}
        />
      </div>

      {error && (
        <div
          className="text-sm px-3 py-2 mb-6"
          style={{
            borderLeft: '2px solid #7B1A1A',
            backgroundColor: 'rgba(123,26,26,0.08)',
            color: '#7B1A1A',
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          background: 'transparent',
          border: '1px solid #C4A882',
          color: '#6B4226',
          padding: '12px 24px',
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#7B1A1A' }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#C4A882' }}
      >
        {status === 'sending' ? 'Sending...' : 'Send Inquiry →'}
      </button>

      <p className="mt-4" style={{ color: '#6B4226', fontSize: '13px' }}>
        We typically respond within a few hours.
      </p>
    </form>
  )
}
