import React from 'react';

import CSS from './NavigationItems.module.scss';
import { NavigationItemsProps } from './NavigationItems.d';
import { toCss } from './../../../util/util';
import NavigationItem from './navigationItem/NavigationItem';
const {
    navItems: s_navItems,
} = CSS;

export default function(props: NavigationItemsProps): JSX.Element {

    return (
        <ul className={toCss(s_navItems)}>
            {props.items.map(config => (
                <NavigationItem 
                    key={config.link}
                    link={config.link}
                    onClick={() => {
                        if (props.onItemClicked) {
                            props.onItemClicked();
                        }
                    }}
                >
                    {config.label}
                </NavigationItem>
            ))}
        </ul>
    );
}