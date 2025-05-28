import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  loading: boolean
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    timestamp: number
  }>
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setLoading: (loading: boolean) => void
  addNotification: (notification: Omit<UIState['notifications'][0], 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarOpen: false,
  theme: 'system',
  loading: false,
  notifications: [],

  setSidebarOpen: (open: boolean) => {
    set({ sidebarOpen: open })
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }))
  },

  setTheme: (theme: 'light' | 'dark' | 'system') => {
    set({ theme })
  },

  setLoading: (loading: boolean) => {
    set({ loading })
  },

  addNotification: (notification) => {
    const newNotification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    }
    
    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }))

    // Auto-remove after 5 seconds
    setTimeout(() => {
      get().removeNotification(newNotification.id)
    }, 5000)
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }))
  },

  clearNotifications: () => {
    set({ notifications: [] })
  }
}))
