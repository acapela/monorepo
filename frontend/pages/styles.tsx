import styled from "styled-components";

import { devAssingWindowVariable } from "~shared/dev";
import { AppThemeProvider, defaultTheme, theme } from "~ui/theme";

export default function App() {
  return (
    <AppThemeProvider theme={defaultTheme}>
      <UITest>fool</UITest>
    </AppThemeProvider>
  );
}

devAssingWindowVariable("theme", theme);

const UITest = styled.div`
  ${theme.typo.pageTitle}
`;
