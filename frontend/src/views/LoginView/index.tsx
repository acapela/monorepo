import { EmailLoginButton } from "~frontend/authentication/EmailLoginButton";
import { GoogleLoginButton } from "~frontend/authentication/GoogleLoginButton";
import { Logo } from "~frontend/ui/Logo";
import { UIContentWrapper } from "~frontend/ui/UIContentWrapper";
import { UILogoWrapper } from "~frontend/ui/UILogoWrapper";

export function LoginView(): JSX.Element {
  return (
    <div>
      <UIContentWrapper marginTop>
        <UILogoWrapper>
          <Logo />
        </UILogoWrapper>
        <GoogleLoginButton />
        &nbsp;
        <EmailLoginButton />
      </UIContentWrapper>
    </div>
  );
}
