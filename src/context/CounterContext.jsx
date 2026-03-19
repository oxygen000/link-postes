import { createContext } from "react"



export let counterContext = createContext()

export default function CounterContext({children}) {
  return (
    <>

    <counterContext.Provider value={{count: 0}}>
    {children}
    </counterContext.Provider>
    </>
  )
}
