import { Manifest } from "deno-slack-sdk/mod.ts";
import { TicketGeneratorWorkflow } from "./workflows/ticket_generator.ts";

export default Manifest({
  name: "Culture Booster Slack Bot",
  description:
    "Internal Slack bot to help with automating Culture Booster activities",
  icon: "assets/logo512.png",
  // A list of our custom workflows
  workflows: [TicketGeneratorWorkflow],
  // Need to add the outgoingDomains for the Notion API to avoid CORS issues
  outgoingDomains: ["api.notion.com"],
  // No datastores yet
  datastores: [],
  // Scopes to grant access to actions in slack
  botScopes: [
    "chat:write",
    "chat:write.public",
    "channels:read",
    "triggers:write",
    "triggers:read"
  ],
});
