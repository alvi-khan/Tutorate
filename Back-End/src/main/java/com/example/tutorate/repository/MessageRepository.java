package com.example.tutorate.repository;

import com.example.tutorate.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message,Integer> {
    @Query(value = "select * from message where receiver_name=:username and status=1 or sender_name=:username and status=1",nativeQuery = true)
    List<Message> getPrefetchMessages(String username);
}
