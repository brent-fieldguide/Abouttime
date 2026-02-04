import { useStoryStore } from '../../context/StoryContext';
import QuestionLayout, { EncouragementBubble } from '../common/QuestionLayout';
import { CardGrid, SelectionCard } from '../common/CardGrid';

const THEME_OPTIONS = [
  {
    value: 'journey',
    icon: '🗺️',
    label: 'Going on a big journey',
    sublabel: 'An epic adventure awaits!',
  },
  {
    value: 'friendship',
    icon: '🤝',
    label: 'Making a new friend',
    sublabel: 'A story about connection',
  },
  {
    value: 'mystery',
    icon: '🔎',
    label: 'Solving a mystery',
    sublabel: 'Who did it? What happened?',
  },
  {
    value: 'learning',
    icon: '📚',
    label: 'Learning something new',
    sublabel: 'Growing and discovering',
  },
  {
    value: 'fear',
    icon: '💪',
    label: 'Overcoming a fear',
    sublabel: 'Being brave!',
  },
  {
    value: 'helping',
    icon: '🦸',
    label: 'Helping someone in trouble',
    sublabel: 'A hero\'s tale',
  },
  {
    value: 'magic',
    icon: '✨',
    label: 'Discovering a magical power',
    sublabel: 'Something special!',
  },
  {
    value: 'silly',
    icon: '🤪',
    label: 'Having the silliest day ever',
    sublabel: 'Laughs and fun!',
  },
];

export default function ThemePicker() {
  const { storySpec, updateStorySpec, nextPhase, prevPhase } = useStoryStore();
  const selectedTheme = storySpec.theme;
  const characterName = storySpec.mainCharacter.name;

  const handleSelect = (theme) => {
    updateStorySpec({ theme });
  };

  const canContinue = !!selectedTheme;

  const getThemeMessage = () => {
    const theme = THEME_OPTIONS.find((t) => t.value === selectedTheme);
    if (!theme) return null;
    return `${characterName} is ${theme.label.toLowerCase()}!`;
  };

  return (
    <QuestionLayout
      title="What kind of adventure is it?"
      subtitle="Pick what happens in your story!"
      onNext={nextPhase}
      onBack={prevPhase}
      canContinue={canContinue}
    >
      {selectedTheme && <EncouragementBubble message={getThemeMessage()} />}

      <CardGrid columns={4}>
        {THEME_OPTIONS.map((theme) => (
          <SelectionCard
            key={theme.value}
            icon={theme.icon}
            label={theme.label}
            sublabel={theme.sublabel}
            selected={selectedTheme === theme.value}
            onClick={() => handleSelect(theme.value)}
          />
        ))}
      </CardGrid>
    </QuestionLayout>
  );
}
