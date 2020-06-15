import React, { useState } from 'react';

import { CustomColorDialogProps } from './CustomColorDialog.d';
import { Dialog } from 'evergreen-ui';
import { ChromePicker } from 'react-color';

import './override.css';

export default function(props: CustomColorDialogProps): JSX.Element {

    const [col, setCol] = useState(props.initialCol);
    
    return (
        <Dialog 
            isShown={props.show}
            hasHeader={false}
            onConfirm={(close) => {
                props.onConfirm(col);
                close();
            }}
            onCloseComplete={() => props.onClose()}
        >
            <ChromePicker 
                disableAlpha
                color={col}
                onChangeComplete={(color, event) => setCol(color.hex)}
            />
        </Dialog>
    );
}