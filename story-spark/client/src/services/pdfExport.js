import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  pdf,
  Font,
} from '@react-pdf/renderer';
import { createElement } from 'react';

// Register a nice font (system fallback)
Font.register({
  family: 'Georgia',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/@fontsource/eb-garamond@4.5.0/files/eb-garamond-latin-400-normal.woff',
      fontWeight: 400,
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/@fontsource/eb-garamond@4.5.0/files/eb-garamond-latin-700-normal.woff',
      fontWeight: 700,
    },
  ],
});

// PDF styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFBF5',
    padding: 0,
  },
  coverPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#FEF7EE',
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Georgia',
  },
  coverAuthor: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Georgia',
  },
  coverImage: {
    width: 300,
    height: 225,
    objectFit: 'cover',
    borderRadius: 8,
    marginVertical: 30,
  },
  storyPage: {
    flex: 1,
  },
  pageImage: {
    width: '100%',
    height: 350,
    objectFit: 'cover',
  },
  pageTextContainer: {
    padding: 30,
    flex: 1,
    justifyContent: 'center',
  },
  pageText: {
    fontSize: 18,
    lineHeight: 1.6,
    color: '#1F2937',
    textAlign: 'center',
    fontFamily: 'Georgia',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 30,
    fontSize: 12,
    color: '#9CA3AF',
  },
  endPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  endTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 30,
    fontFamily: 'Georgia',
  },
  endImage: {
    width: 200,
    height: 150,
    objectFit: 'cover',
    borderRadius: 8,
    marginBottom: 30,
  },
  endMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontFamily: 'Georgia',
  },
});

// Convert blob URL to base64 if needed
async function ensureBase64(imageSrc) {
  if (!imageSrc) return null;

  // Already base64
  if (imageSrc.startsWith('data:')) {
    return imageSrc;
  }

  // Blob URL - convert to base64
  if (imageSrc.startsWith('blob:')) {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.error('Failed to convert blob to base64:', err);
      return null;
    }
  }

  // Regular URL - try to fetch and convert
  try {
    const response = await fetch(imageSrc);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error('Failed to fetch image:', err);
    return null;
  }
}

// Create the PDF document component
function StoryDocument({ story, images, authorName, characterName }) {
  const getImageForPage = (pageNumber) => {
    const img = images.find((i) => i.pageNumber === pageNumber);
    return img?.base64 || null;
  };

  const coverImage = images[0]?.base64;
  const lastImage = images[images.length - 1]?.base64;

  return createElement(
    Document,
    null,
    // Cover page
    createElement(
      Page,
      { size: 'A4', style: styles.page },
      createElement(
        View,
        { style: styles.coverPage },
        createElement(Text, { style: styles.coverTitle }, story.title),
        coverImage &&
          createElement(Image, { src: coverImage, style: styles.coverImage }),
        createElement(
          Text,
          { style: styles.coverAuthor },
          authorName ? `Written by ${authorName}` : `A story about ${characterName}`
        )
      )
    ),
    // Story pages
    ...story.pages.map((page) =>
      createElement(
        Page,
        { key: page.pageNumber, size: 'A4', style: styles.page },
        createElement(
          View,
          { style: styles.storyPage },
          getImageForPage(page.pageNumber) &&
            createElement(Image, {
              src: getImageForPage(page.pageNumber),
              style: styles.pageImage,
            }),
          createElement(
            View,
            { style: styles.pageTextContainer },
            createElement(Text, { style: styles.pageText }, page.text)
          ),
          createElement(Text, { style: styles.pageNumber }, page.pageNumber)
        )
      )
    ),
    // End page
    createElement(
      Page,
      { size: 'A4', style: styles.page },
      createElement(
        View,
        { style: styles.endPage },
        createElement(Text, { style: styles.endTitle }, 'The End'),
        lastImage &&
          createElement(Image, { src: lastImage, style: styles.endImage }),
        createElement(
          Text,
          { style: styles.endMessage },
          `Thank you for reading!\nCreated with Story Spark`
        )
      )
    )
  );
}

// Main export function
export async function generateStoryPDF({ story, images, authorName, characterName }) {
  // Convert all images to base64
  const imagesWithBase64 = await Promise.all(
    images.map(async (img) => ({
      ...img,
      base64: await ensureBase64(img.imageSrc),
    }))
  );

  // Create the document
  const doc = createElement(StoryDocument, {
    story,
    images: imagesWithBase64,
    authorName,
    characterName,
  });

  // Generate PDF blob
  const blob = await pdf(doc).toBlob();

  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${story.title.replace(/[^a-z0-9]/gi, '_')}_storybook.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return true;
}
