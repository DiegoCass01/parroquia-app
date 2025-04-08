const SearchBar = ({ sacramento, searchQuery, setSearchQuery, setFilterParam, fechaField }) => {
  return (
    <div className="search-sacramento">
      <form className="form-search-sacramento">
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
        <select
          onChange={(e) => setFilterParam(e.target.value)}
          className="filter"
          defaultValue={"Placeholder"} // <-- Aquí se controla la opción seleccionada
        >
          <option value="Placeholder" disabled hidden>Año de sacramento</option>
          <option value="All">Todos los años</option>
          {[...new Set(
            sacramento
              .map((item) => new Date(item[fechaField]).getFullYear()) // Extrae el año dinámicamente basado en el campo de fecha
          )]
            .sort((a, b) => b - a) // Ordena los años en orden descendente
            .map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}

export { SearchBar };
