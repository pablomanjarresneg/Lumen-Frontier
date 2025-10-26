/**
 * Flashcards Widget
 *
 * Review flashcards with flip animation
 */

import { useState } from 'react'
import type { WidgetProps } from '@/types/widgets'

// Sample flashcards data
const SAMPLE_FLASHCARDS = [
  {
    id: '1',
    question: 'What is the capital of France?',
    answer: 'Paris',
    category: 'Geography'
  },
  {
    id: '2',
    question: 'What is 2 + 2?',
    answer: '4',
    category: 'Math'
  },
  {
    id: '3',
    question: 'Who wrote "Romeo and Juliet"?',
    answer: 'William Shakespeare',
    category: 'Literature'
  }
]

export default function FlashcardsWidget({ config }: WidgetProps) {
  const flashcards = config.data?.flashcards || SAMPLE_FLASHCARDS
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [studiedCount, setStudiedCount] = useState(0)

  const currentCard = flashcards[currentIndex]
  const progress = ((studiedCount / flashcards.length) * 100).toFixed(0)

  const handleNext = () => {
    setIsFlipped(false)
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      if (!isFlipped) setStudiedCount(studiedCount + 1)
    } else {
      // Reset to beginning
      setCurrentIndex(0)
      setStudiedCount(flashcards.length)
    }
  }

  const handlePrevious = () => {
    setIsFlipped(false)
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-600 mb-1">
          <span>Progress</span>
          <span>{studiedCount} / {flashcards.length} cards</span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-400 to-indigo-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="flex-1 flex items-center justify-center">
        <div
          className={`relative w-full h-64 cursor-pointer perspective-1000`}
          onClick={handleFlip}
        >
          <div
            className={`absolute w-full h-full transition-transform duration-500 transform-style-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* Front of card */}
            <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-6 flex flex-col items-center justify-center shadow-lg">
              <div className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full mb-4">
                {currentCard.category}
              </div>
              <p className="text-lg font-medium text-slate-800 text-center">
                {currentCard.question}
              </p>
              <p className="text-xs text-slate-500 mt-6">Click to reveal answer</p>
            </div>

            {/* Back of card */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6 flex flex-col items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-indigo-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xl font-bold text-indigo-900 text-center">
                {currentCard.answer}
              </p>
              <p className="text-xs text-slate-500 mt-6">Click to flip back</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="p-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          aria-label="Previous flashcard"
          title="Previous card"
        >
          <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <span className="text-sm text-slate-600 font-medium">
          {currentIndex + 1} / {flashcards.length}
        </span>

        <button
          onClick={handleNext}
          className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          aria-label="Next flashcard"
          title="Next card"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Complete message */}
      {studiedCount === flashcards.length && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-sm font-medium text-green-800">
            🎉 You've reviewed all cards!
          </p>
        </div>
      )}
    </div>
  )
}
