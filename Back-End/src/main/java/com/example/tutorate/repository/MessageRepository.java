package com.example.tutorate.repository;

import com.example.tutorate.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message,Integer> {
    @Query(value = "SELECT * FROM message WHERE receiverid = :userID OR senderid = :userID", nativeQuery = true)
    List<Message> getMessages(int userID);

    @Query(value = "SELECT * FROM message WHERE receiverid = :receiverID AND senderid = :senderID AND status < :status", nativeQuery = true)
    List<Message> getMessagesWithMaxStatus(int senderID, int receiverID, int status);
}
