import Nav from './nav'

export default function Layout({ children }) {


    return (
        <div className='layout'>
            <div className='header'>
                <Nav />
            </div>
            <main>
                {children}
            </main>
        </div>
    )
}