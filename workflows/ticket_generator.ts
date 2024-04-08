import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { TicketGeneratorSetupFunction } from "../functions/ticket_generator.ts";

/**
 * The TicketGeneratorWorkflow opens a form where the user creates a
 * ticket message. The trigger for this workflow is found in
 * `/triggers/ticket_generator_shortcut.ts`
 */
export const TicketGeneratorWorkflow = DefineWorkflow({
  callback_id: "ticket_generator_workflow",
  title: "Create a Ticket",
  description: " Creates ticket in Notion and notifies the team",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["interactivity"],
  },
});

/**
 * This step uses the OpenForm Slack function. The form has two
 * inputs -- a welcome message and a channel id for that message to
 * be posted in.
 */
const SetupWorkflowForm = TicketGeneratorWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Create Ticket",
    submit_label: "Submit",
    description: ":thinking_face: What's on your mind?",
    interactivity: TicketGeneratorWorkflow.inputs.interactivity,
    fields: {
      required: ["messageTitle"],
      elements: [
        {
          name: "messageTitle",
          title: "Short title for your request",
          type: Schema.types.string,
          long: false,
        },
        {
          name: "messageInput",
          title: "A small description of your request",
          type: Schema.types.string,
          long: true,
        },
      ],
    },
  },
);

/**
 * This step takes the form output and passes it along to a custom
 * function which creates the ticket.
 * See `/functions/ticket_generator.ts` for more information.
 */
TicketGeneratorWorkflow.addStep(TicketGeneratorSetupFunction, {
  title: SetupWorkflowForm.outputs.fields.messageTitle,
  message: SetupWorkflowForm.outputs.fields.messageInput,
  author: TicketGeneratorWorkflow.inputs.interactivity.interactor.id,
});

/**
 * This step uses the SendEphemeralMessage Slack function.
 * An ephemeral confirmation message will be sent to the user
 * creating the welcome message, after the user submits the above
 * form.
 */
// TicketGeneratorWorkflow.addStep(Schema.slack.functions.SendEphemeralMessage, {
//   channel_id: SetupWorkflowForm.outputs.fields.channel,
//   user_id: TicketGeneratorWorkflow.inputs.interactivity.interactor.id,
//   message: `Your ticket was created and the team was notified! :disco_pug:`,
// });

export default TicketGeneratorWorkflow;
