import { create } from "zustand"

const useThemeStore = create((set) => ({
    theme: localStorage.getItem("convoo-theme") || "forest",
    setTheme: (theme) => {
        localStorage.setItem("convoo-theme",theme)
        set({theme})
    }
}));

export default useThemeStore