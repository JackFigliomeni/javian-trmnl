'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<'username' | 'password' | null>(null)

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

  const inputBase: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#FBF7F2',
    border: '1px solid #C4A882',
    padding: '10px 12px',
    fontSize: '14px',
    color: '#2C1810',
    outline: 'none',
  }

  const inputFocused: React.CSSProperties = {
    ...inputBase,
    borderColor: '#7B1A1A',
    boxShadow: 'inset 3px 0 0 #7B1A1A',
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#3D2208' }}
    >
      <div className="w-full max-w-md">
        <div
          className="bg-[#FBF7F2] p-10"
          style={{
            border: '1px solid #C4A882',
            borderTop: '2px solid #7B1A1A',
          }}
        >
          {/* Logo + Brand */}
          <div className="flex flex-col items-center mb-6">
            <Image
              src="/professor-logo.png"
              alt="Professor Java's Logo"
              width={80}
              height={116}
              className="object-contain mb-4"
            />
            <p
              className="text-center mb-2"
              style={{
                fontSize: '10px',
                letterSpacing: '0.25em',
                color: '#7B1A1A',
                textTransform: 'uppercase',
              }}
            >
              ORDER PORTAL
            </p>
            <h1
              className="text-xl font-bold text-[#2C1810] tracking-wide text-center"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              PROFESSOR JAVA&apos;S
            </h1>
            <p className="text-[#7B1A1A] text-xs tracking-widest uppercase text-center mt-1">
              CATERING &amp; CONCIERGE
            </p>
            <p className="text-[#6B4226] text-xs text-center mt-1">
              Private Aviation Catering &mdash; Albany, NY
            </p>
          </div>

          <div className="border-t border-[#C4A882] my-6" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block mb-1.5"
                style={{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#6B4226',
                  fontWeight: 500,
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
                style={focusedField === 'username' ? inputFocused : inputBase}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1.5"
                style={{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#6B4226',
                  fontWeight: 500,
                }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                style={focusedField === 'password' ? inputFocused : inputBase}
              />
            </div>

            {error && (
              <div
                className="text-sm px-3 py-2 mt-2"
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
              className="w-full bg-[#7B1A1A] hover:bg-[#5C1212] disabled:opacity-60 disabled:cursor-not-allowed text-[#FBF7F2] py-3 text-sm font-medium mt-1"
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p
            className="text-center mt-4"
            style={{
              color: '#C4A882',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Authorized Personnel Only
          </p>
          <div className="text-center mt-1">
            <button
              type="button"
              onClick={showPrivacyPolicy}
              className="text-[#6B4226] text-xs underline"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
