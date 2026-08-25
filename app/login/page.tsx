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

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#3D2208' }}
    >
      <div className="w-full max-w-sm">
        <div
          className="bg-[#FBF7F2] border border-[#C4A882] rounded-sm p-8"
        >
          {/* Logo + Brand */}
          <div className="flex flex-col items-center mb-5">
            <Image
              src="https://professorjavas.com/wp-content/uploads/2024/09/Coffee_Shop_22@2x.png"
              alt="Professor Java's Logo"
              width={60}
              height={48}
              className="object-contain mb-3"
              unoptimized
            />
            <h1 className="text-xl font-bold text-[#2C1810] tracking-wide text-center" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              PROFESSOR JAVA&apos;S
            </h1>
            <p className="text-[#7B1A1A] text-xs tracking-widest uppercase text-center mt-1">
              CATERING &amp; CONCIERGE
            </p>
            <p className="text-[#6B4226] text-xs text-center mt-1">
              Private Aviation Catering -- Albany, NY
            </p>
          </div>

          <div className="border-t border-[#C4A882] my-5" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block uppercase text-[#6B4226] mb-1"
                style={{ fontSize: '11px', letterSpacing: '0.08em' }}
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
                className="w-full border border-[#C4A882] bg-[#FBF7F2] rounded-sm px-3 py-2 text-sm text-[#2C1810] focus:border-[#7B1A1A] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block uppercase text-[#6B4226] mb-1"
                style={{ fontSize: '11px', letterSpacing: '0.08em' }}
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
                className="w-full border border-[#C4A882] bg-[#FBF7F2] rounded-sm px-3 py-2 text-sm text-[#2C1810] focus:border-[#7B1A1A] focus:outline-none"
              />
            </div>

            {error && (
              <div className="bg-[#7B1A1A]/10 border border-[#7B1A1A]/40 text-[#7B1A1A] text-sm px-3 py-2 rounded-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7B1A1A] hover:bg-[#5C1212] disabled:opacity-60 disabled:cursor-not-allowed text-[#FBF7F2] py-2.5 text-sm font-medium rounded-sm mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-[#C4A882] text-xs text-center mt-5">
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
