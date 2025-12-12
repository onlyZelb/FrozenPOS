package com.finalproject.frozenpos.Services; // Interface in the Services package

import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Path;
import java.io.IOException;

public interface FileStorageService {
    String storeFile(MultipartFile file, String subdirectory, String customFileName) throws IOException;
    Path loadFile(String fileName, String subdirectory);
}