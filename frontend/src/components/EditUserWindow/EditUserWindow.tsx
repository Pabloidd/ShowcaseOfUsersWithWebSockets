import React, { useState, useEffect } from 'react';
import style from './EditUserWindow.module.css';

interface EditUserWindowProps {
    onClose: () => void;
    user: {
        id: number;
        FIO: string;
        post: string;
        address: string;
        age: number;
        salary: number;
        haveINN: boolean | null;
        INN: number | null;
    };
    onSave: (userData: any) => Promise<void>;
}

export default function EditUserWindow({ onClose, user, onSave }: EditUserWindowProps) {
    const [formData, setFormData] = useState({
        FIO: user.FIO,
        post: user.post,
        address: user.address,
        age: user.age,
        salary: user.salary,
        haveINN: user.haveINN || false,
        INN: user.INN || ''
    });

    const [isSaveDisabled, setIsSaveDisabled] = useState(true);

    useEffect(() => {
        validateForm();
    }, [formData]);

    const validateForm = () => {
        // Проверка обязательных полей
        const isFIOValid = formData.FIO.trim() !== '' && formData.FIO.length <= 30;
        const isPostValid = formData.post.trim() !== '' && formData.post.length <= 30;
        const isAddressValid = formData.address.trim() !== '' && formData.address.length <= 30;
        const isAgeValid = formData.age >= 18 && formData.age <= 100;

        // Проверка ИНН (если есть галочка)
        let isINNValid = true;
        if (formData.haveINN) {
            isINNValid = formData.INN !== '' && /^\d{12}$/.test(String(formData.INN));
        }

        setIsSaveDisabled(!(isFIOValid && isPostValid && isAddressValid && isAgeValid && isINNValid));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        // Ограничение длины для текстовых полей
        if (type === 'text' && value.length > 30) {
            return;
        }

        // Ограничение возраста (1-100)
        if (name === 'age') {
            const ageValue = Number(value);
            if (ageValue > 100) return;
        }

        // Ограничение ИНН (12 цифр)
        if (name === 'INN' && value.length > 12) {
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
        }));
    };

    const handleReset = () => {
        setFormData({
            FIO: user.FIO,
            post: user.post,
            address: user.address,
            age: user.age,
            salary: user.salary,
            haveINN: user.haveINN || false,
            INN: user.INN || ''
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaveDisabled) return;

        try {
            await onSave({
                ...formData,
                id: user.id,
                INN: formData.haveINN ? formData.INN : null,
                haveINN: formData.haveINN
            });
            onClose();
        } catch (error) {
            console.error('Ошибка при сохранении:', error);
        }
    };

    return (
        <>
            <div
                className={`${style.overlay} ${style.active}`}
                onClick={onClose}
            />
            <aside className={style.editUserWindow}>
                <h2>Редактирование пользователя</h2>
                <form onSubmit={handleSubmit}>
                    <div className={style.editUserWindow__field}>
                        <label htmlFor="FIO">ФИО*</label>
                        <input
                            type="text"
                            id="FIO"
                            name="FIO"
                            value={formData.FIO}
                            onChange={handleChange}
                            maxLength={30}
                        />
                    </div>

                    <div className={style.editUserWindow__field}>
                        <label htmlFor="post">Должность*</label>
                        <input
                            type="text"
                            id="post"
                            name="post"
                            value={formData.post}
                            onChange={handleChange}
                            maxLength={30}
                        />
                    </div>

                    <div className={style.editUserWindow__field}>
                        <label htmlFor="address">Адрес*</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            maxLength={30}
                        />
                    </div>

                    <div className={style.editUserWindow__field}>
                        <label htmlFor="age">Возраст*</label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            min="18"
                            max="100"
                        />
                    </div>

                    <div className={style.editUserWindow__field}>
                        <label htmlFor="salary">Зарплата</label>
                        <input
                            type="number"
                            id="salary"
                            name="salary"
                            value={formData.salary}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={style.editUserWindow__field}>
                        <label htmlFor="haveINN">Наличие ИНН</label>
                        <input
                            type="checkbox"
                            id="haveINN"
                            name="haveINN"
                            checked={formData.haveINN}
                            onChange={handleChange}
                        />
                    </div>

                    {formData.haveINN && (
                        <div className={style.editUserWindow__field}>
                            <label htmlFor="INN">ИНН*</label>
                            <input
                                type="number"
                                id="INN"
                                name="INN"
                                value={formData.INN}
                                onChange={handleChange}
                                maxLength={12}
                            />
                        </div>
                    )}

                    <div className={style.buttonsContainer}>
                        <button
                            type="button"
                            className={style.editUserWindow__button}
                            onClick={onClose}
                        >
                            Назад
                        </button>
                        <button
                            type="button"
                            className={style.editUserWindow__button}
                            onClick={handleReset}
                        >
                            Сбросить
                        </button>
                        <button
                            type="submit"
                            className={style.editUserWindow__button}
                            disabled={isSaveDisabled}
                        >
                            Сохранить
                        </button>
                    </div>
                </form>
            </aside>
        </>
    );
}