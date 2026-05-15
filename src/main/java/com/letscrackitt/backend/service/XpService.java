package com.letscrackitt.backend.service;

import com.letscrackitt.backend.entity.User;
import com.letscrackitt.backend.entity.XpLevel;
import com.letscrackitt.backend.entity.Xptransaction;
import com.letscrackitt.backend.repository.UserRepository;
import com.letscrackitt.backend.repository.XpLevelRepository;
import com.letscrackitt.backend.repository.XpTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class XpService {

    public static final String SOURCE_NOTE = "NOTE_READ";
    public static final String SOURCE_PROJECT_STEP = "PROJECT_STEP";
    public static final String SOURCE_QUIZ = "QUIZ";

    private final UserRepository userRepository;
    private final XpTransactionRepository xpTransactionRepository;
    private final XpLevelRepository xpLevelRepository;

    @Transactional
    public Map<String, Object> awardOnce(User user, String source, Long sourceId, Integer amount) {
        int xpAmount = Math.max(0, amount == null ? 0 : amount);

        if (xpAmount == 0 || xpTransactionRepository.existsByUserAndSourceAndSourceId(user, source, sourceId)) {
            return xpResult(0, user.getXpPoints(), false);
        }

        int totalXp = (user.getXpPoints() == null ? 0 : user.getXpPoints()) + xpAmount;

        user.setXpPoints(totalXp);
        userRepository.save(user);

        xpTransactionRepository.save(
                Xptransaction.builder()
                        .user(user)
                        .source(source)
                        .sourceId(sourceId)
                        .xpAmount(xpAmount)
                        .build()
        );

        return xpResult(xpAmount, totalXp, true);
    }

    public int todayXp(User user) {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        return xpTransactionRepository
                .findByUserAndCreatedAtBetweenOrderByCreatedAtDesc(user, start, end)
                .stream()
                .mapToInt(tx -> tx.getXpAmount() == null ? 0 : tx.getXpAmount())
                .sum();
    }

    public List<Map<String, Object>> recentTransactions(User user) {
        return xpTransactionRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .limit(12)
                .map(tx -> Map.<String, Object>of(
                        "id", tx.getId(),
                        "source", tx.getSource(),
                        "sourceId", tx.getSourceId(),
                        "xp", tx.getXpAmount() == null ? 0 : tx.getXpAmount(),
                        "createdAt", tx.getCreatedAt()
                ))
                .toList();
    }

    public Map<String, Object> profile(User user) {
        int totalXp = user.getXpPoints() == null ? 0 : user.getXpPoints();
        XpLevel currentLevel = currentLevel(totalXp);
        int nextLevelXp = currentLevel.getMaxXp();

        return Map.of(
                "xpPoints", totalXp,
                "xpToday", todayXp(user),
                "level", currentLevel.getLevelNumber(),
                "levelLabel", currentLevel.getLabel(),
                "levelMinXp", currentLevel.getMinXp(),
                "nextLevelXp", nextLevelXp,
                "xpIntoLevel", Math.max(0, totalXp - currentLevel.getMinXp()),
                "xpToNextLevel", Math.max(0, nextLevelXp - totalXp),
                "streak", user.getStreak() == null ? 0 : user.getStreak()
        );
    }

    public int level(int totalXp) {
        return currentLevel(totalXp).getLevelNumber();
    }

    private String levelLabel(int totalXp) {
        return currentLevel(totalXp).getLabel();
    }

    private int nextLevelXp(int totalXp) {
        return currentLevel(totalXp).getMaxXp();
    }

    private XpLevel currentLevel(int totalXp) {
        List<XpLevel> levels = xpLevelRepository.findAllByOrderByMinXpAsc();

        if (levels.isEmpty()) {
            return XpLevel.builder()
                    .levelNumber(1)
                    .minXp(0)
                    .maxXp(100)
                    .label("Newbie")
                    .build();
        }

        return levels.stream()
                .filter(level -> totalXp >= level.getMinXp())
                .reduce((first, second) -> second)
                .orElse(levels.get(0));
    }

    private Map<String, Object> xpResult(int earned, int total, boolean awarded) {
        XpLevel currentLevel = currentLevel(total);

        return Map.of(
                "xpEarned", earned,
                "xpPoints", total,
                "awarded", awarded,
                "level", currentLevel.getLevelNumber(),
                "levelLabel", currentLevel.getLabel(),
                "levelMinXp", currentLevel.getMinXp(),
                "nextLevelXp", currentLevel.getMaxXp(),
                "xpToNextLevel", Math.max(0, currentLevel.getMaxXp() - total)
        );
    }
}
