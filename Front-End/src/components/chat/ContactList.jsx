import {Avatar, List, ListItem, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import {useStateContext} from "../../contexts/StateContextProvider";

export const ContactList = (props) => {

    const {user} = useStateContext();

    const getSelectedColor = (contact) => {
        if (props.currentContact && props.currentContact.id == contact.id)    return "#ececec";
    }

    return(
        <List sx={{ width: '100%', maxWidth: 360 }}>
            {[...props.userData.keys()].filter(id => id != user.id).map((id, index) => {
                const contact = props.userData.get(id);
                return (
                    <ListItem key={index} onClick={() => props.selectContact(contact)}>
                        <ListItemButton style={{backgroundColor: getSelectedColor(contact), borderRadius: 10}}>
                            <ListItemAvatar>
                            {
                                contact.tutor &&
                                contact.tutor.image &&
                                <Avatar src={`${process.env.REACT_APP_BASE_URL}${contact.tutor.image}`}/>
                            }
                            {
                                (!contact.tutor || !contact.tutor.image) &&
                                <Avatar>{contact.username[0]}</Avatar>
                            }
                            </ListItemAvatar>
                            <ListItemText id={index} primary={contact.username} />
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
}