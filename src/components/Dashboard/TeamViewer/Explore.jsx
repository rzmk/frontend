import React, { useState, useEffect } from "react";
import { List, Grid, Typography } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";

import PropTypes from "prop-types";
import TeamLoading from "../TeamLoading";

import RenderRow from "./RenderRow";
import ExploreSearchBox from "./ExploreSearchBox";

function Explore(props) {
    const [matches, setMatches] = useState({});
    const [searchMatches, setSearchMatches] = useState([]);
    const [originalTeamId, setOriginalTeam] = useState({});
    const [page, setPage] = React.useState(1);
    const [allTeams, setAllTeams] = useState({});
    const [loading, setLoading] = useState("Loading your matches...");
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        props.profile.getTeamUser().then((success) => {
            const team_id = success.response.team_id;
            setOriginalTeam(success.response.team_id);
            props.profile.matches(team_id).then((success) => {
                setMatches(success.response);
                setSearchMatches(success.response.matches);
                props.profile.getAllTeams(0, 4).then((success) => {
                    setAllTeams(success.response);
                    setLoading(false);
                });
            });
        });
    }, []);

    /*
    * Search Box Functionality
    * On each letter change, setSearchMatches with filter
    * Based on initial page load matches
    */
    useEffect(() => {
        try {
            const checkMatch = (match) => {
                const lowerMatch = match.name.toLowerCase();
                const upperMatch = match.name.toUpperCase();
                if (lowerMatch.includes(searchText.toLowerCase()))
                    return lowerMatch.includes(searchText.toLowerCase());
                else if (upperMatch.includes(searchText.toUpperCase()))
                    return upperMatch.includes(searchText.toUpperCase());
            };
            setSearchMatches(matches.matches.filter(checkMatch));
        } catch (error) {
            console.error(error);
        }
    }, [searchText]);

    const onInvite = async (id) => {
        // let all_teams = await props.profile.getAllTeams(((page - 1) * 4), 4);
        setAllTeams(prevState => ({
            ...prevState,
            all_open_teams: prevState.all_open_teams.filter(el => el !== id)
        }));
        setMatches(prevState => ({
            ...prevState,
            matches: prevState.matches.filter(el => el !== id)
        }));
    };

    const handlePagination = async (event, value) => {
        setPage(value);
        let all_teams = await props.profile.getAllTeams(((value - 1) * 4), 4);
        setAllTeams(all_teams.response);
    };
    if (loading) {
        return (<TeamLoading text={loading} />);
    }
    return (
        <Grid item
            container
            direction="column"
            justify="center"
            alignItems="center"
            style={{marginTop: "2em"}}>
            {/* <ExploreSearch options={matches}
                setSearchText={setSearchText}
            /> */}
            <ExploreSearchBox setSearchText={setSearchText} />
            <Typography variant="h5"
                style={{ marginTop: "2em" }}>
                Matches
            </Typography>
            <List
                style={{ maxHeight: "300px", width: "600px", overflow: "auto" }}
                className="no-scrollbars no-style-type"
            >
                {searchMatches && searchMatches.length > 0 ? (
                    searchMatches.map((invitingTeamId, i) => (
                        <RenderRow
                            index={invitingTeamId}
                            key={invitingTeamId+i}
                            invitingTeam={invitingTeamId}
                            originalTeamId={originalTeamId}
                            onInvite={onInvite}
                            {...props}
                        />
                    ))
                ) : (
                    <Typography variant="subtitle1">No Matches Yet</Typography>
                )}
            </List>
            {/* <Pagination
                count={Math.ceil(allTeams.total_teams / 4)}
                variant="outlined"
                page={page}
                onChange={handlePagination}
                shape="rounded"
            /> */}
            <Typography variant="h5">All Teams</Typography>
            <List
                style={{ maxHeight: "300px", width: "600px", overflow: "auto" }}
                className="no-scrollbars no-style-type"
            >
                {allTeams.all_open_teams && allTeams.all_open_teams.length > 0 ? (
                    allTeams.all_open_teams.map((invitingTeamId, i) => (
                        <RenderRow
                            index={invitingTeamId}
                            key={invitingTeamId+i}
                            invitingTeam={invitingTeamId}
                            originalTeamId={originalTeamId}
                            onInvite={onInvite}
                            {...props}
                        />
                    ))
                ) : (
                    <Typography variant="subtitle1">No Teams Yet</Typography>
                )}
            </List>
            <Pagination
                count={Math.ceil(allTeams.total_teams / 4)}
                variant="outlined"
                page={page}
                onChange={handlePagination}
                shape="rounded"
            />
        </Grid>
    );
}
Explore.propTypes = {
    invitingTeam: PropTypes.object,
    originalTeamId: PropTypes.string,
    profile: PropTypes.object,
};

export default Explore;