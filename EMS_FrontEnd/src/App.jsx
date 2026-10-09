import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Home'
import Layout from './Layout'
import AddEmp from './AddEmp'
import EditEmp from './EditEmp'
import Logs from './Logs'
import Register from './ServicesFile/Register'
import Login from './ServicesFile/Login'
import AuthContext from './AuthFile/AuthContext'
import ThemeProvider from './ThemeContext'
import ProtectedRoute from './AuthFile/ProtectedRoute'
import PublicRoute from './AuthFile/PublicRoute'
import Projects from './Pages/Projects'
import ReportPopup from './Popups/ReportPopup'
import AddEditProject from './AddPages.jsx/AddEditProject'
import Reports from './Pages/Reports'
import ReportViewPopup from './Popups/ReportViewPopUp'
import Manegment from './Pages/Manegment'
import Settings from './Pages/Settings'
import News from './Pages/News/Latest'

function App() {

  return (
    <>
      <ThemeProvider>
        <AuthContext>
          <BrowserRouter>
            <Routes>
              {/* Public — Register -> Login is the entry flow for anyone not signed in */}
              <Route path='/register' element={<PublicRoute><Register /></PublicRoute>}></Route>
              <Route path='/login' element={<PublicRoute><Login /></PublicRoute>}></Route>

              {/* Everything else requires a valid, authenticated session */}
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path='/' element={<Home></Home>}></Route>
                <Route path='/addEmployee' element={<AddEmp></AddEmp>}></Route>
                <Route path='/editEmployee/:id' element={<EditEmp></EditEmp>}></Route>
                <Route path='/logspage' element={<Logs></Logs>}></Route>
                <Route path="/Projects" element={<Projects></Projects>}>
                  <Route path='report/:id' element={<ReportPopup></ReportPopup>}></Route>
                  <Route path='addeditProject/:id' element={<AddEditProject></AddEditProject>}></Route>
                  <Route path='addeditProject' element={<AddEditProject></AddEditProject>}></Route>
                </Route>
                <Route path='/reports' element={<Reports></Reports>}>
                  <Route path='ReportViewPopup/:id' element={<ReportViewPopup></ReportViewPopup>}></Route>
                </Route>
                <Route path='/manegment' element={<Manegment></Manegment>}></Route>
                <Route path='/Settings' element={<Settings></Settings>}></Route>
                <Route path='/latestnews' element={<News category='latest'></News>}></Route>
                <Route path='/news/company' element={<News category='business'></News>}></Route>
                <Route path='/news/industry' element={<News category='technology'></News>}></Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthContext>
      </ThemeProvider>
    </>
  )
}

export default App
