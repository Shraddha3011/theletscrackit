package com.letscrackitt.backend.service;

import com.letscrackitt.backend.entity.Topic;
import com.letscrackitt.backend.repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class TopicService {
    @Autowired
    private TopicRepository topicRepository;

    public List<Topic> getAllTopics() {
        return topicRepository.findAll().stream()
                .sorted(Comparator.comparingInt(t -> t.getOrderIndex() == null ? 0 : t.getOrderIndex()))
                .toList();
    }

    public Topic createTopic(Topic topic) {
        if (topic.getSlug() == null || topic.getSlug().isBlank()) {
            topic.setSlug(slugify(topic.getTitle()));
        }
        return topicRepository.save(topic);
    }

    public Optional<Topic> updateTopic(Long id, Topic topicRequest) {
        return topicRepository.findById(id).map(topic -> {
            topic.setTitle(topicRequest.getTitle());
            topic.setSlug(topicRequest.getSlug() == null || topicRequest.getSlug().isBlank()
                    ? slugify(topicRequest.getTitle())
                    : topicRequest.getSlug());
            topic.setCategory(topicRequest.getCategory());
            topic.setDescription(topicRequest.getDescription());
            topic.setIcon(topicRequest.getIcon());
            topic.setColor(topicRequest.getColor());
            topic.setOrderIndex(topicRequest.getOrderIndex());
            return topicRepository.save(topic);
        });
    }

    public boolean deleteTopic(Long id) {
        if (!topicRepository.existsById(id)) {
            return false;
        }
        topicRepository.deleteById(id);
        return true;
    }

    public Optional<Topic> getBySlug(String slug) {
        Optional<Topic> exact = topicRepository.findBySlug(slug);
        if (exact.isPresent()) {
            return exact;
        }

        return topicRepository.findAll().stream()
                .filter(topic -> slugify(topic.getTitle()).equals(slug))
                .findFirst();
    }

    private String slugify(String value) {
        return value == null ? "" : value.toLowerCase().trim().replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
    }
}
