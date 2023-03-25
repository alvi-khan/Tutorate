import React, {useEffect, useState} from 'react';
import {Autocomplete, TextField} from "@mui/material";

export const Subjects = (props) => {

  const [subjects, setSubjects] = useState([]);
  const [selection, setSelection] = useState(props.subjects);

  const updateSelection = (newSelection) => {
    setSelection(newSelection);
    props.onSubjectChange(newSelection);
  }

  useEffect(async () => {
    const res = await fetch(`${window.location.protocol}//${window.location.hostname}:8080/tutor/getAllSubjects`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    setSubjects(await res.json());
  }, [])

  return <Autocomplete
      multiple
      freeSolo={props.allowNewValues}
      renderInput={(params) => <TextField {...params} label="Subjects" required={props.required && selection.length === 0}/>}
      options={subjects}
      defaultValue={selection}
      onChange={(event, values) => updateSelection(values)}
      fullWidth
  />
};
