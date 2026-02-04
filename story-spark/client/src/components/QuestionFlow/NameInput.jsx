import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStoryStore } from '../../context/StoryContext';
import QuestionLayout from '../common/QuestionLayout';
import VoiceInput from '../common/VoiceInput';

const NAME_SUGGESTIONS = {
  'kid-boy': ['Max', 'Leo', 'Sam', 'Finn', 'Milo'],
  'kid-girl': ['Luna', 'Zoe', 'Lily', 'Maya', 'Ruby'],
  'kid-nonbinary': ['Alex', 'Jamie', 'Riley', 'Quinn', 'River'],
  cat: ['Whiskers', 'Luna', 'Shadow', 'Mittens', 'Ginger'],
  dog: ['Buddy', 'Max', 'Bella', 'Lucky', 'Scout'],
  bunny: ['Fluffy', 'Cotton', 'Clover', 'Snowball', 'Pepper'],
  dragon: ['Spark', 'Ember', 'Blaze', 'Cinder', 'Flame'],
  bear: ['Teddy', 'Honey', 'Bruno', 'Maple', 'Cocoa'],
  owl: ['Hoot', 'Oliver', 'Sage', 'Willow', 'Athena'],
  fox: ['Rusty', 'Scout', 'Autumn', 'Copper', 'Fern'],
  unicorn: ['Sparkle', 'Rainbow', 'Star', 'Crystal', 'Shimmer'],
  fairy: ['Dewdrop', 'Petal', 'Twinkle', 'Blossom', 'Sunny'],
  robot: ['Beep', 'Chip', 'Bolt', 'Zappy', 'Whirr'],
  monster: ['Bubbles', 'Grumble', 'Fuzzy', 'Giggles', 'Snuggles'],
  mermaid: ['Coral', 'Pearl', 'Marina', 'Splash', 'Azure'],
  custom: ['Sparky', 'Wonder', 'Magic', 'Zippy', 'Sunny'],
};

export default function NameInput() {
  const { storySpec, updateMainCharacter, nextPhase, prevPhase } = useStoryStore();
  const [name, setName] = useState(storySpec.mainCharacter.name || '');
  const [showSuggestions, setShowSuggestions] = useState(true);

  const characterType = storySpec.mainCharacter.type;
  const suggestions = NAME_SUGGESTIONS[characterType] || NAME_SUGGESTIONS.custom;

  const handleNameChange = (newName) => {
    setName(newName);
    updateMainCharacter({ name: newName });
    if (newName) setShowSuggestions(false);
  };

  const handleVoiceResult = (transcript) => {
    // Capitalize first letter
    const formatted = transcript.charAt(0).toUpperCase() + transcript.slice(1).toLowerCase();
    handleNameChange(formatted);
  };

  const canContinue = name.trim().length > 0;

  return (
    <QuestionLayout
      title="What's your character's name?"
      subtitle="Every hero needs a name!"
      onNext={nextPhase}
      onBack={prevPhase}
      canContinue={canContinue}
      centerContent
    >
      <div className="max-w-md mx-auto">
        {/* Name input */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Type a name..."
              className="flex-1 px-5 py-4 text-2xl font-bold text-center border-3 border-gray-200 rounded-xl focus:border-spark-400 focus:outline-none transition-colors"
              autoFocus
              maxLength={20}
            />
            <VoiceInput onResult={handleVoiceResult} />
          </div>
        </div>

        {/* Name preview */}
        {name && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-6"
          >
            <p className="text-lg text-gray-600">
              Meet{' '}
              <span className="font-bold text-spark-500 text-2xl">{name}</span>
              !
            </p>
          </motion.div>
        )}

        {/* Suggestions */}
        {showSuggestions && !name && (
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-3">Need ideas? Try one of these:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((suggestion) => (
                <motion.button
                  key={suggestion}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNameChange(suggestion)}
                  className="px-4 py-2 bg-spark-100 hover:bg-spark-200 text-spark-700 rounded-full font-medium transition-colors"
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </QuestionLayout>
  );
}
