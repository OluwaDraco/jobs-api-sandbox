import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
const doc = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.JOBS_TABLE!;

export const handler = async (event: any) => {
    const input = JSON.parse(event.body ?? "{}");
    const id = `job_${crypto.randomUUID().replace(/-/g, "").slice(0, 8)}`;

    const job = {
        pk: id,
        gsi1pk: "JOB",
        id,
        posted_at: new Date().toISOString(),
        ...input,
    };

    await doc.send(new PutCommand({ TableName: TABLE, Item: job }));
    return { statusCode: 201, body: JSON.stringify(job) };
};
