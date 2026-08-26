'use client'

import { useState } from 'react'

const inputClass =
  'w-full border border-[#C4A882] bg-[#FBF7F2] rounded-sm px-3 py-2 text-sm text-[#2C1810] focus:border-[#7B1A1A] focus:outline-none'

const labelClass = 'block uppercase text-[#6B4226] mb-1'
const labelStyle = { fontSize: '11px', letterSpacing: '0.08em' }

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
  const [file, setFile] = useState<File | null>(null)
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
      let attachmentUrl: string | undefined
      let attachmentName: string | undefined

      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        if (!uploadRes.ok) {
          const data = await uploadRes.json()
          throw new Error(data.error ?? 'Failed to upload file.')
        }
        const uploadData = await uploadRes.json()
        attachmentUrl = uploadData.url
        attachmentName = uploadData.name
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          passengerCount: parseInt(form.passengerCount, 10),
          ...(attachmentUrl ? { attachmentUrl } : {}),
          ...(attachmentName ? { attachmentName } : {}),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to submit order.')
      }

      setSuccess(true)
      setForm(emptyForm)
      setFile(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-[#FBF7F2] border border-[#C4A882] rounded-sm p-6">
      <h2 className="text-base font-bold text-[#2C1810] pb-2 mb-4" style={{ borderBottom: '1px solid #7B1A1A' }}>
        New Catering Order
      </h2>
      <p className="text-[#6B4226] text-sm mb-6">
        Fill in all required fields to submit your catering request.
      </p>

      {success && (
        <div className="mb-5 bg-[#FBF7F2] border border-[#C4A882] text-[#2C1810] text-sm px-4 py-3 rounded-sm">
          Your order has been submitted successfully. Our team will confirm shortly.
        </div>
      )}

      {error && (
        <div className="mb-5 bg-[#7B1A1A]/10 border border-[#7B1A1A]/40 text-[#7B1A1A] text-sm px-4 py-3 rounded-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: Provider Name */}
        <div>
          <label htmlFor="providerName" className={labelClass} style={labelStyle}>
            Provider / Company Name <span className="text-[#7B1A1A]">*</span>
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
            <label htmlFor="flightNumber" className={labelClass} style={labelStyle}>
              Flight Number <span className="text-[#7B1A1A]">*</span>
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
            <label htmlFor="departureTime" className={labelClass} style={labelStyle}>
              Departure Date &amp; Time <span className="text-[#7B1A1A]">*</span>
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
            <label htmlFor="passengerCount" className={labelClass} style={labelStyle}>
              Number of Passengers <span className="text-[#7B1A1A]">*</span>
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
            <label htmlFor="deliveryLocation" className={labelClass} style={labelStyle}>
              Delivery Location <span className="text-[#7B1A1A]">*</span>
            </label>
            <input
              id="deliveryLocation"
              name="deliveryLocation"
              type="text"
              required
              value={form.deliveryLocation}
              onChange={handleChange}
              placeholder="e.g. Albany Int'l -- FBO Terminal B"
              className={inputClass}
            />
          </div>
        </div>

        {/* Row 4: Food Order Details */}
        <div>
          <label htmlFor="foodDetails" className={labelClass} style={labelStyle}>
            Food Order Details <span className="text-[#7B1A1A]">*</span>
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
          <label htmlFor="specialNotes" className={labelClass} style={labelStyle}>
            Special Notes{' '}
            <span className="text-[#6B4226] normal-case" style={{ fontSize: '11px' }}>(optional)</span>
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

        {/* Row 6: File Upload */}
        <div>
          <label htmlFor="orderFile" className={labelClass} style={labelStyle}>
            Attach Order Document (Optional)
          </label>
          <p className="text-[#6B4226] text-xs mb-2">
            You may attach a PDF, image, or document in lieu of or in addition to the form above.
          </p>
          <input
            id="orderFile"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="border border-[#C4A882] bg-[#FBF7F2] w-full text-sm p-2 rounded-sm text-[#6B4226]"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="bg-[#7B1A1A] hover:bg-[#5C1212] disabled:opacity-60 disabled:cursor-not-allowed text-[#FBF7F2] px-5 py-2 text-sm font-medium rounded-sm"
        >
          {submitting ? 'Submitting...' : 'Submit Order'}
        </button>
      </form>
    </div>
  )
}
