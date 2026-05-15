package com.letscrackitt.backend.config;

import com.letscrackitt.backend.entity.XpLevel;
import com.letscrackitt.backend.repository.XpLevelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Order(30)
@RequiredArgsConstructor
public class XpLevelSeeder implements CommandLineRunner {

    private final XpLevelRepository xpLevelRepository;

    @Override
    public void run(String... args) {
        if (xpLevelRepository.count() > 0) {
            return;
        }

        xpLevelRepository.saveAll(List.of(
                level(1, 0, 100, "Newbie"),
                level(2, 100, 300, "Explorer"),
                level(3, 300, 600, "Coder"),
                level(4, 600, 1000, "Builder"),
                level(5, 1000, 1500, "Hacker"),
                level(6, 1500, 2200, "Architect"),
                level(7, 2200, 3000, "Master"),
                level(8, 3000, 4000, "Legend")
        ));
    }

    private XpLevel level(int number, int minXp, int maxXp, String label) {
        return XpLevel.builder()
                .levelNumber(number)
                .minXp(minXp)
                .maxXp(maxXp)
                .label(label)
                .build();
    }
}
