import { CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { lazy, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AppLayout from './layout/AppLayout.jsx';
import { ProtectAdminRoute } from './lib/ProtectAdminRoute.jsx';
import ProtectRoute from './lib/ProtectRoute.jsx';
import { setToken, userExists } from './redux/slices/userSlice.js';

// Lazy Load below all components

const About = lazy(() => import('./components/About.jsx'));
const ForgetPassword = lazy(() => import('./components/ForgetPassword.jsx'));
const Home = lazy(() => import('./components/Home.jsx'));
const NotFound = lazy(() => import('./components/NotFound.jsx'));
const Test = lazy(() => import('./components/Test.jsx'));
const TestCompleted = lazy(() => import('./components/TestCompleted.jsx'));
const TestDashboardLayout = lazy(() => import('./layout/TestDashboardLayout.jsx'));
const TestDashboard = lazy(() => import('./components/TestDashboard.jsx'));
const AssignedTest = lazy(() => import('./pages/AssignedTest.jsx'));
const Instruction = lazy(() => import('./pages/Instruction.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));

// Admin Components
const Dashboard = lazy(() => import('./components/admin/Dashboard.jsx'));
const AdminLayout = lazy(() => import('./layout/AdminLayout.jsx'));
const AdminLogin = lazy(() => import('./components/admin/Login.jsx'));
const CreateTest = lazy(() => import('./components/admin/pages/CreateTest.jsx'));
const TestManagement = lazy(() => import('./components/admin/pages/TestManagement.jsx'));
const AssignTest = lazy(() => import('./components/admin/pages/AssignTest.jsx'));
const UserManagement = lazy(() => import('./components/admin/pages/UserManagement.jsx'));
const EditTest = lazy(() => import('./shared/EditTest.jsx'));
const TestResult = lazy(() => import('./pages/TestResult.jsx'));

const LoginSuccess = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URI}/auth/login/success`, {
        withCredentials: true
      });

      if (res.data.success && res.data.user) {
        dispatch(userExists(res.data.user))
        dispatch(setToken(res.data.refreshToken))
        navigate('/', { replace: true })
      }
    } catch (error) {
     console.log('error in login success', error)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])
}

const App = () => {
  const { user, isAuthenticated } = useSelector(state => state.user || {});
  const isAdmin = user?.isAdmin;

  return (
    <Suspense fallback={<CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />}>
      <Routes>
        <Route path='/' element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path='about' element={<About />} />
          <Route path='*' element={<NotFound />} />
        </Route>

        <Route path='/test/:id/instruction' element={<ProtectRoute user={isAuthenticated}><Instruction /></ProtectRoute>} />
        <Route path='/test/:id/start' element={<ProtectRoute user={isAuthenticated}><Test /></ProtectRoute>} />
        <Route path='/test/:id/result' element={<ProtectRoute user={isAuthenticated}><TestResult /></ProtectRoute>} />

        {/* auth routes */}
        <Route path='/auth'>
          <Route path='login' index element={<ProtectRoute redirect="/" user={!isAuthenticated}><Login /></ProtectRoute>} />
          <Route path='forget' element={<ForgetPassword />} />
        </Route>
        <Route path='/login/success' element={<LoginSuccess />} />

        <Route path='/instruction' element={<ProtectRoute user={isAuthenticated}><Instruction /></ProtectRoute>} />
        <Route path='/profile/:id' element={<Profile />} />

        <Route path='/test' element={<TestDashboardLayout />}>
          <Route index path="dashboard" element={<TestDashboard />} />
          <Route path='assigned' element={<AssignedTest />} />
          <Route path='completed' element={<TestCompleted />} />
        </Route>

        {/* Admin routes */}
        <Route path='/admin' element={<ProtectRoute user={isAuthenticated}><ProtectAdminRoute isAdmin={isAdmin}><AdminLayout /></ProtectAdminRoute></ProtectRoute>}>
          <Route inedx path='dashboard' element={<Dashboard />} />
          <Route path='tests/create' element={<CreateTest />} />
          <Route path='users' element={<UserManagement />} />
          <Route path='tests' element={<TestManagement />} />
          <Route path='tests/assign' element={<AssignTest />} />
          <Route path='tests/edit/:id' element={<EditTest />} />
        </Route>

        <Route path='/admin/login' element={<AdminLogin />} />
      </Routes>
      <ToastContainer position='top-right' autoClose={1500} theme='dark' />
    </Suspense>
  )
}

export default App