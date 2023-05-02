import React, {useEffect, useState} from 'react'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../stylesheets/ChatRoom.css";
import {useStateContext} from "../../contexts/StateContextProvider";
import {ContactList} from "./ContactList";
import {Link, useLocation} from "react-router-dom";
import TextField from "@mui/material/TextField";
import {Avatar} from "@mui/material";

var stompClient = null;
export const ChatRoom = () => {
    const location = useLocation();
    const {user} = useStateContext();
    const [messages, setMessages] = useState(new Map());
    const [receiver, setReceiver] = useState(location.state ? location.state.receiver : null);
    const [connected, setConnected] = useState(false);
    const [input, setInput] = useState("");
    const [userData, setUserData] = useState(new Map());

    useEffect(async () => {
        connect();
    }, [])

    useEffect(() => {
        if (receiver)   downloadUserData(receiver.id);
    }, [receiver])

    const connect = () => {
        let Sock = new SockJS(`${process.env.REACT_APP_BASE_URL}/ws`);
        stompClient = over(Sock);
        stompClient.debug = null;   // disable log messages
        stompClient.connect({}, onConnected, onError);
    }

    const onError = (err) => {
        console.log(err);
    }

    const onConnected = () => {
        setConnected(true);
        stompClient.subscribe(`/userMessages/${user.id}/`, onNewMessage);
        userJoin();
    }

    const downloadUserData = async (userID) => {
        if (userData.get(userID))  return;

        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/${userID}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });
        userData.set(userID, await res.json());
        setUserData(new Map(userData));
    }

    const userJoin = async () => {
          const res = await fetch(`${process.env.REACT_APP_BASE_URL}/message/getMessages?userID=${user.id}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          });

          const data = await res.json();
          data.map((item, index) => {
              downloadUserData(item.senderID);
              let key = item.senderID === user.id ? item.receiverID : item.senderID;
              if(messages.get(key)) {
                  messages.get(key).push(item);
                  setMessages(new Map(messages));
              }
              else {
                  let list = [item];
                  messages.set(key, list);
                  setMessages(new Map(messages));
              }
          });

          if (receiver && !messages.get(receiver.id)) {
              messages.set(receiver.id, []);
              setMessages(new Map(messages));
          }
    }
    
    const onNewMessage = (payload) => {
        var payloadData = JSON.parse(payload.body);
        downloadUserData(payloadData.senderID);
        if(messages.get(payloadData.senderID)) {
            messages.get(payloadData.senderID).push(payloadData);
            setMessages(new Map(messages));
        }
        else {
            let list = [];
            list.push(payloadData);
            messages.set(payloadData.senderID, list);
            setMessages(new Map(messages));
        }
    }

    const handleMessage = (event) => {
        const {value} = event.target;
        setInput(value);
    }

    const sendMessage = async() => {
        if (!stompClient)   return;
        var chatMessage = {
            senderID: user.id,
            receiverID: receiver.id,
            message: input,
            status: "SENT"
        };

        if(user.id !== receiver.id) {
            messages.get(receiver.id).push(chatMessage);
            setMessages(new Map(messages));
        }

        stompClient.send("/chat/messages", {}, JSON.stringify(chatMessage));
        setInput("");
    }

    return (
        <div className="chat-box">
            {messages.size !== 0 &&
                <ContactList userData={userData} currentContact={receiver} selectContact={setReceiver}/>
            }

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
                        {[...messages.get(receiver.id)].map((chat,index) => {
                            const senderData = userData.get(chat.senderID);

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
                                    <div className="message-data">{chat.message}</div>
                                </li>
                            );
                        })}
                    </ul>
                <div className="send-message">
                    <TextField placeholder="Type a message..." fullWidth value={input} onChange={handleMessage}
                    onKeyPress={(e) => {if (e.key === 'Enter') {sendMessage()}}}/>
                    <button type="button" className="send-button" onClick={sendMessage}>
                        <i className="bi bi-send"/>
                    </button>
                </div>
            </div>}
        </div>
    )
}