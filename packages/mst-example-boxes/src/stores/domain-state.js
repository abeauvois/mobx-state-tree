import { runInAction, values } from "mobx"
import { types, getSnapshot, applySnapshot, getParent, hasParent } from "mobx-state-tree"

import { randomUuid } from "../utils"

export const Box = types
    .model("Box", {
        id: types.identifier,
        name: "hal",
        x: 0,
        y: 0,
        height: 0,
        dragging: false,
        resizing: false
    })
    .views(self => ({
        get width() {
            return self.name.length * 15
        },
        get isSelected() {
            if (!hasParent(self)) return false
            return getParent(self, 2).selection === self
        },
        get isHovered() {
            if (!hasParent(self)) return false
            return getParent(self, 2).hovered === self
        },
        get handlers() {
            return [{ x: self.width / 2, y: 20 }]
        }
    }))
    .actions(self => ({
        move(dx, dy) {
            if (!self.resizing) {
                self.x += dx
                self.y += dy
            }
        },
        resize(dx, dy) {
            self.height += dy
        },
        setName(newName) {
            self.name = newName
        },
        setDragging() {
            self.dragging = !self.dragging
        },
        setResizing(isResizing) {
            self.resizing = isResizing
        }
    }))

export const Arrow = types.model("Arrow", {
    id: types.identifier,
    from: types.reference(Box),
    to: types.reference(Box)
})

export const Store = types
    .model("Store", {
        boxes: types.map(Box),
        arrows: types.array(Arrow),
        selection: types.maybeNull(types.reference(Box)),
        hovered: types.maybeNull(types.reference(Box))
    })
    .actions(self => ({
        addBox(name, x, y) {
            const box = Box.create({ name, x, y, id: randomUuid() })
            self.boxes.put(box)
            return box
        },
        addArrow(from, to) {
            self.arrows.push({ id: randomUuid(), from, to })
        },
        setSelection(selection) {
            self.selection = selection
        },

        setHovered(hovered) {
            if (self.hovered) {
                self.hovered = null
            } else {
                self.hovered = hovered
            }
        },
        createBox(name, x, y, source) {
            const box = self.addBox(name, x, y)
            self.setSelection(box)
            if (source) self.addArrow(source.id, box.id)
        }
    }))

/*
    The store that holds our domain: boxes and arrows
*/
const store = Store.create({
    boxes: {
        "ce9131ee-f528-4952-a012-543780c5e66d": {
            id: "ce9131ee-f528-4952-a012-543780c5e66d",
            name: "Rotterdam",
            x: 100,
            y: 100
        },
        "14194d76-aa31-45c5-a00c-104cc550430f": {
            id: "14194d76-aa31-45c5-a00c-104cc550430f",
            name: "Bratislava",
            x: 650,
            y: 300
        },
        "14194d76-aa31-45c5-a00c-104cc550430e": {
            id: "14194d76-aa31-45c5-a00c-104cc550430e",
            name: "Bratislava2",
            x: 652,
            y: 350
        }
    },
    arrows: [
        {
            id: "7b5d33c1-5e12-4278-b1c5-e4ae05c036bd",
            from: "ce9131ee-f528-4952-a012-543780c5e66d",
            to: "14194d76-aa31-45c5-a00c-104cc550430f"
        }
    ],
    selection: null
})

export default store
window.store = store // for demo

/**
    Generate 'number' new random arrows and boxes
*/
export function generateStuff(number) {
    runInAction(() => {
        for (let i = 0; i < number; i++) {
            store.addBox(
                "#" + i,
                Math.random() * window.innerWidth * 0.5,
                Math.random() * window.innerHeight
            )
        }
        const allBoxes = values(store.boxes)
        for (let i = 0; i < number; i++) {
            store.addArrow(
                allBoxes[Math.floor(Math.random() * allBoxes.length)],
                allBoxes[Math.floor(Math.random() * allBoxes.length)]
            )
        }
    })
}

/**
    Save / Restore the state of the store while self module is hot reloaded
*/
if (module.hot) {
    if (module.hot.data && module.hot.data.store) {
        applySnapshot(store, module.hot.data.store)
    }
    module.hot.dispose(data => {
        data.store = getSnapshot(store)
    })
}
