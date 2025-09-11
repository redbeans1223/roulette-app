package com.example.roulette;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class RouletteController {
    private RouletteSettings settings;
    public RouletteController (RouletteSettings settings) {
        this.settings = settings;
    }
    @PostMapping("/sections")
    public ResponseEntity<?> setSections(@RequestBody RouletteSettings request) {
        // type判定
        if (request.getType() == null || (!request.getType().equals("number")
         && !request.getType().equals("text"))) {
            return ResponseEntity.badRequest().body(Map.of("error", "形式はnumberまたはtext"));
        }
        if (request.getCount() == null || request.getCount() < 1) {
            return ResponseEntity.badRequest().body(Map.of("error", "セクション数は1以上"));
        }
        if (request.getType().equals("number") && request.getCount() > 20) {
            return ResponseEntity.badRequest().body(Map.of("error", "数値は1～20"));
        }
        if (request.getType().equals("text") && (request.getCount() > 10 || request.getLabels() == null
             || request.getLabels().size() != request.getCount() || request.getLabels().stream().anyMatch(l -> l != null && l.length() > 10))) {
                return ResponseEntity.badRequest().body(Map.of("error", "文字数は1～10文字以内、labelsはcountと一致"));
        }
        this.settings = request;
        return ResponseEntity.ok(Map.of("success", true));
    }
    @GetMapping("/spin")
    public ResponseEntity<?> spin() {
        if (settings == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "設定がありません"));
        }
        Integer count = settings.getCount();
        int index = (int) (Math.random() * count);
        return ResponseEntity.ok(Map.of("result", index));
    }

    @DeleteMapping("/reset")
    public ResponseEntity<?> resetSections() {
        if (settings == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "すでにリセットされてます"));
        }
        settings = null;
        return ResponseEntity.ok(Map.of("success", true));
    }
    
    
}
