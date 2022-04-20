import Link from 'next/link'
// import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { isMobile } from 'react-device-detect'


export default function Nav() {
    // const [session, loading] = useSession()
    const router = useRouter()

    return (
        <nav>
            <ul className='navItems'>
                {/* {session ?
                    <li className='navItem'><Link href={`/users/${session && session.user.id}`} ><a className={router.pathname == `/users/${session.user.id}` ? "active" : ""}>{session && session.user.name}</a></Link></li>
                    : <li className='navItem'><Link href={`/api/auth/signin`}><a className={router.pathname == "/signin" ? "active" : ""}>Sign In</a></Link></li>
                } */}

                {router.pathname !== "/" && <li className='navItem'><Link href="/"><a className={router.pathname == "/" ? "active" : ""}>HabitTracker</a></Link></li>}

                {/* {isMobile &&  */}
                <li className='navItem'><Link href="/homepage"><a className={router.pathname == "/homepage" ? "active" : ""}>Home</a></Link></li>
                {/* } */}
                <li className='navItem'><Link href="/calendar"><a className={router.pathname == "/calendar" ? "active" : ""}>Calendar</a></Link></li>
                <li className='navItem'><Link href="/settings"><a className={router.pathname == "/settings" ? "active" : ""}>Settings</a></Link></li>

            </ul>
        </nav>
    )
}