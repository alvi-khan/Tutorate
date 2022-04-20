import React, { useEffect, useState } from 'react'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../stylesheets/ChatRoom.css";

var stompClient = null;
export const ChatRoom = () => {
    const [privateChats, setPrivateChats] = useState(new Map());     
    const [publicChats, setPublicChats] = useState([]);
    const [tab, setTab] = useState("CHATROOM");
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: ''
      });

    const connect = () => {
        let Sock = new SockJS('http://localhost:8080/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }

    const onError = (err) => {
        console.log(err);
    }

    const onConnected = () => {
        setUserData({...userData, "connected": true});
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe('/user/' + userData.username + '/private', onPrivateMessage);
        userJoin();
    }

    const userJoin = async () => {
          var chatMessage = {
            senderName: userData.username,
            status: "JOIN"
          };
          stompClient.send("/app/message", {}, JSON.stringify(chatMessage));

          const res = await fetch(`http://localhost:8080/message/prefetch?name=${userData.username}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          });

          const data = await res.json();

          var all = data.map(function(item, index) {
              if(userData.username != item.senderName) {
                  if(privateChats.get(item.senderName)) {
                      privateChats.get(item.senderName).push(item);
                      setPrivateChats(new Map(privateChats));
                  }
                  else {
                      let list =[];
                      list.push(item);
                      privateChats.set(item.senderName,list);
                      setPrivateChats(new Map(privateChats));
                  }
              }
              else if(userData.username == item.senderName) {
                  if(privateChats.get(item.receiverName)) {
                      privateChats.get(item.receiverName).push(item);
                      setPrivateChats(new Map(privateChats));
                  }
                  else {
                      let list =[];
                      list.push(item);
                      privateChats.set(item.receiverName,list);
                      setPrivateChats(new Map(privateChats));
                  }
              }
          });
    }

    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        switch(payloadData.status) {
            case "JOIN":
                if(!privateChats.get(payloadData.senderName)) {
                    privateChats.set(payloadData.senderName, []);
                    setPrivateChats(new Map(privateChats));
                }
                var chatMessage = {
                    senderName: userData.username,
                    receiverName:payloadData.senderName,
                    message: userData.message,
                    status:"OTHERS"
                  };
                  stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));   
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
        }
    }
    
    const onPrivateMessage = (payload) => {
        if(payload.status != "OTHERS") {
            var payloadData = JSON.parse(payload.body);
            if(privateChats.get(payloadData.senderName)) {
                privateChats.get(payloadData.senderName).push(payloadData);
                setPrivateChats(new Map(privateChats));
            }
            else {
                let list = [];
                list.push(payloadData);
                privateChats.set(payloadData.senderName, list);
                setPrivateChats(new Map(privateChats));
            }
        }
        else {
            if(!privateChats.get(payloadData.senderName)) {
                privateChats.set(payloadData.senderName,[]);
                setPrivateChats(new Map(privateChats));
            }
        }
    }

    const handleMessage = (event) => {
        const {value} = event.target;
        setUserData({...userData,"message": value});
    }

    const sendValue = () => {
        if (stompClient) {
            var chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status: "MESSAGE"
              };
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({...userData,"message": ""});
        }
    }

    const sendPrivateValue = async() => {
        const res = await fetch(`http://localhost:8080/user/checkSession?username=${userData.username}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });

        const check = await res.json();
        if(check == true) {
            if (stompClient) {
                var chatMessage = {
                    senderName: userData.username,
                    receiverName: tab,
                    message: userData.message,
                    status: "MESSAGE"
                };
                if(userData.username !== tab) {
                    privateChats.get(tab).push(chatMessage);
                    setPrivateChats(new Map(privateChats));
                }
                stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
                setUserData({...userData,"message": ""});
            }
        }
    }

    const handleUsername = (event) => {
        const {value} = event.target;
        setUserData({...userData, "username": value});
    }
 
    const registerUser = async() => {
        const res = await fetch(`http://localhost:8080/user/checkSession?username=${userData.username}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });

        const check = await res.json();
        if(check == true) connect();
    }

    useEffect(async () => {
        await registerUser();
    }, [])
    
    return (
        <div className="chat-box">
            <div className="member-list">
                <ul>
                    <li onClick={()=>{setTab("CHATROOM")}} className={`member ${tab==="CHATROOM" && "active"}`}>Chatroom</li>
                    {[...privateChats.keys()].map((name,index)=>(
                        <li onClick={()=>{setTab(name)}} className={`member ${tab===name && "active"}`} key={index}>{name}</li>
                    ))}
                </ul>
            </div>
            {tab==="CHATROOM" && <div className="chat-content">
                <ul className="chat-messages">
                    {publicChats.map((chat,index)=>(
                        <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                            {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                            <div className="message-data">{chat.message}</div>
                            {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                        </li>
                    ))}
                </ul>
                <div className="send-message">
                    <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} />
                    <button type="button" className="send-button" onClick={sendValue}>send</button>
                </div>
            </div>}
            {tab!=="CHATROOM" && <div className="chat-content">
                <ul className="chat-messages">
                    {[...privateChats.get(tab)].map((chat,index)=>(
                        <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                            {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                            <div className="message-data">{chat.message}</div>
                            {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                        </li>
                    ))}
                </ul>
                <div className="send-message">
                    <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} />
                    <button type="button" className="send-button" onClick={sendPrivateValue}>send</button>
                </div>
            </div>}
        </div>
    )
}