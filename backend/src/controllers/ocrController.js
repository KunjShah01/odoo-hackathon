const { createWorker } = require('tesseract.js');
const path = require('path');
const fs = require('fs').promises;

const extractText = async (req, res) => {
  let worker;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Create worker
    worker = await createWorker('eng');

    // Get text from image
    const { data: { text } } = await worker.recognize(req.file.path);

    // Clean up uploaded file
    await fs.unlink(req.file.path);

    // Basic text processing to extract potential expense information
    const extractedData = {
      rawText: text,
      potentialAmounts: extractAmounts(text),
      potentialDates: extractDates(text),
      potentialVendors: extractVendors(text)
    };

    res.json({
      message: 'Text extracted successfully',
      data: extractedData
    });
  } catch (error) {
    console.error('OCR error:', error);

    // Clean up uploaded file if it exists
    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }

    res.status(500).json({ error: 'Failed to extract text from image' });
  } finally {
    // Clean up worker
    if (worker) {
      await worker.terminate();
    }
  }
};

// Helper functions for text processing
function extractAmounts(text) {
  // Match currency patterns like $123.45, €50, £25.99, etc.
  const currencyRegex = /[$€£¥₹₽₩₦₨₪₫₡₵₺₴₸₼₲₱₭₯₰₳₶₷₹₻₽₾₿][\d,]+\.?\d{0,2}|\d+\.\d{2}/g;
  const matches = text.match(currencyRegex) || [];
  return [...new Set(matches)]; // Remove duplicates
}

function extractDates(text) {
  // Match common date patterns
  const dateRegex = /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b|\b\d{2,4}[/-]\d{1,2}[/-]\d{1,2}\b|\b\w+ \d{1,2},? \d{2,4}\b/g;
  const matches = text.match(dateRegex) || [];
  return [...new Set(matches)]; // Remove duplicates
}

function extractVendors(text) {
  // Look for lines that might be vendor names (capitalized words)
  const lines = text.split('\n');
  const potentialVendors = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 3 && trimmed.length < 50) {
      // Check if line has mostly capitalized words (potential business name)
      const words = trimmed.split(' ');
      const capitalizedWords = words.filter(word =>
        word.length > 1 && word[0] === word[0].toUpperCase()
      );

      if (capitalizedWords.length >= 2 || (capitalizedWords.length === 1 && words.length === 1)) {
        potentialVendors.push(trimmed);
      }
    }
  }

  return potentialVendors.slice(0, 5); // Return top 5 potential vendors
}

module.exports = {
  extractText
};