import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';
import MenuBar from '../menuBar/menuBar'

const localizer = momentLocalizer(moment);

// example shift
const sampleEvents = [
  {
    title: 'Shift at Kitslano',
    start: new Date(2024, 7, 12, 10, 0),
    end: new Date(2024, 7, 12, 12, 0),
  },
  {
    title: 'Shift at Wharf',
    start: new Date(2024, 7, 13, 8, 0),
    end: new Date(2024, 7, 13, 16, 0),
  },
];

const roles = ['Role 1', 'Role 2', 'Role 3'];

const locations = [
  { value: '1', label: 'Location 1'},
  { value: '2', label: 'Location 2'},
  { value: '3', label: 'Location 3'},
]; 


const SupervisorCalendar = () => {

  const apiUrl = process.env.REACT_APP_API_URL;

  const [selectedDate, setSelectedDate] = useState(null);
  const [dropdown1Value, setDropdown1Value] = useState('choice1');
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [matchedDate, setMatchedDate] = useState(false);
  const [events, setEvents] = useState();
  
  const handleColumnChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
        setSelectedColumns([...selectedColumns, value]);
    } else {
        setSelectedColumns(selectedColumns.filter((col) => col !== value));
    }
  };

  const handleSelectSlot = (slotInfo) => {
    const clickedDate = slotInfo.start;
    if (selectedDate && moment(selectedDate).isSame(clickedDate, 'day')) {
      setSelectedDate(null);
    } else {
      setSelectedDate(clickedDate);
    }
  };

  useEffect(() => {
    const fetchShifts = async () => {

      console.log(apiUrl);

      try {
        const response = await fetch(`${apiUrl}/shifts`);
        const data = await response.json();

        if (data.success) {
          console.log(data.shifts);

          const fetchPositions = async (shift) => {
            try{
              const shiftDate = new Date(shift.SHIFT_DATE).toISOString().split('T')[0];
              console.log(shiftDate);

              const positionsResponse = await fetch(
                `${apiUrl}/shifts/positions?shiftDate=${encodeURIComponent(shiftDate)}`
              );

              const positionsData = await positionsResponse.json();
  
              let positionsTitle = '';

              if (positionsData.success) {
                const positions = positionsData.positions.map(pos => pos.pos_location).join(', ');
                positionsTitle = `${positions}`;
              }

              return positionsTitle;

            } catch (err) {
              console.error('Error fetching positions:', err);
            }
          }

          const formattedShifts = await Promise.all(data.shifts.map(async (shift) => {
            const positionsTitle = await fetchPositions(shift);
            
            return {
              title: `Shift at ${positionsTitle || 'Unknown'}`, 
              start: new Date(`${shift.SHIFT_DATE}`), 
              end: new Date(`${shift.SHIFT_DATE}`),
              allDay: true,
            };
          }));
  
          console.log(formattedShifts);
  
          setEvents(formattedShifts);
        } else {
          console.error('Failed to fetch shifts:', data.message);
        }
      } catch (err) {
        console.error('Error fetching shifts:', err);
      }
    };

    fetchShifts();
  }, [apiUrl]);


  useEffect(() => {
    console.log('Selected date updated:', selectedDate);

    if (selectedDate) {
      const eventFound = events.find(event =>
        moment(event.start).isSame(selectedDate, 'day')
      );

      if (eventFound) {
        console.log('Selected date matches an event:', eventFound);
        setMatchedDate(true);
      } else {
        console.log('Selected date does not match any events.');
        setMatchedDate(false);
      }
    }
  }, [selectedDate]);

  useEffect(() => {}, [matchedDate]);

  const dayPropGetter = (date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    const isSelected = selectedDate && moment(selectedDate).format('YYYY-MM-DD') === formattedDate;

    return {
      style: {
        backgroundColor: isSelected ? '#d3e4f1' : undefined,
      },
    };
  };

  const handleSubmit = () => {
    console.log(`Date: ${selectedDate ? moment(selectedDate).format('YYYY-MM-DD') : ''}`);
  };

  const handleDelete = async () => {
    let formattedDate = selectedDate ? moment(selectedDate).format('YYYY-MM-DD') : '';
    console.log(`Date to delete: ${formattedDate}`);
  
    if (formattedDate) {
      try {

        const response = await fetch(`${apiUrl}/shifts/${formattedDate}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {

          const data = await response.json();

          if (data.success) {
            console.log(`Shift on ${formattedDate} deleted successfully.`);
          } else {
            console.error(`Failed to delete shift: ${data.message}`);
          }

        } else {
          console.error(`Server responded with status ${response.status}`);
        }
      } catch (error) {
        console.error('Error deleting shift:', error);
      }
    }
  };
  

  return (
    <div className="calendar-container">
      <MenuBar />
      <div className="calendar-content">
        <div className="calendar">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            selectable
            onSelectSlot={handleSelectSlot}
            dayPropGetter={dayPropGetter}
            defaultView={Views.MONTH}
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          />
        </div>
        <div className="side-container">
          <p>
            <span className="attribute-name">Roles:</span>
            <div className="columns-scrollable">
                {roles.map((column, index) => (
                    <div key={index}>
                      <input
                          type="checkbox"
                          value={column}
                          onChange={handleColumnChange}
                          checked={selectedColumns.includes(column)}
                      />
                      <label>{column}</label>
                    </div>
                ))}
            </div>
          </p>
          <p>
            <span className="attribute-name">Location:</span>
            <select className="dropdown" onChange={(e) => setSelectedLocation(e.target.value)}>
              {locations.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </p>
          <p>
            <span className="attribute-name">Date:</span>
            <span className="value">{selectedDate ? moment(selectedDate).format('YYYY-MM-DD') : ''}</span>
          </p>
          {matchedDate ? 
            <button className="action-button" onClick={handleDelete}>Delete Shift</button>
            :
            <button className="action-button">Create Shift</button>
           }
        </div>
      </div>
    </div>
  );
};

export default SupervisorCalendar;