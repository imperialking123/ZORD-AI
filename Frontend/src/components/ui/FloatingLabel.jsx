import {
  Box,
  Field,
  Input,
  defineStyle,
  useControllableState,
} from "@chakra-ui/react";
import { useState } from "react";
import { useColorModeValue } from "./color-mode";

const FloatingLabelInput = (props) => {
  const { label, onValueChange, value, defaultValue = "", ...rest } = props;

  const labelBg = useColorModeValue("white", "gray.900");

  const floatingStyles = defineStyle({
    pos: "absolute",
    px: "1",
    top: "50%",
    transform: "translateY(-50%)",
    insetStart: "3",
    fontWeight: "normal",
    pointerEvents: "none",
    transition: "all 0.2s",
    color: "fg.muted",
    "&[data-float]": {
      top: "-3",
      transform: "translateY(0)",
      insetStart: "2",
      color: "fg",
      fontSize: "sm",
      bg: labelBg,
      px: "1.5",
    },
  });

  const [inputState, setInputState] = useControllableState({
    defaultValue,
    onChange: onValueChange,
    value,
  });

  const [focused, setFocused] = useState(false);
  const shouldFloat = inputState.length > 0 || focused;

  return (
    <Box pos="relative" w="full">
      <Input
        autoComplete="off"
        {...rest}
        onFocus={(e) => {
          props.onFocus?.(e);
          setFocused(true);
        }}
        onBlur={(e) => {
          props.onBlur?.(e);
          setFocused(false);
        }}
        onChange={(e) => {
          props.onChange?.(e);
          setInputState(e.target.value);
        }}
        value={inputState}
        data-float={shouldFloat || undefined}
      />
      <Field.Label
        rounded="10px"
        css={floatingStyles}
        data-float={shouldFloat || undefined}
      >
        {label}
      </Field.Label>
    </Box>
  );
};

export default FloatingLabelInput;
