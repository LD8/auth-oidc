import { WebStorageStateStore } from 'oidc-client-ts'
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider, useAuth } from 'react-oidc-context'
import {
  Link,
  Outlet,
  RouterProvider,
  createBrowserRouter,
  useRouteError,
} from 'react-router-dom'
import Error404 from './Error404'
import { AUTH_WITH_OIDC, OIDC } from './utils/constants'

const router = createBrowserRouter([
  {
    path: '/',
    element: AUTH_WITH_OIDC ? <LayoutWithOIDCAuthProvider /> : <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Landing /> },
      AUTH_WITH_OIDC
        ? {
            path: 'login',
            element: <Login />,
          }
        : {},
      {
        path: 'about',
        element: <div>About</div>,
      },
    ],
  },
  { path: '*', element: <Error404 /> },
])

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

function Layout() {
  return (
    <div>
      <h1>OIDC Authentication Test</h1>
      <div style={{ display: 'flex', gap: '24px' }}>
        <Link to='/'>Landing</Link>
        {AUTH_WITH_OIDC && <Link to='login'>Login</Link>}
        <Link to='about'>About Us</Link>
      </div>
      <hr />
      <Outlet />
    </div>
  )
}

/**
 * @ref react-oidc-context
 * @url https://github.com/authts/react-oidc-context?tab=readme-ov-file#getting-started
 */
function LayoutWithOIDCAuthProvider() {
  return (
    <AuthProvider
      {...{
        userStore: new WebStorageStateStore({ store: window.localStorage }),
        scope: 'openid email profile',
        automaticSilentRenew: true,
        authority: OIDC.issuer,
        client_id: OIDC.clientId,
        redirect_uri: OIDC.urlRedirect,
        responseType: 'id_token',
        onSigninCallback: () => {
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          )
        },
      }}
    >
      <Layout />
    </AuthProvider>
  )
}

function Landing() {
  const auth = useAuth()
  console.log({
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    activeNavigator: auth.activeNavigator,
    auth,
  })

  // // automatically sign-in
  // const [hasTriedSignin, setHasTriedSignin] = React.useState(false)
  // React.useEffect(() => {
  //   if (
  //     !hasAuthParams() &&
  //     !auth.isAuthenticated &&
  //     !auth.activeNavigator &&
  //     !auth.isLoading &&
  //     !hasTriedSignin
  //   ) {
  //     auth.signinRedirect()
  //     setHasTriedSignin(true)
  //   }
  // }, [auth, hasTriedSignin])

  // switch (auth.activeNavigator) {
  //   case 'signinSilent':
  //     return <div>Signing you in...</div>
  //   case 'signoutRedirect':
  //     return <div>Signing you out...</div>
  // }

  if (auth.isLoading) return 'Loading'

  if (auth.error)
    return <div>Oops... Authentication error: {auth.error.message}</div>

  if (!auth.isAuthenticated)
    return <button onClick={() => void auth.signinRedirect()}>Log in</button>

  // Authenticated
  return (
    <div>
      <h2>Landing</h2>
      Hello (user.profile.sub: {auth.user?.profile.sub})
      <br />
      <br />
      <button onClick={() => void auth.removeUser()}>Log out</button>
    </div>
  )
}

function Login() {
  const auth = useAuth()
  console.log({ loginAuth: auth })
  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Login</button>
      <button onClick={() => auth.signoutSilent()}>Log out</button>
    </div>
  )
}

function ErrorPage() {
  const error = useRouteError() as any
  console.error(error)

  return (
    <div id='error-page'>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  )
}
