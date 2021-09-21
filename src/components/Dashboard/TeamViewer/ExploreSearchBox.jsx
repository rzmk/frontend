import * as React from "react";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";

function ExploreSearchSimple(props) {
    return (
        <Box
            component="form"
            sx={{
                mt: 5
            }}
            noValidate
            autoComplete="off"
            onChange={(e) => {
                props.setSearchText(e.target.value);
            }}
        >
            <TextField id="outlined-basic"
                label="Search for a team"
                variant="outlined" />
        </Box>
    );
}

ExploreSearchSimple.propTypes = {
    setSearchText: PropTypes.func
};

export default ExploreSearchSimple;