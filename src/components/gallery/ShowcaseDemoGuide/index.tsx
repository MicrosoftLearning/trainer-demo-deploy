import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';


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
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{markdownContent}</ReactMarkdown>
    </div>
  );
};

export default ShowcaseDemoGuide;