import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function ActionModal({
    children,
    trigger,
    title,
    desc,
    btnText,
    cancelBtnText,
    onClick,
    open,
    setOpen
}) {
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent className={"max-w-screen-xl max-h-[80svh] overflow-y-scroll"}>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {desc}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {children}
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        {cancelBtnText ? cancelBtnText : "Cancel"}
                    </AlertDialogCancel>
                    {btnText && (
                        <AlertDialogAction onClick={onClick}>{btnText}</AlertDialogAction>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
