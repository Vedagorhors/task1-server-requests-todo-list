export const Sorting = ({ sortAsc, onSortToggle }) => {
	return (
		<button type="button" onClick={onSortToggle}>
			Сортировать {sortAsc ? 'Я-А' : 'А-Я'}
		</button>
	);
};
