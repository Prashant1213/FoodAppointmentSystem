package com.foodappointment.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadImage(MultipartFile file) throws IOException {
        return uploadImage(file, "food-appointment/restaurants");
    }

    public String uploadImage(
            MultipartFile file,
            String folder) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Image file is required"
            );
        }

        String fileName = file.getOriginalFilename();

        if (fileName == null || fileName.isBlank()) {
            throw new IllegalArgumentException(
                    "Image file is required"
            );
        }

        String lowerCaseFileName =
                fileName.toLowerCase();

        if (!(lowerCaseFileName.endsWith(".jpg")
                || lowerCaseFileName.endsWith(".jpeg")
                || lowerCaseFileName.endsWith(".png")
                || lowerCaseFileName.endsWith(".webp"))) {

            throw new IllegalArgumentException(
                    "Only JPG, JPEG, PNG and WEBP images are allowed"
            );
        }

        Map<?, ?> result =
                cloudinary.uploader().upload(
                        file.getBytes(),
                        ObjectUtils.asMap(
                                "folder",
                                folder
                        )
                );

        return result.get("secure_url").toString();
    }
}