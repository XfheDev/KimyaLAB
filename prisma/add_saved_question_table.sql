CREATE TABLE IF NOT EXISTS SavedQuestion (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    questionId TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(userId, questionId),
    FOREIGN KEY (userId) REFERENCES User(id),
    FOREIGN KEY (questionId) REFERENCES Question(id)
);
