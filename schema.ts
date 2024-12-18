import { Entity, type EntityItem } from "electrodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  endpoint: "http://localhost:4566",
});

export const senderId = new Entity(
  {
    model: {
      entity: "SenderID",
      service: "KSenderIDService",
      version: "1",
    },
    attributes: {
      phoneNumber: {
        type: "string",
        required: true,
      },
      channel: {
        type: ["sms", "mms", "rcs", "whatsapp"],
        required: true,
      },
      supported: {
        type: "boolean",
        required: true,
        default: false,
      },
      createdAt: {
        type: "number",
        default: () => Date.now(),
        // cannot be modified after created
        readOnly: true,
      },
      updatedAt: {
        type: "number",
        // watch for changes to any attribute
        watch: "*",
        // set current timestamp when updated
        set: () => Date.now(),
        default: () => Date.now(),
      },
    },
    indexes: {
      phoneNumbers: {
        pk: {
          field: "pk",
          composite: ["phoneNumber"],
        },
        sk: {
          field: "sk",
          composite: ["channel", "updatedAt"],
        },
      },
      capabilities: {
        collection: "capabilities",
        index: "gsi1pk-gsi1sk-index",
        pk: {
          field: "gsi1pk",
          composite: ["channel"],
        },
        sk: {
          field: "gsi1sk",
          composite: ["supported", "updatedAt"],
        },
      },
    },
  },
  { table: "phone_number_capability", client },
);

export type SenderIdEntityItem = EntityItem<typeof senderId>;
