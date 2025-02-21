import React from "react";
import { BiSearch } from "react-icons/bi";

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  isLoading,
  activeMode,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="w-full relative group">
    <div className="absolute inset-0 bg-gradient-to-r from-[#ED6A5A] to-[#ef5e4b] rounded-2xl blur opacity-25 group-hover:opacity-40 transition-all duration-300"></div>
    <div className="relative flex items-center">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={
          activeMode === "scan"
            ? "Enter contract to scan..."
            : "Enter contract to report..."
        }
        className="w-full pl-5 pr-14 py-4 bg-[#8AA6A3] text-white placeholder-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ED6A5A] transition-all shadow-inner"
      />
      <button
        type="submit"
        disabled={!searchQuery.trim() || isLoading}
        className="absolute right-2.5 w-10 h-10 flex items-center justify-center text-white disabled:opacity-50 bg-[#ED6A5A] rounded-xl hover:bg-[#ef5e4b] transition-all duration-300 disabled:hover:bg-[#ED6A5A]"
      >
        <BiSearch className="text-xl" />
      </button>
    </div>
  </form>
);

export default SearchBar;
