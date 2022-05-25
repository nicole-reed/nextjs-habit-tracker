import Head from 'next/head'
import Layout from '../components/layout'
import FullCalendar from '../components/fullCalendar'
import { useSession } from "next-auth/react"
import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Calendar() {
    const { data: session } = useSession()
    const [logs, setLogs] = useState([])

    const getLogs = async () => {
        try {
            const res = await axios.get(`/api/users/${session.user.id}/logs`)

            setLogs(res.data.logs)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getLogs()
    }, [session])

    return (
        <div>
            <Head>
                <title>Calendar</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout>

                <main>
                    <FullCalendar />
                    {/* {logs && <>
                        <div className='logs'>
                            {logs.map(day => (
                                <div>
                                    <p>date: {day.date.slice(0, 10)}</p>

                                    <ul>
                                        {Object.values(day.habitsCompleted).map(habit => <li>{habit}</li>)}
                                    </ul>


                                </div>
                            ))}
                        </div>
                    </>} */}
                </main>
            </Layout>
        </div>
    )
}
