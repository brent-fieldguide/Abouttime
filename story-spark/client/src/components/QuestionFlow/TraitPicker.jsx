import { useStoryStore } from '../../context/StoryContext';
import QuestionLayout, { EncouragementBubble } from '../common/QuestionLayout';
import { CardGrid, MultiSelectCard } from '../common/CardGrid';

const TRAIT_OPTIONS = [
  { value: 'brave', icon: '🦁', label: 'Brave' },
  { value: 'silly', icon: '🤪', label: 'Silly' },
  { value: 'kind', icon: '💝', label: 'Kind' },
  { value: 'curious', icon: '🔍', label: 'Curious' },
  { value: 'shy', icon: '🙈', label: 'Shy' },
  { value: 'adventurous', icon: '🚀', label: 'Adventurous' },
  { value: 'clever', icon: '🧠', label: 'Clever' },
  { value: 'friendly', icon: '🤗', label: 'Friendly' },
];

const MAX_TRAITS = 2;

export default function TraitPicker() {
  const { storySpec, updateMainCharacter, nextPhase, prevPhase } = useStoryStore();
  const selectedTraits = storySpec.mainCharacter.traits || [];
  const characterName = storySpec.mainCharacter.name;

  const handleToggleTrait = (trait) => {
    let newTraits;
    if (selectedTraits.includes(trait)) {
      newTraits = selectedTraits.filter((t) => t !== trait);
    } else if (selectedTraits.length < MAX_TRAITS) {
      newTraits = [...selectedTraits, trait];
    } else {
      return;
    }
    updateMainCharacter({ traits: newTraits });
  };

  const canContinue = selectedTraits.length >= 1;
  const maxReached = selectedTraits.length >= MAX_TRAITS;

  const getTraitDescription = () => {
    if (selectedTraits.length === 0) return null;
    const traitLabels = selectedTraits.map(
      (t) => TRAIT_OPTIONS.find((o) => o.value === t)?.label.toLowerCase()
    );
    if (traitLabels.length === 1) {
      return `${characterName} is ${traitLabels[0]}!`;
    }
    return `${characterName} is ${traitLabels[0]} and ${traitLabels[1]}!`;
  };

  return (
    <QuestionLayout
      title={`What is ${characterName} like?`}
      subtitle="Pick one or two personality traits!"
      onNext={nextPhase}
      onBack={prevPhase}
      canContinue={canContinue}
    >
      {selectedTraits.length > 0 && (
        <EncouragementBubble message={getTraitDescription()} />
      )}

      <CardGrid columns={4}>
        {TRAIT_OPTIONS.map((trait) => (
          <MultiSelectCard
            key={trait.value}
            icon={trait.icon}
            label={trait.label}
            selected={selectedTraits.includes(trait.value)}
            maxReached={maxReached}
            onClick={() => handleToggleTrait(trait.value)}
          />
        ))}
      </CardGrid>

      <p className="text-center text-sm text-gray-500 mt-4">
        {selectedTraits.length} of {MAX_TRAITS} selected
      </p>
    </QuestionLayout>
  );
}
