import React, { createContext, useContext, useEffect, useState } from 'react';
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import {useStateContext} from "./StateContextProvider";

const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const {user} = useStateContext();
    const [messages, setMessages] = useState(new Map());
    const [contactData, setContactData] = useState(new Map());
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        if(user.id != undefined)    onLogin();
        else                        onLogout();
    }, [user]);

    useEffect(() => {
        if(stompClient) stompClient.connect({"userID": user.id}, onConnected, onError);
    }, [stompClient]);

    const onError = (err) => {
        console.log(err);
    }

    const onConnected = () => {
        stompClient.subscribe(`/userMessages/${user.id}/`, onNewMessage);
        stompClient.subscribe(`/statusUpdate`, updateContactStatus);
        retrieveMessages(user);
    }

    const onLogin = () => {
        let client = over(new SockJS(`${process.env.REACT_APP_BASE_URL}/ws`));
        client.debug = null;   // disable log messages
        setStompClient(client);
    }

    const onLogout = () => {
        if (!stompClient)   return;
        stompClient.disconnect();
        setStompClient(null);
        setMessages(new Map());
        setContactData(new Map());
    }

    const updateContactStatus = (payload) => {
        var userID = JSON.parse(payload.body);
        contactData.delete(userID);
        downloadContactData(userID, true);
    }

    const downloadContactData = async (userID, force=false) => {
        if (!force && contactData.get(userID))  return;
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/${userID}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });
        contactData.set(userID, await res.json());
        setContactData(new Map(contactData));
    }

    const retrieveMessages = async () => {
          const res = await fetch(`${process.env.REACT_APP_BASE_URL}/message/getMessages?userID=${user.id}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          });

          const data = await res.json();
          data.map((item, index) => {
              downloadContactData(item.senderID);
              downloadContactData(item.receiverID);
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
    }
    
    const onNewMessage = (payload) => {
        var payloadData = JSON.parse(payload.body);
        downloadContactData(payloadData.senderID);
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

    const sendMessage = async(message, receiver) => {
        if (!stompClient || !receiver)   return;
        var chatMessage = {
            senderID: user.id,
            receiverID: receiver.id,
            message: message,
            status: "SENT"
        };

        if(user.id !== receiver.id) {
            messages.get(receiver.id).push(chatMessage);
            setMessages(new Map(messages));
        }

        stompClient.send("/chat/messages", {}, JSON.stringify(chatMessage));
    }

    return (
        <ChatContext.Provider value={{
            messages, setMessages, contactData, downloadContactData, sendMessage
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => useContext(ChatContext);
