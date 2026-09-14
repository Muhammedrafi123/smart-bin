import type { SmartBin } from '@/types'

export const SMART_BINS: SmartBin[] = [
  {
    id: 'BIN-A1',
    label: 'Bin A1',
    location: 'CS Block · Ground Floor',
    accepts: ['organic', 'paper'],
    fillLevel: 42,
    online: true,
  },
  {
    id: 'BIN-B2',
    label: 'Bin B2',
    location: 'Central Canteen',
    accepts: ['organic'],
    fillLevel: 78,
    online: true,
  },
  {
    id: 'BIN-C3',
    label: 'Bin C3',
    location: 'Library Entrance',
    accepts: ['paper', 'plastic'],
    fillLevel: 25,
    online: true,
  },
  {
    id: 'BIN-D4',
    label: 'Bin D4',
    location: 'Hostel Mess',
    accepts: ['organic', 'metal'],
    fillLevel: 61,
    online: false,
  },
]

export const ACTIVE_BIN = SMART_BINS[1]
