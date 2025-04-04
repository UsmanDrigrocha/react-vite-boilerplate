import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./Components/Home/Home"
import NotFound from "./Components/NotFound/NotFound"
import ProtectedRoute from './ProtectedRoute'
import Auth from './Components/Auth/Auth'
import Dashboard from "./Components/Dashboard/Dashboard"
import { ToastContainer } from "react-toastify"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>

          {/* Landing page */}
          <Route path="/" element={<Home />} />


          {/* Authentication Page */}
          <Route path="/register" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/verify-account/:token" element={<Auth />} />


          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />


          {/* Not Found */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
      <ToastContainer />

    </>
  )
}

export default App
