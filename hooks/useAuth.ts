import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { refreshUserToken } from "@/store/slices/authSlice"
import { checkTokenExpiration } from "@/lib/auth"

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { token, refreshToken, isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      if (!token || !refreshToken || !isAuthenticated) return

      const isExpired = await checkTokenExpiration(token)
      if (isExpired) {
        dispatch(refreshUserToken())
      }
    }

    // Check token expiration every minute
    const interval = setInterval(checkAndRefreshToken, 60 * 1000)
    checkAndRefreshToken() // Initial check

    return () => clearInterval(interval)
  }, [dispatch, token, refreshToken, isAuthenticated])

  return {
    isAuthenticated,
    token,
    refreshToken,
  }
} 