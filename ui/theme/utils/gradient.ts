import { StylesPart, css } from "styled-components";

type Gradient = {
  direction(direction: number): Gradient;
  asBg: StylesPart;
  asTextBg: StylesPart;
};

interface GradientStep {
  color: string;
  progress: number;
}

interface GradientConfig {
  steps: GradientStep[];
  direction?: number;
}

type GradientInput = string[] | GradientConfig;

function resolveGradientInput(input: GradientInput): GradientConfig {
  if (!Array.isArray(input)) {
    return input;
  }

  const stepsCount = input.length;

  const steps: GradientStep[] = input.map((color, index) => {
    const progress = index / stepsCount;

    return { color, progress };
  });

  return {
    steps,
  };
}

export function gradient(input: GradientInput): Gradient {
  const { steps, direction = 45 } = resolveGradientInput(input);

  const self: Gradient = {
    direction(direction) {
      return gradient({ steps, direction });
    },
    get asBg() {
      const stepsDefinitions = steps.map((step) => {
        return `${step.color}`;
      });
      return css`
        background-image: linear-gradient(${direction}deg, ${stepsDefinitions.reverse().join(",")});
      `;
    },
    get asTextBg() {
      return css`
        ${self.asBg};
        background-size: 100%;
        -webkit-text-fill-color: transparent;
        text-fill-color: transparent;
        -webkit-background-clip: text;
        background-clip: text;
      `;
    },
  };

  return self;
}
