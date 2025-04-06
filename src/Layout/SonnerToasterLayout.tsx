import { Toaster as SonnerToaster, type ToasterProps } from "sonner";
import { useTheme } from "./ThemeProvider";

export function Toaster(){
    const { theme } = useTheme()
    
    return (
        <SonnerToaster
        theme={theme as ToasterProps["theme"]}
        expand={true}
        />
    )

}