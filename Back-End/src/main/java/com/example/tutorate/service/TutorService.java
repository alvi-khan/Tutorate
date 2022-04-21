package com.example.tutorate.service;

import com.example.tutorate.model.SearchParams;
import com.example.tutorate.model.Tutor;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface TutorService {
    Tutor saveTutor(Tutor tutor);
    List<Tutor> getTutors(String searchTerm, SearchParams searchParams);
    Tutor getTutorByName(String name);
    String saveImage(MultipartFile image, int useID);
    boolean sessionCheck(HttpServletRequest request);
    Integer deleteById(int id);
}
