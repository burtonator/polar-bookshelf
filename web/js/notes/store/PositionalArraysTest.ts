import {PositionalArrays} from "./PositionalArrays";
import PositionalArray = PositionalArrays.PositionalArray;
import {assertJSON} from "../../test/Assertions";

describe("PositionalArrays", () => {

    it("basic", () => {

        let arr: PositionalArray<string> = {};
        arr = PositionalArrays.append(arr, '0x123');

        assertJSON(arr, {
            "1": "0x123"
        });

    });

    it("multiple appends", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '0x123');
        arr = PositionalArrays.append(arr, '0x234');

        assertJSON(arr, {
            "1": "0x123",
            "2": "0x234"
        });

    });

    it("remove", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '0x123');

        assertJSON(arr, {
            "1": "0x123",
        });

        arr = PositionalArrays.remove(arr, '0x123');

        assertJSON(arr, {
        });

    });

    it("insert after", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '0x123');

        assertJSON(arr, {
            "1": "0x123",
        });

        arr = PositionalArrays.insert(arr, '0x123', '0x234', 'after');

        assertJSON(arr, {
            "1": "0x123",
            "2": "0x234"
        });

    });

    it("insert before", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '0x123');

        assertJSON(arr, {
            "1": "0x123",
        });

        arr = PositionalArrays.insert(arr, '0x123', '0x234', 'before');

        assertJSON(arr, {
            "0": "0x234",
            "1": "0x123",
        });

    });

    it("insert before (2x)", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '0x123');

        assertJSON(arr, {
            "1": "0x123",
        });

        arr = PositionalArrays.insert(arr, '0x123', '0x234', 'before');
        assertJSON(PositionalArrays.toArray(arr), ['0x234', '0x123']);

        arr = PositionalArrays.insert(arr, '0x234', '0x345', 'before');
        assertJSON(PositionalArrays.toArray(arr), ['0x345', '0x234', '0x123']);

        assertJSON(arr, {
            "-1": "0x345",
            "0": "0x234",
            "1": "0x123",
        });

    });

    it("insert between (before)", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '0x123');
        arr = PositionalArrays.append(arr, '0x234');

        arr = PositionalArrays.insert(arr, '0x234', '0x345', 'before');

        assertJSON(arr, {
            "1": "0x123",
            "2": "0x234",
            "1.5": "0x345",
        });

    });

    it("insert between (after)", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '0x123');
        arr = PositionalArrays.append(arr, '0x234');

        arr = PositionalArrays.insert(arr, '0x123', '0x345', 'after');

        assertJSON(arr, {
            "1": "0x123",
            "2": "0x234",
            "1.5": "0x345",
        });

    });


    it("insert between (after) ... with negative values", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '1');
        arr = PositionalArrays.insert(arr, '1', '2', 'before');
        arr = PositionalArrays.insert(arr, '2', '3', 'before');

        assertJSON(PositionalArrays.toArray(arr), ['3', '2', '1']);

        assertJSON(arr, {
            "0": "2",
            "1": "1",
            "-1": "3"
        });

        arr = PositionalArrays.insert(arr, '3', '4', 'after');
        assertJSON(PositionalArrays.toArray(arr), ['3', '4', '2', '1']);

        assertJSON(arr, {
            "0": "2",
            "1": "1",
            "-0.5": "4",
            "-1": "3"
        });


    });

    it("multiple insertions.. including negative and in between", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '0x1');
        assertJSON(PositionalArrays.toArray(arr), ['0x1']);

        assertJSON(arr, {
            "1": "0x1",
        });

        arr = PositionalArrays.insert(arr, '0x1', '0x2', 'before');
        assertJSON(PositionalArrays.toArray(arr), ['0x2', '0x1']);

        assertJSON(arr, {
            "0": "0x2",
            "1": "0x1",
        });

        arr = PositionalArrays.insert(arr, '0x2', '0x3', 'before');
        assertJSON(PositionalArrays.toArray(arr), ['0x3', '0x2', '0x1']);

        assertJSON(arr, {
            "0": "0x2",
            "1": "0x1",
            "-1": "0x3"
        });

        arr = PositionalArrays.insert(arr, '0x3', '0x4', 'before');
        assertJSON(PositionalArrays.toArray(arr), ['0x4', '0x3', '0x2', '0x1']);

        assertJSON(arr, {
            "0": "0x2",
            "1": "0x1",
            "-1": "0x3",
            "-2": "0x4"
        });

        // the ptr should be to 0x4 and have a base of -2 and a delta of 0.5 which would set it to -1.5

        arr = PositionalArrays.insert(arr, '0x4', '0x5', 'after');

        assertJSON(PositionalArrays.toArray(arr), ['0x4', '0x5', '0x3', '0x2', '0x1']);

        assertJSON(arr, {
            "0": "0x2",
            "1": "0x1",
            "-1": "0x3",
            "-1.5": "0x5",
            "-2": "0x4"
        });

    });

    it("double (idempotent) remove", () => {

        let arr: PositionalArray<string> = {};

        arr = PositionalArrays.append(arr, '0x123');
        arr = PositionalArrays.remove(arr, '0x123');
        arr = PositionalArrays.remove(arr, '0x123');

        assertJSON(arr, {
        });

    });


    it("create with existing values", () => {

        const arr: PositionalArray<string> = PositionalArrays.create(['1', '2', '3']);

        assertJSON(arr, {
            "1": "1",
            "2": "2",
            "3": "3"
        });

        assertJSON(PositionalArrays.toArray(arr), ['1', '2', '3']);

    });


});

