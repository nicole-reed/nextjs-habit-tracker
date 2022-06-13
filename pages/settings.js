import Head from 'next/head'
import Script from 'next/script'
import Layout from '../components/layout'
import DeleteModal from '../components/deleteModal'
import { getSession, useSession } from "next-auth/react"
import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Settings() {
    const { data: session } = useSession({
        required: true, onUnauthenticated() {
            // The user is not authenticated, handle it here.
            console.log('in unauthenticated')
        },
    })
    const [habits, setHabits] = useState({})
    const [usersHabits, setUsersHabits] = useState([])
    const [isLoading, setLoading] = useState(true)
    console.log('habits', habits)
    console.log('usersHabits', usersHabits)

    // For delete modal
    const [habitid, setHabitId] = useState(null);
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [message, setMessage] = useState(null)

    const getHabits = async () => {
        try {
            setLoading(true)
            const session = await getSession()
            const res = await axios.get(`/api/users/${session.user.id}/habits`)
            const habits = res.data.habits
            if (habits.length > 0) {

                setUsersHabits(habits.filter(habit => habit.userid === session.user.id))
            }
            setHabits(habits)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getHabits()
    }, [])


    const addHabit = async event => {
        try {
            event.preventDefault()
            const session = await getSession()
            const reqBody = { habit: event.target.habit.value, userid: session.user.id }

            await axios.post(`/api/habits`, reqBody)

            getHabits()
        } catch (error) {
            console.log(error)
        }
    }

    // let usersHabits = []
    // if (habits.length > 0) {

    //     usersHabits = habits.filter(habit => habit.userid === session.user.id)
    // }


    // Handle the displaying of the modal based on id
    const showDeleteModal = async (habitid) => {
        setHabitId(habitid);

        setDeleteMessage('Are you sure you want to delete the habit and its records?');


        setDisplayConfirmationModal(true);
    };

    // Hide the modal
    const hideConfirmationModal = () => {
        setDisplayConfirmationModal(false);
    };

    // Handle the actual deletion of the item
    const submitDelete = async (habitid) => {
        try {
            await axios.delete(`/api/habits/${habitid}`)
            setMessage('Habit was deleted succcessfully');
            setDisplayConfirmationModal(false);

            getHabits()
        } catch (error) {
            console.log(error.message)
        }
    };

    return (
        <div>
            <Head>
                <title>Settings</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout>

                <main>
                    <Script src="https://kit.fontawesome.com/3c5f175f7a.js"></Script>

                    {isLoading ? '...' :
                        <div className='settings'>

                            <h1 className='habit-list-title'>My habits</h1>

                            <div className='habits-container'>
                                <ul className='habits'>
                                    {usersHabits.map((habit) => (
                                        <li key={habit._id} className='habit-list'>
                                            <p id={habit._id}>{habit.name}</p>
                                            <button id={habit._id} className='delete-habit-btn' onClick={() => showDeleteModal(habit._id)}><i className="fa-solid fa-trash-can"></i></button>
                                        </li>
                                    ))}
                                </ul>
                                <form className='add-habit-form' onSubmit={addHabit}>
                                    <input className='add-habit' id='habit' name='habit' type="text" placeholder='Add a habit' required />

                                    <button className='add-habit-btn' type='submit'>+</button>
                                </form>
                            </div>




                        </div>
                    }

                </main>
                <DeleteModal showModal={displayConfirmationModal} confirmModal={submitDelete} hideModal={hideConfirmationModal} habitid={habitid} message={deleteMessage} />


            </Layout>
        </div>
    )
}
