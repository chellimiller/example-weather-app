import React, { useEffect } from "react";

const About: React.FC = () => {
  useEffect(() => {
    fetch('http://localhost:3000/api/weather').then(
      (config) => {
        console.log(config.text());
      }, (error) => {
        console.log(error)
      });
  }, [])
  return (
    <h1>This is a PWA</h1>
  );
}

export default About;
