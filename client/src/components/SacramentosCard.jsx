
const SacramentosCard = ({ name, handleNavigate, title }) => {
  return (
    <button className="btn-navigate" name={name} onClick={handleNavigate}>
      <h1 className="btn-title">{title}</h1>
    </button>
  )
}
export { SacramentosCard }