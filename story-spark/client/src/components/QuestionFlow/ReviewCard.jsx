import { motion } from 'framer-motion';
import { useStoryStore, PHASES } from '../../context/StoryContext';
import BigButton from '../common/BigButton';

const CHARACTER_ICONS = {
  'kid-boy': '👦', 'kid-girl': '👧', 'kid-nonbinary': '🧒',
  cat: '🐱', dog: '🐕', bunny: '🐰', dragon: '🐉', bear: '🐻',
  owl: '🦉', fox: '🦊', unicorn: '🦄', fairy: '🧚', robot: '🤖',
  monster: '👾', mermaid: '🧜', bird: '🐦', custom: '✨',
};

const LOCATION_ICONS = {
  'enchanted-forest': '🌳', ocean: '🌊', space: '🚀', castle: '🏰',
  city: '🏙️', village: '🏡', farm: '🌾', island: '🏝️',
  mountains: '⛰️', 'candy-land': '🍭', dinosaur: '🦕', custom: '✨',
};

const THEME_LABELS = {
  journey: 'Going on a big journey',
  friendship: 'Making a new friend',
  mystery: 'Solving a mystery',
  learning: 'Learning something new',
  fear: 'Overcoming a fear',
  helping: 'Helping someone in trouble',
  magic: 'Discovering a magical power',
  silly: 'Having the silliest day ever',
};

const MOOD_EMOJIS = {
  proud: '🏆', silly: '😂', cozy: '🏠', excited: '🌟', loved: '💕',
};

const STYLE_LABELS = {
  watercolor: 'Watercolor', cartoon: 'Cartoon', storybook: 'Classic Storybook',
  collage: 'Paper Collage', pencil: 'Colored Pencil', pixel: 'Pixel Art',
};

const PALETTE_LABELS = {
  bright: 'Bright & Sunny', magical: 'Magical & Sparkly', cool: 'Cool & Calm',
  warm: 'Warm & Cozy', dark: 'Dark & Mysterious', rainbow: 'Rainbow!',
};

export default function ReviewCard() {
  const { storySpec, setPhase, goToPhase } = useStoryStore();
  const { mainCharacter, sidekick, setting, theme, conflict, endingMood, artStyle, colorPalette, pageCount } = storySpec;

  const handleStartGeneration = () => {
    setPhase(PHASES.GENERATING);
  };

  const ReviewItem = ({ icon, label, value, editPhase }) => (
    <div className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
      <span className="text-2xl w-10 text-center">{icon}</span>
      <div className="flex-1">
        <span className="text-sm text-gray-500">{label}</span>
        <p className="font-medium text-gray-800">{value}</p>
      </div>
      <button
        onClick={() => goToPhase(editPhase)}
        className="text-sm text-spark-500 hover:text-spark-600 font-medium px-3 py-1 rounded-lg hover:bg-spark-50 transition-colors"
      >
        Change
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-3"
        >
          Your Story Recipe!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600"
        >
          Let's see what you've created
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-xl p-6 mb-8"
      >
        {/* Character */}
        <ReviewItem
          icon={CHARACTER_ICONS[mainCharacter.type] || '✨'}
          label="Main Character"
          value={`${mainCharacter.name} the ${mainCharacter.type === 'custom' ? mainCharacter.description : mainCharacter.type} — ${mainCharacter.traits.join(' and ')}`}
          editPhase={PHASES.CHARACTER_TYPE}
        />

        {/* Sidekick */}
        <ReviewItem
          icon={sidekick ? CHARACTER_ICONS[sidekick.type] || '👫' : '🦸'}
          label="Sidekick"
          value={sidekick ? `${sidekick.name} the ${sidekick.type}` : 'Solo adventure!'}
          editPhase={PHASES.SIDEKICK}
        />

        {/* Setting */}
        <ReviewItem
          icon={LOCATION_ICONS[setting.location] || '🌍'}
          label="Setting"
          value={`${setting.location === 'custom' ? setting.locationDescription : setting.location} — ${setting.era}`}
          editPhase={PHASES.LOCATION}
        />

        {/* Theme & Conflict */}
        <ReviewItem
          icon="🎭"
          label="Adventure"
          value={`${THEME_LABELS[theme] || theme} — ${conflict === 'custom' ? storySpec.conflictDescription : conflict}`}
          editPhase={PHASES.THEME}
        />

        {/* Ending */}
        <ReviewItem
          icon={MOOD_EMOJIS[endingMood] || '😊'}
          label="Ending Mood"
          value={endingMood}
          editPhase={PHASES.ENDING_MOOD}
        />

        {/* Art Style */}
        <ReviewItem
          icon="🎨"
          label="Art Style"
          value={`${STYLE_LABELS[artStyle] || artStyle} — ${PALETTE_LABELS[colorPalette] || colorPalette}`}
          editPhase={PHASES.ART_STYLE}
        />

        {/* Length */}
        <ReviewItem
          icon="📚"
          label="Story Length"
          value={`${pageCount} pages`}
          editPhase={PHASES.STORY_LENGTH}
        />
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col gap-4"
      >
        <BigButton
          variant="magic"
          size="large"
          onClick={handleStartGeneration}
          className="w-full"
        >
          <span className="text-2xl mr-2">✨</span>
          Let's Make My Story!
        </BigButton>

        <p className="text-center text-sm text-gray-500">
          The story elves will write your story and paint the pictures!
        </p>
      </motion.div>
    </div>
  );
}
