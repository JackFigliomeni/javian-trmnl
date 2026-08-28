interface Inquiry {
  id: string
  firstName: string
  lastName: string
  company: string | null
  email: string
  message: string
  createdAt: string
}

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(iso))
}

export default function ContactInquiriesList({ inquiries }: { inquiries: Inquiry[] }) {
  return (
    <div className="bg-[#FBF7F2] border border-[#C4A882]">
      <div className="px-8 pt-7 pb-5 border-b border-[#C4A882]">
        <h2
          className="text-2xl font-bold text-[#2C1810] pb-3"
          style={{ borderBottom: '1px solid #7B1A1A' }}
        >
          Website Inquiries
        </h2>
      </div>

      {inquiries.length === 0 ? (
        <p className="px-8 py-10 text-center text-[#6B4226] text-sm">
          No inquiries yet.
        </p>
      ) : (
        <div className="divide-y divide-[#C4A882]">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="px-8 py-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                <p className="font-bold text-[#2C1810]">
                  {inquiry.firstName} {inquiry.lastName}
                  {inquiry.company && (
                    <span className="font-normal text-[#6B4226]"> — {inquiry.company}</span>
                  )}
                </p>
                <span className="text-xs text-[#6B4226] whitespace-nowrap">
                  {formatDateTime(inquiry.createdAt)}
                </span>
              </div>
              <a
                href={`mailto:${inquiry.email}`}
                className="text-sm text-[#7B1A1A] underline"
              >
                {inquiry.email}
              </a>
              <p className="text-sm text-[#2C1810] mt-2 whitespace-pre-wrap leading-relaxed">
                {inquiry.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
