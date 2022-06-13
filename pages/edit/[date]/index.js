import Head from 'next/head'
import Layout from '../../../components/layout'
import { getSession, useSession } from "next-auth/react"
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function Edit() {
    const { data: session } = useSession({
        required: true, onUnauthenticated() {
            console.log('in unauthenticated')
        },
    })
    const router = useRouter()
    const { date } = router.query
    const [habits, setHabits] = useState({})
    const [log, setLog] = useState({})
    const [habitsCompleted, setHabitsCompleted] = useState([])
    const [isLoading, setLoading] = useState(true)

    const getHabits = async () => {
        try {
            const session = await getSession()
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
            setLoading(true)
            const session = await getSession()
            if (date) {
                const res = await axios.get(`/api/users/${session.user.id}/logs/${date}`)
                const log = res.data.log
                if (log) {
                    const habits = Object.keys(log.habitsCompleted)
                    setLog(log)
                    setHabitsCompleted(habits)
                    getHabits()
                }
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getLog()
    }, [session])


    const updateLog = async event => {
        try {
            const session = await getSession()
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
            const session = await getSession()
            const reqBody = { habitID: event.target.id, habitName: event.target.name }

            await axios.post(`/api/users/${session.user.id}/logs/${date}`, reqBody)
            getLog()

        } catch (error) {
            console.log(error)
        }
    }

    let usersHabits = []
    if (session && habits.length > 0) {

        usersHabits = habits.filter(habit => habit.userid === session.user.id)
    }

    if (date) {
        return (
            <div>
                <Head>
                    <title>Edit</title>
                    <meta name="description" content="Generated by create next app" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Layout>


                    <main>

                        {isLoading ? '...' :
                            <div>
                                {date && <h2 className='habit-list-title'>Habits Completed On {`${date.slice(8, 10)}/${date.slice(5, 7)}/${date.slice(0, 4)}`}</h2>}
                                {usersHabits && log ?
                                    <div className='habits-container'>
                                        <ul className='habits'>
                                            {usersHabits && usersHabits.map((habit) => (

                                                <li key={habit._id}>
                                                    <input id={habit._id} name={habit.name} type="checkbox" defaultChecked={log && habitsCompleted.includes(habit._id) ? true : false} onChange={log._id || habitsCompleted.length > 0 ? updateLog : createLog} />
                                                    <label className="habit-name" htmlFor={habit._id}>
                                                        {habit.name}
                                                    </label>
                                                </li>

                                            ))}
                                        </ul>
                                    </div>
                                    : ''}
                            </div>
                        }

                    </main>
                </Layout>
            </div>

        )
    }
}

