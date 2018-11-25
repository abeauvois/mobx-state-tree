import React, { Component } from "react"
import { values } from "mobx"
import { observer } from "mobx-react"
import DevTools from "mobx-react-devtools"

import BoxView from "./box-view"
import ArrowView from "./arrow-view"
import Sidebar from "./sidebar"
import FunStuff from "./fun-stuff"

const onCanvasClick = store => e => {
    if (e.altKey === false) {
        store.setSelection(null)
    } else {
        store.createBox("Hi.", e.clientX - 50, e.clientY - 20, store.selection)
    }
}

const Canvas = ({ store }) => {
    return (
        <div className="app">
            <div className="canvas" onClick={onCanvasClick(store)}>
                <svg>
                    {store.arrows.map(arrow => (
                        <ArrowView arrow={arrow} key={arrow.id} />
                    ))}
                </svg>
                {values(store.boxes).map(box => (
                    <BoxView box={box} store={store} key={box.id} />
                ))}
            </div>
            <Sidebar store={store} />
            <FunStuff />
            <DevTools />
        </div>
    )
}

export default observer(Canvas)
