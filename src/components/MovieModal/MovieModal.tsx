import { useEffect, type MouseEvent } from 'react';
import { createPortal } from "react-dom";
import type { Movie } from '../../types/movie';
import css from './MovieModal.module.css';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!movie) return null;

  return createPortal(
    <div 
      className={css.backdrop} 
      onClick={handleBackdropClick} 
    >
      <div className={css.modal}>
        <button 
          className={css.closeButton} 
          onClick={onClose} 
          aria-label="Close modal"
        >
          &times;
        </button>

          <img
            className={css.image}
            src={movie.backdrop_path 
                ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` 
                : 'https://placeholder.com'}
            alt={movie.title}
        />

        <div className={css.content}>
          <h2 className={css.title}>{movie.title}</h2>
          
          <div className={css.info}>
            <p className={css.title}><b>Рейтинг:</b> {movie.vote_average}</p>
            <p className={css.title}><b>Дата виходу:</b> {movie.release_date}</p>
          </div>

          <p className={css.overview}>{movie.overview}</p>
        </div>
      </div>
    </div>,
    document.body
  );
}
