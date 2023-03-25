import React, {useEffect, useState} from 'react';
import {Autocomplete, TextField} from "@mui/material";

export const Grades = (props) => {
    const [grades, setGrades] = useState([]);
    const [selection, setSelection] = useState(props.grades);

    const updateSelection = (newSelection) => {
        setSelection(newSelection);
        props.onGradeChange(newSelection);
    }

    useEffect(async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/tutor/getAllGrades`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });
        setGrades(await res.json());
    }, [])

    return <Autocomplete
        multiple
        freeSolo={props.allowNewValues}
        renderInput={(params) => <TextField {...params} label="Grades" required={props.required && selection.length === 0}/>}
        options={grades}
        defaultValue={selection}
        onChange={(event, values) => updateSelection(values)}
        fullWidth
        />
};
