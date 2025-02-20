import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";

const SearchBar = ({
  onSearch,
  placeholder = "Contract or Wallet Address...",
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
      <div className="relative flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-4 pr-12 py-2.5 bg-white/10 text-gray-600 placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
        />
        <button
          type="submit"
          className="absolute right-2 p-2 text-gray-600 bg-transparent hover:text-gray-600 border-none transition-colors"
          disabled={!searchQuery.trim()}
        >
          <BiSearch className="text-xl" />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
