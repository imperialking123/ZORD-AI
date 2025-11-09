import { Button, Field, Flex, Spinner } from "@chakra-ui/react";
import FloatingLabelInput from "../ui/FloatingLabel";
import userAuthStore from "@/store/userAuthStore";
import { useState } from "react";
import { getStateToken, handleEmailLookup } from "@/utils/authFunction";

const AuthFormContainer = () => {
  const { isRunningEmailLookup } = userAuthStore();

  const [steps, setSteps] = useState(1);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [Error, setError] = useState({
    status: false,
    errText: "",
  });

  const emailRegEx =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|io|gov|co|uk|us|ng)$/i;

  const handleSubmit = async () => {
    if (!formData.email || formData.email === " ") return;
    if (!emailRegEx.test(formData.email)) {
      setError({
        status: true,
        errText: "Please enter a valid email address.",
      });

      return;
    }

    const emailLookupResponse = await handleEmailLookup(formData.email);

    console.log(emailLookupResponse);

    if (emailLookupResponse.isError === true) {
      setError({ status: true, errText: emailLookupResponse.message });
      return;
    }
  };

  const handleGoogleLoginWithHint = (email, state) => {
    const VITE_GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const REDIRECT_URI = `${
      import.meta.env.VITE_FRONTEND_BASE_URL
    }/auth/google`;
    const params = new URLSearchParams({
      client_id: VITE_GOOGLE_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: "code",
      scope: "email profile",
      login_hint: email,
      state: state,
    });
    console.log(
      "redirecting to:",
      `https://accounts.google.com/o/oauth2/v2/auth?${params}`
    );
    window.location.assign(
      `https://accounts.google.com/o/oauth2/v2/auth?${params}`
    );
  };

  const handleOnchange = (event) => {
    setError({ status: false, errText: "" });
    setFormData((prev) => ({ ...prev, email: event.target.value }));
  };

  return (
    <Flex w="full" direction="column" gap="15px" alignItems="center">
      {steps === 1 && (
        <>
          <Field.Root invalid={Error.status}>
            <FloatingLabelInput
              value={formData.email}
              onChange={handleOnchange}
              rounded="full"
              size="xl"
              label="Email"
            />
            <Field.ErrorText ml="3%">{Error.errText}</Field.ErrorText>
          </Field.Root>

          <Button onClick={handleSubmit} w="full" size="xl" rounded="full">
            {isRunningEmailLookup ? <Spinner /> : "Continue"}
          </Button>
        </>
      )}
    </Flex>
  );
};

export default AuthFormContainer;
