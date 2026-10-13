import { describe, expect, it } from "vitest";
import {
  ApiError,
  fieldErrorsFromApiDetails,
  getErrorMessage,
  isApiError,
} from "../../utils/apiError";

describe("ApiError", () => {
  it("porte le statut, le code et les détails", () => {
    const err = new ApiError(409, "Tag déjà pris", "TAG_TAKEN", []);
    expect(err).toBeInstanceOf(Error);
    expect(isApiError(err)).toBe(true);
    expect(err).toMatchObject({
      statusCode: 409,
      code: "TAG_TAKEN",
      details: [],
    });
  });

  it("isApiError refuse une Error ordinaire", () => {
    expect(isApiError(new Error("x"))).toBe(false);
  });
});

describe("getErrorMessage", () => {
  it("renvoie le message de l'erreur s'il existe", () => {
    expect(getErrorMessage(new ApiError(400, "Titre requis"), "Repli")).toBe(
      "Titre requis",
    );
  });

  it("renvoie le repli pour une valeur qui n'est pas une Error ou un message vide", () => {
    expect(getErrorMessage("oups", "Repli")).toBe("Repli");
    expect(getErrorMessage(new Error(""), "Repli")).toBe("Repli");
  });
});

describe("fieldErrorsFromApiDetails", () => {
  it("garde le premier message par champ", () => {
    expect(
      fieldErrorsFromApiDetails([
        { path: ["email"], message: "Email requis" },
        { path: ["email"], message: "Email invalide" },
        { path: ["name"], message: "Nom requis" },
      ]),
    ).toEqual({ email: "Email requis", name: "Nom requis" });
  });

  it("renvoie null si les détails sont absents ou inexploitables", () => {
    expect(fieldErrorsFromApiDetails(undefined)).toBeNull();
    expect(fieldErrorsFromApiDetails([{ foo: "bar" }])).toBeNull();
  });
});
