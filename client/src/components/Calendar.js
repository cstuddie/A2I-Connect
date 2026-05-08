import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserHeader } from './Dashboard';
import { parseLocalDate, formatLocalDate } from '../utils/dateUtils';
import './LandingPage.css';
import './Calendar.css';
import useTranslation from '../utils/useTranslation';

const statusLabels = { 1: 'Pending', 2: 'Confirmed', 3: 'Completed' };

const Calendar = () => {
    const t = useTranslation();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [profileNames, setProfileNames] = useState({});
    const [expertiseMap, setExpertiseMap] = useState({});
    const userID = localStorage.getItem('userID') || 2;

    const [profileInfo, setProfileInfo] = useState({ name: 'Profile', interests: '', history: '', expertise: '', affiliation: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const eventsResponse = await fetch(`http://localhost:3001/events/user/${userID}`);
                const eventsData = await eventsResponse.json();
                setEvents(Array.isArray(eventsData) ? eventsData : []);

                const usersResponse = await fetch('http://localhost:3001/users');
                const usersData = await usersResponse.json();
                const namesMap = {};
                if (Array.isArray(usersData)) {
                    usersData.forEach(user => { namesMap[user.ID] = `${user.FirstName} ${user.LastName}`; });
                }
                setProfileNames(namesMap);

                const expertiseResponse = await fetch('http://localhost:3001/users/expertise');
                const expertiseData = await expertiseResponse.json();
                const expMap = {};
                if (Array.isArray(expertiseData)) {
                    expertiseData.forEach(exp => { expMap[exp.ID] = exp.Title; });
                }
                setExpertiseMap(expMap);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [userID]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:3001/users/${userID}`);
                const data = await response.json();
                if (data && data.length > 0) setProfileInfo(data[0]);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, [userID]);

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const getEventsForDay = (day) => {
        const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return events.filter(event => event.Date.split('T')[0] === dateStr);
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const days = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="cal-day empty" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayEvents = getEventsForDay(day);
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

            days.push(
                <div key={`day-${day}`} className={`cal-day ${isToday ? 'today' : ''} ${dayEvents.length > 0 ? 'has-events' : ''}`}>
                    <div className="cal-day-number">{day}</div>
                    {dayEvents.length > 0 && (
                        <>
                            <div className="cal-dot" />
                            <div className="cal-tooltip">
                                {dayEvents.map(event => (
                                    <div key={event.ID} className="cal-tooltip-item">
                                        <Link to={`/events/${event.ID}`} className="cal-tooltip-topic">{event.Topic}</Link>
                                        <span className="cal-tooltip-sub">
                                            {event.InstructorID ? profileNames[event.InstructorID] || 'TBD' : 'TBD'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            );
        }

        return days;
    };

    const monthYearString = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const currentMonthEvents = events.filter(event => {
        const eventDate = parseLocalDate(event.Date);
        return eventDate && eventDate.getMonth() === currentDate.getMonth() &&
               eventDate.getFullYear() === currentDate.getFullYear();
    });

    return (
        <div className="dash-root">
            <UserHeader name={profileInfo.FirstName} />

            <div className="dash-banner">
                <div className="dash-banner-inner">
                    <h1 className="dash-banner-title">{t.calendar || 'Calendar'}</h1>
                    <p className="dash-banner-sub">View and manage your scheduled events</p>
                </div>
            </div>

            <div className="cal-body">

                {/* Calendar Grid */}
                <div className="cal-panel">
                    <div className="cal-nav">
                        <button className="cal-nav-btn" onClick={prevMonth}>← {'Prev'}</button>
                        <h2 className="cal-month-title">{monthYearString}</h2>
                        <button className="cal-nav-btn" onClick={nextMonth}>{'Next'} →</button>
                    </div>

                    <div className="cal-weekdays">
                        {[t.sun, t.mon, t.tue, t.wed, t.thu, t.fri, t.sat].map((d, i) => (
                            <div key={i} className="cal-weekday">{d}</div>
                        ))}
                    </div>

                    <div className="cal-grid">
                        {renderCalendar()}
                    </div>
                </div>

                {/* Events List */}
                <div className="cal-events-panel">
                    <h3 className="cal-events-title">{t.eventsThisMonth || 'Events This Month'}</h3>

                    {currentMonthEvents.length > 0 ? (
                        <div className="cal-events-list">
                            {currentMonthEvents.map(event => (
                                <Link to={`/events/${event.ID}`} key={event.ID} className="cal-event-item">
                                    <div className="cal-event-date">{formatLocalDate(event.Date)}</div>
                                    <div className="cal-event-topic">{event.Topic}</div>
                                    <div className="cal-event-meta">
                                        {expertiseMap[event.ExpertiseID] && (
                                            <span className="cal-event-badge">{expertiseMap[event.ExpertiseID]}</span>
                                        )}
                                        {event.DeliveryMethod && (
                                            <span className="cal-event-badge">{event.DeliveryMethod}</span>
                                        )}
                                        {event.EventStatus && (
                                            <span className={`cal-event-badge status-${event.EventStatus}`}>
                                                {statusLabels[event.EventStatus] || event.EventStatus}
                                            </span>
                                        )}
                                    </div>
                                    <div className="cal-event-instructor">
                                        {event.InstructorID
                                            ? `${t.with || 'With'} ${profileNames[event.InstructorID] || 'TBD'}`
                                            : `(${t.instructorTBD || 'Instructor TBD'})`}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="dash-empty">{t.noEventsMonth || 'No events this month.'}</p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Calendar;