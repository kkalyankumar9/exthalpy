import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const SummarisingCom = ({ data }) => {
  const [summary, setSummary] = useState('');

  
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": "Bearer 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",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "openai/gpt-3.5-turbo",
            messages: [
              {
                role: "user",
                content: `Summarize  the following text: ${data} in md format, it should have a title(h1, h2, h3), pointers, etc`
              }
            ]
          })
        });

        const result = await response.json();
        if (result && result.choices && result.choices[0]) {
          setSummary(result.choices[0].message.content); // Set the summary response from OpenAI
        } else {
          setSummary('No summary available.');
        }
      } catch (error) {
        console.error('Error fetching summary:', error);
        setSummary('Failed to fetch summary');
      }
    };

    if (data) {
      fetchSummary();
    }
  }, [data]); 

  return (
    <div>
      
      <ReactMarkdown>{summary}</ReactMarkdown>
    </div>
  );
};

export default SummarisingCom;
