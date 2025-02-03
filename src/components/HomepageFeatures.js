/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import styles from "./styles.module.css";
import Feature from "@site/src/components/Feature";

/**
 * Fixed data that is rendered as a 'Feature' component on Homepage
 * Each element requires the following pieces of data:
 *  Svg = path to an svg that is rendered here within an <img> tag
 *  title = the short title given to feature component
 *  description = the 1-2 sentence description shown below title in Feature card
 *  link = the link associated with title and image (for redirection)
 */
const FeatureList = [
  {
    title: "Discover Training Templates",
    Svg: "img/home-create.svg",
    link: "https://microsoftlearning.github.io/trainer-demo-deploy/",
    description:
      "View our gallery of MTT and MCT community-contributed templates.",
    content: "View templates",
  },
  {
    title: "Check out the FAQs",
    Svg: "img/home-learn.svg",
    link: "https://microsoftlearning.github.io/trainer-demo-deploy/docs/faq/what-is-azd/",
    description:
      "Answers to common questions, how to use the templates and prerequisites.",
    content: "View FAQs",
  },
  {
    title: "Contribute to the Library",
    Svg: "img/home-contribute.svg",
    link: "https://microsoftlearning.github.io/trainer-demo-deploy/docs/contribute",
    description:
      "Are you an MTT/MCT and have demo scenarios you want to share with the trainer community? This is your time to shine!",
    content: "View contributor guide",
  },
  {
    title: "Can't get enough of AZD?",
    Svg: "img/home-discover.svg",
    link: "https://azure.github.io/awesome-azd",
    description:
      "Explore even more AZD examples (not related to Microsoft Courses) at Awesome-AZD.",
    content: "To Awesome-AZD",
  }
];

/**
 * Component that renders FeaturesList data in a container
 * with each data item represented as a Feature in a responsive grid
 */
export default function HomepageFeatures() {
  return (
    <div className={styles.features}>
      <div className={styles.row}>
        {FeatureList.map((props, idx) => (
          <Feature key={idx} {...props} />
        ))}
      </div>
    </div>
  );
}
