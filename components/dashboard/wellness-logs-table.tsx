import type React from "react"
import { useEffect, useMemo, useState } from "react"
import type { WellnessLogData } from "@/types"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchLogs, setSearchTerm, deleteLog } from "@/store/slices/wellnessSlice"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Modal } from "@/components/ui/modal"
import { EditWellnessLogForm } from "@/components/forms/edit-wellness-log-form"
import { Search, Edit, Trash2, AlertTriangle } from "lucide-react"

export function WellnessLogsTable() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { logs, isLoading, error, searchTerm } = useAppSelector((state) => state.wellness)

  const [editingLog, setEditingLog] = useState<WellnessLogData | null>(null)
  const [deletingLog, setDeletingLog] = useState<WellnessLogData | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (user) {
      dispatch(fetchLogs({ userId: user.id, searchTerm }))
    }
  }, [dispatch, user, searchTerm])

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (user) {
        dispatch(fetchLogs({ userId: user.id, searchTerm }))
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, dispatch, user])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value))
  }

  const handleEditSuccess = () => {
    setEditingLog(null)
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
    Focused: "🎯",
  }

  const filteredLogs = useMemo(() => {
    if (!searchTerm) return logs
    return logs.filter((log) => log.activityNotes.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [logs, searchTerm])

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 h-full flex items-center justify-center">
        <div className="text-red-500 dark:text-red-400 font-medium">{error}</div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Wellness Journey</h3>
        <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-80">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
            size={20}
          />
          <input
            type="text"
            placeholder="Search activity notes..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-emerald-500 focus:ring-emerald-500/20 focus:outline-none focus:ring-4 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600 focus:bg-white dark:focus:bg-gray-700"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 dark:text-gray-400">Loading your wellness logs...</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border-2 border-dashed border-emerald-200 dark:border-emerald-800">
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-lg">
              {searchTerm
                ? `No logs found matching "${searchTerm}"`
                : "No wellness logs yet. Start by adding your first entry!"}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto h-full">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                    Mood
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600 hidden sm:table-cell">
                    Sleep
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                    Activity
                  </th>
                  <th className="px-6 py-4 border-b border-gray-200 dark:border-gray-600"></th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors duration-150"
                  >
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-600 dark:text-gray-400">
                      {new Date(log.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        {moodEmojis[log.mood]} {log.mood}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-100 hidden sm:table-cell">
                      {log.sleepDuration}h
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2 max-w-xs">
                        {log.activityNotes}
                      </p>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingLog(log)}
                          className="p-2 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg transition-all duration-200 hover:shadow-md transform hover:scale-105"
                          title="Edit log"
                          aria-label={`Edit log from ${log.date}`}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeletingLog(log)}
                          className="p-2 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg transition-all duration-200 hover:shadow-md transform hover:scale-105"
                          title="Delete log"
                          aria-label={`Delete log from ${log.date}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal isOpen={!!editingLog} onClose={() => setEditingLog(null)} title="Edit Wellness Log">
        {editingLog && (
          <EditWellnessLogForm log={editingLog} onSuccess={handleEditSuccess} onCancel={() => setEditingLog(null)} />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
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
            <div className="flex gap-4 justify-end">
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
