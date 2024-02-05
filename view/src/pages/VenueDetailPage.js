import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function VenueDetailPage() {
  const [venueInfo, setVenueInfo] = useState({
    Name: '',
    Capacity: 0,
    Address: ''
  });

  const { bookName } = useParams();

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
          {/* Render the venue information */}
          <h2>{venueInfo.Name}</h2>
          {/* Additional JSX to display other details */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default VenueDetailPage;


