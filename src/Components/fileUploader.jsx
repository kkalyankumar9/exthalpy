import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import SummarisingCom from './summarisingCom';

// Set the workerSrc for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

const ReadFile = () => {
  const [fileContent, setFileContent] = useState('');
  const [wordCount, setWordCount] = useState(0);

  const handleFileRead = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;

      const reader = new FileReader();

      // If it's a .txt file
      if (fileType === 'text/plain') {
        reader.onload = (e) => {
          const text = e.target.result;
          setFileContent(text);
          setWordCount(countWords(text));
        };
        reader.readAsText(file);
      } 
      // If it's a .pdf file
      else if (fileType === 'application/pdf') {
        reader.onload = async (e) => {
          const typedArray = new Uint8Array(e.target.result);  // Convert the ArrayBuffer to Uint8Array
          
          // Load the PDF document
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          
          let text = '';

          // Extract text from each page of the PDF
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map((item) => item.str).join(' ');
            text += pageText + '\n';
          }

          // Set the extracted text and calculate word count
          setFileContent(text);
          setWordCount(countWords(text));
        };

        // Read the PDF file as an ArrayBuffer
        reader.readAsArrayBuffer(file);
      } else {
        setFileContent('Unsupported file type');
        setWordCount(0);
      }
    }
  };

  // Function to count words in a string
  const countWords = (text) => {
    return text.split(/\s+/).filter((word) => word.length > 0).length;
  };

  return (
    <div style={styles.container}>
      {/* File input */}
      <input
        type="file"
        accept=".txt, .pdf"
        onChange={handleFileRead}
        style={styles.input}
      />
      
      {/* Word count input */}
     

      {/* Display the content of the file */}
      <div style={styles.contentContainer}>
        <h3 style={styles.title}>File Content Summary:</h3>
        <SummarisingCom data={fileContent}  />
      </div>
    </div>
  );
};

// Inline CSS styles
const styles = {
  container: {
    padding: '24px',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '16px',
    fontSize: '16px',
    outline: 'none',
  },
  inputFocus: {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
  },
  contentContainer: {
    marginTop: '16px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '8px',
  },
};

export default ReadFile;
