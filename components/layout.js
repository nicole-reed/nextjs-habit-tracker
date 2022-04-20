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
            <footer className="section-footer">
                <div className="cont">
                    <div>
                        <h2 className="lighter">Connect with us on social media.</h2>
                        <a href="http://twitter.com">
                            <i className="fa-brands fa-twitter fa-2x"></i>
                        </a>
                        <a href="http://facebook.com">
                            <i className="fab fa-facebook fa-2x"></i>
                        </a>
                        <a href="http://instagram.com">
                            <i className="fa-brands fa-instagram fa-2x"></i>
                        </a>
                    </div>
                    <div>
                        <h2>Need Some Inspo?</h2>
                        <a href="https://www.webmd.com/fitness-exercise/ss/twelve-habits-super-healthy-people">Check out this article from WebMD.</a>
                        <br />
                        <a href="https://www.psychologytoday.com/us/blog/lifes-work/202103/7-simple-habits-protect-your-mental-health">Or this one from Psychology Today.</a>
                    </div>

                </div>
            </footer>
        </div>
    )
}