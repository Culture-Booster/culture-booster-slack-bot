import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { Client } from "https://deno.land/x/notion_sdk/src/mod.ts";
import { PageObjectResponse } from "https://deno.land/x/notion_sdk@v2.2.3/src/api-endpoints.ts";

/**
 * This custom function will take the initial form input, generate
 * a task in Notion with the Ticket template, and send a message to
 * the appropriate channel to notify them of a new ticket.
 */
export const TicketGeneratorSetupFunction = DefineFunction({
  callback_id: "ticket_generator_setup_function",
  title: "Ticket Generator",
  description: "Takes a ticket title and message and creates a new ticket.",
  source_file: "functions/ticket_generator.ts",
  input_parameters: {
    properties: {
      type: {
        type: Schema.types.array,
        description: "List of ticket types",
        items: {
          type: Schema.types.string,
        },
      },
      title: {
        type: Schema.types.string,
        description: "The ticket title",
      },
      message: {
        type: Schema.types.string,
        description: "The ticket message",
      },
      author: {
        type: Schema.slack.types.user_id,
        description:
          "The user ID of the person who created the welcome message",
      },
    },
    required: ["title", "type"],
  },
});

export default SlackFunction(
  TicketGeneratorSetupFunction,
  async ({ inputs, client, env }) => {
    const { type, title, message, author } = inputs;

    // Create a Notion client for creating pages and blocks
    const notion = new Client({
      auth: env.NOTION_SECRET,
    });

    const ticketType = type[0];

    // Generate the task in Notion
    const task = await notion.pages.create({
      icon: ticketType === "Ticket"
        ? {
          type: "external",
          external: { url: "https://www.notion.so/icons/ticket_orange.svg" },
        }
        : ticketType === "Bug"
        ? {
          type: "external",
          external: { url: "https://www.notion.so/icons/bug_red.svg" },
        }
        : {
          type: "external",
          external: {
            url: "https://www.notion.so/icons/light-bulb_yellow.svg",
          },
        },
      "parent": {
        "type": "database_id",
        "database_id": env.NOTION_DATABASE_ID,
      },
      "properties": {
        "title": [
          {
            "text": {
              "content": title ?? "",
            },
          },
        ],
        "%3E_rk": [{
          id: "Mobile",
          name: "Engineering",
          color: "purple",
        }],
        "notion%3A%2F%2Ftasks%2Ftags_property": [
          ticketType === "Ticket"
            ? {
              id: "=l~q",
              name: "Ticket",
              color: "gray",
            }
            : ticketType === "Bug"
            ? {
              name: "Bug",
              color: "red",
            }
            : {
              name: "Feature",
              color: "purple",
            },
        ],
        "notion%3A%2F%2Ftasks%2Fdue_date_property": {
          start: new Date().toISOString(),
        },
        "notion%3A%2F%2Ftasks%2Festimates_property": {
          id: "1",
          name: "1",
          color: "blue",
        },
      },
      "children": [
        {
          "object": "block",
          "heading_2": {
            "rich_text": [
              {
                "text": {
                  "content": "Description",
                },
              },
            ],
          },
        },
        {
          "object": "block",
          "paragraph": {
            "rich_text": [
              {
                "text": {
                  "content": message ?? "",
                },
              },
            ],
          },
        },
        {
          "object": "block",
          "heading_2": {
            "rich_text": [
              {
                "text": {
                  "content": "Additional Details",
                },
              },
            ],
          },
        },
      ],
    });

    if (task.object !== "page") {
      // The type defs don't seem to have an error option for if the task fails
      return { error: `Failed to create task: ${(task as any).message}` };
    }

    // Send a message to the appropriate channel to notify them of a new ticket
    const notificationMessage = await client.chat.postMessage({
      channel: ticketType === "Bug"
        ? env.ENGINEERING_CHANNEL
        : env.TEAM_CHANNEL,
      text: `${
        ticketType === "Bug" || ticketType === "Ticket" ? "<!here> " : ""
      }<@${author}> created a new ticket: ${(task as PageObjectResponse).url}`,
      user: author,
    });

    if (!notificationMessage.ok) {
      return {
        error:
          `Failed to send notification message: ${notificationMessage.error}`,
      };
    }

    return { outputs: {} };
  },
);
