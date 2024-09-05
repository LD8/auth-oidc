import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { Link, RouterProvider, createBrowserRouter } from 'react-router-dom'
import Error404 from './Error404'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div>
        <h1>Hello World</h1>
        <Link to='about'>About Us</Link>
      </div>
    ),
  },
  {
    path: 'about',
    element: <div>About</div>,
  },
  { path: '*', element: <Error404 /> },
])

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
)
