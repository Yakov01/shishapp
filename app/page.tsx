'use client'

import { useEffect, useState } from 'react'
import { useTableStore } from '@/lib/store'
import { TableTile } from '@/components/table-tile'
import { Button } from '@/components/ui/button'
import { Volume2, VolumeX } from 'lucide-react'

export default function Home() {
  const {
    tables,
    loading,
    soundEnabled,
    initTables,
    activateTable,
    handleCharcoalChange,
    updateTimers,
    setSoundEnabled,
    transferTable
  } = useTableStore()

  const [draggedTableNumber, setDraggedTableNumber] = useState<number | null>(null)
  const [dragOverTableNumber, setDragOverTableNumber] = useState<number | null>(null)
  const [touchStartTable, setTouchStartTable] = useState<number | null>(null)
  const [touchCurrentTable, setTouchCurrentTable] = useState<number | null>(null)

  useEffect(() => {
    initTables()

    // Update timers every second
    const timerInterval = setInterval(() => {
      updateTimers()
    }, 1000)

    return () => clearInterval(timerInterval)
  }, [initTables, updateTimers])

  const handleTableTap = (tableNumber: number) => {
    const table = tables.get(tableNumber)
    if (!table) return

    if (table.session.status === 'available') {
      activateTable(tableNumber)
    } else if (table.session.status === 'alert') {
      handleCharcoalChange(tableNumber)
    }
  }

  const handleDragStart = (tableNumber: number) => {
    setDraggedTableNumber(tableNumber)
  }

  const handleDragEnd = () => {
    setDraggedTableNumber(null)
    setDragOverTableNumber(null)
  }

  const handleDragOver = (tableNumber: number) => {
    setDragOverTableNumber(tableNumber)
  }

  const handleDrop = (tableNumber: number) => {
    if (draggedTableNumber !== null && draggedTableNumber !== tableNumber) {
      transferTable(draggedTableNumber, tableNumber)
    }
    setDraggedTableNumber(null)
    setDragOverTableNumber(null)
  }

  const handleTouchStart = (tableNumber: number) => {
    const table = tables.get(tableNumber)
    if (table && (table.session.status === 'active' || table.session.status === 'alert')) {
      setTouchStartTable(tableNumber)
      setDraggedTableNumber(tableNumber)
    }
  }

  const handleTouchMove = (tableNumber: number) => {
    if (touchStartTable !== null) {
      setTouchCurrentTable(tableNumber)
      setDragOverTableNumber(tableNumber)
    }
  }

  const handleTouchEnd = (tableNumber: number) => {
    if (touchStartTable !== null && touchStartTable !== tableNumber) {
      const toTable = tables.get(tableNumber)
      if (toTable && toTable.session.status === 'available') {
        transferTable(touchStartTable, tableNumber)
      }
    }
    setTouchStartTable(null)
    setTouchCurrentTable(null)
    setDraggedTableNumber(null)
    setDragOverTableNumber(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const tableArray = Array.from(tables.values()).sort(
    (a, b) => a.table_number - b.table_number
  )

  return (
    <div className="min-h-screen bg-gray-900 p-2 md:p-4">
      {/* Header */}
      <header className="mb-3 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Shisha Charcoal Timer
        </h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="bg-gray-800 border-gray-700 hover:bg-gray-700"
        >
          {soundEnabled ? (
            <Volume2 className="h-5 w-5 text-white" />
          ) : (
            <VolumeX className="h-5 w-5 text-white" />
          )}
        </Button>
      </header>

      {/* Table Grid */}
      <div className="grid grid-cols-5 gap-2 max-w-6xl mx-auto">
        {tableArray.map((table) => (
          <TableTile
            key={table.id}
            table={table}
            onTap={() => handleTableTap(table.table_number)}
            onDragStart={() => handleDragStart(table.table_number)}
            onDragEnd={handleDragEnd}
            onDragOver={() => handleDragOver(table.table_number)}
            onDrop={() => handleDrop(table.table_number)}
            onTouchStart={() => handleTouchStart(table.table_number)}
            onTouchMove={() => handleTouchMove(table.table_number)}
            onTouchEnd={() => handleTouchEnd(table.table_number)}
            isDragging={draggedTableNumber === table.table_number}
            isDragOver={dragOverTableNumber === table.table_number}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 max-w-6xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-600 rounded" />
              <div className="text-white">
                <div className="font-semibold text-xs">Grey</div>
                <div className="text-xs text-gray-400">Available</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded" />
              <div className="text-white">
                <div className="font-semibold text-xs">Green</div>
                <div className="text-xs text-gray-400">Active</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded animate-pulse" />
              <div className="text-white">
                <div className="font-semibold text-xs">Red</div>
                <div className="text-xs text-gray-400">Alert</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
