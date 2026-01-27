"use client"
import { useEffect, useMemo, useState } from "react"
import { useTheme } from "next-themes"
import {
  Cloud,
  fetchSimpleIcons,
  ICloud,
  renderSimpleIcon,
  SimpleIcon,
} from "react-icon-cloud"

/**
 * Cloud configuration properties
 * Controls the 3D rotating icon cloud behavior and appearance
 */
export const cloudProps: Omit<ICloud, "children"> = {
  containerProps: {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      paddingTop: 40,
    },
  },
  options: {
    reverse: true, // Rotation direction
    depth: 1, // 3D depth effect
    wheelZoom: false, // Disable zoom on scroll
    imageScale: 2, // Icon size scale
    activeCursor: "default", // Cursor style on hover
    tooltip: "native", // Show icon name on hover
    initial: [0.1, -0.1], // Initial rotation angle
    clickToFront: 500, // Animation speed when clicking icons
    tooltipDelay: 0, // No delay for tooltip
    outlineColour: "#0000", // Transparent outline
    maxSpeed: 0.04, // Maximum rotation speed
    minSpeed: 0.02, // Minimum rotation speed
    // dragControl: false, // Enable/disable drag rotation
  },
}

/**
 * Renders individual icons with theme-aware colors
 * @param icon - SimpleIcon object from react-icon-cloud
 * @param theme - Current theme ("light" or "dark")
 */
export const renderCustomIcon = (icon: SimpleIcon, theme: string) => {
  const bgHex = theme === "light" ? "#f3f2ef" : "#080510"
  const fallbackHex = theme === "light" ? "#6e6e73" : "#ffffff"
  const minContrastRatio = theme === "dark" ? 2 : 1.2
  return renderSimpleIcon({
    icon,
    bgHex,
    fallbackHex,
    minContrastRatio,
    size: 42,
    aProps: {
      href: undefined,
      target: undefined,
      rel: undefined,
      onClick: (e: any) => e.preventDefault(),
    },
  })
}

export type DynamicCloudProps = {
  iconSlugs: string[]
}

type IconData = Awaited<ReturnType<typeof fetchSimpleIcons>>

/**
 * IconCloud Component
 * Displays a 3D rotating cloud of technology/platform icons
 */
export function IconCloud({ iconSlugs }: DynamicCloudProps) {
  const [data, setData] = useState<IconData | null>(null)
  const { theme } = useTheme()

  // Fetch icon data from simpleicons API
  useEffect(() => {
    fetchSimpleIcons({ slugs: iconSlugs }).then(setData)
  }, [iconSlugs])

  // Render icons with current theme
  const renderedIcons = useMemo(() => {
    if (!data) return null
    return Object.values(data.simpleIcons).map((icon) =>
      renderCustomIcon(icon, theme || "light"),
    )
  }, [data, theme])

  return (
    // @ts-ignore
    <Cloud {...cloudProps}>
      <>{renderedIcons}</>
    </Cloud>
  )
}
