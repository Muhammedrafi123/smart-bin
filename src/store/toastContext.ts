import { createContext, useContext } from 'react'

export type ToastKind = 'success' | 'error' | 'info'
export type PushToast = (message: string, kind?: ToastKind) => void

export const ToastCtx = createContext<PushToast | null>(null)

export function useToast() {
  const v = useContext(ToastCtx)
  if (!v) throw new Error('useToast must be used inside <ToastProvider>')
  return v
}
