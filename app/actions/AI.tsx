"use server";

import { getMutableAIState, streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { Spinner } from "@/components/common/spinner";

import { AssistantMessage } from "inform-ai";
import { generateId } from "ai";

import { ClientMessage } from "../providers/AI";

import RedirectTool from "../tools/Redirect";
import BackupsTableTool from "../tools/BackupsTable";

export async function submitUserMessage(messages: ClientMessage[]) {
  const aiState = getMutableAIState();

  //add the new messages to the AI State so the user can refresh and not lose the context
  aiState.update({
    ...aiState.get(),
    messages: [...aiState.get().messages, ...messages],
  });

  //set up our streaming LLM response, with a couple of tools, a prompt and some onSegment logic
  //to add any tools and text responses from the LLM to the AI State
  const result = await streamUI({
    model: openai("gpt-4o-2024-08-06"),
    initial: <Spinner />,
    system: `\
    You are a helpful assistant who can help a user to navigate through information they
    are seeing on their screen. The user interface that that user is looking at has a collection
    of components that can send events and have states. The user can interact with the components,
    and the components can send events to the assistant. Messages sent from components will usually
    have a unique componentId, may have a human-friendly name, may also have a self-description that
    is intended to help you understand what the component does.

    This application is called LANsaver, and is a tool that helps users back up the configurations
    of network devices such as routers, firewalls, switches and Home Assistant instances. It has the
    following features:

    - CRUD operations for Devices - user can specify the hostname, type and credentials for the device
    - Backup operations - user can back up the configuration of a Device. The Backup is stored as a file,
      and has logs that the user can view
    - Schedule operations - user CRUD Schedules, which apply to a subset of devices and run on a cron schedule
    - Job operations - user can see the status of a job, and see the logs of a job. A Job is a collection of 
      Backup operations, and is associated with a Schedule.
    
    Components can also send events, which are messages that describe something that happened in the
    interface, like the user clicking something, or some other event.
    
    All messages from components will be sent via the system role in this conversation.`,
    messages: [
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name,
      })),
    ],
    text: ({ content, done }) => {
      if (done) {
        aiState.update({
          ...aiState.get(),
          messages: [...aiState.get().messages, { role: "assistant", content }],
        });

        // console.log(aiState.get().messages); //if you want to see the message history
        aiState.done(aiState.get());
      }

      return <AssistantMessage content={content} />;
    },
    tools: {
      redirect: RedirectTool,
      backupsTable: BackupsTableTool,
    },
  });

  return {
    id: generateId(),
    content: result.value,
  };
}
