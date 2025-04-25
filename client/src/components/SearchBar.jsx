const SearchBar = ({ searchQuery, setSearchQuery, setYearFilter, yearFilter, placeholderFiltro, yearNac, setYearNac, onSubmit }) => {

  return (
    <form className="search-sacramento" onSubmit={onSubmit}>
      <div className="form-search-sacramento" >
        <input
          type="search"
          placeholder="Ingrese el nombre"
          name="q"
          autoComplete="off"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </div>
      <div className="search-filters">
        {/* Filtrado por año de sacramento */}
        <input
          type="number"
          placeholder={placeholderFiltro}
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="filter"
        />
        {yearNac !== undefined && setYearNac && (
          <input
            type="number"
            placeholder="Año de nacimiento"
            value={yearNac}
            onChange={(e) => setYearNac(e.target.value)}
            className="filter"
          />
        )}
      </div>
    </form>
  );
}

export { SearchBar };
