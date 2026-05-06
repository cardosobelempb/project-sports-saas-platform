// test/user.e2e.spec.ts

import { buildApp } from "@/common/infrastructure/http/app";
import request from "supertest";
import { describe, expect, it } from "vitest";

describe("User Create", () => {
  it("should create user", async () => {
    const app = await buildApp();

    const response = await request(app.server).post("/users").send({
      email: "john@email.com",
      password: "12345678",
    });

    expect(response.status).toBe(201);
  });
});
