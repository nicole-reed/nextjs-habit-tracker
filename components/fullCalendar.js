import Calendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
// import styles from './Fullcalendar.module.scss';
import { useSession } from "next-auth/react"
import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function FullCalendar(props) {
    const { data: session } = useSession()
    const [logs, setLogs] = useState([])
    const [habitNames, setHabitNames] = useState([])

    const getHabits = async () => {
        try {
            const res = await axios.get(`api/users/${session.user.id}/habits`)
            const names = res.data.habits.map(habit => habit.name)
            setHabitNames(names)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getHabits()
    }, [session])

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


    const events = logs.map((log) => {
        const habits = Object.values(log.habitsCompleted)
        return habits.map((habit) => {
            return {
                'title': habit,
                'start': log.date.slice(0, 10)
            }
        })
    })
    // events is an array of arrays so to make one array we flatten
    const eventLog = events.flat()
    // filter out events that are no longer in the user's habits
    const filteredEvents = eventLog.filter(event => habitNames.includes(event.title))

    return (
        <Calendar {...props}
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            contentHeight="auto"
            navLinks="true"
            timeZone="local"
            events={filteredEvents}
            navLinkDayClick={(date) => {
                // console.log('day', date.toISOString().slice(0, 10));
                const day = date.getDate() < 10 ? `0` + date.getDate() : date.getDate()
                const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
                const year = date.getFullYear()
                // console.log('date', `${year}-${month}-${day}`)
                window.location.href = `/edit/${year}-${month}-${day}`
            }}
        />
    );
}