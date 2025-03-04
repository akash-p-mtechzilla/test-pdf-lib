
import { Box, Container, Flex, Text } from "@chakra-ui/react";
import { chakraToHTML } from "./chakraToHTML";
import { styles } from "./constant";

export const page1 = (): string => {
  const content = chakraToHTML(
    <Container
      mx="0.7rem"
      maxW="43rem"
      fontSize="0.625rem"
      id="TitleContent"
      p={0}
    >
      <Flex
        height="100vh"
        direction="column"
        justify="center"
        align="center"
        backgroundColor="#f5f5f5"
      >
        <Box textAlign="center">
          <Text
            fontSize="2.5rem"
            fontWeight="bold"
            mb="2rem"
            color="#333"
          >
            Program Details Report
          </Text>
          <Text fontSize="1.5rem" color="#666">
            Generated on {new Date().toLocaleDateString()}
          </Text>
          <Box mt="4rem">
            <Text fontSize="1.2rem" color="#888">
              Confidential Document
            </Text>
          </Box>
        </Box>
      </Flex>
    </Container>
  );

  return `<!DOCTYPE html>
    <html>
    <head>
        <style>
            ${styles}
            body { margin: 0; padding: 0; }
        </style>
    </head>
    <body>
        ${content}
    </body>
    </html>`;
};
