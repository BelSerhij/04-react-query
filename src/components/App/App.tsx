import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import SearchBar from '../SearchBar/SearchBar'
import MovieGrid from '../MovieGrid/MovieGrid'
import { fetchMovies } from '../../services/movieService'
import { Toaster } from 'react-hot-toast'
import type { Movie } from '../../types/movie'
import './App.module.css'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import MovieModal from '../MovieModal/MovieModal'
import Loader from '../Loader/Loader'
import Pagination from '../ReactPaginate/ReactPaginate';

export default function App() {
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1); 
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { 
    data, 
    isLoading, 
    isError, 
    isFetched,
    // isSuccess 
  } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.length > 0,
    retry: 1, 
    placeholderData: keepPreviousData,
  });

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  const handleSearchSubmit = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  return (
    <>
      <SearchBar onSubmit={handleSearchSubmit} />
       
      {movies.length > 0 && totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          page={page}
          setPage={setPage}
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

        {isFetched && movies.length === 0 && !isLoading && (
          <p>No movies found for your request</p>
        )}
      </main>

      <Toaster />
    </>
  )
}
