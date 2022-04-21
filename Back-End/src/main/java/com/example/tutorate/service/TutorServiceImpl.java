package com.example.tutorate.service;

import com.example.tutorate.model.SearchParams;
import com.example.tutorate.model.Tutor;
import com.example.tutorate.repository.TutorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Service
public class TutorServiceImpl implements TutorService{
    @Autowired
    private TutorRepository tutorRepository;

    public TutorServiceImpl() {}

    @Override
    public Tutor saveTutor(Tutor tutor) {
        return tutorRepository.save(tutor);
    }

    @Override
    public String saveImage(MultipartFile image, int userID) {
        if (image == null)  return null;
        String filepath = "/tutorImages/" + userID + System.currentTimeMillis();
        String originalFileName = image.getOriginalFilename();
        String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        filepath += extension;
        String staticFolder = getClass().getClassLoader().getResource("static").getFile();
        try { image.transferTo(new File(staticFolder + filepath)); }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        return filepath;
    }

    @Override
    public List<Tutor> getTutors(String searchTerm, SearchParams searchParams) {
        searchTerm = searchTerm.toLowerCase();
        List<Tutor> tutors = new ArrayList<>();
        for (Tutor tutor: tutorRepository.findAllByOrderByAverageRatingDesc()) {
            if (!searchParams.filter(tutor))    continue;

            // search by name
            if (tutor.getName().toLowerCase().startsWith(searchTerm))
                tutors.add(tutor);

            // search by location
            else if (tutor.getLocation().toLowerCase().startsWith(searchTerm))
                tutors.add(tutor);
        }
        return tutors;
    }
    /*
    * Checks if any entry in database has name equal to name entered
    * */
    @Override
    public  Tutor getTutorByName(String username){
        Tutor searched_tutor=new Tutor();
        searched_tutor.setName("never");
        for(Tutor tutor:tutorRepository.findAll()){
            String tutorName=tutor.getName();
            if(tutorName.equals(username)){
                searched_tutor=tutor;
                return searched_tutor;
            }
        }
        return searched_tutor;
    }

    /*
    * Check if user is authenticated
    * */

    @Override
    public boolean sessionCheck(HttpServletRequest request){
        HttpSession session =request.getSession();
        if(session.getAttribute("Session token")==null)
            return false;
        if(session.getAttribute("Session token").equals(request.getSession()))
            return true;
        else    return false;
    }

    @Override
    public Integer deleteById(int id) {
        return null;
    }
}
