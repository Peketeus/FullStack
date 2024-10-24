const Filter = ({ filterName, handleFilter }) => {
    return (
        <div>
            filter shown with: 
            <input value={filterName}onChange={handleFilter}/>
        </div>
    )
}

export default Filter