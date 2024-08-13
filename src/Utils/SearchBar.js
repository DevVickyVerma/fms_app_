import { useState } from 'react';
import { Link } from 'react-router-dom';
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from '@mui/icons-material/Search';


const SearchBar = ({ onSearch, onReset, placeholder, hideReset }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearch(searchTerm);
        }
    };

    const handleSearch = () => {
        onSearch(searchTerm);
    };

    const handleReset = () => {
        setSearchTerm('');
        onReset();
    };

    return (
        <div className="search-component d-flex gap-2 align-items-center ">
            <input
                type="text"
                className="search-input w-40 form-control"
                placeholder={placeholder || 'Search...'}
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
            <Link
                className="btn btn-primary  addclientbtn"
                onClick={handleSearch}
            >
                <SearchIcon />
            </Link>

            {hideReset && (
                <Link
                    className="btn btn-danger  addclientbtn"
                    onClick={handleReset}
                >
                    <RestartAltIcon />
                </Link>
            )}
        </div>
    );
};

export default SearchBar;
