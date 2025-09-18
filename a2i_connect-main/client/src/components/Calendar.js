import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { UserHeader } from './Dashboard';
import { Button } from 'react-bootstrap';
import './Base.css';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [profileNames, setProfileNames] = useState({});
    const userID = localStorage.getItem('userID') || 2;

    const [profileInfo, setProfileInfo] = useState({
            name: 'Profile',
            interests: '',
            history: '',
            expertise: '',
            affiliation: '',
        });

    // Fetch events and profile names
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch events
                const eventsResponse = await fetch(`http://localhost:5000/events/${userID}`);
                const eventsData = await eventsResponse.json();
                setEvents(eventsData);

                // Fetch all profiles to map IDs to names
                const profilesResponse = await fetch('http://localhost:5000/profiles');
                const profilesData = await profilesResponse.json();
                
                const namesMap = {};
                profilesData.forEach(profile => {
                    namesMap[profile.userID] = profile.name;
                });
                setProfileNames(namesMap);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [userID]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:5000/profile/${userID}`);
                const data = await response.json();
                if (data && data.length > 0) {
                    setProfileInfo(data[0]);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, [userID]);

    // Navigation functions
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    // Check if a date has events
    const hasEvents = (day) => {
        const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return events.some(event => {
            const eventDate = event.date.split('T')[0]; // Remove time portion if exists
            return eventDate === dateStr;
        });
    };

    // Get events for a specific day
    const getEventsForDay = (day) => {
        const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return events.filter(event => {
            const eventDate = event.date.split('T')[0];
            return eventDate === dateStr;
        });
    };

    // Render calendar days
    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();

        const days = [];
        
        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEvents = getEventsForDay(day);
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
            
            days.push(
                <div 
                    key={`day-${day}`} 
                    className={`calendar-day ${isToday ? 'today' : ''}`}
                >
                    <div className="day-number">{day}</div>
                    {dayEvents.length > 0 && <div className="event-indicator">•</div>}
                    {dayEvents.length > 0 && (
                        <div className="day-events-tooltip">
                            {dayEvents.map(event => (
                                <div key={event.eventID} className="event-tooltip-item">
                                    <Link to={`/Event/${event.eventID}`} style={{textDecoration: 'none'}}><h4><b>{event.topic}</b></h4></Link>
                                    <p>With: {event.instructorID ? profileNames[event.instructorID] || 'TBD' : 'TBD'}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return days;
    };

    // Format month and year for display
    const monthYearString = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    // Get events for the current month
    const currentMonthEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getMonth() === currentDate.getMonth() && 
               eventDate.getFullYear() === currentDate.getFullYear();
    });

    return (
        <div>
            <UserHeader name={profileInfo.name}/>
            <div className="container">
                <main className="calendar-main">
                    <div className="month-navigation">
                        <Button variant='secondary' onClick={prevMonth}>&lt; Previous</Button>
                        <h2 className="month-title">{monthYearString}</h2>
                        <Button variant ='secondary' onClick={nextMonth}>Next &gt;</Button>
                    </div>

                    <div className="weekdays">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                    </div>

                    <div className="calendar-grid">
                        {renderCalendar()}
                    </div>

                    <div className="events-list">
                        <h3>Your Events This Month</h3>
                        {currentMonthEvents.length > 0 ? (
                            currentMonthEvents.map(event => (
                                <div key={event.eventID} className="event-item">
                                    <Link to={`/Event/${event.eventID}`} style={{textDecoration: 'none'}}><strong>{event.topic}</strong></Link>
                                    <p>
                                        {new Date(event.date).toLocaleDateString()} • {event.field} • 
                                        {event.instructorID ? ` With: ${profileNames[event.instructorID] || 'TBD'}` : ' (Instructor TBD)'}
                                    </p>
                                    <p>Status: {event.status} • Method: {event.deliveryMethod}</p>
                                </div>
                            ))
                        ) : (
                            <p>No events scheduled for this month</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Calendar;