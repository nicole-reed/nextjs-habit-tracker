import { useSession } from "next-auth/react"
import React, { useState, useEffect } from 'react'
import axios from 'axios'


export default function Component() {
    const { data: session } = useSession()
    const [habits, setHabits] = useState({})

    const getAllHabits = async () => {
        try {
            const res = await axios.get('/api/habits')
            // console.log('res', res.data.habits)
            setHabits(res.data.habits)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getAllHabits()
    }, [])

    const addHabit = async event => {
        try {
            // event.preventDefault()
            const reqBody = { habit: event.target.habit.value, id: session.user.id }

            const res = await axios.post(`/api/hello`, reqBody)

        } catch (error) {
            console.log(error)
        }
    }

    if (session) {
        const usersHabits = habits.filter(habit => habit.userid === session.user.id)
        return (
            <>
                Signed in as {session.user.email} <br />
                ID: {session.user.id}
                <form onSubmit={addHabit}>
                    <input id='habit' name='habit' type="text" placeholder='habit' required />

                    <button type='submit'>add habit</button>
                </form>
                {/* <h1>{habits[0]['name']}</h1> */}

                {usersHabits.map((habit) => (
                    <p key={habit._id}>{habit.name}</p>
                ))}

            </>
        )
    }
    return (
        <>
            Not signed in <br />
        </>
    )
}

