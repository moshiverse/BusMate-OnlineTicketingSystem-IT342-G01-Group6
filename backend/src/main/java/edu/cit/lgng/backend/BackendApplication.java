package edu.cit.lgng.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
        System.out.println("GOOGLE_CLIENT_ID=" + System.getenv("GOOGLE_CLIENT_ID"));
        System.out.println("GOOGLE_CLIENT_SECRET=" + System.getenv("GOOGLE_CLIENT_SECRET"));
	}

}
