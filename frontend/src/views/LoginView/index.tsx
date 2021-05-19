import { EmailLoginButton } from "~frontend/authentication/EmailLoginButton";
import { GoogleLoginButton } from "~frontend/authentication/GoogleLoginButton";
import { Logo } from "~frontend/ui/Logo";
import { UIContentWrapper } from "~frontend/ui/UIContentWrapper";
import { UILogoWrapper } from "~frontend/ui/UILogoWrapper";
import { LoginOptionsView } from "../LoginOptionsView";

export function LoginView(): JSX.Element {
  return (
    <div>
      <UIContentWrapper marginTop>
        <UILogoWrapper>
          <Logo />
        </UILogoWrapper>
        <LoginOptionsView />
      </UIContentWrapper>
    </div>
  );
}
