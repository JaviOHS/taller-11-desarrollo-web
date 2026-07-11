import { useState } from 'react'

function PasswordInput({ id, name, value, onChange, placeholder, autoComplete, minLength }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-surface-400">
        <i className="fas fa-lock"></i>
      </span>
      <input
        id={id}
        name={name || id}
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        minLength={minLength}
        required
        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-surface-200 bg-white text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-agro-500 focus:border-transparent transition"
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-surface-400 hover:text-surface-600"
      >
        <i className={`fas ${visible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
      </button>
    </div>
  )
}

function GoogleButton() {
  return (
    <a
      href="/api/auth/google"
      className="w-full py-2.5 rounded-xl border border-surface-200 bg-white text-surface-700 text-sm font-semibold hover:bg-surface-50 active:scale-[0.99] transition flex items-center justify-center gap-2.5"
    >
      <svg style={{ height: 18, width: 18 }} viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
      </svg>
      Continuar con Google
    </a>
  )
}

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onLogin(data.token)
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="log-email" className="block text-xs font-semibold text-surface-600 mb-1.5">Correo electrónico</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-surface-400">
            <i className="fas fa-envelope"></i>
          </span>
          <input
            id="log-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@unemi.edu.ec"
            required
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 bg-white text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-agro-500 focus:border-transparent transition"
          />
        </div>
      </div>

      <div>
        <label htmlFor="log-password" className="block text-xs font-semibold text-surface-600 mb-1.5">Contraseña</label>
        <PasswordInput id="log-password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-xl bg-agro-600 text-white text-sm font-semibold hover:bg-agro-700 active:scale-[0.99] transition shadow-sm shadow-agro-600/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <i className="fas fa-spinner fa-spin"></i>
            Verificando...
          </>
        ) : (
          'Iniciar sesión'
        )}
      </button>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-center gap-2.5">
          <i className="fas fa-circle-exclamation text-red-500"></i>
          <p className="text-red-700 text-xs font-medium">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-3 py-1">
        <div className="h-px flex-1 bg-surface-200"></div>
        <span className="text-xs text-surface-400 font-medium">o continúa con</span>
        <div className="h-px flex-1 bg-surface-200"></div>
      </div>

      <GoogleButton />
    </form>
  )
}

function RegisterForm({ onLogin }) {
  const [form, setForm] = useState({ nombre: '', email: '', username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onLogin(data.token)
    } catch (err) {
      setError(err.message || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="reg-nombre" className="block text-xs font-semibold text-surface-600 mb-1.5">Nombre completo</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-surface-400">
            <i className="fas fa-user"></i>
          </span>
          <input
            id="reg-nombre"
            name="nombre"
            type="text"
            autoComplete="name"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre y apellido"
            required
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 bg-white text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-agro-500 focus:border-transparent transition"
          />
        </div>
      </div>

      <div>
        <label htmlFor="reg-email" className="block text-xs font-semibold text-surface-600 mb-1.5">Correo electrónico</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-surface-400">
            <i className="fas fa-envelope"></i>
          </span>
          <input
            id="reg-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="tucorreo@unemi.edu.ec"
            required
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 bg-white text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-agro-500 focus:border-transparent transition"
          />
        </div>
      </div>

      <div>
        <label htmlFor="reg-username" className="block text-xs font-semibold text-surface-600 mb-1.5">Username</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-surface-400">
            <i className="fas fa-at"></i>
          </span>
          <input
            id="reg-username"
            name="username"
            type="text"
            autoComplete="username"
            value={form.username}
            onChange={handleChange}
            placeholder="usuario123"
            required
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 bg-white text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-agro-500 focus:border-transparent transition"
          />
        </div>
      </div>

      <div>
        <label htmlFor="reg-password" className="block text-xs font-semibold text-surface-600 mb-1.5">Contraseña</label>
        <PasswordInput id="reg-password" name="password" autoComplete="new-password" value={form.password} onChange={handleChange} placeholder="Mínimo 6 caracteres" minLength={6} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-xl bg-agro-600 text-white text-sm font-semibold hover:bg-agro-700 active:scale-[0.99] transition shadow-sm shadow-agro-600/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <i className="fas fa-spinner fa-spin"></i>
            Creando cuenta...
          </>
        ) : (
          'Crear cuenta'
        )}
      </button>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-center gap-2.5">
          <i className="fas fa-circle-exclamation text-red-500"></i>
          <p className="text-red-700 text-xs font-medium">{error}</p>
        </div>
      )}
    </form>
  )
}

function AuthCard({ onLogin }) {
  const [tab, setTab] = useState('login')

  return (
    <div className="min-h-screen bg-surface-50 text-surface-800 relative overflow-x-hidden flex items-center justify-center px-4 py-10 sm:py-14">
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-agro-200/40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-[28rem] h-[28rem] bg-teal-200/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-agro-100/50 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-4xl bg-white/95 backdrop-blur rounded-3xl shadow-2xl shadow-surface-200/60 ring-1 ring-surface-900/5 overflow-hidden grid md:grid-cols-2">

        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-agro-600 via-agro-700 to-teal-800 p-10 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-56 h-56 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-16 -left-14 w-44 h-44 bg-white/10 rounded-full"></div>
          <div className="absolute top-1/2 right-8 w-24 h-24 bg-white/5 rounded-full"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <span className="font-semibold tracking-wide">EventMila</span>
            </div>

            <h1 className="mt-12 text-3xl font-bold text-white leading-tight">
              Gestión de<br />Eventos
            </h1>
            <p className="mt-4 text-agro-50/80 text-sm leading-relaxed max-w-xs">
              Crea, edita y organiza tus eventos. Hazlos públicos para que el resto de usuarios los descubra.
            </p>
          </div>

          <ul className="relative z-10 space-y-4 text-sm text-agro-50/90">
            <li className="flex items-center gap-3">
              <i className="fas fa-circle-check flex-shrink-0"></i>
              Autenticación segura con JWT
            </li>
            <li className="flex items-center gap-3">
              <i className="fas fa-circle-check flex-shrink-0"></i>
              Inicio de sesión con Google
            </li>
            <li className="flex items-center gap-3">
              <i className="fas fa-circle-check flex-shrink-0"></i>
              Eventos públicos o privados
            </li>
          </ul>

          <p className="relative z-10 text-xs text-agro-100/60">Desarrollo Web · UNEMI © 2026</p>
        </div>

        <div className="p-8 sm:p-10 flex flex-col">
          <div className="md:hidden mb-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-agro-600 flex items-center justify-center text-white text-xl">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <h1 className="mt-3 text-xl font-bold text-surface-900">EventMila</h1>
            <p className="text-xs text-surface-500">UNEMI · Desarrollo Web</p>
          </div>

          <div className="flex bg-surface-100 rounded-xl p-1 mb-7">
            <button
              type="button"
              onClick={() => setTab('login')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${tab === 'login' ? 'bg-white text-agro-700 shadow-sm' : 'text-surface-500'}`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => setTab('register')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${tab === 'register' ? 'bg-white text-agro-700 shadow-sm' : 'text-surface-500'}`}
            >
              Crear cuenta
            </button>
          </div>

          {tab === 'login' ? <LoginForm onLogin={onLogin} /> : <RegisterForm onLogin={onLogin} />}
        </div>
      </div>
    </div>
  )
}

export default AuthCard
