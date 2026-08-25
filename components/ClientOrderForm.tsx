'use client'

import { useState } from 'react'

const inputClass =
  'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 bg-white focus:outline-none focus:border-[#2ea3f2] focus:ring-2 focus:ring-[#2ea3f2]/10 transition'

const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

interface FormData {
  providerName: string
  flightNumber: string
  departureTime: string
  passengerCount: string
  deliveryLocation: string
  foodDetails: string
  specialNotes: string
}

const emptyForm: FormData = {
  providerName: '',
  flightNumber: '',
  departureTime: '',
  passengerCount: '',
  deliveryLocation: '',
  foodDetails: '',
  specialNotes: '',
}

export default function ClientOrderForm() {
  const [form, setForm] = useState<FormData>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess(false)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          passengerCount: parseInt(form.passengerCount, 10),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to submit order.')
      }

      setSuccess(true)
      setForm(emptyForm)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-[#1a1a2e] mb-1">
        New Catering Order
      </h2>
      <p className="text-gray-400 text-sm mb-6">
        Fill in all required fields to submit your catering request.
      </p>

      {success && (
        <div className="mb-5 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
          ✓ Your order has been submitted successfully! Our team will confirm
          shortly.
        </div>
      )}

      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: Provider Name */}
        <div>
          <label htmlFor="providerName" className={labelClass}>
            Provider / Company Name <span className="text-red-400">*</span>
          </label>
          <input
            id="providerName"
            name="providerName"
            type="text"
            required
            value={form.providerName}
            onChange={handleChange}
            placeholder="e.g. Delta Private Charter"
            className={inputClass}
          />
        </div>

        {/* Row 2: Flight Number + Departure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="flightNumber" className={labelClass}>
              Flight Number <span className="text-red-400">*</span>
            </label>
            <input
              id="flightNumber"
              name="flightNumber"
              type="text"
              required
              value={form.flightNumber}
              onChange={handleChange}
              placeholder="e.g. DL4821"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="departureTime" className={labelClass}>
              Departure Date &amp; Time <span className="text-red-400">*</span>
            </label>
            <input
              id="departureTime"
              name="departureTime"
              type="datetime-local"
              required
              value={form.departureTime}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* Row 3: Passengers + Delivery Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="passengerCount" className={labelClass}>
              Number of Passengers <span className="text-red-400">*</span>
            </label>
            <input
              id="passengerCount"
              name="passengerCount"
              type="number"
              required
              min={1}
              value={form.passengerCount}
              onChange={handleChange}
              placeholder="e.g. 8"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="deliveryLocation" className={labelClass}>
              Delivery Location <span className="text-red-400">*</span>
            </label>
            <input
              id="deliveryLocation"
              name="deliveryLocation"
              type="text"
              required
              value={form.deliveryLocation}
              onChange={handleChange}
              placeholder="e.g. Albany Int'l — FBO Terminal B"
              className={inputClass}
            />
          </div>
        </div>

        {/* Row 4: Food Order Details */}
        <div>
          <label htmlFor="foodDetails" className={labelClass}>
            Food Order Details <span className="text-red-400">*</span>
          </label>
          <textarea
            id="foodDetails"
            name="foodDetails"
            required
            rows={5}
            value={form.foodDetails}
            onChange={handleChange}
            placeholder="Please describe the full food and beverage order, including quantities, dietary restrictions, presentation preferences, etc."
            className={inputClass}
          />
        </div>

        {/* Row 5: Special Notes */}
        <div>
          <label htmlFor="specialNotes" className={labelClass}>
            Special Notes{' '}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="specialNotes"
            name="specialNotes"
            rows={3}
            value={form.specialNotes}
            onChange={handleChange}
            placeholder="Any additional instructions, timing requirements, or special requests..."
            className={inputClass}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 bg-[#2ea3f2] hover:bg-[#1a85cc] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          <span>✈</span>
          {submitting ? 'Submitting…' : 'Submit Order'}
        </button>
      </form>
    </div>
  )
}
