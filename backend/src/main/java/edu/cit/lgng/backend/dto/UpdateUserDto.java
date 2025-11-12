package edu.cit.lgng.backend.dto;

public class UpdateUserDto {
    private String name;       
    // add more fields if you want users to update them (e.g., address)
    // new fields also needs getters and setters

    public UpdateUserDto() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
