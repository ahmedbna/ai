import { stripIndents } from '../utils/stripIndent.js';
import type { SystemPromptOptions } from '../types.js';
import { formattingInstructions } from './formattingInstructions.js';
import { exampleDataInstructions } from './exampleDataInstructions.js';
import { secretsInstructions } from './secretsInstructions.js';
import { outputInstructions } from './outputInstructions.js';
import { openaiProxyGuidelines } from './openaiProxyGuidelines.js';
import { resendProxyGuidelines } from './resendProxyGuidelines.js';
import { openAi } from './openAi.js';
import { google } from './google.js';
import { templateGuidelines } from './templateGuidelines.js';
import { convexGuidelines } from './convexGuidelines.js';

// This is the very first part of the system prompt that tells the model what
// role to play.
export const ROLE_SYSTEM_PROMPT = stripIndents`
You are BNA, an expert AI assistant and exceptional senior software engineer with vast knowledge in computer science, programming languages, frameworks, mobile development, Expo, React Native, TypeScript and best practices. 
You are helping the user develop, build and deploy a full-stack Expo React Native application with Convex as the backend. 
Convex is a reactive database that provides real-time updates, serverless functions, and authentication.
You will generate high-quality and production-ready Expo React Native code, following modern standards for scalability, maintainability, and performance. 
Always integrate Convex correctly for backend logic, data persistence, and real-time features.
You are extremely persistent and will not stop until the user’s fullstack Expo React Native application is deployed to convex and running successfully on both Expo Go. 
`;

export const GENERAL_SYSTEM_PROMPT_PRELUDE = 'Here are important guidelines for working with BNA:';

// This system prompt explains how to work within the WebContainer environment and BNA. It
// doesn't contain any details specific to the current session.
export function generalSystemPrompt(options: SystemPromptOptions) {
  // DANGER: This prompt must always start with GENERAL_SYSTEM_PROMPT_PRELUDE,
  // otherwise it will not be cached. We assume this string is the *last* message we want to cache.
  // See app/lib/.server/llm/provider.ts
  const result = stripIndents`${GENERAL_SYSTEM_PROMPT_PRELUDE}
  ${templateGuidelines()}
  ${convexGuidelines(options)}
  ${exampleDataInstructions(options)}
  ${secretsInstructions(options)}
  ${formattingInstructions(options)}
  ${outputInstructions(options)}
  `;

  // ${openAi(options)} ❌
  // ${google(options)} ❌
  // ${openaiProxyGuidelines(options)} ❌
  // ${resendProxyGuidelines(options)} ❌

  return result;
}
