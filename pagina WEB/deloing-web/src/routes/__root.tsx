import { createRootRoute, Outlet } from '@tanstack/react-router'
import { MotionConfig } from 'framer-motion'
import { Toaster } from 'sonner'

export const Route = createRootRoute({
  component: () => (
    // reducedMotion="user" => Framer Motion respeta la preferencia del sistema
    <MotionConfig reducedMotion="user">
      <Outlet />
      <Toaster
        position="bottom-center"
        theme="light"
        toastOptions={{
          style: {
            borderRadius: '18px',
            border: '1px solid var(--color-line)',
            background: 'var(--color-surface)',
            color: 'var(--color-ink)',
            boxShadow: 'var(--shadow-float)',
          },
        }}
      />
    </MotionConfig>
  ),
})
