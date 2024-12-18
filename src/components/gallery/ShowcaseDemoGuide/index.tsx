import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

const ShowcaseDemoGuide = ({ url }) => {
  const [markdownContent, setMarkdownContent] = useState('');

  useEffect(() => {
    if (url) {
      fetch(url)
        .then((response) => response.text())
        .then((text) => setMarkdownContent(text));
    }
  }, [url]);

  return (
    <div>
      <ReactMarkdown>{markdownContent}</ReactMarkdown>
    </div>
  );
};

export default ShowcaseDemoGuide;