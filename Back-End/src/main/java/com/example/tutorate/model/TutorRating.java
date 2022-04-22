package com.example.tutorate.model;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@IdClass(TutorRatingPK.class)
public class TutorRating implements Serializable {
    @Id
    @ManyToOne
    @JoinColumn(name = "fk_user")
    User user;

    @Id
    @ManyToOne
    @JoinColumn(name = "fk_tutor")
    Tutor tutor;

    float rating;
    int punctuality;
    int effectiveness;
    int clarity;
    int patience;
    String review;

    public TutorRating(){}

    public int getPunctuality() {
        return punctuality;
    }

    public void setPunctuality(int punctuality) {
        this.punctuality = punctuality;
    }

    public int getEffectiveness() {
        return effectiveness;
    }

    public void setEffectiveness(int effectiveness) {
        this.effectiveness = effectiveness;
    }

    public int getClarity() {
        return clarity;
    }

    public void setClarity(int clarity) {
        this.clarity = clarity;
    }

    public int getPatience() {
        return patience;
    }

    public void setPatience(int patience) {
        this.patience = patience;
    }

    public void setRating(float rate) {
        this.rating = rate;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setTutor(Tutor tutor) {
        this.tutor = tutor;
    }

    public User getUser() {
        return user;
    }

    public Tutor getTutor() {
        return tutor;
    }

    public float getRating() {
        return rating;
    }

    public void calculateRate() {
        this.rating = (float)((this.punctuality) + (2 * this.patience) + (3 * this.clarity) + (4 * this.effectiveness)) / 10;
    }

    public void setReview(String review) {
        this.review = review;
    }

    public String getReview() {
        return review;
    }

}
