import { Colors } from "@blueprintjs/core";

export default {
    dark: {
        backgroundColor: Colors.DARK_GRAY4,
        backgroundFrameColor: Colors.DARK_GRAY2,
        listItemHover: Colors.DARK_GRAY2,
        codeBlock: Colors.DARK_GRAY2,
        codeAccent: Colors.GREEN5,
        vault: {
            list: {
                focusedBackgroundColor: Colors.DARK_GRAY5,
                selectedBackgroundColor: Colors.TURQUOISE3,
                selectedTextColor: "#fff"
            },
            colors: {
                divider: Colors.DARK_GRAY5,
                paneDivider: Colors.GRAY3,
                uiBackground: Colors.DARK_GRAY4,
                mainPaneBackground: Colors.DARK_GRAY3
            },
            tree: {
                selectedBackgroundColor: Colors.DARK_GRAY5,
                hoverBackgroundColor: "transparent",
                selectedTextColor: Colors.LIGHT_GRAY5,
                selectedIconColor: Colors.LIGHT_GRAY5
            },
            entry: {
                primaryContainer: Colors.DARK_GRAY3,
                separatorTextColor: Colors.GRAY3,
                separatorBorder: Colors.GRAY1,
                fieldHoverBorder: Colors.GRAY1
            },
            attachment: {
                dropBackground: Colors.DARK_GRAY3,
                dropBorder: Colors.DARK_GRAY5,
                dropText: Colors.GRAY2
            }
        }
    },
    light: {
        backgroundColor: Colors.WHITE,
        backgroundFrameColor: Colors.GRAY5,
        listItemHover: Colors.LIGHT_GRAY3,
        codeBlock: Colors.LIGHT_GRAY1,
        codeAccent: Colors.GREEN1,
        vault: {
            list: {
                focusedBackgroundColor: Colors.LIGHT_GRAY5,
                selectedBackgroundColor: Colors.TURQUOISE3,
                selectedTextColor: "#fff"
            },
            colors: {
                divider: Colors.LIGHT_GRAY4,
                paneDivider: Colors.GRAY3,
                uiBackground: "#fff",
                mainPaneBackground: Colors.LIGHT_GRAY5
            },
            tree: {
                selectedBackgroundColor: Colors.LIGHT_GRAY2,
                hoverBackgroundColor: "transparent",
                selectedTextColor: Colors.DARK_GRAY1,
                selectedIconColor: Colors.DARK_GRAY5
            },
            entry: {
                primaryContainer: Colors.LIGHT_GRAY5,
                separatorTextColor: Colors.GRAY3,
                separatorBorder: Colors.LIGHT_GRAY2,
                fieldHoverBorder: Colors.LIGHT_GRAY1
            },
            attachment: {
                dropBackground: Colors.LIGHT_GRAY5,
                dropBorder: Colors.LIGHT_GRAY2,
                dropText: Colors.GRAY4
            }
        }
    }
};
