import React, { useEffect } from "react";
import "./App.css";
import { Header } from "./components/layout/header/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector, useDispatch } from "react-redux";
import ThemeAction from "./redux/actions/ThemeAction";
import "./assets/css/grid.css";
import "./assets/css/theme.css";
import "./assets/css/index.css";
import { Main } from "./components/main/Main";

export const App = () => {
	const themeReducer = useSelector((state) => state.ThemeReducer);
	const dispatch = useDispatch();
	useEffect(() => {
		const themeClass = localStorage.getItem("themeMode", "theme-mode-light");
		const colorClass = localStorage.getItem("colorMode", "theme-mode-light");
		dispatch(ThemeAction.setMode(themeClass));
		dispatch(ThemeAction.setColor(colorClass));
	}, [dispatch]);
	return (
		<div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
			<Header />
			<Main />
		</div>
	);
};

export default App;
