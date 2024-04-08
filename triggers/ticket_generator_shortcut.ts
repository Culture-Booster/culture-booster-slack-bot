import { Trigger } from "deno-slack-api/types.ts";
import TicketGeneratorWorkflow from "../workflows/ticket_generator.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";

/**
 * This link trigger prompts the TicketGeneratorWorkflow workflow.
 */
const ticketGeneratorTrigger: Trigger<
  typeof TicketGeneratorWorkflow.definition
> = {
  type: TriggerTypes.Shortcut,
  name: "Create a ticket",
  description:
    "Creates a template ticket in Notion and notifies the engineering team.",
  workflow: `#/workflows/${TicketGeneratorWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
    channel: {
      value: TriggerContextData.Shortcut.channel_id,
    },
  },
};

export default ticketGeneratorTrigger;
