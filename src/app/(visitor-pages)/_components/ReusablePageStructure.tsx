import { ReactNode } from "react"
interface ReusablePageStructureProps {
    children: ReactNode
  }

const ReusablePageStructure = ({children}:ReusablePageStructureProps) => {
    return (
        <div className="flex flex-col items-start justify-start w-full">
            {children}
        </div>
    )
}

export default ReusablePageStructure