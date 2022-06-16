import Nav from './nav'

export default function Layout({ children }) {


    return (
        <div className='layout'>
            <Nav />
            <main>
                {children}
            </main>
        </div>
    )
}