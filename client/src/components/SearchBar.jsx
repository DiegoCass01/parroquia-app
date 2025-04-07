const SearchBar = ({ bautizos, searchQuery, setSearchQuery, setFilterParam }) => {
  return (
    <div className="search-bautizo">
      <form className="form-search-bautizo">
        <input type="search" placeholder="Ingrese el nombre" name="q" autoComplete="off" value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} />
      </form>
      <div className="search-filters">
        {/* Filtrado por año */}
        <select
          onChange={(e) => setFilterParam(e.target.value)}
          className="filter"
          defaultValue={"Placeholder"} // <-- Aquí se controla la opción seleccionada
        >
          <option value="Placeholder" disabled hidden>Año de bautizo</option>
          <option value="All">Todos los años</option>
          {[
            ...new Set(
              bautizos
                .map((bautizo) => new Date(bautizo.fecha_bautizo).getFullYear()) // Extrae solo el año
            ),
          ]
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