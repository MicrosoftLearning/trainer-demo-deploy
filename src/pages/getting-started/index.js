/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useState, useEffect } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import useBaseUrl from "@docusaurus/useBaseUrl";
import {
  Text,
  teamsLightTheme,
  teamsDarkTheme,
  makeStyles,
  typographyStyles,
  FluentProvider,
} from "@fluentui/react-components";
import { useColorMode } from "@docusaurus/theme-common";
import styles from "./styles.module.css";

const useStyles = makeStyles({
  largeTitle: typographyStyles.largeTitle,
  title3: typographyStyles.title3,
  subtitle1: typographyStyles.subtitle1,
});

function HomepageHeader({ colorMode }) {
  const style = useStyles();
  return (
    <header className={styles.heroBanner}>
      
      <img
        src={
          colorMode != "dark"
            ? useBaseUrl("/img/coverBackgroundLight_new.png")
            : useBaseUrl("/img/coverBackgroundDark_new.png")
        }
        className={styles.cover}
        onError={({ currentTarget }) => {
          currentTarget.style.display = "none";
        }}
        alt=""
      />
      
      <div className={styles.section}>
        <div className={styles.description}>
          <h1>
            <Text
              className={style.largeTitle}
              style={{ marginBottom: "6px", color: colorMode !== "dark" ? "#242424" : "#ffffff" }}
            >
              Deploy Microsoft Certified Trainer Demo scenarios from a single (azd) command
            </Text>
          </h1>
          <Text className={style.title3} style={{ color: colorMode !== "dark" ? "#242424" : "#ffffff" }}>
            The <a href="https://esi.microsoft.com/" target="_blank" rel="noopener noreferrer">Microsoft Technical Trainer</a> (MTT) and <a href="https://example.com/https://learn.microsoft.com/en-us/credentials/certifications/mct-certification" target="_blank" rel="noopener noreferrer">Microsoft Certified Trainer</a> (MCT) community-built scenarios, allow everyone to 
            redeploy demo scenarios in their own Azure subscription, in minutes. 
          </Text>
        </div>
        <div className={styles.imageContainer}>
          <img
            src= { useBaseUrl ("/img/Standard MCT Badge Large.png")}
            alt="Microsoft Certified Trainer Badge"
            
          />
        </div>
        
        
      </div>
    </header>
  );
}

const HomeApp = () => {
  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, []);

  return !loading ? (
    <FluentProvider
      theme={colorMode == "dark" ? teamsDarkTheme : teamsLightTheme}
      className={styles.backgroundColor}
    >
      <div className={styles.container}>
        <HomepageHeader colorMode={colorMode} />
        <HomepageFeatures />
      </div>
    </FluentProvider>
  ) : null;
};

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomeApp />
    </Layout>
  );
}
