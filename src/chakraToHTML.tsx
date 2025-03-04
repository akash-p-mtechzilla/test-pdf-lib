import { ChakraProvider, theme } from "@chakra-ui/react";
import ReactDOMServer from "react-dom/server";

export const chakraToHTML = (component: React.ReactElement): string => {
  return ReactDOMServer.renderToString(
    <ChakraProvider theme={theme}>{component}</ChakraProvider>
  );
};
