import React from "react";

function range(len: number) {
    const arr = [];
    for (let i = 0; i < len; i++) {
        arr.push(i);
    }
    return arr;
}

const newPerson = () => {
    const statusChance = Math.random();
    return {
        title: 'Mastering Bitcoin',
        progress: Math.floor(Math.random() * 100),
    };
};

export function makeData(len = 5553): any {
    return range(len).map(d => {
        return {
            ...newPerson(),
            children: range(10).map(newPerson)
        };
    });
}

export const Logo = () =>
    <div style={{ margin: '1rem auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center'}}>
</div>;

export const Tips = () =>
    <div style={{ textAlign: "center" }}>
    <em>Tip: Hold shift when sorting to multi-sort!</em>
    </div>;

export const Footer = () =>
    <footer style={{ textAlign: "center" }}>
    {/*Like Polar?  Show your love by giving us a Github star!*/}

    <div className="buttons">

        <div className="button">
            <a href="https://discord.gg/GT8MhA6">
                <img src="https://img.shields.io/discord/477560964334747668.svg?logo=discord"/>
            </a>
        </div>

        <div className="button">
            <a href="https://github.com/burtonator/polar-bookshelf/releases">
                <img src="https://img.shields.io/github/downloads/burtonator/polar-bookshelf/total.svg"/>
            </a>
        </div>

        <div className="button">
            <a href="https://github.com/burtonator/polar-bookshelf">
                <img src="https://img.shields.io/github/stars/burtonator/polar-bookshelf.svg?style=social&label=Star"/>
            </a>
        </div>

        <div className="button">
            <a href="https://twitter.com/getpolarized?ref_src=twsrc%5Etfw">
                <img src="https://img.shields.io/twitter/follow/getpolarized.svg?style=social&label=Follow"/>
            </a>
        </div>

    </div>

    {/*<div className="text-center p-1">*/}
        {/*<a href="https://opencollective.com/polar-bookshelf/donate" target="_blank">*/}
            {/*<img src="https://opencollective.com/polar-bookshelf/donate/button@2x.png?color=blue" width="250" />*/}
        {/*</a>*/}
    {/*</div>*/}

    </footer>;
