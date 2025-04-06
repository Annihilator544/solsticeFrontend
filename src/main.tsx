import { createRoot } from 'react-dom/client'
import './index.css'
import PaymentDashboard from './components/Dashboard'
import { ThemeProvider } from './Layout/ThemeProvider'
import { Toaster } from './Layout/SonnerToasterLayout'
import FetchTableData from './Layout/FetchTableData'

createRoot(document.getElementById('root')!).render(
     <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <FetchTableData>
        <PaymentDashboard />
        <Toaster />
      </FetchTableData>
    </ThemeProvider>,
)
