'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as yup from 'yup'

import { PageHeader } from '@/components/PageHeader'
import { useAuth } from '@/context/AuthContext'
import type { PublicUser } from '@/types/user'

const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(8, 'At least 8 characters').required(),
})

type Form = yup.InferType<typeof schema>

export function RegisterForm() {
  const { refresh, setUser } = useAuth()
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ resolver: yupResolver(schema) })

  async function onSubmit(data: Form) {
    const r = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const j = (await r.json()) as { user?: PublicUser; error?: string }
    if (!r.ok) {
      const msg = j.error || 'Registration failed'
      setServerError(msg)
      toast.error(msg)
      return
    }
    if (j.user) setUser(j.user)
    await refresh()
    toast.success('Account created. You’re all set.')
    router.replace('/dashboard')
  }

  return (
    <div className="mx-auto max-w-md">
      <PageHeader
        title="Create account"
        description="Add your name, email, and a secure password. You’ll land on your dashboard where you can review your profile and keep shopping."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Register' },
        ]}
      />
      <form
        className="mt-2 space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div>
          <label className="text-xs font-medium text-slate-600" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-800"
            autoComplete="name"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-xs text-amber-700">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-800"
            autoComplete="email"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-amber-700">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label
            className="text-xs font-medium text-slate-600"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-800"
            autoComplete="new-password"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs text-amber-700">{errors.password.message}</p>
          )}
        </div>
        {serverError && <p className="text-sm text-amber-800">{serverError}</p>}
        <button
          type="submit"
          className="w-full rounded-xl bg-amber-500 py-3 font-medium text-slate-900 transition hover:bg-amber-400"
        >
          Register
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link className="font-medium text-cyan-600 hover:underline" href="/login">
          Log in
        </Link>
      </p>
    </div>
  )
}
