import { useStoryStore } from '../../context/StoryContext';
import QuestionLayout, { EncouragementBubble } from '../common/QuestionLayout';
import { CardGrid, SelectionCard } from '../common/CardGrid';

const TIME_OPTIONS = [
  {
    value: 'fairytale',
    icon: '🏰',
    label: 'A long, long time ago',
    sublabel: 'Once upon a time...',
  },
  {
    value: 'present',
    icon: '📱',
    label: 'Right now, today!',
    sublabel: 'Modern times',
  },
  {
    value: 'future',
    icon: '🚀',
    label: 'In the future!',
    sublabel: 'Sci-fi adventure',
  },
  {
    value: 'fantasy',
    icon: '✨',
    label: 'Once upon a dream',
    sublabel: 'Timeless and magical',
  },
];

export default function TimePicker() {
  const { storySpec, updateSetting, nextPhase, prevPhase } = useStoryStore();
  const selectedEra = storySpec.setting.era;

  const handleSelect = (era) => {
    updateSetting({ era });
  };

  const canContinue = !!selectedEra;

  const getEraMessage = () => {
    switch (selectedEra) {
      case 'fairytale':
        return 'Once upon a time...';
      case 'present':
        return 'In the world of today...';
      case 'future':
        return 'In a galaxy far, far away...';
      case 'fantasy':
        return 'In a place where dreams come true...';
      default:
        return null;
    }
  };

  return (
    <QuestionLayout
      title="When does the story happen?"
      subtitle="Pick a time for your adventure!"
      onNext={nextPhase}
      onBack={prevPhase}
      canContinue={canContinue}
    >
      {selectedEra && <EncouragementBubble message={getEraMessage()} />}

      <div className="max-w-2xl mx-auto">
        <CardGrid columns={2}>
          {TIME_OPTIONS.map((time) => (
            <SelectionCard
              key={time.value}
              icon={time.icon}
              label={time.label}
              sublabel={time.sublabel}
              selected={selectedEra === time.value}
              onClick={() => handleSelect(time.value)}
              className="py-6"
            />
          ))}
        </CardGrid>
      </div>
    </QuestionLayout>
  );
}
