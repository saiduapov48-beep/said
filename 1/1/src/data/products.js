const products = [
  {
    id: 1,
    name: 'iPhone 16 Pro Max',
    category: 'iphone',
    price: 1199,
    image: '/images/products/16 pro max.png',
    description: 'Titanium design. A18 Pro chip. 48MP camera system with 5x Telephoto. The most advanced iPhone ever.',
    specs: ['6.9-inch Super Retina XDR display', 'A18 Pro chip', '48MP Fusion camera', '5x Telephoto', 'Titanium design', 'USB-C with USB 3'],
    inStock: true,
    color: 'Desert Titanium'
  },
  {
    id: 2,
    name: 'iPhone 16',
    category: 'iphone',
    price: 799,
    image: '/images/products/16.png',
    description: 'Built for Apple Intelligence. A18 chip. Stunning camera system. All in a durable design.',
    specs: ['6.1-inch Super Retina XDR display', 'A18 chip', '48MP Fusion camera', 'Camera Control', 'Action button', 'USB-C'],
    inStock: true,
    color: 'Ultramarine'
  },
  {
    id: 3,
    name: 'MacBook Pro 16"',
    category: 'macbook',
    price: 2499,
    image: '/images/products/MacBook Pro 16.png',
    description: 'The most advanced Mac chips. Up to 24 hours of battery life. A stunning Liquid Retina XDR display.',
    specs: ['M4 Pro or M4 Max chip', '16-inch Liquid Retina XDR', 'Up to 128GB unified memory', 'Up to 24hrs battery', 'Thunderbolt 5', 'Space Black'],
    inStock: true,
    color: 'Space Black'
  },
  {
    id: 4,
    name: 'MacBook Air 15"',
    category: 'macbook',
    price: 1299,
    image: '/images/products/MacBook Air 15.png',
    description: 'Impossibly thin. Incredibly powerful. Strikingly brilliant display. With the M3 chip.',
    specs: ['M3 chip', '15.3-inch Liquid Retina display', '18hrs battery life', '1080p FaceTime HD camera', 'MagSafe charging', 'Midnight finish'],
    inStock: true,
    color: 'Midnight'
  },
  {
    id: 5,
    name: 'MacBook Pro 14"',
    category: 'macbook',
    price: 1999,
    image: '/images/products/MacBook Pro 16.png',
    description: 'Pro performance meets portability. M4 Pro chip. Stunning Liquid Retina XDR display.',
    specs: ['M4 Pro chip', '14-inch Liquid Retina XDR', 'Up to 48GB unified memory', 'Up to 17hrs battery', 'Thunderbolt 5', 'Space Black'],
    inStock: true,
    color: 'Space Black'
  },
  {
    id: 6,
    name: 'iPad Pro 13"',
    category: 'ipad',
    price: 1299,
    image: '/images/products/Aipad Pro 13.jpg',
    description: 'The thinnest, most advanced iPad ever. M4 chip. Tandem OLED Ultra Retina XDR display.',
    specs: ['M4 chip', '13-inch Ultra Retina XDR', 'Tandem OLED', 'Apple Pencil Pro', 'Thunderbolt / USB 4', 'Space Gray'],
    inStock: true,
    color: 'Space Gray'
  },
  {
    id: 7,
    name: 'AirPods Max',
    category: 'accessories',
    price: 549,
    image: '/images/products/AirPods Max.webp',
    description: 'High-fidelity audio. Active Noise Cancellation. USB-C. Personalized Spatial Audio.',
    specs: ['Apple H2 chip', 'Active Noise Cancellation', 'Adaptive Transparency', 'Personalized Spatial Audio', 'USB-C', '20hrs battery'],
    inStock: true,
    color: 'Midnight'
  },
  {
    id: 8,
    name: 'Apple Watch Ultra 2',
    category: 'accessories',
    price: 799,
    image: '/images/products/Apple Watch Ultra 2.png',
    description: 'The most rugged and capable Apple Watch pushes limits. Black titanium case.',
    specs: ['49mm Titanium case', 'S9 SiP', 'Always-On Retina display', 'Precision dual-frequency GPS', 'Up to 36hrs battery', 'Depth gauge & Water temp sensor'],
    inStock: false,
    color: 'Black Titanium'
  },
  {
    id: 9,
    name: 'AirPods Pro 2',
    category: 'accessories',
    price: 249,
    image: '/images/products/airpods pro 2.jpg',
    description: 'Adaptive Audio. Active Noise Cancellation. Hearing Health features. USB-C MagSafe case.',
    specs: ['Apple H2 chip', 'Adaptive Audio', 'Active Noise Cancellation', 'Conversation Awareness', 'USB-C MagSafe case', 'IP54 dust/water resistant'],
    inStock: true,
    color: 'White'
  },
  {
    id: 10,
    name: 'iMac 24"',
    category: 'macbook',
    price: 1299,
    image: '/images/products/iMac 24.png',
    description: 'All-in-one. All in color. M4 chip. 24-inch 4.5K Retina display. Nano-texture option.',
    specs: ['M4 chip', '24-inch 4.5K Retina display', 'Up to 32GB unified memory', '1080p FaceTime HD camera', 'Six-speaker system', 'Thunderbolt 4'],
    inStock: true,
    color: 'Silver'
  }
]

export default products
