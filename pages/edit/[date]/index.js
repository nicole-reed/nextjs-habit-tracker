import Head from 'next/head'
import Layout from '../../../components/layout'
import { useSession } from "next-auth/react"
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function Homepage() {
    const { data: session } = useSession()
    const router = useRouter()
    const { date } = router.query
    const [habits, setHabits] = useState({})
    const [log, setLog] = useState({})
    const habitIDs = Object.keys(log)

    const getHabits = async () => {
        try {
            const res = await axios.get(`/api/users/${session.user.id}/habits`)

            setHabits(res.data.habits)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getHabits()
    }, [session])


    const getLog = async () => {
        try {
            const res = await axios.get(`/api/users/${session.user.id}/logs/${date}`)
            const log = res.data.log.habitsCompleted

            setLog(log)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getLog()
    }, [session])




    const updateLog = async event => {
        try {
            if (event.target.checked) {
                const reqBody = { habitID: event.target.id, habitName: event.target.name, complete: true }
                await axios.patch(`/api/users/${session.user.id}/logs/${date}`, reqBody)
            } else {
                const reqBody = { habitID: event.target.id, habitName: event.target.name, complete: false }
                await axios.patch(`/api/users/${session.user.id}/logs/${date}`, reqBody)
            }

            getLog()

        } catch (error) {
            console.log(error)
        }
    }

    const createLog = async event => {
        try {
            const reqBody = { habitID: event.target.id, habitName: event.target.name }

            await axios.post(`/api/users/${session.user.id}/logs/${date}`, reqBody)
            getLog()

        } catch (error) {
            console.log(error)
        }
    }

    let usersHabits = []
    if (habits.length > 0) {

        usersHabits = habits.filter(habit => habit.userid === session.user.id)
    }
    if (session) {

        return (
            <>
                <div>
                    <Head>
                        <title>Edit</title>
                        <meta name="description" content="Generated by create next app" />
                        <link rel="icon" href="/favicon.ico" />
                    </Head>
                    <Layout>


                        <main>

                            <h2>Log for {date}</h2>
                            {usersHabits && log ?
                                <ul>
                                    {usersHabits && usersHabits.map((habit) => (
                                        <div>
                                            <li key={habit._id}>
                                                <input id={habit._id} name={habit.name} type="checkbox" defaultChecked={log && habitIDs.includes(habit._id) ? true : false} onChange={log || habitIDs.length > 0 ? updateLog : createLog} />
                                                <label className="habit-name" htmlFor={habit._id}>
                                                    {habit.name}
                                                </label>
                                            </li>
                                        </div>
                                    ))}
                                </ul>
                                : ''}
                        </main>
                    </Layout>
                </div>


            </>
        )
    }

    return (
        <>
            <div>
                <Head>
                    <title>Edit</title>
                    <meta name="description" content="Generated by create next app" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Layout>


                    <main>
                        <h1>
                            No log for {date}...</h1>

                    </main>
                </Layout>
            </div>


        </>
    )

}