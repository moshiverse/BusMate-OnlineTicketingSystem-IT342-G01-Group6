export const heroBackground = 'https://www.figma.com/api/mcp/asset/b8df4ccd-61ca-4ac9-8ccf-b7b10efeae0b'
export const ctaBackground = 'https://www.figma.com/api/mcp/asset/f1928deb-1d0a-4326-b2fc-891eee72b855'
export const paymentPartner = 'https://www.figma.com/api/mcp/asset/5b943374-fefb-49ba-8959-361934bdd23d'

export const dashboardFallback = {
  hero: {
    badge: '🚌 Seamless Bus Travel Experience',
    title: 'Travel Smart,',
    highlightedText: 'Book Fast',
    description:
      'Skip the queues and book your intercity bus tickets online. Real-time seat availability, secure payments, and instant e-tickets.',
  },
  features: [
    {
      title: 'Real-Time Tracking',
      description: 'View live seat availability and pick your perfect spot before checkout.',
      icon: '🛰️',
    },
    {
      title: 'Secure Payments',
      description: '256-bit encryption plus GoTyme support keeps every transaction protected.',
      icon: '🔒',
    },
    {
      title: 'Instant E-Tickets',
      description: 'Receive QR-coded tickets in your inbox seconds after booking.',
      icon: '⚡',
    },
  ],
  popularRoutes: [
    {
      from: 'Manila',
      to: 'Baguio',
      distance: '250 km',
      duration: '6h',
      price: '₱550',
      extras: ['🚌 15 trips/day'],
    },
    {
      from: 'Cebu',
      to: 'Bohol',
      distance: '120 km',
      duration: '3h',
      price: '₱450',
      extras: ['🚌 10 trips/day'],
    },
    {
      from: 'Manila',
      to: 'Iloilo',
      distance: '550 km',
      duration: '12h',
      price: '₱1,200',
      extras: ['🚌 8 trips/day'],
    },
  ],
  stats: [
    { value: '50K+', label: 'Happy Travelers' },
    { value: '100+', label: 'Routes Available' },
    { value: '24/7', label: 'Customer Support' },
  ],
}

export const routesFallback = {
  popularRoutes: [
    { from: 'Manila', to: 'Davao', distance: '1500 km', duration: '30h', badge: 'Popular' },
    { from: 'Manila', to: 'Iloilo', distance: '550 km', duration: '12h', badge: 'Popular' },
    { from: 'Manila', to: 'Naga', distance: '380 km', duration: '8h', badge: 'Popular' },
  ],
  allRoutes: [
    { from: 'Manila', to: 'Baguio', distance: '250 km', duration: '6h', price: '₱550' },
    { from: 'Manila', to: 'Davao', distance: '1500 km', duration: '30h', price: '₱1,200' },
    { from: 'Cebu', to: 'Bohol', distance: '120 km', duration: '3h', price: '₱450' },
    { from: 'Manila', to: 'Iloilo', distance: '550 km', duration: '12h', price: '₱1,200' },
    { from: 'Manila', to: 'Naga', distance: '380 km', duration: '8h', price: '₱700' },
  ],
}

export const tripsFallback = {
  summary: {
    route: 'Manila → Baguio',
    travelDate: 'Mon, Oct 20',
    passengers: '1 Person',
    availableTrips: 3,
    cover: 'https://www.figma.com/api/mcp/asset/2d910aa2-ae9f-4ed7-8b17-187daf8d82f7',
  },
  trips: [
    {
      id: 'BM-001',
      tier: 'Deluxe',
      departureTime: '06:00',
      arrivalTime: '12:00',
      duration: '6h 0m',
      price: '₱650',
      seats: '32 seats available',
      amenities: ['WiFi', 'AC', 'Reclining Seats', 'USB Charging'],
    },
    {
      id: 'BM-002',
      tier: 'Standard',
      departureTime: '09:00',
      arrivalTime: '15:00',
      duration: '6h 0m',
      price: '₱550',
      seats: '28 seats available',
      amenities: ['AC', 'Comfortable Seats'],
    },
    {
      id: 'BM-003',
      tier: 'Deluxe',
      departureTime: '14:00',
      arrivalTime: '20:00',
      duration: '6h 0m',
      price: '₱700',
      seats: '40 seats available',
      amenities: ['WiFi', 'AC', 'Reclining Seats', 'USB Charging', 'Entertainment'],
    },
  ],
}

export const footerLinks = [
  {
    title: 'Quick Links',
    items: [
      { label: 'Book Tickets', to: '/booking' },
      { label: 'My Bookings', to: '/my-bookings' },
      { label: 'Routes', to: '/routes' },
      { label: 'Schedules', to: '/schedules' },
    ],
  },
]

