// Import the js file to test
import { reloadWeb } from "../src/client/js/helper";

describe("Testing notification Center", () => {
    test("Testing the reloadWeb() function", () => {
        expect(reloadWeb).toBeDefined();
    })
});