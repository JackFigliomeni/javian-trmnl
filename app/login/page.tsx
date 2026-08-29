'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<'username' | 'password' | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid username or password. Please try again.')
        setLoading(false)
        return
      }

      router.push('/')
      router.refresh()
    } catch {
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  function showPrivacyPolicy() {
    window.alert(
      "Privacy Policy\n\nBy submitting an order through this portal, you acknowledge that Professor Java's Catering & Concierge will collect and retain the information provided, including company name, flight details, and order specifications, solely for the purpose of fulfilling your catering request. This information is not shared with third parties. For questions regarding your data, contact us at contact@professorjavas.com."
    )
  }

  const underlineBase: React.CSSProperties = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: '#C4A882',
    padding: '8px 0',
    fontSize: '22px',
    color: '#2C1810',
    outline: 'none',
  }

  const underlineFocused: React.CSSProperties = {
    ...underlineBase,
    borderBottomColor: '#7B1A1A',
  }

  return (
    <div className="min-h-screen px-6 py-10 sm:px-12 sm:py-14" style={{ backgroundColor: '#F5EEE6' }}>
      <div className="max-w-3xl mx-auto">
        {/* Top bar */}
        <div className="flex items-start justify-between mb-24">
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

        {/* Back to main page */}
        <Link
          href="/"
          className="inline-block mb-10"
          style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: '#6B4226',
          }}
        >
          ← Back to Main Page
        </Link>

        {/* Welcome headline */}
        <h1
          className="mb-16"
          style={{
            fontSize: 'clamp(56px, 10vw, 96px)',
            fontWeight: 500,
            color: '#2C1810',
            letterSpacing: '0.01em',
          }}
        >
          Welcome
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-xl">
          <div className="mb-8">
            <label
              htmlFor="username"
              className="block mb-2"
              style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: '#6B4226',
              }}
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField(null)}
              style={focusedField === 'username' ? underlineFocused : underlineBase}
            />
          </div>

          <div className="mb-10">
            <label
              htmlFor="password"
              className="block mb-2"
              style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: '#6B4226',
              }}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                style={{
                  ...(focusedField === 'password' ? underlineFocused : underlineBase),
                  paddingRight: '56px',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-0 top-1/2 -translate-y-1/2"
                style={{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#6B4226',
                }}
                tabIndex={-1}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
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
            disabled={loading}
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
            {loading ? 'Entering...' : 'Enter the Terminal →'}
          </button>
        </form>

        <div className="mt-20 flex items-center gap-4">
          <p
            style={{
              color: '#C4A882',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Authorized Personnel Only
          </p>
          <button
            type="button"
            onClick={showPrivacyPolicy}
            className="underline"
            style={{ color: '#6B4226', fontSize: '11px' }}
          >
            Privacy Policy
          </button>
        </div>
      </div>
    </div>
  )
}
