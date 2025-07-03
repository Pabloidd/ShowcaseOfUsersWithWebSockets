import React, { useState } from 'react';
import style from "./ToolWindow.module.css";

type ColumnsVisibility = {
    id: boolean,
    FIO: boolean,
    post: boolean,
    address: boolean,
    age: boolean,
    salary: boolean
};

interface ToolWindowProps {
    onClose: () => void;
}

const defaultColumnsVisibility: ColumnsVisibility = {
    id: true,
    FIO: true,
    post: true,
    address: true,
    age: true,
    salary: true
};

export default function ToolWindow({ onClose }: ToolWindowProps) {

    const [columnsVisibility, setColumnsVisibility] = useState<ColumnsVisibility>(() => {
        const storedColumnsVisibility = localStorage.getItem("columnsVisibility");
        if (storedColumnsVisibility) {
            try {
                return JSON.parse(storedColumnsVisibility);
            } catch (error) {
                console.error("Ошибка при парсинге данных из localStorage:", error);
                return defaultColumnsVisibility;
            }
        }
        return defaultColumnsVisibility;
    });

    const saveColumnsVisibilityToLocalStorage = () => {
        const JsonColumnsVisibility = JSON.stringify(columnsVisibility);
        localStorage.setItem("columnsVisibility", JsonColumnsVisibility);
    }

    const changeColumnVisibility = (name: keyof ColumnsVisibility) => {
        setColumnsVisibility(prevState => ({
            ...prevState,
            [name]: !prevState[name]
        }));
    }

    return (
        <aside className={style.ToolWindow}>
            <h3>Настройки видимости столбцов</h3>
            <div className={style.ToolWindow__field}>
            <p>Id</p>
            <button className={style.ToolWindow__button} onClick={() => {changeColumnVisibility("id")}}>
                {columnsVisibility.id ? "Скрыть" : "Показать"}
            </button>
            </div>
            <div className={style.ToolWindow__field}>
            <p>ФИО</p>
            <button className={style.ToolWindow__button} onClick={() => {changeColumnVisibility("FIO")}}>
                {columnsVisibility.FIO ? "Скрыть" : "Показать"}
            </button>
            </div>
            <div className={style.ToolWindow__field}>
            <p>Должность</p>
            <button className={style.ToolWindow__button} onClick={() => {changeColumnVisibility("post")}}>
                {columnsVisibility.post ? "Скрыть" : "Показать"}
            </button>
            </div>
            <div className={style.ToolWindow__field}>
            <p>Адрес</p>
            <button className={style.ToolWindow__button} onClick={() => {changeColumnVisibility("address")}}>
                {columnsVisibility.address ? "Скрыть" : "Показать"}
            </button>
            </div>
            <div className={style.ToolWindow__field}>
            <p>Возраст</p>
            <button className={style.ToolWindow__button} onClick={() => {changeColumnVisibility("age")}}>
                {columnsVisibility.age ? "Скрыть" : "Показать"}
            </button>
            </div>
            <div className={style.ToolWindow__field}>
            <p>Зарплата</p>
            <button className={style.ToolWindow__button} onClick={() => {changeColumnVisibility("salary")}}>
                {columnsVisibility.salary ? "Скрыть" : "Показать"}
            </button>
            </div>
            <p>Изменения вступят в силу после применения и перезагрузки страницы</p>
            <button className={style.ToolWindow__button} onClick={() => {
                saveColumnsVisibilityToLocalStorage();
                onClose();
            }}>
                Применить
            </button>
        </aside>
    )
}
