import React, {useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../stylesheets/ChatRoom.css";
import {useStateContext} from "../../contexts/StateContextProvider";
import {ContactList} from "./ContactList";
import {Link} from "react-router-dom";
import TextField from "@mui/material/TextField";
import {Avatar} from "@mui/material";
import {useChatContext} from '../../contexts/ChatContextProvider';

export const ChatRoom = () => {
    const {user} = useStateContext();
    const {messages, sendMessage, contactData, receiver} = useChatContext();
    const [input, setInput] = useState("");

    const handleMessage = (event) => {
        const {value} = event.target;
        setInput(value);
    }

    const handleSend = () => {
        sendMessage(input);
        setInput("");
    }

    return (
        <div className="chat-box">
            {messages.size !== 0 && <ContactList />}

            {messages.size === 0 &&
                <div className="flex-grow chat-content">
                    <div className="default-text">
                        <i className="bi bi-chat-left-fill"/>
                        <p>Conversations with tutors will appear here.</p>
                        <Link to={{pathname: "/"}}>
                            <button className="button mt-4" type="submit">
                                <i className="icon bi bi-search mr-1" />
                                &nbsp;Explore
                            </button>
                        </Link>
                    </div>
                </div>
            }

            {messages.size !== 0 && !receiver &&
                <div className="flex-grow chat-content">
                    <div className="default-text">
                        <i className="bi bi-chat-left-fill"/>
                        <p>Select a contact to start viewing messages.</p>
                    </div>
                </div>
            }
            {receiver && messages.get(receiver.id) &&
                <div className="flex-grow chat-content">
                    <ul className="flex-grow chat-messages">
                        {[...messages.get(receiver.id)].sort((a, b) => a.id - b.id).map((chat,index) => {
                            const senderData = contactData.get(chat.senderID);

                            return (
                                <li className={`message ${chat.senderID === user.id && "self"}`} key={index}>
                                    {
                                        chat.senderID !== user.id &&
                                        senderData && senderData.tutor && senderData.tutor.image &&
                                        <Avatar src={`${process.env.REACT_APP_BASE_URL}${senderData.tutor.image}`}/>
                                    }
                                    {
                                        chat.senderID != user.id &&
                                        (
                                            senderData && senderData.tutor && !senderData.tutor.image ||
                                            senderData && !senderData.tutor
                                        ) &&
                                        <Avatar>{senderData.username[0]}</Avatar>
                                    }
                                    {
                                        chat.senderID != user.id &&
                                        !senderData &&
                                        <Avatar/>
                                    }
                                    {
                                        chat.senderID != user.id &&
                                        <div className="message-data">{chat.message}</div>
                                    }
                                    {
                                        chat.senderID == user.id &&
                                        <div className="message-data">
                                            {chat.message}
                                            {chat.status == "SENT" && <i className="bi bi-check"/>}
                                            {chat.status == "DELIVERED" && <i className="bi bi-check-circle"/>}
                                            {chat.status == "READ" && <i style={{color: "#5EBCD7"}} className="bi bi-check-circle-fill"/>}
                                        </div>
                                    }
                                </li>
                            );
                        })}
                    </ul>
                <div className="send-message">
                    <TextField
                        placeholder="Type a message..."
                        fullWidth
                        value={input}
                        onChange={handleMessage}
                        onKeyPress={(e) => {if (e.key === 'Enter') handleSend();}}
                    />
                    <button type="button" className="send-button" onClick={handleSend}>
                        <i className="bi bi-send"/>
                    </button>
                </div>
            </div>}
        </div>
    )
}