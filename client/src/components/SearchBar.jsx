const SearchBar = ({ searchQuery, setSearchQuery, setYearFilter, yearFilter, placeholderFiltro }) => {

  return (
    <div className="search-sacramento">
      <form className="form-search-sacramento" onSubmit={(e) => e.preventDefault()}>
        <input
          type="search"
          placeholder="Ingrese el nombre"
          name="q"
          autoComplete="off"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
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
