// src/pages/home-page/components/search/Search.jsx
import styles from './search.module.css';

export const Search = ({ search, onSearchChange }) => {
	return (
		<div className={styles.searchContainer}>
			<input
				type="text"
				className={styles.searchInput}
				placeholder="Поиск по задачам"
				value={search}
				onChange={onSearchChange}
			/>
		</div>
	);
};
