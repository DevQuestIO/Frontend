import React, { useState, useEffect } from "react";
import styles from "../../styles/SuggestedQuestions.module.css";
import { useSession } from "../../hooks/useSession";

// Define the type for a suggested question
interface Question {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

const SuggestedQuestions: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session, status } = useSession();

  useEffect(() => {
    const fetchQuestions = async () => {
      if (status !== "authenticated" || !session?.preferred_username) {
        return; // Wait for session to be ready
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://127.0.0.1:8001/api/v1/suggestions?username=${session.preferred_username}`
        );

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Failed to fetch: ${response.statusText} - ${errorData}`);
        }

        const data: Question[] = await response.json();
        setSuggestedQuestions(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [session?.preferred_username, status]);

  if (status === "loading" || loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.suggestedQuestionsWrapper}>
      {/* Header: Always visible */}
      <div
        className={styles.suggestedQuestionsHeader}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>Suggested Questions</span>
        <span className={styles.toggleIcon}>{isExpanded ? "▼" : "▲"}</span>
      </div>

      {/* List: Toggles visibility */}
      <div
        className={`${styles.suggestedQuestionsContainer} ${
          isExpanded ? styles.expanded : ""
        }`}
      >
        {isExpanded && (
          <div className={styles.suggestedQuestionsList}>
            {suggestedQuestions.map((question, index) => (
              <div key={index} className={styles.questionItem}>
                <span className={styles.questionTitle}>{question.title}</span>
                <span
                  className={`${styles.questionDifficulty} ${
                    styles[question.difficulty.toLowerCase()]
                  }`}
                >
                  {question.difficulty}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
