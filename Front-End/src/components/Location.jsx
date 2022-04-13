import React, {useEffect, useState} from "react";
import {Autocomplete, TextField} from "@mui/material";

export const Location = (props) => {
    const [locations, setLocations] = useState([]);

    useEffect(async () => {
        const res = await fetch(`http://localhost:8080/tutor/getAllLocations`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });
        setLocations(await res.json());
    })
    return <Autocomplete
        freeSolo={props.allowNewValues}
        renderInput={(params) => <TextField {...params} label="Location" required/>}
        options={locations}
        onChange={(event, value) => {props.onLocationChange(value)}}
        fullWidth
    />
}