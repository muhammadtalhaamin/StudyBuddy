import React from "react";
import { BookOpen, Brain, Calendar, Clock, Target } from "lucide-react";

// Define interfaces
interface QuickStartCardsProps {
  onQuestionSelect: (question: string) => void;
}

interface QuestionItem {
  icon: React.ReactNode;
  text: string;
  question: string;
  description: string;
}

const QuickStartCards: React.FC<QuickStartCardsProps> = ({
  onQuestionSelect,
}) => {
  const questions: QuestionItem[] = [
    {
      icon: <Target className="w-5 h-5" />,
      text: "Study Plan",
      question: "I need a 5-day study plan for [subject]. My exam is on [date] and I need help with [specific topics].",
      description: "Get a customized daily study schedule"
    },
    {
      icon: <Brain className="w-5 h-5" />,
      text: "Practice Quiz",
      question: "Create a practice quiz for [subject], focusing on [specific topic].",
      description: "Test your knowledge with targeted questions"
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      text: "Exam Countdown",
      question: "I have exams in [subjects] on [dates]. Help me prepare a study timeline.",
      description: "Plan your exam preparation easily"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl w-full p-4">
      {questions.map((item, index) => (
        <button
          key={index}
          onClick={() => onQuestionSelect(item.question)}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-start text-left space-y-3 border border-gray-200 dark:border-gray-700 group"
        >
          <div className="flex items-center space-x-3 w-full">
            <div className="p-2 bg-blue-50 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-800 transition-colors duration-200">
              {item.icon}
            </div>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {item.text}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {item.description}
          </p>
          
          <div className="text-xs text-gray-500 dark:text-gray-400 italic mt-2">
            Click to customize prompt
          </div>
        </button>
      ))}
    </div>
  );
};

export default QuickStartCards;