import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const doc = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.JOBS_TABLE!;

const jobs = [
    {
        id: "job_8f3kd92m",
        title: "Build a React dashboard for inventory tracking",
        description:
            "Looking for a developer to build an internal dashboard for warehouse inventory levels, with charts and CSV export.",
        posted_at: "2026-08-15T14:22:04Z",
        budget: {
            type: "fixed",
            amount: "1500.00",
            currency: "USD",
        },
        engagement: {
            workload: "30+ hrs/week",
            duration: "1 to 3 months",
        },
        skills: ["react", "typescript", "postgresql"],
        client: {
            id: "cl_2k9dm4",
            name: "Northwind Supply Co.",
            country: "US",
            verified: true,
            jobs_posted: 14,
        },
        source_url: "https://sandbox.example/jobs/job_8f3kd92m",
    },
    // add 5–10 more, varied
];

for (const job of jobs) {
    doc.send(
        new PutCommand({
            TableName: TABLE,
            Item: { pk: job.id, gsi1pk: "JOB", ...job },
        }),
    );
    console.log("seeded", job.id);
}
