import * as React from "react"
import {
    Frame,
    addPropertyControls,
    ControlType,
    useNavigation,
    useIsInCurrentNavigationTarget,
    Override,
    RenderTarget,
} from "framer"

type KeyboardProps = {
    ctrl: boolean
    useEverywhere: boolean
    hitkey: string
    targetFrame: any
}

export const KeyboardLink = (props: KeyboardProps) => {
    let [controlEnabled, setControlEnabled] = React.useState(false)

    let inFramer = RenderTarget.current() == RenderTarget.canvas

    // Check if the control should be enabled in this frame
    const inView = useIsInCurrentNavigationTarget()
    if (inView && !controlEnabled) {
        setControlEnabled(true)
    } else if (!inView && controlEnabled) {
        setControlEnabled(false)
    }

    const navigation = useNavigation()
    React.useEffect(() => {
        const handleKeydown = (event) => {
            if (
                (controlEnabled || props.useEverywhere) &&
                event.ctrlKey == props.ctrl &&
                event.key == props.hitkey
            ) {
                navigation.instant(props.targetFrame)
            }
        }
        document.addEventListener("keydown", handleKeydown)
        return () => {
            document.removeEventListener("keydown", handleKeydown)
        }
    }, [controlEnabled, props.useEverywhere])
    return (
        <Frame
            style={
                // Only render something when working in Framer
                inFramer
                    ? {
                          background: "rgba(187, 102, 204, 0.2)",
                          border: "dotted 2px #BB66CC",
                          borderRadius: 4,
                      }
                    : null
            }
            visible={inFramer ? true : false}
        ></Frame>
    )
}

KeyboardLink.defaultProps = {
    hitkey: "q",
    ctrl: true,
    useEverywhere: false,
}

addPropertyControls(KeyboardLink, {
    hitkey: {
        title: "Key",
        type: ControlType.String,
        defaultValue: "q",
    },
    ctrl: {
        title: "Hold Control",
        type: ControlType.Boolean,
        defaultValue: true,
    },
    targetFrame: {
        title: "Target: ",
        type: ControlType.ComponentInstance,
    },
    useEverywhere: {
        title: "Use everywhere",
        type: ControlType.Boolean,
        defaultValue: false,
    },
})
