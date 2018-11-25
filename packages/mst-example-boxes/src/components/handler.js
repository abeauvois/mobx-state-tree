import React, { Component } from "react"
import { observer } from "mobx-react"
import { DraggableCore } from "react-draggable"

const handlerStyles = ({ height }) => ({
    position: "absolute",
    width: 10,
    height: 10,
    left: -7,
    top: height,
    background: "green",
    borderRadius: "50%"
})

const Handler = props => {
    return (
        <DraggableCore
            onDrag={props.handleDrag}
            onStart={props.handleStartDrag}
            onStop={props.handleStopDrag}
        >
            <div
                style={handlerStyles(props.box)}
                onMouseEnter={props.handleHover}
                onMouseLeave={props.handleHover}
                onClick={props.handleClick}
            />
        </DraggableCore>
    )
}

export default observer(Handler)
