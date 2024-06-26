
const LayoutPage = ({children} : {children : React.ReactNode}) => {
  return (
    <div className='flex h-full justify-center items-center bg-gradient-to-b from-sky-400 to-sky-800'>
        {children}
    </div>
  )
}

export default LayoutPage