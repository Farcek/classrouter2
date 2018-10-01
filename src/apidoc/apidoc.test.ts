import "reflect-metadata";

import { suite, test } from "mocha-typescript";
import { assert } from "chai";
import { Property, Type } from "@napp/common";


class BaGroup {
    @Property()
    name: string;

    
    @Type(Number, true)
    location: number[];
}


class BarName {
    @Property()
    name: string

    @Property()
    group: BaGroup
}








@suite
export class ApidocTest {


    @test
    schemaFactiryBasic() {
    }

    
}
