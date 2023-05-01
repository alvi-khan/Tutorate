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
    const [receiver, setReceiver] = useState(location.state ? location.state.receiver : "");
    const [connected, setConnected] = useState(false);
    const [input, setInput] = useState("");
    const [userAvatars, setUserAvatars] = useState(new Map());

    useEffect(async () => {
        connect();
    }, [])

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
        stompClient.subscribe('/user/' + user.username + '/private', onPrivateMessage);
        userJoin();
    }

    const downloadAvatar = async (user, image) => {
        if (userAvatars.get(user))  return;

        const avatar = <Avatar src={`${process.env.REACT_APP_BASE_URL}${image}`}/>
        userAvatars.set(user, avatar);
        setUserAvatars(new Map(userAvatars));
    }

    const userJoin = async () => {
          let chatMessage = {
            senderName: user.username,
            status: "JOIN"
          };
          stompClient.send("/app/message", {}, JSON.stringify(chatMessage));

          const res = await fetch(`${process.env.REACT_APP_BASE_URL}/message/prefetch?name=${user.username}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          });

          const data = await res.json();
          data.map((item, index) => {
              if (item.senderImage != null && item.senderImage != "") {
                downloadAvatar(item.senderName, item.senderImage);
              }
              let key = item.senderName === user.username ? item.receiverName : item.senderName;
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

          if (receiver !== "" && !messages.get(receiver)) {
              messages.set(receiver, []);
              setMessages(new Map(messages));
          }
    }
    
    const onPrivateMessage = (payload) => {
        if(payload.status != "OTHERS") {
            var payloadData = JSON.parse(payload.body);
            if(messages.get(payloadData.senderName)) {
                messages.get(payloadData.senderName).push(payloadData);
                setMessages(new Map(messages));
            }
            else {
                let list = [];
                list.push(payloadData);
                messages.set(payloadData.senderName, list);
                setMessages(new Map(messages));
            }
        }
        else {
            if(!messages.get(payloadData.senderName)) {
                messages.set(payloadData.senderName,[]);
                setMessages(new Map(messages));
            }
        }
    }

    const handleMessage = (event) => {
        const {value} = event.target;
        setInput(value);
    }

    const sendMessage = async() => {
        if (stompClient) {
            var chatMessage = {
                senderName: user.username,
                receiverName: receiver,
                message: input,
                status: "MESSAGE",
                senderImage: user.tutor ? user.tutor.image : null
            };
            if(user.username !== receiver) {
                messages.get(receiver).push(chatMessage);
                setMessages(new Map(messages));
            }
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
            setInput("");
        }
    }

    return (
        <div className="chat-box">
            {messages.size !== 0 &&
                <ContactList contacts={[ ...messages.keys()]} avatars={userAvatars} currentContact={receiver} selectContact={setReceiver}/>
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

            {messages.size !== 0 && receiver === "" &&
                <div className="flex-grow chat-content">
                    <div className="default-text">
                        <i className="bi bi-chat-left-fill"/>
                        <p>Select a contact to start viewing messages.</p>
                    </div>
                </div>
            }
            {receiver !== "" && messages.get(receiver) &&
                <div className="flex-grow chat-content">
                    <ul className="flex-grow chat-messages">
                        {[...messages.get(receiver)].map((chat,index)=>(
                            <li className={`message ${chat.senderName === user.username && "self"}`} key={index}>
                                {chat.senderName !== user.username &&
                                    (userAvatars.get(chat.senderName) ||
                                    <Avatar>{chat.senderName[0]}</Avatar>)
                                }
                                <div className="message-data">{chat.message}</div>
                            </li>
                        ))}
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