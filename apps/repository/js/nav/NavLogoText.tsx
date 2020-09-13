import * as React from "react";
import {deepMemo} from "../../../../web/js/react/ReactUtils";

export const NavLogoText = deepMemo(() => {
    return (
        <div style={{
                 paddingLeft: '5px',
                 paddingRight: '5px',
                 fontWeight: 'bold',
                 fontSize: '20px',
                 userSelect: 'none',
                 textDecoration: 'none'
             }}>
            POLAR
        </div>
    );

});
