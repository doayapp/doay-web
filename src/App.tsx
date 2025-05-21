import { useMemo, useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
    CssBaseline, AppBar, Box, Drawer, Toolbar, Typography,
    IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    useMediaQuery, ThemeProvider, createTheme, Menu, MenuItem
} from "@mui/material"
import {
    Home as HomeIcon, Dns as NodeIcon, Article as LogIcon,
    Settings as SettingsIcon, Translate, Brightness4, Brightness7
} from "@mui/icons-material"

const drawerWidth = 200

function Home() {
    const {t} = useTranslation()
    return <Typography variant="h5">{t("menu.home")}</Typography>
}

function Nodes() {
    const {t} = useTranslation()
    return <Typography variant="h5">{t("menu.nodes")}</Typography>
}

function Logs() {
    const {t} = useTranslation()
    return <Typography variant="h5">{t("menu.logs")}</Typography>
}

function Settings() {
    const {t} = useTranslation()
    return <Typography variant="h5">{t("menu.settings")}</Typography>
}

export default function App() {
    const {t, i18n} = useTranslation()
    const prefersDark = useMediaQuery("(prefers-color-scheme: dark)")

    const [lang, setLang] = useState(() => {
        return localStorage.getItem("app-language") || i18n.language || "zh"
    })

    const [darkMode, setDarkMode] = useState(() => {
        const stored = localStorage.getItem("app-theme")
        if (stored === "dark") return true
        if (stored === "light") return false
        return prefersDark
    })

    useEffect(() => {
        i18n.changeLanguage(lang).catch()
        localStorage.setItem("app-language", lang)
    }, [lang, i18n])

    useEffect(() => {
        localStorage.setItem("app-theme", darkMode ? "dark" : "light")
    }, [darkMode])

    const theme = useMemo(() => createTheme({palette: {mode: darkMode ? "dark" : "light"}}), [darkMode])

    const [langMenuAnchor, setLangMenuAnchor] = useState<null | HTMLElement>(null)
    const openLangMenu = Boolean(langMenuAnchor)
    const toggleLang = (newLang: string) => {
        setLang(newLang)
        setLangMenuAnchor(null)
    }

    const menu = [
        {text: t("menu.home"), icon: <HomeIcon/>, path: "/"},
        {text: t("menu.nodes"), icon: <NodeIcon/>, path: "/nodes"},
        {text: t("menu.logs"), icon: <LogIcon/>, path: "/logs"},
        {text: t("menu.settings"), icon: <SettingsIcon/>, path: "/settings"}
    ]

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Router>
                <Box sx={{display: "flex"}}>
                    <Drawer
                        variant="permanent"
                        sx={{
                            width: drawerWidth,
                            flexShrink: 0,
                            [`& .MuiDrawer-paper`]: {
                                width: drawerWidth,
                                boxSizing: "border-box"
                            }
                        }}
                    >
                        <Toolbar>
                            <Typography variant="h6">Doay</Typography>
                        </Toolbar>
                        <List>
                            {menu.map(item => (
                                <ListItem key={item.path} disablePadding>
                                    <ListItemButton component={Link} to={item.path}>
                                        <ListItemIcon>{item.icon}</ListItemIcon>
                                        <ListItemText primary={item.text}/>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Drawer>

                    <Box sx={{flexGrow: 1, display: "flex", flexDirection: "column"}}>
                        <AppBar position="fixed" sx={{zIndex: theme.zIndex.drawer + 1}}>
                            <Toolbar>
                                <Typography variant="h6" sx={{flexGrow: 1}}>
                                    {t("title")}
                                </Typography>
                                <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit" title={darkMode ? "Light mode" : "Dark mode"}>
                                    {darkMode ? <Brightness7/> : <Brightness4/>}
                                </IconButton>
                                <IconButton color="inherit" onClick={(e) => setLangMenuAnchor(e.currentTarget)} title="Change language">
                                    <Translate/>
                                </IconButton>
                                <Menu
                                    anchorEl={langMenuAnchor}
                                    open={openLangMenu}
                                    onClose={() => setLangMenuAnchor(null)}
                                >
                                    <MenuItem selected={lang === "zh"} onClick={() => toggleLang("zh")}>简体中文</MenuItem>
                                    <MenuItem selected={lang === "en"} onClick={() => toggleLang("en")}>English</MenuItem>
                                </Menu>
                            </Toolbar>
                        </AppBar>

                        <Box component="main" sx={{flexGrow: 1, p: 3, mt: 8}}>
                            <Routes>
                                <Route path="/" element={<Home/>}/>
                                <Route path="/nodes" element={<Nodes/>}/>
                                <Route path="/logs" element={<Logs/>}/>
                                <Route path="/settings" element={<Settings/>}/>
                            </Routes>
                        </Box>
                    </Box>
                </Box>
            </Router>
        </ThemeProvider>
    )
}
