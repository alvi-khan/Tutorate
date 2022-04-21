import {useState} from "react";
import {Avatar, List, ListItem, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";

export const ContactList = (props) => {

    const getSelectedColor = (contact) => {
        if (props.currentContact == contact)    return "#ececec";
    }

    return(
        <List sx={{ width: '100%', maxWidth: 360 }}>
            {props.contacts.map((contact, index) => {
                return (
                    <ListItem key={index} onClick={() => props.selectContact(contact)}>
                        <ListItemButton style={{backgroundColor: getSelectedColor(contact), borderRadius: 10}}>
                            <ListItemAvatar>
                                <Avatar src={`/profile.png`}/>
                            </ListItemAvatar>
                            <ListItemText id={index} primary={contact} />
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
}