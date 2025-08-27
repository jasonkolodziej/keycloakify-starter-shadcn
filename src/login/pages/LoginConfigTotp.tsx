import type { JSX } from "keycloakify/tools/JSX";
import { cloneElement, useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed";
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormItemCustom, FormMessageCustom } from "@/components/ui/form";
import { Eye, EyeClosed } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
export default function LoginConfigTotp(props: PageProps<Extract<KcContext, { pageId: "login-config-totp.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes
  });

  const { mode, realm, url, qr, auth, messagesPerField, totp } = kcContext;

  const { msg, msgStr } = i18n;

  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={!messagesPerField.existsError("username", "password")}
      headerNode={msg("loginAccountTitle")}
      infoNode={
        <div className="space-y-4">
          <Separator />
          <div id="kc-registration-container" className="text-center">
            <div id="kc-registration" className="space-y-2">
              <div className="text-muted-foreground text-sm">{msg("noAccount")} </div>
              {/* <Button variant="secondary" asChild className="w-full">
                <a tabIndex={8} href={url.loginConfigTotpUrl}>
                  {msg("doRegister")}
                </a>
              </Button> */}
            </div>
          </div>
        </div>
      }
    >
      <div id="kc-form">
        <div id="kc-form-wrapper">
          {realm && (
            <form
              id="kc-totp-settings-form"
              onSubmit={() => {
                setIsLoginButtonDisabled(true);
                return true;
              }}
              action={url.loginAction}
              method="post"
              className="space-y-4"
            >
              {
                <div className={kcClsx("kcFormGroupClass")}>
                  <FormItemCustom>
                    <Label htmlFor="totp">{msg("authenticatorCode")}</Label>
                    <InputOTP maxLength={6} className={kcClsx("kcInputClass")} name="totp" id="totp" autoFocus>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    {/* <Input
                      tabIndex={2}
                      id="username"
                      className={kcClsx("kcInputClass")}
                      name="username"
                      defaultValue={login.username ?? ""}
                      type="text"
                      autoFocus
                      autoComplete="username"
                      aria-invalid={messagesPerField.existsError("username", "password")}
                    /> */}
                    {messagesPerField.existsError("totp") && (
                      <FormMessageCustom id="input-error" className="text-destructive text-sm" aria-live="polite">
                        {kcSanitize(messagesPerField.getFirstError("totp"))}
                      </FormMessageCustom>
                    )}
                  </FormItemCustom>
                </div>
              }
              <div
                className={cn(
                  kcClsx("kcFormGroupClass", "kcFormSettingClass"),
                  "flex items-center gap-4",
                  realm.displayName && !totp.totpSecret ? "justify-between" : "justify-center"
                )}
              >
                {realm.displayName && !totp.totpSecret && (
                  <div id="kc-form-options">
                    <div className="flex items-center gap-3">
                      <Checkbox tabIndex={5} id="rememberMe" name="rememberMe" defaultChecked={!!totp.totpSecret} />
                      <Label htmlFor="rememberMe">{msg("rememberMe")}</Label>
                    </div>
                  </div>
                )}
              </div>

              <div id="kc-form-buttons" className={kcClsx("kcFormGroupClass")}>
                <input type="hidden" id="id-hidden-input" name="credentialId" value={totp.totpSecretEncoded} />
                <Button
                  tabIndex={7}
                  disabled={isLoginButtonDisabled}
                  className={cn(kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonBlockClass", "kcButtonLargeClass"), "w-full")}
                  name="submit"
                  id="saveTOTPBtn"
                  type="submit"
                >
                  {msgStr("doSubmit")}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Template>
  );
}

function PasswordWrapper(props: { kcClsx: KcClsx; i18n: I18n; passwordInputId: string; children: JSX.Element }) {
  const { i18n, passwordInputId, children } = props;

  const { msgStr } = i18n;
  const { isPasswordRevealed, toggleIsPasswordRevealed } = useIsPasswordRevealed({ passwordInputId });

  return (
    <div className="relative">
      {cloneElement(children, {
        type: isPasswordRevealed ? "text" : "password",
        className: clsx(children.props.className, "pr-10") // space for the button
      })}
      <button
        type="button"
        onClick={toggleIsPasswordRevealed}
        aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
        aria-controls={passwordInputId}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
      >
        {isPasswordRevealed ? <Eye className="w-4 h-4" /> : <EyeClosed className="w-4 h-4" />}
      </button>
    </div>
  );
}
