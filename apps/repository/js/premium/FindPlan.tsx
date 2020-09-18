import {deepMemo} from "../../../../web/js/react/ReactUtils";
import React from "react";

export const FindPlan = deepMemo(() => {

    return (
        <div>
            <h2 className="text-tint text-left">

                Find a plan<br/>

                {/*<span className="text-large">that's right for you.</span>*/}

            </h2>


            <p>
                We have both yearly and monthly plans.  Get a free
                month of service if you buy for a whole year!
            </p>

        </div>
    );

});
