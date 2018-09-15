import "reflect-metadata";

import { suite, test } from "mocha-typescript";
import { assert } from "chai";
import { Property, Type } from "@napp/common";
import { schemaFactory } from "./openapi";

class BaGroup {
    @Property()
    name: string;

    //@Property({ type: Number, isArray: true })
    @Type(Number, true)
    location: number[];
}

const BaGroupJson = {
    "BaGroup": {
        "type": "object",
        "required": [],
        "properties": {
            "name": {
                "type": "string"
            },
            "location": {
                "type": "int"
            }
        }
    }
};

class BarName {
    @Property()
    name: string


    @Property()
    group: BaGroup
}



class FooClass {

    @Property()
    int1: number;

    @Type(Number)
    int2: any;


    @Property()
    bar1: BarName;


    @Type(BarName)
    bar2: any;
}




@suite
export class OpenapiTest {


    @test
    schemaFactiryBasic() {
        let container = {};
        schemaFactory(BaGroup, false, container);
        console.log(JSON.stringify(container, null, 5));
        //assert.equal(JSON.stringify(BaGroupJson), JSON.stringify(container));
    }

    // @test
    schemaFactiryLinked() {

        let json = {
            "FooClass": {
                "type": "object",
                "required": [],
                "properties": {
                    "int1": {
                        "type": "int"
                    },
                    "int2": {
                        "type": "int"
                    },
                    "bar1": {
                        "$ref": "#/components/schemas/BarName"
                    },
                    "bar2": {
                        "$ref": "#/components/schemas/BarName"
                    }
                }
            },
            "BarName": {
                "type": "object",
                "required": [],
                "properties": {
                    "name": {
                        "type": "string"
                    },
                    "group": {
                        "$ref": "#/components/schemas/BaGroup"
                    }
                }
            },
            "BaGroup": {
                "type": "object",
                "required": [],
                "properties": {
                    "name": {
                        "type": "string"
                    },
                    "location": {
                        "type": "int"
                    }
                }
            }
        };

        var container = {};
        schemaFactory(FooClass, false, container);
        assert.equal(JSON.stringify(container), JSON.stringify(json));
    }
}
