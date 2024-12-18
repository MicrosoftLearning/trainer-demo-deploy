import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const GitHubStars = () => {
  const [stars, setStars] = useState(0);

  useEffect(() => {
    fetch('https://api.github.com/repos/petender/gh4azuredemos')
      .then(response => response.json())
      .then(data => setStars(data.stargazers_count))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>GitHub Stars</h1>
      <p>The repository has {stars} stars.</p>
    </div>
  );
};

export default GitHubStars;