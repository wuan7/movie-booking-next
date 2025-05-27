'use client'

import { useEffect, useState } from "react"
import { cn } from "../lib/utils" // Nếu bạn dùng hàm cn để gộp class

type DayType = {
  formattedDate: string
  formattedFullDate: string
  dayName: string
}

const getNext10Days = (): DayType[] => {
  const days: DayType[] = []
  const today = new Date()

  for (let i = 0; i < 10; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    const formattedDate = date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    })

    const formattedFullDate = date.toISOString().split("T")[0]

    const dayName = date.toLocaleDateString("vi-VN", {
      weekday: "short",
    })

    days.push({
      formattedDate,
      formattedFullDate,
      dayName,
    })
  }

  return days
}

type DateBoxProps = {
  setShowDate: (date: string) => void
}

const DateBox = ({setShowDate}: DateBoxProps) => {
  const [daysToShow, setDaysToShow] = useState<DayType[]>([])
  const [selectedDay, setSelectedDay] = useState<string>("")

  useEffect(() => {
    const days = getNext10Days()
    setShowDate(days[0].formattedFullDate)
    setDaysToShow(days)
    setSelectedDay(days[0].formattedFullDate)
  }, [setShowDate])

  const handleSelectDate = (day: DayType) => {
    setSelectedDay(day.formattedFullDate)
    setShowDate(day.formattedFullDate)
  }

  return (
    <div className="w-full bg-white shadow-md p-2">
      <div className="flex gap-x-2 overflow-x-auto custom-scrollbar pb-2">
        {daysToShow.map((day) => (
          <button
            key={day.formattedFullDate}
            onClick={() => handleSelectDate(day)}
            className="border border-white/85 hover:border-white rounded-sm transition"
          >
            <div
              className={cn(
                "w-16 h-8 flex items-center justify-center font-semibold text-black rounded-t-sm",
                selectedDay === day.formattedFullDate
                  ? "bg-primary text-white"
                  : "bg-slate-300"
              )}
            >
              {day.formattedDate}
            </div>
            <div
              className={cn(
                "w-16 h-8 flex items-center justify-center rounded-b-sm text-xs truncate px-1",
                selectedDay === day.formattedFullDate
                  ? "bg-white text-primary font-semibold"
                  : "bg-slate-100 text-black"
              )}
            >
              {day.dayName}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default DateBox
