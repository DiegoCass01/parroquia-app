const SearchBar = ({ searchQuery, setSearchQuery, setYearFilter, yearFilter, placeholderFiltro }) => {

  return (
    <div className="search-sacramento">
      <div className="form-search-sacramento" >
        <input
          type="search"
          placeholder="Ingrese el nombre"
          name="q"
          autoComplete="off"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="search-filters">
        {/* Filtrado por año */}
        <input
          type="number"
          placeholder={placeholderFiltro}
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="filter"
        />
      </div>
    </div>
  );
}

export { SearchBar };
