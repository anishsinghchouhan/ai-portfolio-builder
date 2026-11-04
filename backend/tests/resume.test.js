import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createResumeSchema } from "../src/controllers/resumeController.js";

describe("Resume Controller & Schema Suite", () => {
  it("successfully validates a complete resume payload", () => {
    const payload = {
      fileName: "Anish_Singh_Resume_2026.pdf",
      fileSize: 1024 * 500, // 500 KB
      fileUrl: "/uploads/Anish_Singh_Resume_2026.pdf",
      parsedData: {
        personalInfo: { fullName: "Anish Singh", email: "anish@example.com" },
        skills: ["React", "Node.js"],
      },
    };

    const validated = createResumeSchema.parse(payload);
    assert.equal(validated.fileName, "Anish_Singh_Resume_2026.pdf");
    assert.equal(validated.fileSize, 512000);
    assert.deepEqual(validated.parsedData.skills, ["React", "Node.js"]);
  });

  it("applies default fileUrl if omitted", () => {
    const payload = {
      fileName: "portfolio-cv.pdf",
      fileSize: 2048,
    };

    const validated = createResumeSchema.parse(payload);
    assert.equal(validated.fileUrl, "/uploads/resume.pdf");
  });

  it("rejects payload when fileName is empty", () => {
    assert.throws(() => {
      createResumeSchema.parse({
        fileName: "   ",
        fileSize: 1024,
      });
    });
  });

  it("rejects files exceeding 10 MB limit", () => {
    assert.throws(() => {
      createResumeSchema.parse({
        fileName: "oversized.pdf",
        fileSize: 15 * 1024 * 1024, // 15 MB
      });
    });
  });

  it("rejects unknown forbidden fields in payload", () => {
    assert.throws(() => {
      createResumeSchema.parse({
        fileName: "test.pdf",
        fileSize: 1024,
        isAdmin: true,
      });
    });
  });
});

