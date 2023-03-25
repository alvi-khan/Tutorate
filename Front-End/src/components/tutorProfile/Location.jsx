import React, {useEffect, useState} from "react";
import {Autocomplete, TextField} from "@mui/material";

export const Location = (props) => {
    const [locations, setLocations] = useState([]);

    useEffect(async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/tutor/getAllLocations`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });
        setLocations(await res.json());
    }, [])

    return <Autocomplete
        defaultValue={props.defaultLocation}
        freeSolo={props.allowNewValues}
        renderInput={(params) => <TextField {...params} label="Location" required />}
        options={locations}
        onInputChange={(event, value) => {props.onLocationChange(value)}}
        fullWidth
    />
}