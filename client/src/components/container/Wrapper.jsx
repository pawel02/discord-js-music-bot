const WRAPPER_STYLE = {
    backgroundColor: "#111D3B",
    margin: "1rem",
    padding: "0.8rem",
    borderRadius: ".5rem"
}

export const Wrapper = ({children}) => {
  return (
    <div style={WRAPPER_STYLE}>
        {children}
    </div>
  )
}
