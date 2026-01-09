import "../Styles/SearchBar.css";

function SearchBar() {
  return (
    <div className="search-container">
      <input type="text" placeholder="City or Location" />
      <input type="text" placeholder="Service Type" />
      <button>🔍</button>
    </div>
  );
}

export default SearchBar;
