import React from 'react';

const caret: React.CSSProperties = {

    display: 'inline-block',
    width: 0,
    height: 0,
    marginLeft: '.255em',
    verticalAlign: '.255em',
    borderTop: '.3em solid',
    borderRight: '.3em solid transparent',
    borderBottom: 0,
    borderLeft: '.3em solid transparent',
    color: 'var(--secondary)'

};

type IMUIDropdownCaretProps = {
    className?: string;
    style?: React.CSSProperties;
}

export const MUIDropdownCaret: React.FC<IMUIDropdownCaretProps> = ({ className = "", style = {} }) => (
    <span style={{ ...caret, ...style }} className={className} />
);
