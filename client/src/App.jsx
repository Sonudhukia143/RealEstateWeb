import { Route, createBrowserRouter, RouterProvider, createRoutesFromElements } from 'react-router-dom';
import './App.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.esm'
import Layout from './components/Layout';
import Home from './routes/Home';
import LoginPage from './routes/LoginPage';
import SignUp from './routes/SignUp'
import UndefinedPath from './routes/UndefinedPath';
import About from './routes/About';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="about" element={<About />} />

        <Route path="*" element={<UndefinedPath />} />
      </Route>
    </>
  )
)

export default function App() {
  return (
      <RouterProvider router={router} />
  )
}