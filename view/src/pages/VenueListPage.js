import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

function useBookSearch(pageNumber, selectedCity) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);

      try {
        const response = await axios.post(
          '/venue/list',
          {
            pageNumber: pageNumber,
            pageSize: 15,
            City: selectedCity,
            token: localStorage.getItem('Spectator-Token'),
          },
          { withCredentials: true }
        );
        
        setBooks(prevBooks => [...new Set([...prevBooks, ...response.data])]);

        //setBooks(prevBooks => [...new Set([...prevBooks, ...response.data.map(b => b.Name)])]);
        setHasMore(response.data.length > 0);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [pageNumber, selectedCity]); // Include selectedCity in the dependency array

  useEffect(() => {
    // Clear books when selectedCity changes
    setBooks([]);
  }, [selectedCity]);

  return { loading, error, books, hasMore };
}




function VenueListPage() {
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedCity, setSelectedCity] = useState('All');
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const citiesData = await axios.post('/venue/list/city', { token: localStorage.getItem("Spectator-Token")}, { withCredentials: true });
        setCities(citiesData.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCities();
  }, []); // Run once when the component mounts

  const {
    books,
    hasMore,
    loading,
    error
  } = useBookSearch(pageNumber, selectedCity);

  const observer = useRef();

  const lastBookElementRef = useCallback(
    (node) => {

      
      if (loading) return;

      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && node === entries[0].target) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });

      if (node) observer.current.observe(node);

      return () => {
        if (node) observer.current.unobserve(node);
      };
    },
    [loading, hasMore, setPageNumber]
  );

  // Reset pageNumber when selectedCity changes
  const handleCityChange = (value) => {
    setPageNumber(1);
    setSelectedCity(value);
  };


console.log(books)
  return (
    <div className='venue-container'>
      <div className='Filter'>
        <div>Filter by city:</div>
        <select className='venue-element' value={selectedCity} onChange={(e) => handleCityChange(e.target.value)}>
          {cities.map((c, index) => (<option key={index} value={c.City}>{c.City}</option>))}
        </select>
      </div>
      <div className='content-section'>
        {books.map((book, index) => {
          
          const key = `${book.ID}-${index}`; // Assuming `id` is a unique identifier for each book

          if (books.length === index + 1) {
            return <Link  to={`/venue/${book.Name}`} key ={key} className="custom-link"><div className='venue-list' ref={lastBookElementRef} key={key}>{book.Capacity}</div></Link>;
          } else {
            return <Link  to={`/venue/${book.Name}`} key ={key} className="custom-link"><div className='venue-list' key={key}>{book.Name}</div></Link>;
          }
        })}
        <div>{loading && 'Loading...'}</div>
        <div>{error && 'Error'}</div>
      </div>
    </div>
  );
}

export default VenueListPage;





