import Link from 'next/link'
import { useRouter } from 'next/router'
import { isMobile } from 'react-device-detect'
import { useSession, signIn, signOut } from "next-auth/react"


export default function Nav() {
    const { data: session } = useSession()
    const router = useRouter()

    return (
        <nav>
            <ul className='navItems'>

                {session && <li id='logo' className='navItem'><Link href="/"><a className={router.pathname == "/" ? "active" : ""}>HabitTracker</a></Link></li>}

                {session ? <li className='navItem'><Link href="/homepage"><a className={router.pathname == "/homepage" ? "active" : ""}>Home</a></Link></li>
                    : <li className='navItem'><Link href={`/api/auth/signin`}><a className={router.pathname == "/signin" ? "active" : ""}>Home</a></Link></li>}

                {session ? <li className='navItem'><Link href="/calendar"><a className={router.pathname == "/calendar" ? "active" : ""}>Calendar</a></Link></li>
                    : <li className='navItem'><Link href={`/api/auth/signin`}><a className={router.pathname == "/signin" ? "active" : ""}>Calendar</a></Link></li>}

                {session ? <li className='navItem'><Link href="/settings"><a className={router.pathname == "/settings" ? "active" : ""}>Settings</a></Link></li>
                    : <li className='navItem'><Link href={`/api/auth/signin`}><a className={router.pathname == "/signin" ? "active" : ""}>Settings</a></Link></li>}

                {session ?
                    <li className='navItem'><Link href={`/api/auth/signout`}><a className={router.pathname == "/signin" ? "active" : ""}>Sign Out</a></Link></li>
                    : <li className='navItem'><Link href={`/api/auth/signin`}><a className={router.pathname == "/signin" ? "active" : ""}>Sign In</a></Link></li>}

                {/* {isMobile &&
                    <ul>
                        <li className='navItem'><Link href="/homepage"><a className={router.pathname == "/homepage" ? "active" : ""}>Home</a></Link></li>

                        <li className='navItem'><Link href="/calendar"><a className={router.pathname == "/calendar" ? "active" : ""}>Calendar</a></Link></li>
                        <li className='navItem'><Link href="/settings"><a className={router.pathname == "/settings" ? "active" : ""}>Settings</a></Link></li>
                        {session ? <button onClick={() => signOut({ redirect: true, callbackUrl: "/" })}>Sign out</button> : <li className='navItem'><Link href={`/api/auth/signin`}><a className={router.pathname == "/signin" ? "active" : ""}>Sign In</a></Link></li>}
                    </ul>
                } */}
            </ul>
        </nav>
    )
}