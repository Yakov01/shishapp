'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table } from '@/lib/store'
import { differenceInSeconds } from 'date-fns'
import { useEffect, useState } from 'react'

interface TableTileProps {
  table: Table
  onTap: () => void
  onDoubleTap: () => void
}

export function TableTile({
  table,
  onTap,
  onDoubleTap
}: TableTileProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [lastTapTime, setLastTapTime] = useState<number>(0)

  useEffect(() => {
    if (table.session.status === 'active' && table.session.timer_end_time) {
      const updateTime = () => {
        const endTime = new Date(table.session.timer_end_time!)
        const seconds = Math.max(0, differenceInSeconds(endTime, new Date()))
        setTimeRemaining(seconds)
      }

      updateTime()
      const interval = setInterval(updateTime, 1000)
      return () => clearInterval(interval)
    } else {
      setTimeRemaining(0)
    }
  }, [table.session.status, table.session.timer_end_time])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getBackgroundColor = (): string => {
    switch (table.session.status) {
      case 'available':
        return 'bg-gray-600 hover:bg-gray-500'
      case 'active':
        return 'bg-green-600 hover:bg-green-500'
      case 'alert':
        return 'bg-red-600 hover:bg-red-500 animate-pulse'
      default:
        return 'bg-gray-600'
    }
  }

  const canInteract = (): boolean => {
    return table.session.status === 'available' || table.session.status === 'alert'
  }

  const handleClick = () => {
    const now = Date.now()
    const timeSinceLastTap = now - lastTapTime

    // Double tap detection (300ms threshold)
    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      // Double tap detected
      if (table.session.status === 'active' || table.session.status === 'alert') {
        onDoubleTap()
      }
      setLastTapTime(0) // Reset
    } else {
      // Single tap
      setLastTapTime(now)
      if (canInteract()) {
        onTap()
      }
    }
  }

  return (
    <Card
      className={`
        ${getBackgroundColor()}
        cursor-pointer
        transition-all
        duration-200
        border-2
        border-gray-700
        ${canInteract() ? 'hover:scale-105' : 'cursor-default'}
        flex
        flex-col
        items-center
        justify-center
        p-2
        h-[100px]
      `}
      onClick={handleClick}
    >
      <div className="text-white text-center space-y-1 w-full">
        {/* Table Number */}
        <div className="text-lg font-bold">
          T{table.table_number}
        </div>

        {/* Timer Display */}
        {table.session.status === 'active' && (
          <div className="text-xl font-mono font-bold">
            {formatTime(timeRemaining)}
          </div>
        )}

        {/* Alert Text */}
        {table.session.status === 'alert' && (
          <div className="text-sm font-bold animate-bounce">
            ALERT!
          </div>
        )}

        {/* Session Counter */}
        {table.session.current_change > 0 && table.session.status !== 'available' && (
          <Badge variant="secondary" className="text-xs">
            {table.session.current_change}/2
          </Badge>
        )}

        {/* Available Status */}
        {table.session.status === 'available' && (
          <div className="text-xs text-gray-300">
            Available
          </div>
        )}
      </div>
    </Card>
  )
}
