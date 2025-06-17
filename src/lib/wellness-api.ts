import type { WellnessLogData } from "../types"

// Mock wellness logs database
const mockWellnessLogs: WellnessLogData[] = [
  {
    id: "1",
    mood: "Happy",
    sleepDuration: 8,
    activityNotes: "Had a great workout session and felt energized all day",
    date: "2024-01-15",
    userId: "1",
  },
  {
    id: "2",
    mood: "Stressed",
    sleepDuration: 6,
    activityNotes: "Work deadline approaching, feeling overwhelmed",
    date: "2024-01-14",
    userId: "1",
  },
  {
    id: "3",
    mood: "Focused",
    sleepDuration: 7,
    activityNotes: "Meditation session helped me concentrate better",
    date: "2024-01-13",
    userId: "1",
  },
]

export const wellnessAPI = {
  async getLogs(userId: string, searchTerm?: string) {
    await new Promise((resolve) => setTimeout(resolve, 500))

    let logs = mockWellnessLogs.filter((log) => log.userId === userId)

    if (searchTerm) {
      logs = logs.filter((log) => log.activityNotes.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    return { success: true, data: logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) }
  },

  async createLog(logData: Omit<WellnessLogData, "id">) {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newLog: WellnessLogData = {
      ...logData,
      id: Date.now().toString(),
    }

    mockWellnessLogs.push(newLog)
    return { success: true, data: newLog }
  },

  async updateLog(logId: string, logData: Partial<WellnessLogData>) {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const logIndex = mockWellnessLogs.findIndex((log) => log.id === logId)
    if (logIndex === -1) {
      throw new Error("Log not found")
    }

    mockWellnessLogs[logIndex] = {
      ...mockWellnessLogs[logIndex],
      ...logData,
    }

    return { success: true, data: mockWellnessLogs[logIndex] }
  },

  async deleteLog(logId: string) {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const logIndex = mockWellnessLogs.findIndex((log) => log.id === logId)
    if (logIndex === -1) {
      throw new Error("Log not found")
    }

    const deletedLog = mockWellnessLogs.splice(logIndex, 1)[0]
    return { success: true, data: deletedLog }
  },
}
