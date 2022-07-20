import React from 'react';
import { Slider } from '@mui/material';

export const WageRange = (props) => {
  const marks = [
    { value: 0, label: '৳0.00' },
    { value: 10000, label: '৳10,000.00' },
  ];

  return (
    <Slider
      defaultValue={props.wages == null ? [0, 10000] : props.wages}
      onChange={(event, value) => {props.onWageChange(value)}}
      marks={marks}
      min={0}
      max={10000}
      valueLabelDisplay="on"
    />
  );
};
