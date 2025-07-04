
import React, { useState, useEffect, useRef } from 'react';
import style from "./UsersTable.module.css";
import EditUserWindow from "../EditUserWindow/EditUserWindow";

const SERVER_URL = "ws://localhost:3001";

interface User {
    id: number;
    FIO: string;
    post: string;
    address: string;
    age: number;
    salary: number;
    haveINN: boolean | null;
    INN: number | null;
}

/**
 * Компонент UsersTable для отображения таблицы пользователей.
 * @returns {JSX.Element}
 */
export default function UsersTable() {
    const [loadedAllData, setLoadedAllData] = useState(false);
    const [dataIsLoading, setDataIsLoading] = useState(false);
    const [USERS, setUSERS] = useState<User[]>([]);
    const [currentUsersPart, setCurrentUsersPart] = useState(0);
    const [columnsVisibility, setColumnsVisibility] = useState({
        id: true,
        FIO: true,
        post: true,
        address: true,
        age: true,
        salary: true
    });
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        const storedVisibility = localStorage.getItem('columnsVisibility');
        if (storedVisibility) {
            setColumnsVisibility(JSON.parse(storedVisibility));
        }
    }, []);

    const isFirstRender = useRef(true);

    useEffect(() => {
        ws.current = new WebSocket(SERVER_URL);

        ws.current.onopen = () => {
            console.log("WebSocket connected");
            if (isFirstRender.current) {
                isFirstRender.current = false;
                console.log("Loading first part of users");
                loadPartOfUsers(currentUsersPart);
            }
        };

        ws.current.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                console.log("Received message:", message);
                switch (message.type) {
                    case 'users':
                        console.log("Received users:", message.payload);
                        if (message.payload.length === 0) {
                            setLoadedAllData(true);
                        } else {
                            setUSERS(prev => [...prev, ...message.payload]);
                            setCurrentUsersPart(prev => prev + 1);
                        }
                        setDataIsLoading(false);
                        break;
                    case 'userUpdated':
                        setUSERS(prev => prev.map(u => u.id === message.payload.id ? message.payload : u));
                        setEditingUser(null);
                        break;
                    case 'error':
                        console.error("Error from server:", message.payload);
                        alert(`Ошибка: ${message.payload}`);
                        setDataIsLoading(false);
                        break;
                    default:
                        console.log("Unknown message:", message);
                }
            } catch (error) {
                console.error("Failed to parse message from server:", error);
            }
        };

        ws.current.onclose = () => {
            console.log("WebSocket disconnected");
        };

        ws.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    /**
     * Загружает часть пользователей с сервера.
     * @param {number} part - Номер части пользователей для загрузки.
     */
    const loadPartOfUsers = (part: number) => {
        if (dataIsLoading || loadedAllData || !ws.current) return;

        setDataIsLoading(true);
        console.log("Sending getUsers request with start:", part);
        ws.current.send(JSON.stringify({
            type: 'getUsers',
            payload: { start: part }
        }));
    };

    /**
     * Определяет, нужно ли загружать новую часть данных при прокрутке таблицы.
     * @returns {boolean}
     */
    const needToLoadNewData = () => {
        if (!tableContainerRef.current) return false;

        const element = tableContainerRef.current;
        const scrollHeight = element.scrollHeight;
        const clientHeight = element.clientHeight;
        const scrollTop = element.scrollTop;
        const criticalPoint = scrollHeight - clientHeight / 3;
        const currentPosition = scrollTop + clientHeight;

        return currentPosition >= criticalPoint;
    };

    useEffect(() => {
        const handleScroll = () => {
            if (needToLoadNewData() && !loadedAllData && !dataIsLoading) {
                loadPartOfUsers(currentUsersPart);
            }
        };

        const tableContainer = tableContainerRef.current;
        if (tableContainer) {
            tableContainer.addEventListener('scroll', handleScroll);
            return () => {
                tableContainer.removeEventListener('scroll', handleScroll);
            };
        }
    }, [currentUsersPart, loadedAllData, dataIsLoading]);

    /**
     * Обработчик клика по пользователю в таблице.
     * @param {User} user - Объект пользователя, по которому кликнули.
     */
    const handleUserClick = (user: User) => {
        setEditingUser(user);
    };

    /**
     * Обработчик закрытия окна редактирования пользователя.
     */
    const handleCloseEditWindow = () => {
        setEditingUser(null);
    };

    /**
     * Обработчик сохранения данных пользователя.
     * @param {any} userData - Данные пользователя для сохранения.
     */
    const handleSaveUser = async (userData: any) => {
        if (!ws.current) {
            console.error("WebSocket is not connected.");
            return;
        }

        ws.current.send(JSON.stringify({
            type: 'updateUser',
            payload: {
                ...userData,
                age: Number(userData.age),
                salary: Number(userData.salary),
                INN: userData.haveINN ? Number(userData.INN) : null
            }
        }));
    };

    return (
        <div
            ref={tableContainerRef}
            className={style.usersTableContainer}
        >
            <table className={style.usersTable}>
                <thead>
                <tr>
                    {columnsVisibility.id && <th className={style.usersTable__Th}>Id</th>}
                    {columnsVisibility.FIO && <th className={style.usersTable__Th}>ФИО</th>}
                    {columnsVisibility.post && <th className={style.usersTable__Th}>Должность</th>}
                    {columnsVisibility.address && <th className={style.usersTable__Th}>Адрес</th>}
                    {columnsVisibility.age && <th className={style.usersTable__Th}>Возраст</th>}
                    {columnsVisibility.salary && <th className={style.usersTable__Th}>Зарплата</th>}
                </tr>
                </thead>
                <tbody className={style.usersTable__element}>
                {USERS.map(user => (
                    <tr key={user.id}>
                        {columnsVisibility.id && <td>{user.id}</td>}
                        {columnsVisibility.FIO && (
                            <td
                                onClick={() => handleUserClick(user)}
                            >
                                {user.FIO}
                            </td>
                        )}
                        {columnsVisibility.post && <td>{user.post}</td>}
                        {columnsVisibility.address && <td>{user.address}</td>}
                        {columnsVisibility.age && <td>{user.age}</td>}
                        {columnsVisibility.salary && <td>{user.salary}</td>}
                    </tr>
                ))}
                {dataIsLoading && <tr>
                    <td colSpan={6}>Загрузка...</td>
                </tr>}
                </tbody>
            </table>

            {editingUser && (
                <EditUserWindow
                    onClose={handleCloseEditWindow}
                    user={editingUser}
                    onSave={handleSaveUser}
                />
            )}
        </div>
    );
}
