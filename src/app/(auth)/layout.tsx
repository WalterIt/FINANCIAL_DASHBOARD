
const LayoutPage = ({children} : {children : React.ReactNode}) => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {children}
    </div>
  )
}

export default LayoutPage