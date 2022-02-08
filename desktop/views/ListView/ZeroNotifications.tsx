import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { theme } from "@aca/ui/theme";

const successWords = [
  "Yeah!",
  "Yeih!",
  "Amazeballs!",
  "Yee-hah!",
  "Zip-a-Dee-Doo-Dah🎶",
  "Great Success 🥸",
  "🖐️🎤⬇️",
  "✅",
  "BOOYAH!",
  "Let's Go!",
  "🤜 🤛",
  "Booom 💣",
  "🤩🤩🤩",
  "😍😍😍",
  "🌞🏖️",
  "Got-em!",
  "It's all good in the hood.",
  "🚀🚀🚀",
  "🙌🙌🙌",
];

export function ZeroNotifications() {
  const [successWord, setSuccessWord] = useState<string>("Yeah");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * successWords.length);
    const randomWord = successWords[randomIndex];
    setSuccessWord(randomWord);
  }, []);

  return (
    <UIHolder>
      <UIBold>{successWord}&nbsp;</UIBold>
      <UIUnderlined>No more notifications&nbsp;&nbsp;</UIUnderlined>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
  display: flex;
`;

const UIBold = styled.span`
  ${theme.typo.pageTitle.bold};
  ${theme.colors.text.asColor};
  text-decoration-thickness: 0px;
  text-decoration-line: none;
`;

const UIUnderlined = styled.span`
  ${theme.typo.pageTitle};
  ${theme.colors.text.opacity(0.8).asColor};

  text-decoration-line: underline;
  text-decoration-style: wavy;
  text-decoration-color: ${theme.colors.action.primary.opacity(0.15)};
  text-underline-offset: -1rem;
  text-decoration-skip-ink: none;
  text-decoration-thickness: 8px;
`;
