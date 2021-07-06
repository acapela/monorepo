import styled, { css } from "styled-components";
import { motion } from "framer-motion";

import { fontFamily, fontSize } from "./baseStyles";

/**
 * Base styles
 */

const speziaFamilyBaseStyles = css`
  ${fontFamily.spezia};
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: -0.02%;
`;

const metadataMonoBaseStyles = css`
  ${fontFamily.speziaMono};
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: -0.02%;
`;

const metadataInterBaseStyles = css`
  ${fontFamily.inter};
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: -0.02%;
`;

export const Heading1 = styled.h1`
  ${speziaFamilyBaseStyles};
  font-size: 40px;
`;

export const Heading2 = styled.h1`
  ${speziaFamilyBaseStyles};
  font-size: 32px;
`;

export const Heading3 = styled.h1`
  ${speziaFamilyBaseStyles};
  font-size: 24px;
`;

export const Heading3Extended = styled.h1`
  ${speziaFamilyBaseStyles};
  font-size: 24px;
`;

export const Heading4 = styled.h1`
  ${speziaFamilyBaseStyles};
  font-size: 20px;
`;

export const Heading5 = styled.h1`
  ${speziaFamilyBaseStyles};
  font-size: 18px;
`;

export const Heading6 = styled.h1`
  ${speziaFamilyBaseStyles};
  font-size: 16px;
`;

export const PageTitle = styled.h1`
  font-size: ${fontSize.pageTitle};
  font-weight: 600;
`;

export const ItemTitle = styled(motion.h3)`
  font-size: ${fontSize.itemTitle};
  font-weight: 600;
`;

export const TextTitle = styled.h4`
  font-weight: 600;
`;

export const SecondaryText = styled.span`
  font-size: ${fontSize.label};
  font-weight: 400;
`;

export const FieldLabel = styled.label`
  color: #b4b4b4;
  font-size: 12px;
  font-weight: 500;
`;
