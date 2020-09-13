import React from 'react';
import {EPUBContextMenuRoot} from '../doc/src/renderers/epub/contextmenu/EPUBContextMenuRoot';
import {Resizable} from "../../web/js/ui/resizable/Resizable";
import {UploadProgressDialog} from "../../web/js/ui/dialogs/UploadProgressDialog";
import {MUIAppRoot} from "../../web/js/mui/MUIAppRoot";

const IFrameContent = React.memo(() => {

    const content = `    
        <html>
        <body>

        <p>
            first para
        </p>

        <p>
            second para
        </p>

        </body>
        </html>
    `;

    return (
        <div>
            <iframe srcDoc={content}></iframe>
        </div>
    );
});



// sets up finder and context


export const App = () => (
    <MUIAppRoot>

        <div style={{height: '1200px', position: 'absolute'}}>

            <div style={{
                     position: "absolute",
                     top: '100px',
                     left: '100px',
                     width: '800px',
                     height: '1000px',
                     marginLeft: 'auto',
                     marginRight: 'auto',
                     backgroundColor: 'orange',
                     // position: 'relative'
                 }}>

                <Resizable computeInitialPosition={() => ({
                               top: 0,
                               left: 0,
                               width: 100,
                               height: 100
                           })}
                           bounds="parent"
                           color="rgb(255, 0, 0)"/>


            </div>

            {/*<UploadProgressDialog value='indeterminate'/>*/}

        </div>

    </MUIAppRoot>
);
