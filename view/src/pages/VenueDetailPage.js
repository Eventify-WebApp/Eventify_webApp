import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';


function VenueDetailPage() {
  const [venueInfo, setVenueInfo] = useState({
    Name: '',
    Capacity: 0,
    Address: ''
  });

  const { bookName } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log('Selected date:', date); // You can perform further actions based on the selected date
  };


  useEffect(() => {
    async function getVenueInfo() {
      try {
        const response = await axios.get(`/venue/${bookName}`, {
          headers: { 'token': localStorage.getItem('Spectator-Token') },
        });

        // Destructure directly in the state update
        setVenueInfo({ ...response.data.venueData[0] });
      } catch (error) {
        console.error(error);
        // Handle errors (e.g., set an error state)
      }
    }

    // Call the function
    getVenueInfo();

    // Cleanup logic (if needed)
    return () => {
      // Cleanup logic (if needed)
    };
  }, [bookName]);

  


  
  return (
    <div className='VenuePage'>
      {venueInfo ? (
        <div>
          <h2>{venueInfo.Name}</h2>
          {/* Render the calendar and time picker */}
      <Calendar onChange={handleDateChange} value={selectedDate} />
          {/* Additional JSX to display other details */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default VenueDetailPage;



