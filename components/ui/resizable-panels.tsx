"use client"

import type React from "react"
import { useRef, useCallback, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setLeftPanelWidth, setIsResizing } from "@/store/slices/uiSlice"

interface ResizablePanelsProps {
  leftPanel: React.ReactNode
  rightPanel: React.ReactNode
  minLeftWidth?: number
  maxLeftWidth?: number
}

export function ResizablePanels({ leftPanel, rightPanel, minLeftWidth = 25, maxLeftWidth = 50 }: ResizablePanelsProps) {
  const dispatch = useAppDispatch()
  const { leftPanelWidth, isResizing } = useAppSelector((state) => state.ui)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      dispatch(setIsResizing(true))
    },
    [dispatch],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100

      const clampedWidth = Math.min(Math.max(newLeftWidth, minLeftWidth), maxLeftWidth)
      dispatch(setLeftPanelWidth(clampedWidth))
    },
    [isResizing, minLeftWidth, maxLeftWidth, dispatch],
  )

  const handleMouseUp = useCallback(() => {
    dispatch(setIsResizing(false))
  }, [dispatch])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  return (
    <>
      {/* Desktop Layout */}
      <div ref={containerRef} className="hidden lg:flex h-full min-h-[calc(100vh-140px)] bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col min-w-0" style={{ width: `${leftPanelWidth}%` }}>
          {leftPanel}
        </div>

        <div
          className={`relative flex items-center justify-center w-3 cursor-col-resize transition-colors duration-200 ${
            isResizing ? "bg-gray-300 dark:bg-gray-600" : "hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
          onMouseDown={handleMouseDown}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize panels"
        >
          {/* Gradient divider line with fading ends */}
          <div
            className="w-0.5 h-full"
            style={{
              background: `linear-gradient(
                to bottom,
                transparent 0%,
                rgb(209, 213, 219) 10%,
                rgb(209, 213, 219) 90%,
                transparent 100%
              )`,
            }}
          />

          {/* Handle dots */}
          <div className="absolute inset-y-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-0.5">
              <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full transition-colors duration-200"></div>
              <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full transition-colors duration-200"></div>
              <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full transition-colors duration-200"></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col min-w-0" style={{ width: `${100 - leftPanelWidth}%` }}>
          {rightPanel}
        </div>
      </div>

      {/* Mobile Layout - Stacked vertically without resizer */}
      <div className="lg:hidden flex flex-col gap-6 min-h-[calc(100vh-140px)] bg-gray-50 dark:bg-gray-900">
        <div className="w-full">{leftPanel}</div>
        <div className="w-full">{rightPanel}</div>
      </div>
    </>
  )
}
