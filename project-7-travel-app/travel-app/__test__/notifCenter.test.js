// Import the js file to test
import { notifCenter } from "../src/client/js/base";

describe("Testing notification Center", () => {
    test("Testing the notifCenter() function", () => {
        expect(notifCenter).toBeDefined();
    })
});