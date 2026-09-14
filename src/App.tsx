import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { PhoneShell } from '@/components/layout/PhoneShell'
import { ToastProvider } from '@/store/ToastProvider'
import { useApp } from '@/store/appContext'

import Splash from '@/screens/Splash'
import Login from '@/screens/Login'
import Identify from '@/screens/Identify'
import Home from '@/screens/Home'
import Deposit from '@/screens/Deposit'
import History from '@/screens/History'
import TransactionDetail from '@/screens/TransactionDetail'
import Rewards from '@/screens/Rewards'
import Penalties from '@/screens/Penalties'
import Profile from '@/screens/Profile'
import Notifications from '@/screens/Notifications'

/** Screens behind login redirect to the login screen when signed out. */
function Protected({ children }: { children: ReactNode }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

/**
 * Enter-only transition. An exit animation would need `AnimatePresence
 * mode="wait"`, which stalls navigation whenever rAF is paused (a
 * backgrounded tab), leaving the previous screen mounted.
 */
function Page({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
      className="flex h-full flex-col"
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <PhoneShell>
      <ToastProvider>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <Page>
                <Splash />
              </Page>
            }
          />
          <Route
            path="/login"
            element={
              <Page>
                <Login />
              </Page>
            }
          />
          <Route
            path="/identify"
            element={
              <Page>
                <Identify />
              </Page>
            }
          />

          {(
            [
              ['/home', <Home key="home" />],
              ['/deposit', <Deposit key="deposit" />],
              ['/history', <History key="history" />],
              ['/transaction/:id', <TransactionDetail key="tx" />],
              ['/rewards', <Rewards key="rewards" />],
              ['/penalties', <Penalties key="penalties" />],
              ['/profile', <Profile key="profile" />],
              ['/notifications', <Notifications key="notifications" />],
            ] as const
          ).map(([path, element]) => (
            <Route
              key={path}
              path={path}
              element={
                <Protected>
                  <Page>{element}</Page>
                </Protected>
              }
            />
          ))}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </PhoneShell>
  )
}
