import { describe, expect, it } from "@jest/globals";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `http://localhost:${process.env.NODEJS_PORT}/graphql`,
  method: "POST",
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
});

/**
 * Just testing can hit the endpoint.
 */
describe("The graphQL API should receive incoming requests (if express is running)", () => {
  it("should allow requests to the graphQL endpoint", async () => {
    const gql = {
      query: `
        {
          test
        }
      `,
    };

    await axiosInstance({ data: JSON.stringify(gql) })
      .then((result) => result.data.data)
      .then((data) => {
        expect(data).toHaveProperty("test");
        expect(data.test).toBe(true);
      });
  });
});
