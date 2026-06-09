import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import getRouter from './router' // Import your router factory function
import './styles.css' 

// 1. Initialize the router using your dedicated file configuration
const router = getRouter()

// 2. Register the router type for absolute global type-safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// 3. Render the application using the correct provider instance
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
