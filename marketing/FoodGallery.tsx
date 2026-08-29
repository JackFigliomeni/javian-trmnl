import Image from 'next/image'

const SAMPLES = [
  {
    src: 'https://images.unsplash.com/photo-1678572823447-45fc146df43c',
    alt: 'Artisan charcuterie board with cheeses, fruit, and crackers',
    label: 'Charcuterie Boards',
  },
  {
    src: 'https://images.unsplash.com/photo-1524062008239-962eb6d3383d',
    alt: 'Gourmet sandwiches sliced and arranged on a tray',
    label: 'Gourmet Sandwiches',
  },
  {
    src: 'https://images.unsplash.com/photo-1483695028939-5bb13f8648b0',
    alt: 'Fresh pastries and croissants',
    label: 'Fresh Pastries',
  },
  {
    src: 'https://images.unsplash.com/photo-1610219170948-60d096443dc1',
    alt: 'Cup of coffee in warm light',
    label: 'House Blend Coffee',
  },
]

export default function FoodGallery() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
      {SAMPLES.map((sample) => (
        <figure key={sample.label} className="m-0">
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: '4 / 5', border: '1px solid #C4A882' }}
          >
            <Image
              src={sample.src}
              alt={sample.alt}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
          <figcaption
            className="mt-2"
            style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#6B4226',
            }}
          >
            {sample.label}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
