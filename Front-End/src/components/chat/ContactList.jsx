import {Avatar, Badge, List, ListItem, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import {useStateContext} from "../../contexts/StateContextProvider";
import {useChatContext} from "../../contexts/ChatContextProvider";

export const ContactList = (props) => {

    const {user} = useStateContext();
    const {contactData} = useChatContext();

    const getSelectedColor = (contact) => {
        if (props.currentContact && props.currentContact.id == contact.id)    return "#ececec";
    }

    return(
        <List sx={{ width: '100%', maxWidth: 360 }}>
            {[...contactData.keys()].filter(id => id != user.id).map((id, index) => {
                const contact = contactData.get(id);
                const online = contact.keepAliveCount != 0;
                return (
                    <ListItem key={index} onClick={() => props.selectContact(contact)}>
                        <ListItemButton style={{backgroundColor: getSelectedColor(contact), borderRadius: 10}}>
                            <ListItemAvatar>
                            {
                                contact.tutor &&
                                contact.tutor.image &&
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    variant="dot"
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            backgroundColor: online ? '#44b700' : 'rgb(55, 65, 81)',
                                            color: online ? '#44b700' : 'rgb(55, 65, 81)',
                                            boxShadow: `0 0 0 2px #ffffff`,
                                        }
                                    }}
                                >
                                    <Avatar src={`${process.env.REACT_APP_BASE_URL}${contact.tutor.image}`}/>
                                </Badge>
                            }
                            {
                                (!contact.tutor || !contact.tutor.image) &&
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    variant="dot"
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            backgroundColor: online ? '#44b700' : 'rgb(55, 65, 81)',
                                            color: online ? '#44b700' : 'rgb(55, 65, 81)',
                                            boxShadow: `0 0 0 2px #ffffff`,
                                        }
                                    }}
                                >
                                    <Avatar>{contact.username[0]}</Avatar>
                                </Badge>
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