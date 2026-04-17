import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it } from "vitest";

import { getErrorMessage } from "../get-error-message";

describe("getErrorMessage", () => {
  const fallbackMessage = "Something went wrong";

  it("returns error message from Axios error response data", () => {
    const axiosError = new AxiosError(
      "Request failed",
      "ERR_BAD_REQUEST",
      undefined,
      undefined,
      {
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: { headers: new AxiosHeaders() },
        data: { error: "Invalid API key" },
      },
    );

    expect(getErrorMessage(axiosError, fallbackMessage)).toBe(
      "Invalid API key",
    );
  });

  it("returns fallback when Axios error response has no error field", () => {
    const axiosError = new AxiosError(
      "Request failed",
      "ERR_BAD_REQUEST",
      undefined,
      undefined,
      {
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: { headers: new AxiosHeaders() },
        data: { message: "Some other format" },
      },
    );

    expect(getErrorMessage(axiosError, fallbackMessage)).toBe(fallbackMessage);
  });

  it("returns fallback when Axios error has no response", () => {
    const axiosError = new AxiosError("Network Error", "ERR_NETWORK");

    expect(getErrorMessage(axiosError, fallbackMessage)).toBe(fallbackMessage);
  });

  it("returns fallback when Axios error response data is null", () => {
    const axiosError = new AxiosError(
      "Request failed",
      "ERR_BAD_REQUEST",
      undefined,
      undefined,
      {
        status: 500,
        statusText: "Internal Server Error",
        headers: {},
        config: { headers: new AxiosHeaders() },
        data: null,
      },
    );

    expect(getErrorMessage(axiosError, fallbackMessage)).toBe(fallbackMessage);
  });

  it("returns fallback for regular Error objects", () => {
    const error = new Error("Regular error");

    expect(getErrorMessage(error, fallbackMessage)).toBe(fallbackMessage);
  });

  it("returns fallback for string errors", () => {
    expect(getErrorMessage("string error", fallbackMessage)).toBe(
      fallbackMessage,
    );
  });

  it("returns fallback for null/undefined", () => {
    expect(getErrorMessage(null, fallbackMessage)).toBe(fallbackMessage);
    expect(getErrorMessage(undefined, fallbackMessage)).toBe(fallbackMessage);
  });
});
