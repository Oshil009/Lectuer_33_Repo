import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { toast } from '../utils/swal'

export default function AuthCallback() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { login } = useAuth()

    useEffect(() => {
        const token = searchParams.get('token')
        const userRaw = searchParams.get('user')
        const error = searchParams.get('error')

        if (error) {
            toast('Google sign-in failed. Please try again.', 'error')
            navigate('/login')
            return
        }

        if (token && userRaw) {
            try {
                const user = JSON.parse(decodeURIComponent(userRaw))
                login(token, user)
                toast(`Welcome, ${user.name}!`)
                navigate('/')
            } catch {
                toast('Something went wrong. Please try again.', 'error')
                navigate('/login')
            }
        } else {
            navigate('/login')
        }
    }, [])

    return (
        <div className="state-center">
            <div className="state-center__inner">
                <svg className="animate-spin" width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="11" stroke="rgba(233,69,96,0.2)" strokeWidth="3" />
                    <path d="M14 3a11 11 0 0111 11" stroke="#e94560" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <p className="state-center__text">Signing you in...</p>
            </div>
        </div>
    )
}
