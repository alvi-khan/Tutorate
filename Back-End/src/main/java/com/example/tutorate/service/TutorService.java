package com.example.tutorate.service;

import com.example.tutorate.model.SearchParams;
import com.example.tutorate.model.Tutor;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface TutorService {
    List<Tutor> getTutors(String searchTerm, SearchParams searchParams);
    String saveImage(MultipartFile image, int useID);
}
