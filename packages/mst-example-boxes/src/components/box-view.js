import React, { Component } from "react"
import { observer } from "mobx-react"
import { DraggableCore } from "react-draggable"

import Handler from "./handler"

const boxStyles = {
    padding: "20px 0",
    border: "2px solid white",
    position: "absolute",
    borderRadius: "8px",
    backgroundColor: "#2d3e4e",
    cursor: "pointer",
    color: "white",
    whiteSpace: "nowrap",
    fontFamily: "arial",
    fontWeight: 800,
    textAlign: "center",
    // - webkit - touch - callout: none,
    WebkitUserSelect: "none"
}

const getStyleForState = props => ({
    isSelected: {
        backgroundColor: "red"
    },
    isHovered: {
        border: "solid 2px blue",
        boxShadow: "0 0 30px blue"
    }
})

const getStyles = states => {
    return Object.keys(states).reduce((styles, key) => {
        if (states[key]) {
            return { ...styles, ...getStyleForState()[key] }
        } else {
            return styles
        }
    }, {})
}

const handleClick = (store, box) => e => {
    store.setSelection(box.id)
    e.stopPropagation()
}
const handleHover = (store, box) => e => {
    store.setHovered(box.id)
    e.stopPropagation()
}
const handleMoveDrag = (store, box) => (e, dragInfo) => {
    box.move(dragInfo.deltaX, dragInfo.deltaY)
}
const handlerResizeDrag = (store, box) => (e, dragInfo) => {
    box.resize(dragInfo.deltaX, dragInfo.deltaY)
}
const handlerStartDrag = (store, box) => (e, dragInfo) => {
    box.setResizing(true)
}
const handlerStopDrag = (store, box) => (e, dragInfo) => {
    box.setResizing(false)
}
const BoxView = ({ store, box }) => {
    const { x, y } = box.handlers[0]
    return (
        <DraggableCore onDrag={handleMoveDrag(store, box)}>
            <div
                style={{
                    ...boxStyles,
                    width: box.width,
                    left: box.x,
                    top: box.y,
                    height: box.height,
                    ...getStyles({
                        isSelected: box.isSelected,
                        isHovered: box.isHovered
                    })
                }}
                onMouseEnter={handleHover(store, box)}
                onMouseLeave={handleHover(store, box)}
                onClick={handleClick(store, box)}
            >
                {box.isHovered && (
                    <Handler
                        box={box}
                        handleDrag={handlerResizeDrag(store, box)}
                        handleStartDrag={handlerStartDrag(store, box)}
                        handleStopDrag={handlerStopDrag(store, box)}
                    />
                )}
                {box.name}
            </div>
        </DraggableCore>
    )
}

export default observer(BoxView)
