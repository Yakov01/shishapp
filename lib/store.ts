import { create } from 'zustand'
import { differenceInSeconds } from 'date-fns'

export type TableStatus = 'available' | 'active' | 'alert'

export interface TableSession {
  status: TableStatus
  current_change: number
  timer_start_time: string | null
  timer_end_time: string | null
}

export interface Table {
  id: number
  table_number: number
  session: TableSession
}

interface TableState {
  tables: Map<number, Table>
  loading: boolean
  soundEnabled: boolean
  initTables: () => void
  activateTable: (tableNumber: number) => void
  handleCharcoalChange: (tableNumber: number) => void
  updateTimers: () => void
  setSoundEnabled: (enabled: boolean) => void
  playAlert: () => void
  transferTable: (fromTableNumber: number, toTableNumber: number) => void
}

// Helper to initialize 25 tables
const initializeDefaultTables = (): Map<number, Table> => {
  const tablesMap = new Map<number, Table>()

  // Load from localStorage if available
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('shisha-tables')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        parsed.forEach((table: Table) => {
          tablesMap.set(table.table_number, table)
        })
        return tablesMap
      } catch (e) {
        console.error('Error parsing stored tables:', e)
      }
    }
  }

  // Create default 25 tables
  for (let i = 1; i <= 25; i++) {
    tablesMap.set(i, {
      id: i,
      table_number: i,
      session: {
        status: 'available',
        current_change: 0,
        timer_start_time: null,
        timer_end_time: null
      }
    })
  }

  return tablesMap
}

export const useTableStore = create<TableState>((set, get) => ({
  tables: new Map(),
  loading: true,
  soundEnabled: true,

  initTables: () => {
    const tablesMap = initializeDefaultTables()
    set({ tables: tablesMap, loading: false })
  },

  activateTable: (tableNumber: number) => {
    const tables = get().tables
    const table = tables.get(tableNumber)
    if (!table || table.session.status !== 'available') return

    const now = new Date()
    const endTime = new Date(now.getTime() + 30 * 60 * 1000) // 30 minutes

    const updatedTable: Table = {
      ...table,
      session: {
        status: 'active',
        current_change: 1,
        timer_start_time: now.toISOString(),
        timer_end_time: endTime.toISOString()
      }
    }

    const newTables = new Map(tables)
    newTables.set(tableNumber, updatedTable)
    set({ tables: newTables })

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('shisha-tables', JSON.stringify(Array.from(newTables.values())))
    }
  },

  handleCharcoalChange: (tableNumber: number) => {
    const tables = get().tables
    const table = tables.get(tableNumber)
    if (!table || table.session.status !== 'alert') return

    const now = new Date()
    const currentChange = table.session.current_change

    if (currentChange >= 2) {
      // Reset to available after 2nd change
      const updatedTable: Table = {
        ...table,
        session: {
          status: 'available',
          current_change: 0,
          timer_start_time: null,
          timer_end_time: null
        }
      }

      const newTables = new Map(tables)
      newTables.set(tableNumber, updatedTable)
      set({ tables: newTables })

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('shisha-tables', JSON.stringify(Array.from(newTables.values())))
      }
    } else {
      // Start new timer for next change
      const endTime = new Date(now.getTime() + 30 * 60 * 1000)

      const updatedTable: Table = {
        ...table,
        session: {
          status: 'active',
          current_change: currentChange + 1,
          timer_start_time: now.toISOString(),
          timer_end_time: endTime.toISOString()
        }
      }

      const newTables = new Map(tables)
      newTables.set(tableNumber, updatedTable)
      set({ tables: newTables })

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('shisha-tables', JSON.stringify(Array.from(newTables.values())))
      }
    }
  },

  updateTimers: () => {
    const tables = get().tables
    const now = new Date()
    let hasChanges = false
    const newTables = new Map(tables)

    tables.forEach((table, tableNumber) => {
      if (table.session.status === 'active' && table.session.timer_end_time) {
        const endTime = new Date(table.session.timer_end_time)
        const secondsRemaining = differenceInSeconds(endTime, now)

        if (secondsRemaining <= 0) {
          // Timer expired, change to alert
          hasChanges = true
          const updatedTable: Table = {
            ...table,
            session: {
              ...table.session,
              status: 'alert'
            }
          }
          newTables.set(tableNumber, updatedTable)

          // Play alert sound
          if (get().soundEnabled) {
            get().playAlert()
          }
        }
      }
    })

    if (hasChanges) {
      set({ tables: newTables })

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('shisha-tables', JSON.stringify(Array.from(newTables.values())))
      }
    }
  },

  setSoundEnabled: (enabled: boolean) => {
    set({ soundEnabled: enabled })
  },

  playAlert: () => {
    // Create a simple beep sound using Web Audio API
    try {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const audioContext = new AudioContextClass()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch (error) {
      console.error('Error playing alert sound:', error)
    }
  },

  transferTable: (fromTableNumber: number, toTableNumber: number) => {
    const tables = get().tables
    const fromTable = tables.get(fromTableNumber)
    const toTable = tables.get(toTableNumber)

    // Validate: fromTable must have an active session, toTable must be available
    if (!fromTable || !toTable) return
    if (fromTable.session.status === 'available') return
    if (toTable.session.status !== 'available') return

    const newTables = new Map(tables)

    // Transfer session from fromTable to toTable
    const updatedToTable: Table = {
      ...toTable,
      session: {
        ...fromTable.session
      }
    }

    // Reset fromTable to available
    const updatedFromTable: Table = {
      ...fromTable,
      session: {
        status: 'available',
        current_change: 0,
        timer_start_time: null,
        timer_end_time: null
      }
    }

    newTables.set(toTableNumber, updatedToTable)
    newTables.set(fromTableNumber, updatedFromTable)
    set({ tables: newTables })

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('shisha-tables', JSON.stringify(Array.from(newTables.values())))
    }
  }
}))
