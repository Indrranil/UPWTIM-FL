
package com.mitwpu.finditnow.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class UploadService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String uploadImage(MultipartFile file) throws IOException {
        // Create the directory if it does not exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate a unique file name
        String originalFileName = file.getOriginalFilename();
        String fileExtension = originalFileName != null ? 
                originalFileName.substring(originalFileName.lastIndexOf(".")) : "";
        String fileName = UUID.randomUUID() + fileExtension;

        // Save the file
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Return the file URL
        return "/uploads/images/" + fileName;
    }
}
