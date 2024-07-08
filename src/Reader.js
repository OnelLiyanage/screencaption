import React, { useState, useEffect } from "react";

const ScreenReader = () => {
  const [allElements, setAllElements] = useState(null);
  const [currentElemIndex, setCurrentElemIndex] = useState(0);
  const [currentState, setCurrentState] = useState("PAUSED"); //READING, READINGBACKWARD, READINGFORWARD

  const readFromBeginning = () => {
    const elements = document.querySelectorAll("*");
    setAllElements([...elements]);
    setCurrentElemIndex(0);
    setCurrentState("READING");
    findTheNextOne();
  };

  useEffect(() => {
    readFromBeginning();
    // Include findNextHeading and readFromBeginning in the dependency array
  }, [findNextHeading, readFromBeginning]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setToPause();
      }
      if (e.key === "h") {
        findNextHeading();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // No dependencies, as this effect runs only once

  const setToPause = () => {
    setCurrentState("PAUSED");
    speechSynthesis.cancel();
  };

  /**
   *
   * Finds and reads the next node starting from
   * the current position.
   */
  function findTheNextOne() {
    if (!allElements || currentElemIndex >= allElements.length) return;
    do {
      var currentElem = allElements[currentElemIndex];
      setCurrentElemIndex((prevIndex) => prevIndex + 1);
      if (currentElemIndex > 100) {
        break;
      }
    } while (!doesItSpeak(currentElem));

    speakMe(currentElem);
  }

  function findNextHeading() {
    const all = "h1,h2,h3,h4";
    let currentElem = allElements[currentElemIndex];

    let index = 0; // Remove 'let index;' and define it here

    if (currentElem == null) {
      currentElem = document.querySelector("body");
    }

    const afters = Array.from(document.querySelectorAll(all)).reduce(
      (acc, elem, i) => {
        if (elem === currentElem) {
          index = i;
        }
        if (i > index) {
          acc.push(elem);
        }
        return acc;
      },
      []
    );

    speakMe(afters[0]);
  }

  function doesItSpeak(elem) {
    var allowedTags = ["H1", "H2", "H3", "H4", "H5", "H6", "P"]; // Capitalize tag names
    var tagName = elem.tagName;
    return allowedTags.includes(tagName);
  }

  function speakMe(elem) {
    elem.focus();
    window.scrollTo({
      top: elem.offsetTop,
      behavior: "smooth",
    });

    const u = new SpeechSynthesisUtterance(elem.textContent);
    u.onend = function (event) {
      if (currentState === "READING") {
        findTheNextOne();
      } else if (currentState === "READONEBACK") {
        // Implement findThePreviousOne function if needed
      }
      findTheNextOne();
    };
    speechSynthesis.speak(u);
  }

  return <div>This is the Screen Reader component</div>;
};

export default ScreenReader;
