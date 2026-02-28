import express from 'express'

const router = express.Router()

const stores = [
  // Алматы
  {
    id: 1,
    city: 'Алматы',
    name: 'iSpace Esentai Mall',
    address: 'пр. Аль-Фараби, 77/8, ТРЦ Esentai Mall, 2 этаж',
    lat: 43.2196,
    lng: 76.9294,
    phone: '+7 701 387 92 15',
    hours: '10:00 - 22:00'
  },
  {
    id: 2,
    city: 'Алматы',
    name: 'iSpace Dostyk Plaza',
    address: 'м-р Самал-2, 111, ТРЦ Dostyk Plaza, 2 этаж',
    lat: 43.2231,
    lng: 76.9468,
    phone: '+7 701 813 96 70',
    hours: '10:00 - 22:00'
  },
  {
    id: 3,
    city: 'Алматы',
    name: 'iSpace MEGA Center Alma-Ata',
    address: 'ул. Розыбакиева, 247а, ТРЦ MEGA Center Alma-Ata, 1 этаж',
    lat: 43.2283,
    lng: 76.8513,
    phone: '+7 747 095 15 17',
    hours: '10:00 - 22:00'
  },
  // Астана
  {
    id: 4,
    city: 'Астана',
    name: 'iSpace MEGA Silk Way',
    address: 'ТРЦ MEGA Silk Way, 1 этаж',
    lat: 51.0918,
    lng: 71.4147,
    phone: '+7 747 095 15 17',
    hours: '10:00 - 22:00'
  },
  {
    id: 5,
    city: 'Астана',
    name: 'iSpace Keruen City',
    address: 'ТРЦ Keruen City, 2 этаж',
    lat: 51.1605,
    lng: 71.4704,
    phone: '+7 747 095 15 17',
    hours: '10:00 - 22:00'
  },
  {
    id: 6,
    city: 'Астана',
    name: 'iSpace Керуен',
    address: 'ТРЦ Керуен, 1 этаж',
    lat: 51.1282,
    lng: 71.4328,
    phone: '+7 747 095 15 17',
    hours: '10:00 - 22:00'
  },
  // Другие города
  {
    id: 7,
    city: 'Караганда',
    name: 'iSpace City Mall',
    address: 'ТРЦ City Mall, 1 этаж',
    lat: 49.8047,
    lng: 73.1094,
    phone: '+7 747 095 15 17',
    hours: '10:00 - 22:00'
  },
  {
    id: 8,
    city: 'Атырау',
    name: 'iSpace Infinity Mall',
    address: 'ТРЦ Infinity Mall, 1 этаж',
    lat: 47.1167,
    lng: 51.8833,
    phone: '+7 747 095 15 17',
    hours: '10:00 - 22:00'
  },
  {
    id: 9,
    city: 'Актобе',
    name: 'iSpace Infinity Mall Актобе',
    address: 'ТРЦ Infinity Mall, 1 этаж',
    lat: 50.2797,
    lng: 57.2073,
    phone: '+7 747 095 15 17',
    hours: '10:00 - 22:00'
  },
  {
    id: 10, 
    city: 'Шымкент',
    name: 'iSpace Shymkent City Mall',
    address: 'ТРЦ Shymkent City Mall, 1 этаж',
    lat: 42.3171,
    lng: 69.5959,
    phone: '+7 747 095 15 17',
    hours: '10:00 - 22:00'
  }
]

router.get('/', (req, res) => res.json(stores))

router.get('/cities', (req, res) => {
  const cities = [...new Set(stores.map(s => s.city))]
  res.json(cities)
})

router.get('/:city', (req, res) => {
  const cityStores = stores.filter(s => s.city === decodeURIComponent(req.params.city))
  res.json(cityStores)
})

export default router