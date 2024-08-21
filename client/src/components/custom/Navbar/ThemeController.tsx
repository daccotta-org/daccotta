// components/ThemeController.tsx
import React from "react"
import { useTheme } from "../../../hooks/useTheme"
import { PiPaintBrushBroadFill } from "react-icons/pi"

const ThemeController: React.FC = () => {
    const { theme, changeTheme, themes } = useTheme()

    return (
        <details
            className="dropdown dropdown-top tooltip tooltip-right"
            data-tip="theme"
        >
            <summary className="btn btn-ghost">
                <PiPaintBrushBroadFill color="white" size="1.5rem" />
            </summary>
            <ul
                tabIndex={0}
                className="dropdown-content text-neutral bg-gradient-to-tr from-primary to-secondary rounded-box z-[1] w-52 p-2 shadow-2xl"
            >
                {themes.map((t) => (
                    <li key={t}>
                        <input
                            type="radio"
                            name="theme-dropdown"
                            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                            aria-label={t.charAt(0).toUpperCase() + t.slice(1)}
                            value={t}
                            checked={theme === t}
                            onChange={() => changeTheme(t)}
                        />
                    </li>
                ))}
            </ul>
        </details>
    )
}

export default ThemeController
