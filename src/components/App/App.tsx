import { useState, useEffect } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import SearchBar from '../SearchBar/SearchBar'
import MovieGrid from '../MovieGrid/MovieGrid'
import { fetchMovies } from '../../services/movieService'
import toast, { Toaster } from 'react-hot-toast'
import type { Movie } from '../../types/movie'
import './App.module.css'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import MovieModal from '../MovieModal/MovieModal'
import Loader from '../Loader/Loader'
import ReactPaginate from '../ReactPaginate/ReactPaginate';

export default function App() {
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1); 
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { 
    data, 
    isLoading, 
    isError, 
    isSuccess 
  } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.length > 0,
    retry: 1, 
    placeholderData: keepPreviousData,
  });

  const movies = data?.results || [];
  const pageCount = data?.total_pages || 0;

  useEffect(() => {
  if (isSuccess && movies.length === 0 && query.length > 0) {
    toast.error("No movies found for your request", {
      position: 'top-right',
      duration: 3000,
    });
  }
}, [isSuccess, movies.length, query]); 

  const handleSearchSubmit = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  return (
    <>
      <SearchBar onSubmit={handleSearchSubmit} />
       
      {movies.length > 0 && pageCount > 1 && (
        <ReactPaginate
          pageCount={pageCount}
          onPageChange={page}
          forcePage={setPage}
        />
      )}

      <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      {selectedMovie && (
        <MovieModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}
      
      <main>
        {isError && <ErrorMessage />}
        {isLoading && <Loader />}

        {/* {isFetched && movies.length === 0 && !isLoading && (
          <p>No movies found for your request</p>
        )} */}
      </main>

      <Toaster />
    </>
  )
}
