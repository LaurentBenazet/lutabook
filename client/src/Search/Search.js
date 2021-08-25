import React from "react";
import "./Search.css";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";

class Search extends React.Component {
  render() {
    return (
      <div className="search">
        <TextField
          label="Search on Lutabook"
          InputProps={{
            endAdornment: (
              <InputAdornment position="right">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </div>
    );
  }
}

export default Search;