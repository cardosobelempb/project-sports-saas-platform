// user-create.usecase.spec.ts

import { describe, expect, it, vi } from "vitest";
import { UserCreateUseCase } from "../../user-create.usecase";

describe("UserCreateUseCase", () => {
  it("should create user", async () => {
    const fakeRepo = {
      create: vi.fn(),
    };

    const useCase = new UserCreateUseCase(fakeRepo as any);

    await useCase.execute({
      email: "john@email.com",
      passwordHash: "12345678",
    });

    expect(fakeRepo.create).toHaveBeenCalled();
  });
});
