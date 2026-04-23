import { Suspense } from 'react'

import { LoginForm } from './LoginForm'

export const metadata = { title: 'Log in' }

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <p className="text-slate-600" role="status">
          Loading sign-in…
        </p>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
