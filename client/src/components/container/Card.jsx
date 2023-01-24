import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

const CARD_STYLE = {
    backgroundColor: "#111D3B",
    flex: "1 0 250px",
    margin: "1rem",
    position: "relative",
    padding: "0.8rem",
    display: "flex",
    alignItems: "center",
    flexDirection: "column"
}

export const Card = ({ children, variant }) => {
    const [backgroundColor, setBackgroundColor] = useState(variant)

    useEffect(() => {
        switch (variant) {
            case "primary":
                setBackgroundColor("#1A2C58")
                break;
            case "secondary":
                setBackgroundColor("#111D3B")
                break;
            case "container":
                setBackgroundColor("#0A1122")
                break;
            default:
                setBackgroundColor("#0A1122")
                break;
        }
    }, [variant])
    return (
        <div style={{...CARD_STYLE, backgroundColor}}>
            {children}
        </div>
    )
}
