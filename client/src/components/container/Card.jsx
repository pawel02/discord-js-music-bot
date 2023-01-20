import React from 'react'

const CARD_STYLE = {
    backgroundColor: "#111D3B",
    flex: "1 0 250px",
    margin: "85px 1rem 0 1rem",
    position: "relative",
    padding: "0.8rem",
    display: "flex",
    alignItems: "center",
    flexDirection: "column"
}

export const Card = ({children}) => {
    return (
    <div style={CARD_STYLE}>
        {children}
    </div>
  )
}
