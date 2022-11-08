const { describe, it } = require("mocha");
const { expect } = require("chai");
const sinon = require("sinon");
const axios = require("axios");

/** @todo Stub the API call and return perfect response **/
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/graphql",
  method: "POST",
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
});

/**
 * Just testing the GraphQL endpoint - typically wouldn't do this or maybe stub it
 */
describe("The graphQL API should receive incoming requests", () => {
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
        expect(data).to.haveOwnProperty("test");
        expect(data.test).to.eq(true);
      });
  });
});
