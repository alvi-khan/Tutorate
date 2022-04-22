package com.example.tutorate.repository;

import com.example.tutorate.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message,Integer> {
    @Query(value = "SELECT * FROM message WHERE receiver_name = :username AND status = 1 " +
            "OR sender_name = :username AND status = 1", nativeQuery = true)
    List<Message> getPrefetchMessages(String username);
}
