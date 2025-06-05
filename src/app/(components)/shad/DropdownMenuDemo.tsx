
  import { GenericButton } from "@/components/ui/generic-button"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "../../../components/ui/dropdown-menu"
  

  interface DropdownMenuProps{
    Prod: string, 
    Serv: string
  }
  export function DropdownMenuDemo({Prod, Serv}:DropdownMenuProps) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <GenericButton variant="outline">Filter by ...</GenericButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem className="flex justify-center align-middle">
              <span>{Prod}</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex justify-center align-middle">
              <span>{Serv}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  
