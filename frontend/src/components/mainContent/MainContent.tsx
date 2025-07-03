import UsersTable from "../UserTable/UsersTable";
import style from "./mainContent.module.css";
import {useState} from "react";
import ToolWindow from "../ToolWindow/ToolWindow";

export default function MainContent() {
    const [toolWindowVisibility, setToolVisibility] = useState(false);

    const swapToolWindowVisibility = () => {
        setToolVisibility(!toolWindowVisibility);
    }

    return (
        <main className={style.mainContent}>
            <div
                className={`${style.overlay} ${toolWindowVisibility ? style.active : ""}`}
                onClick={swapToolWindowVisibility} // Закрывает окно при клике на оверлей
            />
            <span className={style.mainContent__helpingContainer}>
                <h2 className={style.mainContent__text}>Элитное подразделение сотрудников</h2>
                <button
                    className={style.mainContent__button}
                    onClick={swapToolWindowVisibility}
                ></button>
            </span>
            <UsersTable/>
            {toolWindowVisibility && <ToolWindow onClose={swapToolWindowVisibility} />}
        </main>
    );
}
