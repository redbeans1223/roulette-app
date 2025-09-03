package com.example.roulette;
import java.util.List;

public class RouletteSettings {
    private Integer count;
    private String type;
    private List<String> labels;
    
    public Integer getCount() {
        return count;
    }
    public void setCount(Integer count) {
        this.count = count;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public List<String> getLabels() {
        return labels;
    }
    public void setLabels(List<String> labels) {
        this.labels = labels;
    }
}
