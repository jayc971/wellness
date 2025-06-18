import type React from "react"
import { useEffect, useMemo, useState } from "react"
import type { WellnessLogData } from "../../types"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { fetchLogs, setSearchTerm, deleteLog } from "../../store/slices/wellnessSlice"
import { LoadingSpinner } from "../ui/loading-spinner"
import { Modal } from "../ui/modal"
import { EditWellnessLogForm } from "../forms/edit-wellness-log-form"
import { Search, Edit, Trash2, AlertTriangle } from "lucide-react"

export function WellnessLogsTable() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { logs, isLoading, error, searchTerm } = useAppSelector((state) => state.wellness)

  const [editingLog, setEditingLog] = useState<WellnessLogData | null>(null)
  const [deletingLog, setDeletingLog] = useState<WellnessLogData | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch logs when component mounts or when search term changes
  useEffect(() => {
    if (user) {
      dispatch(fetchLogs({ userId: user.id, searchTerm }))
    }
  }, [dispatch, user, searchTerm])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value))
  }

  const handleEditSuccess = () => {
    setEditingLog(null)
    // Refresh logs after successful edit
    if (user) {
      dispatch(fetchLogs({ userId: user.id, searchTerm }))
    }
  }

  const handleDelete = async () => {
    if (!deletingLog) return

    setIsDeleting(true)
    try {
      await dispatch(deleteLog(deletingLog.id!)).unwrap()
      setDeletingLog(null)
      // Refresh logs after successful deletion
      if (user) {
        dispatch(fetchLogs({ userId: user.id, searchTerm }))
      }
    } catch (error) {
      // Error is handled by Redux
    } finally {
      setIsDeleting(false)
    }
  }

  const moodEmojis = {
    Happy: "😊",
    Stressed: "😰",
    Tired: "😴",
    Focused: "��",
  }

  // Filter and sort logs based on search term and date
  const filteredLogs = useMemo(() => {
    let filtered = [...logs] // Create a new array
    if (searchTerm) {
      filtered = filtered.filter((log) => 
        log.activityNotes.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    // Sort by date in descending order (newest first)
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [logs, searchTerm])

  if (isLoading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
        <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? "No logs found matching your search" : "No wellness logs found"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{moodEmojis[log.mood]}</span>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{log.mood}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{log.activityNotes}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{new Date(log.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{log.sleepDuration} hours of sleep</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingLog(log)}
                      className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => setDeletingLog(log)}
                      className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={!!editingLog} onClose={() => setEditingLog(null)} title="Edit Wellness Log">
        {editingLog && (
          <EditWellnessLogForm
            log={editingLog}
            onSuccess={handleEditSuccess}
            onCancel={() => setEditingLog(null)}
          />
        )}
      </Modal>

      <Modal isOpen={!!deletingLog} onClose={() => setDeletingLog(null)} title="Delete Wellness Log">
        {deletingLog && (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle size={48} className="text-amber-500" />
            </div>
            <p className="text-gray-900 dark:text-gray-100 mb-6">Are you sure you want to delete this wellness log?</p>
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl mb-6 text-left border border-gray-200 dark:border-gray-600">
              <p className="mb-2">
                <strong className="text-gray-900 dark:text-gray-100">Date:</strong>{" "}
                <span className="text-gray-700 dark:text-gray-300">
                  {new Date(deletingLog.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </p>
              <p className="mb-2">
                <strong className="text-gray-900 dark:text-gray-100">Mood:</strong>{" "}
                <span className="text-gray-700 dark:text-gray-300">
                  {moodEmojis[deletingLog.mood]} {deletingLog.mood}
                </span>
              </p>
              <p>
                <strong className="text-gray-900 dark:text-gray-100">Notes:</strong>{" "}
                <span className="text-gray-700 dark:text-gray-300">{deletingLog.activityNotes}</span>
              </p>
            </div>
            <p className="text-red-500 dark:text-red-400 text-sm font-medium mb-6">This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeletingLog(null)}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-xl font-medium transition-all duration-200 border border-gray-300 dark:border-gray-600 hover:shadow-md transform hover:scale-105"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-300 dark:disabled:bg-red-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 disabled:transform-none"
                disabled={isDeleting}
              >
                {isDeleting ? <LoadingSpinner size="sm" /> : null}
                {isDeleting ? "Deleting..." : "Delete Log"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
