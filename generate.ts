import { faker } from "@faker-js/faker";
import { senderId, type SenderIdEntityItem } from "./schema";

const generate = (count: number): SenderIdEntityItem[] => {
  const results: SenderIdEntityItem[] = [];

  for (let i = 0; i < count; i++) {
    const phoneNumber = faker.phone.number();
    const channel = faker.helpers.arrayElement([
      "sms",
      "mms",
      "rcs",
      "whatsapp",
    ]);
    const supported = true;

    results.push({
      phoneNumber,
      channel,
      supported,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  return results;
};

senderId.put(generate(10)).go({ concurrency: 10 });
