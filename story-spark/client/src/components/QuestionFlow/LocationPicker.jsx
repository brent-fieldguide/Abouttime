import { useState } from 'react';
import { useStoryStore } from '../../context/StoryContext';
import QuestionLayout, { EncouragementBubble } from '../common/QuestionLayout';
import { CardGrid, SelectionCard } from '../common/CardGrid';
import VoiceInput from '../common/VoiceInput';

const LOCATION_OPTIONS = [
  { value: 'enchanted-forest', icon: '🌳', label: 'Enchanted Forest', sublabel: 'Magical trees and creatures' },
  { value: 'ocean', icon: '🌊', label: 'Under the Ocean', sublabel: 'Deep sea adventure' },
  { value: 'space', icon: '🚀', label: 'Outer Space', sublabel: 'Stars and planets' },
  { value: 'castle', icon: '🏰', label: 'Magical Kingdom', sublabel: 'Castles and royalty' },
  { value: 'city', icon: '🏙️', label: 'A Big City', sublabel: 'Tall buildings and busy streets' },
  { value: 'village', icon: '🏡', label: 'Cozy Village', sublabel: 'Friendly neighbors' },
  { value: 'farm', icon: '🌾', label: 'A Farm', sublabel: 'Animals and fields' },
  { value: 'island', icon: '🏝️', label: 'Desert Island', sublabel: 'Tropical adventure' },
  { value: 'mountains', icon: '⛰️', label: 'Mountains', sublabel: 'High peaks and valleys' },
  { value: 'candy-land', icon: '🍭', label: 'Candy Land', sublabel: 'Sweet treats everywhere' },
  { value: 'dinosaur', icon: '🦕', label: 'Dinosaur World', sublabel: 'Prehistoric adventure' },
  { value: 'custom', icon: '✨', label: 'Somewhere else!', sublabel: 'Your imagination' },
];

export default function LocationPicker() {
  const { storySpec, updateSetting, nextPhase, prevPhase } = useStoryStore();
  const [showCustomInput, setShowCustomInput] = useState(storySpec.setting.location === 'custom');
  const [customLocation, setCustomLocation] = useState(
    storySpec.setting.location === 'custom' ? storySpec.setting.locationDescription || '' : ''
  );

  const characterName = storySpec.mainCharacter.name;
  const selectedLocation = storySpec.setting.location;

  const handleSelect = (location) => {
    if (location === 'custom') {
      setShowCustomInput(true);
      updateSetting({ location: 'custom' });
    } else {
      setShowCustomInput(false);
      updateSetting({ location, locationDescription: '' });
    }
  };

  const handleCustomInput = (text) => {
    setCustomLocation(text);
    updateSetting({ locationDescription: text });
  };

  const handleVoiceResult = (transcript) => {
    setCustomLocation(transcript);
    updateSetting({ locationDescription: transcript });
  };

  const canContinue = selectedLocation && (selectedLocation !== 'custom' || customLocation.trim());

  const getLocationName = () => {
    if (selectedLocation === 'custom') return customLocation || 'somewhere special';
    return LOCATION_OPTIONS.find((l) => l.value === selectedLocation)?.label.toLowerCase() || '';
  };

  return (
    <QuestionLayout
      title={`Where does ${characterName}'s adventure happen?`}
      subtitle="Pick a world for your story!"
      onNext={nextPhase}
      onBack={prevPhase}
      canContinue={canContinue}
    >
      {selectedLocation && (
        <EncouragementBubble
          message={`${characterName} is going to ${getLocationName()}!`}
        />
      )}

      <CardGrid columns={4}>
        {LOCATION_OPTIONS.map((loc) => (
          <SelectionCard
            key={loc.value}
            icon={loc.icon}
            label={loc.label}
            sublabel={loc.sublabel}
            selected={selectedLocation === loc.value}
            onClick={() => handleSelect(loc.value)}
          />
        ))}
      </CardGrid>

      {showCustomInput && (
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg max-w-lg mx-auto">
          <label className="block text-lg font-medium text-gray-700 mb-3">
            Describe your world!
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={customLocation}
              onChange={(e) => handleCustomInput(e.target.value)}
              placeholder="A magical treehouse in the clouds..."
              className="flex-1 px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-spark-400 focus:outline-none"
              autoFocus
            />
            <VoiceInput onResult={handleVoiceResult} />
          </div>
        </div>
      )}
    </QuestionLayout>
  );
}
