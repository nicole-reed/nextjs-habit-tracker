import Head from 'next/head'
import Layout from '../components/layout'
import { useSession } from "next-auth/react"
import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Homepage() {
    const { data: session } = useSession()
    const [habits, setHabits] = useState({})
    const today = new Date().toISOString().slice(0, 10)
    const [log, setLog] = useState({})
    const [habitsCompleted, setHabitsCompleted] = useState([])
    const habitIDs = Object.keys(habitsCompleted)
    const [isLoading, setLoading] = useState(true)

    const getHabits = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`/api/users/${session.user.id}/habits`)

            setHabits(res.data.habits)
            setLoading(false)
        } catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        getHabits()
    }, [session])


    const getLog = async () => {
        try {
            const res = await axios.get(`/api/users/${session.user.id}/logs/${today}`)
            const log = res.data.log
            const habits = res.data.log.habitsCompleted

            setLog(log)
            setHabitsCompleted(habits)
        } catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        getLog()
    }, [session])

    const updateLog = async event => {
        try {
            if (event.target.checked) {
                const reqBody = { habitID: event.target.id, habitName: event.target.name, complete: true }
                await axios.patch(`/api/users/${session.user.id}/logs/${today}`, reqBody)
            } else {
                const reqBody = { habitID: event.target.id, habitName: event.target.name, complete: false }
                await axios.patch(`/api/users/${session.user.id}/logs/${today}`, reqBody)
            }

            getLog()

        } catch (error) {
            console.log(error.message)
        }
    }

    const createLog = async event => {
        try {
            const reqBody = { habitID: event.target.id, habitName: event.target.name }

            await axios.post(`/api/users/${session.user.id}/logs/${today}`, reqBody)
            getLog()

        } catch (error) {
            console.log(error.message)
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
                        <title>Home</title>
                        <meta name="description" content="Generated by create next app" />
                        <link rel="icon" href="/favicon.ico" />
                    </Head>
                    <Layout>


                        <main>
                            {isLoading ? '...' :
                                <div>
                                    <h1>Today's Habits</h1>

                                    {usersHabits && log ?
                                        <ul>
                                            {usersHabits && usersHabits.map((habit) => (

                                                <li key={habit._id}>
                                                    <input id={habit._id} name={habit.name} type="checkbox" defaultChecked={log && habitIDs.includes(habit._id) ? true : false} onChange={log._id || habitIDs.length > 0 ? updateLog : createLog} />
                                                    <label className="habit-name" htmlFor={habit._id}>
                                                        {habit.name}
                                                    </label>
                                                </li>

                                            ))}
                                        </ul>
                                        : ''}
                                </div>}
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
                    <title>Home</title>
                    <meta name="description" content="Generated by create next app" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Layout>


                    <main>
                        <h1>
                            Here is where today's habits will be displayed...</h1>

                    </main>
                </Layout>
            </div>


        </>
    )

}